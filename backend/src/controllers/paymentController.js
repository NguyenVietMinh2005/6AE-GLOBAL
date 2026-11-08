import Payment from "../models/Payment.js";
import Invoice from "../models/Invoice.js";
import Customer from "../models/Customer.js";

// Tạo Payment
export const createPayment = async (req, res) => {
    try {
        const {
            invoiceId,
            customerId,
            amount,
            method,
            reference
        } = req.body;

        if (
            !invoiceId ||
            !customerId ||
            amount === undefined ||
            !method
        ) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng cung cấp đầy đủ thông tin Payment"
            });
        }

        // Kiểm tra Invoice
        const invoice = await Invoice.findById(invoiceId);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy Invoice"
            });
        }

        // Kiểm tra Customer
        const customer = await Customer.findById(customerId);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy Customer"
            });
        }

        // Kiểm tra số tiền
        if (Number(amount) !== Number(invoice.totalAmount)) {
            return res.status(400).json({
                success: false,
                message: "Số tiền thanh toán không khớp với Invoice"
            });
        }

        // Không cho thanh toán Invoice đã PAID
        if (invoice.status === "PAID") {
            return res.status(400).json({
                success: false,
                message: "Invoice này đã được thanh toán"
            });
        }

        const payment = await Payment.create({
            invoiceId,
            customerId,
            amount,
            method,
            status: "PAID",
            paidAt: new Date(),
            reference: reference || ""
        });

        // Cập nhật Invoice
        invoice.status = "PAID";
        await invoice.save();

        res.status(201).json({
            success: true,
            message: "Thanh toán thành công",
            data: payment
        });

    } catch (error) {
        console.error("CREATE PAYMENT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Không thể tạo Payment",
            error: error.message
        });
    }
};


// Lấy tất cả Payment
export const getPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate(
                "invoiceId",
                "invoiceNumber totalAmount status dueDate"
            )
            .populate(
                "customerId",
                "companyName taxCode email"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: payments
        });

    } catch (error) {
        console.error("GET PAYMENTS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Không thể lấy danh sách Payment",
            error: error.message
        });
    }
};


// Lấy Payment theo Invoice
export const getPaymentsByInvoice = async (req, res) => {
    try {
        const { invoiceId } = req.params;

        const payments = await Payment.find({
            invoiceId
        })
            .populate(
                "invoiceId",
                "invoiceNumber totalAmount status"
            )
            .populate(
                "customerId",
                "companyName taxCode email"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: payments
        });

    } catch (error) {
        console.error("GET PAYMENTS BY INVOICE ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Không thể lấy Payment",
            error: error.message
        });
    }
};