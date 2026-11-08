import Delivery from "../models/Delivery.js";
import Shipment from "../models/Shipment.js";
import Notification from "../models/Notification.js";

// Tạo Delivery
export const createDelivery = async (req, res) => {
    try {
        const {
            shipmentId,
            deliveryAddress,
            driverName,
            vehicleNumber,
            status,
            pickupTime,
            deliveryTime,
            podUrl
        } = req.body;

        // Kiểm tra Shipment
        const shipment = await Shipment.findById(shipmentId);

        if (!shipment) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy Shipment"
            });
        }

        if (!deliveryAddress) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập địa chỉ giao hàng"
            });
        }

        const delivery = await Delivery.create({
            shipmentId,
            deliveryAddress,
            driverName: driverName || "",
            vehicleNumber: vehicleNumber || "",
            status: status || "PENDING",
            pickupTime: pickupTime || null,
            deliveryTime: deliveryTime || null,
            podUrl: podUrl || null
        });

        res.status(201).json({
            success: true,
            message: "Tạo Delivery thành công",
            data: delivery
        });

    } catch (error) {
        console.error("CREATE DELIVERY ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Không thể tạo Delivery",
            error: error.message
        });
    }
};


// Lấy tất cả Delivery
export const getDeliveries = async (req, res) => {
    try {
        const deliveries = await Delivery.find()
            .populate(
                "shipmentId",
                "shipmentNumber currentStatus origin destination"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: deliveries
        });

    } catch (error) {
        console.error("GET DELIVERIES ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Không thể lấy danh sách Delivery",
            error: error.message
        });
    }
};


// Lấy Delivery theo Shipment
export const getDeliveriesByShipment = async (req, res) => {
    try {
        const { shipmentId } = req.params;

        const deliveries = await Delivery.find({
            shipmentId
        })
            .populate(
                "shipmentId",
                "shipmentNumber currentStatus origin destination"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: deliveries
        });

    } catch (error) {
        console.error("GET DELIVERIES BY SHIPMENT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Không thể lấy Delivery của Shipment",
            error: error.message
        });
    }
};


// Cập nhật trạng thái Delivery
// Cập nhật trạng thái Delivery
export const updateDeliveryStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            status,
            deliveryTime,
            podUrl
        } = req.body;

        // Tìm Delivery
        const delivery = await Delivery.findById(id);

        if (!delivery) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy Delivery"
            });
        }

        // Kiểm tra trạng thái
        if (
            ![
                "PENDING",
                "DELIVERING",
                "DELIVERED",
                "FAILED"
            ].includes(status)
        ) {
            return res.status(400).json({
                success: false,
                message: "Trạng thái Delivery không hợp lệ"
            });
        }

        // Không cho cập nhật lại Delivery đã DELIVERED
        if (
            delivery.status === "DELIVERED" &&
            status !== "DELIVERED"
        ) {
            return res.status(400).json({
                success: false,
                message: "Delivery đã hoàn thành, không thể chuyển về trạng thái khác"
            });
        }

        // Cập nhật Delivery
        delivery.status = status;

        // Nếu DELIVERED mà không truyền deliveryTime
        // thì tự động lấy thời gian hiện tại
        if (status === "DELIVERED") {
            delivery.deliveryTime =
                deliveryTime || new Date();
        }
        else if (deliveryTime !== undefined) {
            delivery.deliveryTime = deliveryTime;
        }

        if (podUrl !== undefined) {
            delivery.podUrl = podUrl;
        }

        await delivery.save();

        // ==========================================
        // Nếu Delivery đã DELIVERED
        // → cập nhật Shipment
        // ==========================================
        if (status === "DELIVERED") {

            const shipment = await Shipment.findById(
                delivery.shipmentId
            );

            if (shipment) {

                // Chỉ cập nhật nếu Shipment chưa DELIVERED
                if (shipment.currentStatus !== "DELIVERED") {

                    shipment.currentStatus = "DELIVERED";

                    shipment.statusHistory.push({
                        status: "DELIVERED",
                        timestamp: new Date(),
                        note: "Hàng đã được giao thành công cho khách hàng",
                        updatedBy: req.user._id
                    });

                    await shipment.save();

                    // Tạo Notification cho Customer
                    await Notification.create({
                        userId: shipment.customer,
                        shipmentId: shipment._id,
                        title: "Shipment Updated",
                        message:
                            `Shipment ${shipment.shipmentNumber} đã chuyển sang trạng thái DELIVERED.`,
                        type: "SHIPMENT_STATUS",
                        isRead: false
                    });
                }
            }
        }

        res.status(200).json({
            success: true,
            message: "Cập nhật trạng thái Delivery thành công",
            data: delivery
        });

    } catch (error) {
        console.error(
            "UPDATE DELIVERY STATUS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Không thể cập nhật Delivery",
            error: error.message
        });
    }
};