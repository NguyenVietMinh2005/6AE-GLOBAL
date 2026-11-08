import Customs from "../models/Customs.js";
import Shipment from "../models/Shipment.js";
import Notification from "../models/Notification.js";


// ==========================================
// CUSTOMER: Tạo tờ khai hải quan
// ==========================================
export const createCustoms = async (req, res) => {
    try {
        const {
            shipmentId,
            type,
            declarationNumber,
            note
        } = req.body;

        // Kiểm tra dữ liệu
        if (
            !shipmentId ||
            !type ||
            !declarationNumber
        ) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng cung cấp đầy đủ thông tin hải quan"
            });
        }

        // Kiểm tra type
        if (!["EXPORT", "IMPORT"].includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Loại hải quan phải là EXPORT hoặc IMPORT"
            });
        }

        // Kiểm tra Shipment
        const shipment = await Shipment.findById(shipmentId);

        if (!shipment) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy Shipment"
            });
        }

        // Customer chỉ được tạo cho Shipment của mình
        if (
            shipment.customer.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Bạn không có quyền tạo tờ khai cho Shipment này"
            });
        }

        // Kiểm tra declarationNumber trùng
        const existingCustoms =
            await Customs.findOne({ declarationNumber });

        if (existingCustoms) {
            return res.status(400).json({
                success: false,
                message: "Số tờ khai hải quan đã tồn tại"
            });
        }

        // Tạo Customs
        const customs = await Customs.create({
            shipmentId: shipment._id,
            type,
            declarationNumber,
            status: "PENDING",
            note: note || ""
        });

        res.status(201).json({
            success: true,
            message: "Tạo tờ khai hải quan thành công",
            data: customs
        });

    } catch (error) {
        console.error("CREATE CUSTOMS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Không thể tạo tờ khai hải quan",
            error: error.message
        });
    }
};


// ==========================================
// CUSTOMER: Xem tờ khai của Shipment
// ==========================================
export const getMyCustoms = async (req, res) => {
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
                message: "Bạn không có quyền xem tờ khai này"
            });
        }

        const customs = await Customs.find({
            shipmentId: shipment._id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: customs
        });

    } catch (error) {
        console.error("GET MY CUSTOMS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Không thể lấy danh sách tờ khai",
            error: error.message
        });
    }
};


// ==========================================
// EMPLOYEE / ADMIN:
// Xem tất cả tờ khai đang xử lý
// ==========================================
export const getCustomsList = async (req, res) => {
    try {
        const customs = await Customs.find()
            .populate(
                "shipmentId",
                "shipmentNumber origin destination currentStatus"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: customs
        });

    } catch (error) {
        console.error("GET CUSTOMS LIST ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Không thể lấy danh sách tờ khai",
            error: error.message
        });
    }
};


// ==========================================
// EMPLOYEE / ADMIN:
// Cập nhật trạng thái hải quan
// ==========================================
export const updateCustomsStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, note } = req.body;

        // Kiểm tra status
        if (
            ![
                "PENDING",
                "SUBMITTED",
                "CLEARED",
                "REJECTED"
            ].includes(status)
        ) {
            return res.status(400).json({
                success: false,
                message: "Trạng thái hải quan không hợp lệ"
            });
        }

        // Tìm Customs
        const customs = await Customs.findById(id);

        if (!customs) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy tờ khai hải quan"
            });
        }

        // Không cho xử lý lại CLEARED
        if (
            customs.status === "CLEARED" &&
            status !== "CLEARED"
        ) {
            return res.status(400).json({
                success: false,
                message: "Tờ khai đã được thông quan"
            });
        }

        // Cập nhật
        customs.status = status;

        if (note !== undefined) {
            customs.note = note;
        }

        if (status === "SUBMITTED") {
            customs.submittedAt = new Date();
        }

        if (status === "CLEARED") {
            customs.clearedAt = new Date();
        }

        await customs.save();

        // Lấy Shipment
        const shipment = await Shipment.findById(
            customs.shipmentId
        );

        // Nếu CLEARED → cập nhật Shipment
        if (
            status === "CLEARED" &&
            shipment.currentStatus !== "DELIVERED"
        ) {
            // Xác định trạng thái Shipment
            const shipmentStatus =
                customs.type === "EXPORT"
                    ? "CUSTOMS_EXPORT"
                    : "CUSTOMS_IMPORT";

            if (shipment.currentStatus !== shipmentStatus){
                shipment.currentStatus = shipmentStatus;

            shipment.statusHistory.push({
                status: shipmentStatus,
                timestamp: new Date(),
                note:
                    customs.type === "EXPORT"
                        ? "Đã hoàn tất thủ tục hải quan đầu xuất"
                        : "Đã hoàn tất thủ tục hải quan đầu nhập",
                updatedBy: req.user._id
            });

            await shipment.save();
            }

            

            // Thông báo Customer
            await Notification.create({
                userId: shipment.customer,
                shipmentId: shipment._id,
                title: "Customs Updated",
                message:
                    `Tờ khai ${customs.declarationNumber} ` +
                    `của Shipment ${shipment.shipmentNumber} ` +
                    `đã được thông quan.`,
                type: "SHIPMENT_STATUS",
                isRead: false
            });
        }

        res.status(200).json({
            success: true,
            message: "Cập nhật trạng thái hải quan thành công",
            data: customs
        });

    } catch (error) {
        console.error("UPDATE CUSTOMS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Không thể cập nhật trạng thái hải quan",
            error: error.message
        });
    }
};