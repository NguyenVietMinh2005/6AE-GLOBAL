import User from "../models/User.js";

export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");

        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Cannot get users",
            error: error.message
        });
    }
};

export const getAllCustomers = async (req, res) => {
    try {
        // Chỉ lấy những user có role là CUSTOMER
        const customers = await User.find({ role: "CUSTOMER" }).select("fullName email _id");
        
        res.status(200).json({
            success: true,
            data: customers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi lấy danh sách khách hàng",
            error: error.message
        });
    }
};