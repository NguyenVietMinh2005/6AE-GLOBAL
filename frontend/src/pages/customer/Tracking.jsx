import { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/axios";

function Tracking() {
    const [searchParams] = useSearchParams();
    const codeFromUrl = searchParams.get("code") || "";

    // 1. Khởi tạo giá trị ban đầu trực tiếp cho searchCode từ URL (loại bỏ lỗi setState trong effect)
    const [searchCode, setSearchCode] = useState(codeFromUrl);
    const [shipment, setShipment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchShipmentData = useCallback(async (code) => {
        if (!code.trim()) return;

        setLoading(true);
        setError("");
        setShipment(null);

        try {
            const response = await api.get(`/shipments/track/${code.trim()}`);
            setShipment(response.data.data);
        } catch (err) {
            setError(err.response?.data?.message || "Không tìm thấy thông tin lô hàng. Vui lòng kiểm tra lại mã vận đơn.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Tự động tra cứu ngay khi có mã truyền sẵn trên URL (Cách 2 khi khách click vào link trong email)
    useState(() => {
        if (codeFromUrl) {
            fetchShipmentData(codeFromUrl);
        }
    });

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchShipmentData(searchCode);
    };


    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-blue-700 tracking-tight mb-3">6AE GLOBAL TRACKING</h1>
                    <p className="text-slate-500 font-medium text-lg">Tra cứu hành trình lô hàng của bạn theo thời gian thực</p>
                </div>

                {/* Form Tra cứu */}
                <form onSubmit={handleSearchSubmit} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 mb-8">
                    <input
                        type="text"
                        value={searchCode}
                        onChange={(e) => setSearchCode(e.target.value)}
                        placeholder="Nhập mã vận đơn (VD: SHP-527036)..."
                        className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none font-bold text-slate-700 text-lg placeholder:font-normal"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl shadow-md transition-transform hover:-translate-y-0.5 whitespace-nowrap"
                    >
                        {loading ? "Đang tra cứu..." : "TRA CỨU NGAY"}
                    </button>
                </form>

                {error && (
                    <div className="bg-red-50 text-red-600 p-5 rounded-2xl font-bold text-center border border-red-100">
                        {error}
                    </div>
                )}

                {/* Kết quả Timeline */}
                {shipment && (
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                            <div>
                                <p className="text-slate-400 font-medium text-sm mb-1">MÃ VẬN ĐƠN</p>
                                <h2 className="text-2xl font-black text-blue-400">{shipment.shipmentNumber}</h2>
                            </div>
                            <div className="text-right">
                                <p className="text-slate-400 font-medium text-sm mb-1">TUYẾN VẬN CHUYỂN</p>
                                <h3 className="text-lg font-bold">
                                    {shipment.origin} <span className="text-slate-500 mx-2">➔</span> {shipment.destination}
                                </h3>
                            </div>
                        </div>

                        <div className="p-8">
                            <h3 className="text-xl font-black text-slate-800 mb-8 border-b border-slate-100 pb-4">Nhật ký hành trình</h3>
                            
                            <div className="relative border-l-2 border-blue-200 ml-4 space-y-8">
                                {shipment.statusHistory && shipment.statusHistory.map((history, index) => {
                                    const isLatest = index === shipment.statusHistory.length - 1;
                                    
                                    return (
                                        <div key={index} className="relative pl-8">
                                            <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 border-white shadow-sm ${isLatest ? 'bg-orange-500 animate-pulse' : 'bg-blue-500'}`}></div>
                                            
                                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 relative">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                                                    <span className={`font-black text-lg ${isLatest ? 'text-orange-600' : 'text-blue-700'}`}>
                                                        {history.status}
                                                    </span>
                                                    <span className="text-slate-500 font-semibold text-sm flex items-center">
                                                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                        {new Date(history.timestamp).toLocaleString("vi-VN", { dateStyle: "medium", timeStyle: "short" })}
                                                    </span>
                                                </div>
                                                {history.note && (
                                                    <p className="text-slate-600 font-medium bg-white p-3 rounded-xl border border-slate-100 inline-block mt-2">
                                                        {history.note}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Tracking;