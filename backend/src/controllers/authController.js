import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import nodemailer from "nodemailer";

export const register = async (req, res) => {
    try {
        const { email, password, fullName, role } = req.body;

        if (!email || !password || !fullName) {
            return res.status(400).json({
                success: false,
                message: "Email, password và fullName là bắt buộc"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email đã tồn tại"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullName: req.body.fullName,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role || "CUSTOMER"
        });

        res.status(201).json({
            success: true,
            message: "Đăng ký thành công",
            data: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Đăng ký thất bại",
            error: error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email và password là bắt buộc"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Email hoặc password không đúng"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Email hoặc password không đúng"
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Tài khoản đã bị khóa"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            success: true,
            message: "Đăng nhập thành công",
            token,
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Đăng nhập thất bại",
            error: error.message
        });
    }
};

// CUSTOMER / EMPLOYEE / ADMIN: Yêu cầu khôi phục mật khẩu
// Gửi OTP về Gmail
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "Email không tồn tại." });
        }

        // Tạo mã OTP 6 số ngẫu nhiên
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Lưu OTP vào DB, hạn 15 phút
        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
        await user.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"6AE GLOBAL Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Mã OTP Khôi phục mật khẩu - 6AE GLOBAL",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #1e3a8a; text-align: center;">6AE GLOBAL</h2>
                    <p>Xin chào,</p>
                    <p>Mã OTP để khôi phục mật khẩu của bạn là:</p>
                    <h1 style="text-align: center; color: #ea580c; font-size: 36px; letter-spacing: 5px;">${otp}</h1>
                    <p style="color: #dc2626; font-size: 14px; text-align: center;">* Mã này sẽ hết hạn sau 15 phút.</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: "Mã OTP đã được gửi về Gmail của bạn!" });

    } catch (error) {
        console.error("Lỗi gửi email:", error);
        res.status(500).json({ success: false, message: "Không thể gửi email lúc này." });
    }
};

// Xác thực OTP và đổi mật khẩu
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await User.findOne({ 
            email, 
            resetPasswordOTP: otp,
            resetPasswordExpires: { $gt: Date.now() } // Kiểm tra OTP còn hạn không
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Mã OTP không đúng hoặc đã hết hạn." });
        }

        // Đổi mật khẩu
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        
        // Xóa OTP cũ
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ success: true, message: "Đổi mật khẩu thành công!" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi hệ thống." });
    }
};