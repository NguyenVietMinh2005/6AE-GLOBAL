import Quotation from "../models/Quotation.js";

// CUSTOMER: Tạo yêu cầu báo giá
export const createQuotation = async (req, res) => {
    try {
        const {
            origin,
            destination,
            cargoType,
            quantity,
            weight,
            note
        } = req.body;

        if (
            !origin ||
            !destination ||
            !cargoType ||
            !quantity ||
            !weight
        ) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập đầy đủ thông tin báo giá"
            });
        }

        const quotation = await Quotation.create({
            customer: req.user._id,
            origin,
            destination,
            cargoType,
            quantity,
            weight,
            note: note || "",
            status: "REQUESTED"
        });

        res.status(201).json({
            success: true,
            message: "Tạo yêu cầu báo giá thành công",
            data: quotation
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Không thể tạo yêu cầu báo giá",
            error: error.message
        });
    }
};


// CUSTOMER: Xem các yêu cầu báo giá của mình
export const getMyQuotations = async (req, res) => {
    try {
        const quotations = await Quotation.find({
            customer: req.user._id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: quotations
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Không thể lấy danh sách báo giá",
            error: error.message
        });
    }
};


// EMPLOYEE / ADMIN: Xem tất cả yêu cầu báo giá
export const getAllQuotations = async (req, res) => {
    try {
        const quotations = await Quotation.find()
            .populate("customer", "fullName email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: quotations
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Không thể lấy danh sách báo giá",
            error: error.message
        });
    }
};


// EMPLOYEE / ADMIN: Gửi báo giá cho khách
export const sendQuotation = async (req, res) => {
    try {
        const { quotedPrice, note } = req.body;

        if (quotedPrice === undefined || quotedPrice === null) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập giá báo"
            });
        }

        const quotation = await Quotation.findById(req.params.id);

        if (!quotation) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy yêu cầu báo giá"
            });
        }

        if (quotation.status !== "REQUESTED") {
            return res.status(400).json({
                success: false,
                message: "Yêu cầu báo giá không ở trạng thái REQUESTED"
            });
        }

        quotation.quotedPrice = quotedPrice;
        quotation.note = note || quotation.note;
        quotation.status = "QUOTED";

        await quotation.save();

        res.status(200).json({
            success: true,
            message: "Đã gửi báo giá cho khách hàng",
            data: quotation
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Không thể gửi báo giá",
            error: error.message
        });
    }
};


// CUSTOMER: Xác nhận báo giá
export const acceptQuotation = async (req, res) => {
    try {
        const quotation = await Quotation.findById(req.params.id);

        if (!quotation) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy yêu cầu báo giá"
            });
        }

        // Chỉ Customer sở hữu quotation mới được xác nhận
        if (
            quotation.customer.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Bạn không có quyền xác nhận báo giá này"
            });
        }

        // Chỉ quotation đã được báo giá mới được xác nhận
        if (quotation.status !== "QUOTED") {
            return res.status(400).json({
                success: false,
                message: "Báo giá chưa ở trạng thái QUOTED"
            });
        }

        quotation.status = "ACCEPTED";

        await quotation.save();

        res.status(200).json({
            success: true,
            message: "Đã xác nhận báo giá",
            data: quotation
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Không thể xác nhận báo giá",
            error: error.message
        });
    }
};