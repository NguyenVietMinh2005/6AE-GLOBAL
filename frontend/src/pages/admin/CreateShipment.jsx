import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

function CreateShipment() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    // Thêm state lưu danh sách khách hàng và khách hàng được chọn
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState("");
    
    const [form, setForm] = useState(() => ({
        shipmentNumber: `SHP-${Date.now().toString().slice(-6)}`,
        origin: "",
        destination: "",
        ETA: "",
        containerNumber: "",
        vesselName: ""
    }));

    // Lấy danh sách khách hàng ngay khi mở trang
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await api.get("/users/customers");
                setCustomers(response.data.data);
            } catch (error) {
                console.error("Lỗi tải danh sách khách hàng:", error);
            }
        };
        fetchCustomers();
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate xem đã chọn khách chưa
        if (!selectedCustomer) {
            setError("Vui lòng chọn khách hàng cho lô hàng này!");
            return;
        }

        setError(""); 
        setLoading(true);

        try {
            await api.post("/shipments", {
                ...form,
                customer: selectedCustomer, // <-- Truyền ID khách hàng vào đây
                currentStatus: "BOOKING_CONFIRMED", 
                statusHistory: [{
                    status: "BOOKING_CONFIRMED",    
                    note: "Lô hàng được khởi tạo trên hệ thống 6AE GLOBAL",
                    timestamp: new Date()
                }]
            });
            
            // Tạo xong đẩy về lại danh sách
            navigate("/admin/shipments");
        } catch (error) {
            setError(error.response?.data?.message || "Lỗi khi tạo lô hàng. Vui lòng kiểm tra lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                <h2 className="text-2xl font-black text-slate-800">Tạo Lô Hàng Mới</h2>
                <button 
                    onClick={() => navigate("/admin/shipments")}
                    className="text-slate-500 hover:text-slate-700 font-medium flex items-center"
                >
                    ← Quay lại
                </button>
            </div>

            {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg font-medium">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* --- Ô CHỌN KHÁCH HÀNG --- */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Khách hàng sở hữu <span className="text-red-500">*</span></label>
                    <select 
                        value={selectedCustomer}
                        onChange={(e) => setSelectedCustomer(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none font-medium"
                    >
                        <option value="">-- Chọn khách hàng --</option>
                        {customers.map(cus => (
                            <option key={cus._id} value={cus._id}>
                                {cus.fullName} ({cus.email})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Mã Vận Đơn (Auto)</label>
                        <input type="text" name="shipmentNumber" value={form.shipmentNumber} readOnly className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 font-bold text-blue-700 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Ngày cập bến dự kiến (ETA)</label>
                        <input type="date" name="ETA" value={form.ETA} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none" required />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Cảng Đi (POL)</label>
                        <input type="text" name="origin" value={form.origin} onChange={handleChange} placeholder="VD: Hai Phong, VN" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Cảng Đến (POD)</label>
                        <input type="text" name="destination" value={form.destination} onChange={handleChange} placeholder="VD: Los Angeles, US" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none" required />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Số Container</label>
                        <input type="text" name="containerNumber" value={form.containerNumber} onChange={handleChange} placeholder="VD: HLXU1234567" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Tên Tàu / Chuyến</label>
                        <input type="text" name="vesselName" value={form.vesselName} onChange={handleChange} placeholder="VD: EVER GIVEN V.123" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none" />
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button type="button" onClick={() => navigate("/admin/shipments")} className="px-6 py-3 font-bold text-slate-500 hover:text-slate-700 mr-4">Hủy bỏ</button>
                    <button type="submit" disabled={loading} className={`px-8 py-3 rounded-xl text-white font-bold shadow-lg transition-transform ${loading ? "bg-slate-400" : "bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5"}`}>
                        {loading ? "Đang lưu..." : "Khởi tạo Vận đơn"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateShipment;