import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NotificationBell from "../../components/NotificationBell";
import api from "../../api/axios";

function CustomerDashboard() {
    const navigate = useNavigate();
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : { fullName: "Khách hàng" };

    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Gọi API lấy danh sách lô hàng khi vào trang
    useEffect(() => {
        const fetchShipments = async () => {
            try {
                const response = await api.get("/shipments/my");
                setShipments(response.data.data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu lô hàng:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchShipments();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-blue-900 tracking-tight">6AE GLOBAL</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-600 font-medium">Xin chào, {user.fullName}</span>
                            <NotificationBell />
                            <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 font-medium transition-colors">
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-blue-900 rounded-2xl p-8 mb-8 text-center shadow-lg">
                    <h2 className="text-3xl font-bold text-white mb-4">Tra cứu hành trình lô hàng</h2>
                    <div className="max-w-2xl mx-auto flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Nhập mã Shipment (VD: SHP-2026...)" 
                            className="flex-1 px-5 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg shadow-inner"
                        />
                        <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg shadow-md">
                            Tra cứu
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-800">Lô hàng gần đây</h3>
                    </div>
                    
                    <div className="divide-y divide-gray-200">
                        {loading ? (
                            <div className="p-6 text-center text-gray-500">Đang tải dữ liệu...</div>
                        ) : shipments.length === 0 ? (
                            <div className="p-6 text-center text-gray-500">Bạn chưa có lô hàng nào đang vận chuyển.</div>
                        ) : (
                            shipments.map((shipment) => (
                                <div key={shipment._id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div>
                                        <p className="text-sm font-bold text-blue-600 mb-1">{shipment.shipmentNumber}</p>
                                        <p className="text-lg font-medium text-gray-800">{shipment.origin} → {shipment.destination}</p>
                                        <p className="text-sm text-gray-500 mt-1">Trạng thái: <span className="font-semibold text-orange-500">{shipment.currentStatus}</span></p>
                                    </div>
                                    <button 
                                        onClick={() => navigate(`/customer/shipment/${shipment._id}`)}
                                        className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-bold rounded-lg transition-all"
                                    >
                                        Xem chi tiết
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default CustomerDashboard;