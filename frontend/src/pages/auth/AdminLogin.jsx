import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

function AdminLogin() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); setLoading(true);

        try {
            const response = await api.post("/auth/login", form);
            const { token, user } = response.data;

            // Chặn Customer đăng nhập ở cổng này
            if (user.role === "CUSTOMER") {
                setError("Tài khoản khách hàng không được truy cập cổng nội bộ.");
                setLoading(false);
                return;
            }

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            navigate("/admin");
            
        } catch (error) {
            setError(error.response?.data?.message || "Sai thông tin đăng nhập.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 font-sans">
            <div className="w-full max-w-md bg-slate-800 p-10 rounded-2xl shadow-2xl border border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-blue-500 tracking-wider">6AE WORKSPACE</h1>
                    <p className="text-slate-400 mt-2 text-sm">Cổng Đăng Nhập Nội Bộ</p>
                </div>

                {error && <div className="mb-6 p-3 bg-red-900/50 border-l-4 border-red-500 text-red-200 text-sm rounded">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-300 mb-1">Email nhân viên</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-700 text-white focus:ring-2 focus:ring-blue-500 outline-none" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-300 mb-1">Mật khẩu</label>
                        <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-700 text-white focus:ring-2 focus:ring-blue-500 outline-none" required />
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-3.5 mt-4 rounded-lg text-white font-bold bg-blue-600 hover:bg-blue-700 transition-colors">
                        {loading ? "Đang xác thực..." : "Đăng nhập hệ thống"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;