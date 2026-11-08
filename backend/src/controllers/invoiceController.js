import Invoice from "../models/Invoice.js";
import Shipment from "../models/Shipment.js";
import Customer from "../models/Customer.js";

// Tạo Invoice
export const createInvoice = async (req, res) => {
    try {
        const {
            invoiceNumber,
            shipmentId,
            customerId,
            subtotal,
            tax,
            totalAmount,
            dueDate
        } = req.body;

        if (
            !invoiceNumber ||
            !shipmentId ||
            !customerId ||
            subtotal === undefined ||
            totalAmount === undefined ||
            !dueDate
        ) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng cung cấp đầy đủ thông tin Invoice"
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

        // Kiểm tra Customer
        const customer = await Customer.findById(customerId);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy Customer"
            });
        }

        // Không cho tạo trùng invoice
        const existingInvoice = await Invoice.findOne({
            invoiceNumber
        });

        if (existingInvoice) {
            return res.status(400).json({
                success: false,
                message: "Invoice Number đã tồn tại"
            });
        }

        const invoice = await Invoice.create({
            invoiceNumber,
            shipmentId,
            customerId,
            subtotal,
            tax: tax || 0,
            totalAmount,
            status: "UNPAID",
            dueDate
        });

        res.status(201).json({
            success: true,
            message: "Tạo Invoice thành công",
            data: invoice
        });

    } catch (error) {
        console.error("CREATE INVOICE ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Không thể tạo Invoice",
            error: error.message
        });
    }
};


// Lấy Invoice theo Shipment
export const getInvoicesByShipment = async (req, res) => {
    try {
        const { shipmentId } = req.params;

        const invoices = await Invoice.find({
            shipmentId
        })
            .populate(
                "shipmentId",
                "shipmentNumber origin destination currentStatus"
            )
            .populate(
                "customerId",
                "companyName taxCode email"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: invoices
        });

    } catch (error) {
        console.error("GET INVOICES ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Không thể lấy danh sách Invoice",
            error: error.message
        });
    }
};


// Lấy tất cả Invoice
export const getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find()
            .populate(
                "shipmentId",
                "shipmentNumber origin destination currentStatus"
            )
            .populate(
                "customerId",
                "companyName taxCode email"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: invoices
        });

    } catch (error) {
        console.error("GET INVOICES ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Không thể lấy danh sách Invoice",
            error: error.message
        });
    }
};


// Cập nhật trạng thái Invoice
export const updateInvoiceStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (
            ![
                "UNPAID",
                "PAID",
                "OVERDUE",
                "CANCELLED"
            ].includes(status)
        ) {
            return res.status(400).json({
                success: false,
                message: "Trạng thái Invoice không hợp lệ"
            });
        }

        const invoice = await Invoice.findById(id);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy Invoice"
            });
        }

        invoice.status = status;

        await invoice.save();

        res.status(200).json({
            success: true,
            message: "Cập nhật trạng thái Invoice thành công",
            data: invoice
        });

    } catch (error) {
        console.error("UPDATE INVOICE ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Không thể cập nhật Invoice",
            error: error.message
        });
    }
};