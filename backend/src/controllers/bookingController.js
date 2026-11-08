import Booking from "../models/Booking.js";
import Quotation from "../models/Quotation.js";

// CUSTOMER: Tạo Booking từ quotation đã ACCEPTED
export const createBooking = async (req, res) => {
    try {
        console.log("========== CREATE BOOKING ==========");
        console.log("BODY:", req.body);
        console.log("USER:", req.user);

        const {
            quotationId,
            customerId,
            origin,
            destination,
            shippingMethod
        } = req.body;

        console.log("quotationId:", quotationId);
        console.log("customerId:", customerId);
        console.log("origin:", origin);
        console.log("destination:", destination);
        console.log("shippingMethod:", shippingMethod);

        if (
            !quotationId ||
            !customerId ||
            !origin ||
            !destination ||
            !shippingMethod
        ) {
            return res.status(400).json({
                success: false,
                message: "Thiếu thông tin tạo Booking",
                received: {
                    quotationId,
                    customerId,
                    origin,
                    destination,
                    shippingMethod
                }
            });
        }

        const bookingNumber =
            "BK" + Date.now();

        const booking = await Booking.create({
            quotationId: quotationId,
            customerId: customerId,
            origin: origin,
            destination: destination,
            shippingMethod: shippingMethod,
            bookingNumber: bookingNumber,
            status: "CONFIRMED"
        });

        console.log("BOOKING CREATED:", booking);

        return res.status(201).json({
            success: true,
            message: "Tạo Booking thành công",
            data: booking
        });

    } catch (error) {
        console.error("CREATE BOOKING ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Không thể tạo Booking",
            error: error.message
        });
    }
};


// CUSTOMER: Xem Booking của mình
export const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            customer: req.user._id
        })
            .populate("quotation")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: bookings
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Không thể lấy danh sách Booking",
            error: error.message
        });
    }
};


// CUSTOMER / EMPLOYEE / ADMIN: Xem Booking theo ID
export const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate("customer", "fullName email")
            .populate("quotation");

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy Booking"
            });
        }

        // Customer chỉ được xem Booking của mình
        if (
            req.user.role === "CUSTOMER" &&
            booking.customer._id.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Bạn không có quyền xem Booking này"
            });
        }

        res.status(200).json({
            success: true,
            data: booking
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Không thể lấy Booking",
            error: error.message
        });
    }
};

export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("customer", "fullName email")
            .populate("quotation")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: bookings
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Không thể lấy danh sách Booking",
            error: error.message
        });
    }
};