import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

function ForgotPassword() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Nhập Email, 2: Nhập OTP & Pass
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Xử lý gửi Email lấy OTP
    const handleSendEmail = async (e) => {
        e.preventDefault();
        setMessage(""); setError(""); setLoading(true);

        try {
            const response = await api.post("/auth/forgot-password", { email });
            setMessage(response.data.message);
            setStep(2); // Chuyển sang bước nhập OTP
        } catch (error) {
            setError(error.response?.data?.message || "Đã xảy ra lỗi.");
        } finally {
            setLoading(false);
        }
    };

    // Xử lý nộp OTP và đổi mật khẩu
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage(""); setError(""); setLoading(true);

        try {
            const response = await api.post("/auth/reset-password", { email, otp, newPassword });
            setMessage(response.data.message);
            setTimeout(() => navigate("/"), 2500); // Đổi xong tự về trang Login
        } catch (error) {
            setError(error.response?.data?.message || "Mã OTP không hợp lệ.");
        } finally {
            setLoading(false);
        }
    };

    const bgImage = "https://images.unsplash.com/photo-1586528116311-ad8ed7c80a71?q=80&w=2070&auto=format&fit=crop";

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center relative font-sans" style={{ backgroundImage: `url('${bgImage}')` }}>
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
            <div className="relative z-10 w-full max-w-md bg-white/95 p-10 rounded-3xl shadow-2xl border border-white/20">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-800">Khôi phục mật khẩu</h2>
                    <p className="text-slate-500 mt-2 text-sm">
                        {step === 1 ? "Nhập email doanh nghiệp để nhận mã OTP." : "Mã OTP đã được gửi đến email của bạn."}
                    </p>
                </div>

                {message && <div className="mb-6 p-3 bg-green-50 text-green-700 text-sm font-medium rounded border-l-4 border-green-500">{message}</div>}
                {error && <div className="mb-6 p-3 bg-red-50 text-red-700 text-sm font-medium rounded border-l-4 border-red-500">{error}</div>}

                {step === 1 ? (
                    // BƯỚC 1: FORM NHẬP EMAIL
                    <form onSubmit={handleSendEmail} className="space-y-5">
                        <div>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Nhập email của bạn..." className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none" required />
                        </div>
                        <button type="submit" disabled={loading} className={`w-full py-3.5 px-4 rounded-xl text-white font-bold text-lg shadow-lg ${loading ? "bg-slate-400" : "bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800"}`}>
                            {loading ? "Đang gửi OTP..." : "Nhận mã OTP"}
                        </button>
                    </form>
                ) : (
                    // BƯỚC 2: FORM NHẬP OTP & PASS MỚI
                    <form onSubmit={handleResetPassword} className="space-y-5">
                        <div>
                            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Nhập mã OTP 6 số" maxLength="6" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none font-bold text-center tracking-[0.5em]" required />
                        </div>
                        <div>
                            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Nhập mật khẩu mới" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none" required minLength="6" />
                        </div>
                        <button type="submit" disabled={loading} className={`w-full py-3.5 px-4 rounded-xl text-white font-bold text-lg shadow-lg ${loading ? "bg-slate-400" : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600"}`}>
                            {loading ? "Đang xử lý..." : "Xác nhận & Đổi mật khẩu"}
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center text-sm font-medium">
                    <Link to="/" className="text-slate-500 hover:text-blue-700 transition-colors">← Quay lại Đăng nhập</Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;