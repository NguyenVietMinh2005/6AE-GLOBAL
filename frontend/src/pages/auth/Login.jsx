import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";

function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", form);
            const { token, user } = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            if (user.role === "CUSTOMER") {
                navigate("/customer");
            } else {
                navigate("/admin");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại.");
        } finally {
            setLoading(false);
        }
    };

    const bgImage = "https://images.unsplash.com/photo-1586528116311-ad8ed7c80a71?q=80&w=2070&auto=format&fit=crop";

    return (
        <div 
            className="min-h-screen flex items-center justify-center bg-cover bg-center relative font-sans"
            style={{ backgroundImage: `url('${bgImage}')` }}
        >
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>

            <div className="relative z-10 w-full max-w-md bg-white/95 p-10 rounded-3xl shadow-2xl border border-white/20">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black text-blue-900 tracking-tighter drop-shadow-sm">6AE GLOBAL</h1>
                    <p className="text-slate-500 mt-2 font-medium">Hệ sinh thái Logistics số toàn diện</p>
                </div>

                <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Đăng nhập</h2>

                {error && (
                    <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded-r-md">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Email doanh nghiệp</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="admin@6aeglobal.com"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Mật khẩu</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 outline-none pr-12"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors focus:outline-none"
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Hàng Ghi nhớ đăng nhập & Quên mật khẩu */}
                    <div className="flex items-center justify-between pt-1 pb-1">
                        <label className="flex items-center cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer" />
                            <span className="ml-2 text-sm font-medium text-slate-600">Ghi nhớ đăng nhập</span>
                        </label>
                        <Link to="/forgot-password" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">Quên mật khẩu?</Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3.5 px-4 mt-2 rounded-xl text-white font-bold text-lg shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 ${
                            loading ? "bg-slate-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 hover:shadow-blue-900/30"
                        }`}
                    >
                        {loading ? "Đang xác thực..." : "Đăng nhập ngay"}
                    </button>
                </form>
                
                <div className="mt-6 text-center text-sm font-medium text-slate-600">
                    Chưa có tài khoản? <Link to="/register" className="text-blue-600 hover:text-blue-800 transition-colors">Đăng ký đối tác mới</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;