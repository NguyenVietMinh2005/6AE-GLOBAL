import mongoose from "mongoose";

const containerSchema = new mongoose.Schema(
    {
        shipmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shipment",
            required: true
        },

        containerNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        containerType: {
            type: String,
            required: true,
            enum: [
                "20GP",
                "40GP",
                "40HC",
                "45HC"
            ]
        },

        sealNumber: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: [
                "EMPTY",
                "IN_TRANSIT",
                "AT_PORT",
                "DELIVERED"
            ],
            default: "EMPTY"
        }
    },
    {
        timestamps: true
    }
);

const Container = mongoose.model("Container", containerSchema);

export default Container;