import { useState, useEffect } from "react";
import { useNavigate, Routes, Route, Link, useLocation } from "react-router-dom";
import api from "../../api/axios"; // Thêm import api để gọi dữ liệu

import ShipmentManager from "./ShipmentManager";
import CreateShipment from "./CreateShipment";
import UpdateStatus from "./UpdateStatus";

// Tạo một Component nhỏ xử lý màn hình Tổng quan
const DashboardOverview = () => {
    const [stats, setStats] = useState({ total: 0, inTransit: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get("/shipments");
                const shipments = response.data.data || [];
                
                // Đếm tổng số và số lô hàng đang vận chuyển
                const inTransitCount = shipments.filter(s => s.currentStatus === "IN_TRANSIT").length;
                
                setStats({ 
                    total: shipments.length, 
                    inTransit: inTransitCount 
                });
            } catch (error) {
                console.error("Lỗi lấy thống kê:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="text-slate-500 font-medium">Đang đồng bộ dữ liệu...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-slate-500 font-bold text-sm uppercase">Tổng lô hàng hệ thống</h3>
                <p className="text-4xl font-black text-blue-600 mt-2">{stats.total}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-slate-500 font-bold text-sm uppercase">Đang vận chuyển</h3>
                <p className="text-4xl font-black text-orange-500 mt-2">{stats.inTransit}</p>
            </div>
        </div>
    );
};

function AdminDashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : { fullName: "Admin", role: "ADMIN" };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex h-screen bg-slate-50 font-sans">
            <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-20">
                <div className="h-16 flex items-center justify-center border-b border-slate-800">
                    <h1 className="text-2xl font-black tracking-wider text-blue-500">6AE GLOBAL</h1>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <Link 
                        to="/admin" 
                        className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${isActive('/admin') ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                        Tổng quan
                    </Link>
                    <Link 
                        to="/admin/shipments" 
                        className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${isActive('/admin/shipments') || location.pathname.includes('/admin/shipments') ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        Quản lý Lô hàng
                    </Link>
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <button onClick={handleLogout} className="w-full flex items-center px-4 py-2 text-slate-400 hover:text-white hover:bg-red-600 rounded-lg transition-colors">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        Đăng xuất
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col overflow-hidden relative">
                <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 z-10 border-b border-slate-200">
                    <h2 className="text-lg font-bold text-slate-700">Hệ thống Điều hành Logistics</h2>
                    <div className="flex items-center">
                        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mr-3 shadow-md">
                            {user.fullName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-slate-700 font-bold">{user.fullName}</span>
                        <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded">{user.role}</span>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                    <Routes>
                        <Route path="/" element={<DashboardOverview />} />
                        <Route path="/shipments" element={<ShipmentManager />} />
                        <Route path="/shipments/create" element={<CreateShipment />} />
                        <Route path="/shipments/:id/update" element={<UpdateStatus />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
}

export default AdminDashboard;