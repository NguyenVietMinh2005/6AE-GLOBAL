import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
    {
        shipmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shipment",
            required: true
        },

        deliveryAddress: {
            type: String,
            required: true
        },

        driverName: {
            type: String,
            default: ""
        },

        vehicleNumber: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: [
                "PENDING",
                "DELIVERING",
                "DELIVERED",
                "FAILED"
            ],
            default: "PENDING"
        },

        pickupTime: {
            type: Date,
            default: null
        },

        deliveryTime: {
            type: Date,
            default: null
        },

        podUrl: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Delivery = mongoose.model("Delivery", deliverySchema);

export default Delivery;