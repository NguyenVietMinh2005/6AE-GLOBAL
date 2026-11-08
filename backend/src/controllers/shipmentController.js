import Shipment from "../models/Shipment.js";
import Booking from "../models/Booking.js";
import Quotation from "../models/Quotation.js";
import Notification from "../models/Notification.js";

// CUSTOMER: Tạo Shipment từ Booking
export const createShipment = async (req, res) => {
    try {
        const { 
            bookingId, 
            customer, // <-- Lấy ID khách hàng từ form Frontend gửi lên
            shipmentNumber, 
            origin, 
            destination, 
            ETA, 
            containerNumber, 
            vesselName, 
            currentStatus, 
            statusHistory 
        } = req.body;

        // ==========================================
        // LUỒNG 1: TẠO TỪ BOOKING (Của Khách hàng)
        // ==========================================
        if (bookingId) {
            const booking = await Booking.findById(bookingId);
            if (!booking) return res.status(404).json({ success: false, message: "Không tìm thấy Booking" });
            
            if (booking.customerId.toString() !== req.user._id.toString()) {
                return res.status(403).json({ success: false, message: "Bạn không có quyền tạo Shipment này" });
            }
            if (booking.status !== "CONFIRMED") {
                return res.status(400).json({ success: false, message: "Booking chưa ở trạng thái CONFIRMED" });
            }
            const existingShipment = await Shipment.findOne({ booking: booking._id });
            if (existingShipment) {
                return res.status(400).json({ success: false, message: "Booking này đã có Shipment" });
            }

            const shipment = await Shipment.create({
                booking: booking._id,
                customer: booking.customerId,
                shipmentNumber: shipmentNumber || `SHP-${Date.now().toString().slice(-6)}`,
                currentStatus: "BOOKING_CONFIRMED",
                origin: booking.origin,
                destination: booking.destination,
                statusHistory: [{
                    status: "BOOKING_CONFIRMED",
                    timestamp: new Date(),
                    note: "Shipment được tạo từ Booking",
                    updatedBy: req.user._id
                }]
            });
            return res.status(201).json({ success: true, message: "Tạo Shipment từ Booking thành công", data: shipment });
        }

        // ==========================================
        // LUỒNG 2: ADMIN TẠO THỦ CÔNG (Từ trang nội bộ)
        // ==========================================
        const manualShipment = await Shipment.create({
            customer: customer, // <-- SỬA Ở ĐÂY: Gán ID khách hàng được chọn, không dùng req.user._id
            shipmentNumber: shipmentNumber,
            origin: origin,
            destination: destination,
            ETA: ETA || null,
            containerNumber: containerNumber || "",
            vesselName: vesselName || "",
            currentStatus: "BOOKING_CONFIRMED",
            statusHistory: [{
                status: "BOOKING_CONFIRMED",
                timestamp: new Date(),
                note: "Lô hàng được khởi tạo trên hệ thống 6AE GLOBAL",
                updatedBy: req.user._id 
            }]
        });

        // TẠO THÔNG BÁO CHO KHÁCH HÀNG NGAY LẬP TỨC
        if (customer) {
            await Notification.create({
                userId: customer,
                shipmentId: manualShipment._id,
                title: "Lô hàng mới được khởi tạo",
                message: `Lô hàng vận đơn ${manualShipment.shipmentNumber} của bạn đã được hệ thống tiếp nhận.`,
                type: "SHIPMENT_STATUS",
                isRead: false
            });
        }

        res.status(201).json({
            success: true,
            message: "Tạo Shipment thủ công thành công",
            data: manualShipment
        });

    } catch (error) {
        console.error("CREATE SHIPMENT ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Không thể tạo Shipment",
            error: error.message
        });
    }
};


// CUSTOMER: Xem Shipment của mình
export const getMyShipments = async (req, res) => {
    try {
        const shipments = await Shipment.find({
            customer: req.user._id
        })
            .populate("booking")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: shipments
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Không thể lấy danh sách Shipment",
            error: error.message
        });
    }
};


// Tra cứu Shipment theo mã vận đơn
export const trackShipment = async (req, res) => {
    try {
        const shipment = await Shipment.findOne({
            shipmentNumber: req.params.shipmentNumber
        })
            .populate("customer", "fullName email")
            .populate("booking");

        if (!shipment) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy Shipment"
            });
        }

        res.status(200).json({
            success: true,
            data: {
                shipmentNumber: shipment.shipmentNumber,
                origin: shipment.origin,
                destination: shipment.destination,
                currentStatus: shipment.currentStatus,
                containerNumber: shipment.containerNumber,
                billOfLading: shipment.billOfLading,
                vesselName: shipment.vesselName,
                ETD: shipment.ETD,
                ETA: shipment.ETA,
                statusHistory: shipment.statusHistory
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Không thể tra cứu Shipment",
            error: error.message
        });
    }
};


