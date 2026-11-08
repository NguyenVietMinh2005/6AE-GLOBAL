import mongoose from "mongoose";

const customsSchema = new mongoose.Schema(
    {
        shipmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shipment",
            required: true
        },

        type: {
            type: String,
            enum: ["EXPORT", "IMPORT"],
            required: true
        },

        declarationNumber: {
            type: String,
            required: true,
            unique: true
        },

        status: {
            type: String,
            enum: [
                "PENDING",
                "SUBMITTED",
                "CLEARED",
                "REJECTED"
            ],
            default: "PENDING"
        },

        submittedAt: {
            type: Date,
            default: null
        },

        clearedAt: {
            type: Date,
            default: null
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

const Customs = mongoose.model("Customs", customsSchema);

export default Customs;