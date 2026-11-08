import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import đúng useNavigate
import api from "../../api/axios";

function ShipmentManager() {
    // KHAI BÁO NAVIGATE Ở ĐÂY để sửa lỗi 'navigate is not defined'
    const navigate = useNavigate();

    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Đưa toàn bộ hàm fetchShipments vào trong useEffect để sửa lỗi cảnh báo của ESLint
        const fetchShipments = async () => {
            try {
                const response = await api.get("/shipments"); 
                setShipments(response.data.data || []);
            } catch (error) {
                console.error("Lỗi lấy dữ liệu:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchShipments();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-800">Quản lý Lô hàng</h2>
                
                {/* Nút bấm gọi hàm navigate để chuyển trang */}
                <button 
                    onClick={() => navigate("/admin/shipments/create")}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-md transition-colors flex items-center"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Tạo Lô hàng mới
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100 text-slate-600 text-sm uppercase tracking-wider border-b border-slate-200">
                                <th className="px-6 py-4 font-bold">Mã Vận Đơn</th>
                                <th className="px-6 py-4 font-bold">Tuyến (POL - POD)</th>
                                <th className="px-6 py-4 font-bold">Khách hàng</th>
                                <th className="px-6 py-4 font-bold">Trạng thái hiện tại</th>
                                <th className="px-6 py-4 font-bold text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500 font-medium">Đang tải dữ liệu...</td></tr>
                            ) : shipments.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500 font-medium">Chưa có lô hàng nào trong hệ thống.</td></tr>
                            ) : (
                                shipments.map((shipment) => (
                                    <tr key={shipment._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-blue-700">{shipment.shipmentNumber}</span>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-slate-700">
                                            {shipment.origin} <span className="text-slate-400 mx-1">→</span> {shipment.destination}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 font-medium">
                                            {shipment.customer?.fullName || "Khách lẻ"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-orange-100 text-orange-700 font-bold text-xs rounded-full uppercase">
                                                {shipment.currentStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button 
                                                onClick={() => navigate(`/admin/shipments/${shipment._id}/update`)}
                                                className="text-blue-600 hover:text-blue-900 font-bold text-sm bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors"
                                            >
                                                Cập nhật Timeline
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ShipmentManager;