// CUSTOMER / EMPLOYEE / ADMIN
export const getShipmentById = async (req, res) => {
    try {
        const shipment = await Shipment.findById(req.params.id)
            .populate("customer", "fullName email")
            .populate("booking");

        if (!shipment) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy Shipment"
            });
        }

        // Customer chỉ xem được shipment của mình
        if (
            req.user.role === "CUSTOMER" &&
            shipment.customer._id.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Bạn không có quyền xem Shipment này"
            });
        }

        res.status(200).json({
            success: true,
            data: shipment
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Không thể lấy Shipment",
            error: error.message
        });
    }
};


// EMPLOYEE: Cập nhật trạng thái Shipment
export const updateShipmentStatus = async (req, res) => {
    try {
        const { status, note } = req.body;

        const shipment = await Shipment.findById(req.params.id);

        if (!shipment) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy Shipment"
            });
        }

        // Các trạng thái hợp lệ
        const validStatuses = [
            "BOOKING_CONFIRMED",
            "DOC_UPLOADED",
            "DOC_APPROVED",
            "CUSTOMS_EXPORT",
            "PICKED_UP",
            "AT_PORT",
            "DEPARTED",
            "ARRIVED",
            "CUSTOMS_IMPORT",
            "DELIVERING",
            "DELIVERED"
        ];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Trạng thái Shipment không hợp lệ"
            });
        }

        // Cập nhật trạng thái hiện tại
        shipment.currentStatus = status;

        // Lưu lịch sử
        shipment.statusHistory.push({
            status: status,
            timestamp: new Date(),
            note: note || "",
            updatedBy: req.user._id
        });

        await shipment.save();

        // Tạo thông báo cho Customer
        await Notification.create({
        userId: shipment.customer,
        shipmentId: shipment._id,
        title: "Shipment Updated",
        message: `Shipment ${shipment.shipmentNumber} đã chuyển sang trạng thái ${status}.`,
        type: "SHIPMENT_STATUS",
        isRead: false
        });

        res.status(200).json({
            success: true,
            message: "Cập nhật trạng thái Shipment thành công",
            data: shipment
        });

    } catch (error) {
        console.error("UPDATE SHIPMENT STATUS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Không thể cập nhật trạng thái Shipment",
            error: error.message
        });
    }
};

// EMPLOYEE / ADMIN: Cập nhật thông tin vận chuyển
export const updateShipmentInfo = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            containerNumber,
            billOfLading,
            vesselName,
            ETD,
            ETA
        } = req.body;

        const shipment = await Shipment.findById(id);

        if (!shipment) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy Shipment"
            });
        }

        // Chỉ cập nhật những field được gửi lên
        if (containerNumber !== undefined) {
            shipment.containerNumber = containerNumber;
        }

        if (billOfLading !== undefined) {
            shipment.billOfLading = billOfLading;
        }

        if (vesselName !== undefined) {
            shipment.vesselName = vesselName;
        }

        if (ETD !== undefined) {
            shipment.ETD = ETD;
        }

        if (ETA !== undefined) {
            shipment.ETA = ETA;
        }

        await shipment.save();

        res.status(200).json({
            success: true,
            message: "Cập nhật thông tin Shipment thành công",
            data: shipment
        });

    } catch (error) {
        console.error("UPDATE SHIPMENT INFO ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Không thể cập nhật thông tin Shipment",
            error: error.message
        });
    }
};

export const getAllShipments = async (req, res) => {
    try {
        // Lấy tất cả lô hàng, sắp xếp theo ngày tạo (mới nhất lên đầu)
        // Dùng populate để lấy thêm tên khách hàng từ bảng User nếu có
        const shipments = await Shipment.find()
            .sort({ createdAt: -1 })
            .populate("customer", "fullName email"); 

        res.status(200).json({
            success: true,
            count: shipments.length,
            data: shipments
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách lô hàng:", error);
        res.status(500).json({ 
            success: false, 
            message: "Lỗi hệ thống khi tải dữ liệu lô hàng." 
        });
    }
};