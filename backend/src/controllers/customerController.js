import Customer from "../models/Customer.js";

// CUSTOMER: Tạo thông tin doanh nghiệp
export const createCustomer = async (req, res) => {
    try {
        const {
            companyName,
            taxCode,
            address,
            contactPerson,
            phone,
            email
        } = req.body;

        // Kiểm tra dữ liệu
        if (
            !companyName ||
            !taxCode ||
            !address ||
            !contactPerson ||
            !phone ||
            !email
        ) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng cung cấp đầy đủ thông tin khách hàng"
            });
        }

        // Kiểm tra Customer đã tồn tại chưa
        const existingCustomer = await Customer.findOne({
            userId: req.user._id
        });

        if (existingCustomer) {
            return res.status(400).json({
                success: false,
                message: "Tài khoản này đã có thông tin khách hàng"
            });
        }

        // Kiểm tra mã số thuế
        const existingTaxCode = await Customer.findOne({
            taxCode
        });

        if (existingTaxCode) {
            return res.status(400).json({
                success: false,
                message: "Mã số thuế đã tồn tại"
            });
        }

        const customer = await Customer.create({
            userId: req.user._id,
            companyName,
            taxCode,
            address,
            contactPerson,
            phone,
            email
        });

        res.status(201).json({
            success: true,
            message: "Tạo thông tin khách hàng thành công",
            data: customer
        });

    } catch (error) {
        console.error("CREATE CUSTOMER ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Không thể tạo thông tin khách hàng",
            error: error.message
        });
    }
};


// CUSTOMER: Xem thông tin của mình
export const getMyCustomer = async (req, res) => {
    try {
        const customer = await Customer.findOne({
            userId: req.user._id
        }).populate("userId", "fullName email role");

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Chưa có thông tin khách hàng"
            });
        }

        res.status(200).json({
            success: true,
            data: customer
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Không thể lấy thông tin khách hàng",
            error: error.message
        });
    }
};


// CUSTOMER: Cập nhật thông tin của mình
export const updateMyCustomer = async (req, res) => {
    try {
        const {
            companyName,
            address,
            contactPerson,
            phone,
            email
        } = req.body;

        const customer = await Customer.findOne({
            userId: req.user._id
        });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Chưa có thông tin khách hàng"
            });
        }

        if (companyName !== undefined) {
            customer.companyName = companyName;
        }

        if (address !== undefined) {
            customer.address = address;
        }

        if (contactPerson !== undefined) {
            customer.contactPerson = contactPerson;
        }

        if (phone !== undefined) {
            customer.phone = phone;
        }

        if (email !== undefined) {
            customer.email = email;
        }

        await customer.save();

        res.status(200).json({
            success: true,
            message: "Cập nhật thông tin khách hàng thành công",
            data: customer
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Không thể cập nhật thông tin khách hàng",
            error: error.message
        });
    }
};


// EMPLOYEE / ADMIN: Xem danh sách khách hàng
export const getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find()
            .populate("userId", "fullName email role")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: customers
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Không thể lấy danh sách khách hàng",
            error: error.message
        });
    }
};


// EMPLOYEE / ADMIN: Xem một khách hàng
export const getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id)
            .populate("userId", "fullName email role");

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy khách hàng"
            });
        }

        res.status(200).json({
            success: true,
            data: customer
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Không thể lấy thông tin khách hàng",
            error: error.message
        });
    }
};