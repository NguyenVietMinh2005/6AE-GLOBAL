import Container from "../models/Container.js";
import Shipment from "../models/Shipment.js";

// EMPLOYEE / ADMIN: Tạo Container
export const createContainer = async (req, res) => {
    try {
        const {
            shipmentId,
            containerNumber,
            containerType,
            sealNumber,
            status
        } = req.body;

        // Kiểm tra dữ liệu
        if (
            !shipmentId ||
            !containerNumber ||
            !containerType ||
            !sealNumber
        ) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng cung cấp đầy đủ thông tin Container"
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

        // Kiểm tra containerNumber đã tồn tại
        const existingContainer = await Container.findOne({
            containerNumber
        });

        if (existingContainer) {
            return res.status(400).json({
                success: false,
                message: "Container này đã tồn tại"
            });
        }

        // Tạo Container
        const container = await Container.create({
            shipmentId,
            containerNumber,
            containerType,
            sealNumber,
            status: status || "EMPTY"
        });

        res.status(201).json({
            success: true,
            message: "Tạo Container thành công",
            data: container
        });

    } catch (error) {
        console.error("CREATE CONTAINER ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Không thể tạo Container",
            error: error.message
        });
    }
};


// EMPLOYEE / ADMIN: Xem tất cả Container
export const getContainers = async (req, res) => {
    try {
        const containers = await Container.find()
            .populate(
                "shipmentId",
                "shipmentNumber origin destination currentStatus"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: containers
        });

    } catch (error) {
        console.error("GET CONTAINERS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Không thể lấy danh sách Container",
            error: error.message
        });
    }
};


// EMPLOYEE / ADMIN: Xem Container theo Shipment
export const getContainersByShipment = async (req, res) => {
    try {
        const { shipmentId } = req.params;

        const shipment = await Shipment.findById(shipmentId);

        if (!shipment) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy Shipment"
            });
        }

        const containers = await Container.find({
            shipmentId
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: containers
        });

    } catch (error) {
        console.error("GET CONTAINERS BY SHIPMENT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Không thể lấy Container của Shipment",
            error: error.message
        });
    }
};


// EMPLOYEE / ADMIN: Cập nhật trạng thái Container
export const updateContainerStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatus = [
            "EMPTY",
            "IN_TRANSIT",
            "AT_PORT",
            "DELIVERING",
            "DELIVERED"
        ];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Trạng thái Container không hợp lệ"
            });
        }

        const container = await Container.findById(id);

        if (!container) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy Container"
            });
        }

        container.status = status;

        await container.save();

        res.status(200).json({
            success: true,
            message: "Cập nhật trạng thái Container thành công",
            data: container
        });

    } catch (error) {
        console.error("UPDATE CONTAINER STATUS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Không thể cập nhật trạng thái Container",
            error: error.message
        });
    }
};