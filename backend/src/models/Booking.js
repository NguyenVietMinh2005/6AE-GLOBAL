import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        bookingNumber: {
            type: String,
            required: true,
            unique: true
        },

        quotationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quotation",
            required: true
        },

        customerId: {
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

        shippingMethod: {
            type: String,
            enum: ["SEA", "AIR", "ROAD"],
            required: true
        },

        etd: {
            type: String,
            default: ""
        },

        eta: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: [
                "PENDING",
                "CONFIRMED",
                "CANCELLED"
            ],
            default: "PENDING"
        }
    },
    {
        timestamps: true
    }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;