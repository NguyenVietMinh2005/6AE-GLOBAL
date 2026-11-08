import Notification from "../models/Notification.js";

// CUSTOMER: Xem danh sách thông báo
export const getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            userId: req.user._id
        })
            .populate("shipmentId", "shipmentNumber currentStatus")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: notifications
        });

    } catch (error) {
        console.error("GET NOTIFICATIONS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Không thể lấy thông báo",
            error: error.message
        });
    }
};


// CUSTOMER: Đánh dấu thông báo đã đọc
export const markNotificationAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(
            req.params.id
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy thông báo"
            });
        }

        // Kiểm tra quyền
        if (
            notification.userId.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Bạn không có quyền thực hiện thao tác này"
            });
        }

        notification.isRead = true;

        await notification.save();

        res.status(200).json({
            success: true,
            message: "Đã đánh dấu thông báo là đã đọc",
            data: notification
        });

    } catch (error) {
        console.error("MARK NOTIFICATION READ ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Không thể cập nhật thông báo",
            error: error.message
        });
    }
};