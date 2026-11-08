import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
    {
        invoiceNumber: {
            type: String,
            required: true,
            unique: true
        },

        shipmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shipment",
            required: true
        },

        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true
        },

        subtotal: {
            type: Number,
            required: true,
            min: 0
        },

        tax: {
            type: Number,
            default: 0,
            min: 0
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },

        status: {
            type: String,
            enum: [
                "UNPAID",
                "PAID",
                "OVERDUE",
                "CANCELLED"
            ],
            default: "UNPAID"
        },

        issuedAt: {
            type: Date,
            default: Date.now
        },

        dueDate: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;