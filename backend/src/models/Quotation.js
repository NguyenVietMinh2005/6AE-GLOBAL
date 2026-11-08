import mongoose from "mongoose";

const quotationSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        origin: {
            type: String,
            required: true
        },

        destination: {
            type: String,
            required: true
        },

        cargoType: {
            type: String,
            required: true
        },

        quantity: {
            type: Number,
            required: true
        },

        weight: {
            type: Number,
            required: true
        },

        requestedPrice: {
            type: Number,
            default: null
        },

        quotedPrice: {
            type: Number,
            default: null
        },

        status: {
            type: String,
            enum: [
                "REQUESTED",
                "QUOTED",
                "ACCEPTED",
                "REJECTED"
            ],
            default: "REQUESTED"
        },

        note: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const Quotation = mongoose.model("Quotation", quotationSchema);

export default Quotation;