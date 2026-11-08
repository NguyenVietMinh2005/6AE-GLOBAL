import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
    {
        shipmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shipment",
            required: true
        },

        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        documentType: {
            type: String,
            enum: [
                "COMMERCIAL_INVOICE",
                "PACKING_LIST"
            ],
            required: true
        },

        fileName: {
            type: String,
            required: true
        },

        fileUrl: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: [
                "PENDING",
                "APPROVED",
                "REJECTED"
            ],
            default: "PENDING"
        },

        note: {
            type: String,
            default: ""
        },

        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        reviewedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Document = mongoose.model(
    "Document",
    documentSchema
);

export default Document;