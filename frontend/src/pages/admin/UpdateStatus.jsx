import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

function UpdateStatus() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [shipment, setShipment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        status: "DEPARTED", // Đổi giá trị mặc định thành một trạng thái hợp lệ trong Enum
        note: ""
    });

    // Cập nhật lại toàn bộ danh sách Option khớp 100% với Database của bạn
    const statusOptions = [
        { value: "BOOKING_CONFIRMED", label: "Đã xác nhận Booking (BOOKING_CONFIRMED)" },
        { value: "DOC_UPLOADED", label: "Đã tải lên chứng từ (DOC_UPLOADED)" },
        { value: "DOC_APPROVED", label: "Đã duyệt chứng từ (DOC_APPROVED)" },
        { value: "CUSTOMS_EXPORT", label: "Thông quan Xuất khẩu (CUSTOMS_EXPORT)" },
        { value: "PICKED_UP", label: "Đã lấy hàng (PICKED_UP)" },
        { value: "AT_PORT", label: "Đang ở cảng đi (AT_PORT)" },
        { value: "DEPARTED", label: "Đã xuất phát (DEPARTED)" },
        { value: "ARRIVED", label: "Đã đến cảng đích (ARRIVED)" },
        { value: "CUSTOMS_IMPORT", label: "Thông quan Nhập khẩu (CUSTOMS_IMPORT)" },
        { value: "DELIVERING", label: "Đang giao hàng (DELIVERING)" },
        { value: "DELIVERED", label: "Đã giao hàng thành công (DELIVERED)" }
    ];

    useEffect(() => {
        const fetchShipment = async () => {
            try {
                const response = await api.get(`/shipments/${id}`);
                setShipment(response.data.data);
            } catch (error) {
                setError("Không thể tải thông tin lô hàng.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchShipment();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        setError("");

        try {
            // Chỉ cần gửi đúng 2 trường status và note theo chuẩn của Backend
            await api.put(`/shipments/${id}/status`, {
                status: formData.status,
                note: formData.note
            });

            navigate("/admin/shipments");
        } catch (error) {
            setError(error.response?.data?.message || "Lỗi cập nhật trạng thái.");
        } finally {
            setSubmitLoading(false);
        }
    };

    if (loading) return <div className="p-8 font-bold text-slate-500">Đang tải dữ liệu...</div>;
    if (!shipment) return <div className="p-8 font-bold text-red-500">Không tìm thấy lô hàng.</div>;

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                <div>
                    <h2 className="text-2xl font-black text-slate-800">Cập nhật Trạng thái</h2>
                    <p className="text-blue-600 font-bold mt-1">Vận đơn: {shipment.shipmentNumber}</p>
                </div>
                <button 
                    onClick={() => navigate("/admin/shipments")}
                    className="text-slate-500 hover:text-slate-700 font-medium"
                >
                    ← Quay lại
                </button>
            </div>

            {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg font-medium">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Trạng thái mới</label>
                    <select 
                        value={formData.status} 
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none font-medium text-slate-700"
                    >
                        {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Ghi chú (Tùy chọn)</label>
                    <textarea 
                        value={formData.note} 
                        onChange={(e) => setFormData({...formData, note: e.target.value})}
                        rows="4"
                        placeholder="VD: Container đã qua máy soi chiếu hải quan an toàn..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none resize-none text-slate-700"
                    ></textarea>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button type="submit" disabled={submitLoading} className={`px-8 py-3 rounded-xl text-white font-bold shadow-lg transition-transform ${submitLoading ? "bg-slate-400" : "bg-orange-500 hover:bg-orange-600 hover:-translate-y-0.5"}`}>
                        {submitLoading ? "Đang lưu..." : "Xác nhận & Cập nhật"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default UpdateStatus;