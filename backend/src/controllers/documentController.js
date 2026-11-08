import Document from "../models/Document.js";
import Shipment from "../models/Shipment.js";
import Notification from "../models/Notification.js";

// CUSTOMER: Upload chứng từ
export const uploadDocument = async (req, res) => {
    try {
        const { shipmentId, documentType } = req.body;

        // 1. Kiểm tra xem file đã được multer bắt và đẩy lên mây chưa
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng đính kèm file chứng từ"
            });
        }

        // 2. Kiểm tra các thông tin text đi kèm
        if (!shipmentId || !documentType) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng cung cấp mã lô hàng và loại chứng từ"
            });
        }

        // 3. Kiểm tra Shipment
        const shipment = await Shipment.findById(shipmentId);
        if (!shipment) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy Shipment"
            });
        }

        // 4. Customer chỉ được upload vào Shipment của mình
        if (shipment.customer.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Bạn không có quyền upload chứng từ cho Shipment này"
            });
        }

        // 5. Kiểm tra loại chứng từ
        if (!["COMMERCIAL_INVOICE", "PACKING_LIST"].includes(documentType)) {
            return res.status(400).json({
                success: false,
                message: "Loại chứng từ không hợp lệ"
            });
        }

        // 6. Tạo Document với dữ liệu URL từ Cloudinary
        const document = await Document.create({
            shipmentId: shipment._id,
            customerId: req.user._id,
            documentType,
            fileName: req.file.originalname, // Lấy tên file gốc trên máy khách
            fileUrl: req.file.path,          // Lấy đường dẫn URL do Cloudinary trả về
            status: "PENDING"
        });

        res.status(201).json({
            success: true,
            message: "Upload chứng từ thành công",
            data: document
        });

    } catch (error) {
        console.error("UPLOAD DOCUMENT ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Không thể upload chứng từ",
            error: error.message
        });
    }
};


// CUSTOMER: Xem chứng từ của Shipment
export const getMyDocuments = async (req, res) => {
    try {
        const { shipmentId } = req.params;

        const shipment = await Shipment.findById(shipmentId);

        if (!shipment) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy Shipment"
            });
        }

        // Kiểm tra quyền
        if (
            shipment.customer.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Bạn không có quyền xem chứng từ này"
            });
        }

        const documents = await Document.find({
            shipmentId: shipment._id,
            customerId: req.user._id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: documents
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Không thể lấy danh sách chứng từ",
            error: error.message
        });
    }
};


// EMPLOYEE / ADMIN: Xem các chứng từ đang chờ duyệt
export const getPendingDocuments = async (req, res) => {
    try {
        const documents = await Document.find({
            status: "PENDING"
        })
            .populate("shipmentId", "shipmentNumber origin destination")
            .populate("customerId", "fullName email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: documents
        });

    } catch (error) {
        console.error("GET PENDING DOCUMENTS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Không thể lấy danh sách chứng từ chờ duyệt",
            error: error.message
        });
    }
};

// EMPLOYEE / ADMIN: Duyệt hoặc từ chối chứng từ
export const reviewDocument = async (req, res) => {
    try {
        const { status, note } = req.body;
        const { id } = req.params;

        // Kiểm tra trạng thái
        if (!["APPROVED", "REJECTED"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Trạng thái phải là APPROVED hoặc REJECTED"
            });
        }

        // Tìm Document
        const document = await Document.findById(id);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy chứng từ"
            });
        }

        // Không cho duyệt lại document đã xử lý
        if (document.status !== "PENDING") {
            return res.status(400).json({
                success: false,
                message: "Chứng từ này đã được xử lý"
            });
        }

        // Cập nhật
        document.status = status;
        document.note = note || "";
        document.reviewedBy = req.user._id;
        document.reviewedAt = new Date();

        await document.save();

        // Nếu chứng từ được APPROVED
if (status === "APPROVED") {

    // Lấy tất cả chứng từ của Shipment
    const documents = await Document.find({
        shipmentId: document.shipmentId
    });

    // Kiểm tra Invoice và Packing List
    const invoiceApproved = documents.some(
        doc =>
            doc.documentType === "COMMERCIAL_INVOICE" &&
            doc.status === "APPROVED"
    );

    const packingListApproved = documents.some(
        doc =>
            doc.documentType === "PACKING_LIST" &&
            doc.status === "APPROVED"
    );

    // Cả hai đều đã APPROVED
    if (invoiceApproved && packingListApproved) {

        const shipment = await Shipment.findById(
            document.shipmentId
        );

        if (shipment && shipment.currentStatus !== "DOC_APPROVED") {

            shipment.currentStatus = "DOC_APPROVED";

            shipment.statusHistory.push({
                status: "DOC_APPROVED",
                timestamp: new Date(),
                note: "Commercial Invoice và Packing List đã được duyệt",
                updatedBy: req.user._id
            });

            await shipment.save();

            // Thông báo Customer
            await Notification.create({
                userId: shipment.customer,
                shipmentId: shipment._id,
                title: "Documents Approved",
                message: `Chứng từ của Shipment ${shipment.shipmentNumber} đã được duyệt.`,
                type: "SHIPMENT_STATUS",
                isRead: false
            });
        }
    }
}

        res.status(200).json({
            success: true,
            message:
                status === "APPROVED"
                    ? "Đã duyệt chứng từ"
                    : "Đã từ chối chứng từ",
            data: document
        });

    } catch (error) {
        console.error("REVIEW DOCUMENT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Không thể xử lý chứng từ",
            error: error.message
        });
    }
};