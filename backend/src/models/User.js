import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            resetPasswordOTP: { type: String },
            resetPasswordExpires: { type: Date },
            required: true
        },

        fullName: {
            type: String,
            required: true,
            trim: true
        },

        role: {
            type: String,
            enum: ["CUSTOMER", "EMPLOYEE", "ADMIN"],
            required: true,
            default: "CUSTOMER"
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

export default User;