import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    const [quickCode, setQuickCode] = useState("");

    // Đã sử dụng handleQuickTrack và setQuickCode
    const handleQuickTrack = (e) => {
        e.preventDefault();
        if (quickCode.trim()) {
            navigate(`/tracking?code=${quickCode.trim()}`);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200">
                            6A
                        </div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-wider">6AE<span className="text-blue-600">GLOBAL</span></h1>
                    </div>
                    
                    <nav className="hidden md:flex gap-8">
                        <a href="#services" className="text-slate-600 hover:text-blue-600 font-bold transition-colors">Dịch vụ</a>
                        <a href="#about" className="text-slate-600 hover:text-blue-600 font-bold transition-colors">Về chúng tôi</a>
                        <Link to="/tracking" className="text-slate-600 hover:text-orange-500 font-bold transition-colors">Tra cứu Vận đơn</Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-blue-600 font-bold hover:text-blue-800 transition-colors hidden sm:block">
                            Cổng Khách hàng
                        </Link>
                        <Link to="/admin-login" className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-lg shadow-md transition-transform hover:-translate-y-0.5">
                            Nội bộ (Nhân viên)
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                <section className="relative bg-blue-700 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8ed7c83a7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative z-10">
                        <div className="max-w-3xl">
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                                Giải pháp Logistics <span className="text-orange-400">Toàn diện & Tốc độ</span>
                            </h2>
                            <p className="text-lg md:text-xl text-blue-100 font-medium mb-8 leading-relaxed">
                                6AE GLOBAL kết nối hàng hóa của bạn đến mọi nơi trên thế giới một cách an toàn, minh bạch và tối ưu chi phí nhất.
                            </p>
                            
                            {/* Ô tra cứu nhanh tích hợp ngay tại Trang chủ */}
                            <form onSubmit={handleQuickTrack} className="bg-white p-3 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-3 max-w-xl">
                                <input
                                    type="text"
                                    value={quickCode}
                                    onChange={(e) => setQuickCode(e.target.value)} // Đã sử dụng setQuickCode
                                    placeholder="Nhập mã vận đơn (VD: SHP-527036)..."
                                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-700 text-base"
                                />
                                <button
                                    type="submit"
                                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl shadow transition-transform hover:-translate-y-0.5"
                                >
                                    Tra cứu ngay
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-slate-900 text-slate-400 py-8 text-center">
                <p className="font-medium">© 2026 6AE GLOBAL Logistics. Hệ thống quản lý điều hành vận tải.</p>
            </footer>
        </div>
    );
}

export default Home;