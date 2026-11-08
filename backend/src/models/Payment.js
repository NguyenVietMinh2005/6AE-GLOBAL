import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        invoiceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Invoice",
            required: true
        },

        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        method: {
            type: String,
            enum: [
                "BANK_TRANSFER",
                "CASH",
                "CREDIT_CARD"
            ],
            required: true
        },

        status: {
            type: String,
            enum: [
                "PENDING",
                "PAID",
                "FAILED"
            ],
            default: "PENDING"
        },

        paidAt: {
            type: Date,
            default: null
        },

        reference: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;