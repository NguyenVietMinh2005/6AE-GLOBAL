import mongoose from "mongoose";

const shipmentHistorySchema = new mongoose.Schema(
    {
        status: {
            type: String,
            required: true
        },

        timestamp: {
            type: Date,
            default: Date.now
        },

        note: {
            type: String,
            default: ""
        },

        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        _id: false
    }
);

const shipmentSchema = new mongoose.Schema(
    {
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: false,
            unique: true,
            sparse: true
        },

        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        shipmentNumber: {
            type: String,
            required: true,
            unique: true
        },

        currentStatus: {
            type: String,
            enum: [
                "BOOKING_CONFIRMED",
                "DOC_UPLOADED",
                "DOC_APPROVED",
                "CUSTOMS_EXPORT",
                "PICKED_UP",
                "AT_PORT",
                "DEPARTED",
                "ARRIVED",
                "CUSTOMS_IMPORT",
                "DELIVERING",
                "DELIVERED"
            ],
            default: "BOOKING_CONFIRMED"
        },

        origin: {
            type: String,
            required: true
        },

        destination: {
            type: String,
            required: true
        },

        containerNumber: {
            type: String,
            default: ""
        },

        billOfLading: {
            type: String,
            default: ""
        },

        vesselName: {
            type: String,
            default: ""
        },

        ETD: {
            type: Date,
            default: null
        },

        ETA: {
            type: Date,
            default: null
        },

        statusHistory: {
            type: [shipmentHistorySchema],
            default: []
        }
    },
    {
        timestamps: true
    }
);

const Shipment = mongoose.model("Shipment", shipmentSchema);

export default Shipment;