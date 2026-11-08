import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import UploadDocument from "../../components/UploadDocument";

function ShipmentDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [shipment, setShipment] = useState(null);
    const [documents, setDocuments] = useState([]); // State lưu danh sách chứng từ
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Tách riêng hàm fetch documents để có thể gọi lại sau khi upload
    // Dùng useCallback để React ghi nhớ hàm này, tránh cảnh báo dependency
    const fetchDocuments = useCallback(async () => {
        try {
            const res = await api.get(`/documents/shipment/${id}`);
            setDocuments(res.data.data);
        } catch (err) {
            console.error("Lỗi tải danh sách chứng từ:", err);
        }
    }, [id]);

    useEffect(() => {
        const fetchShipmentDetail = async () => {
            try {
                const response = await api.get(`/shipments/${id}`);
                setShipment(response.data.data);
                
                // Sau khi lấy thông tin lô hàng thành công thì lấy luôn danh sách file
                await fetchDocuments();
            } catch (err) {
                console.error("Chi tiết lỗi API:", err);
                setError("Không thể tải dữ liệu lô hàng. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        };
        fetchShipmentDetail();
    }, [id, fetchDocuments]);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-blue-900 font-bold text-xl">Đang tải dữ liệu lô hàng...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-600 font-bold">{error}</div>;
    if (!shipment) return <div className="min-h-screen flex items-center justify-center">Không tìm thấy lô hàng</div>;

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-12">
            {/* Header */}
            <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center h-16">
                        <button 
                            onClick={() => navigate("/customer")}
                            className="flex items-center text-slate-500 hover:text-blue-700 font-medium transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            Quay lại Dashboard
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                {/* Thông tin tổng quan */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-slate-100 pb-6">
                        <div>
                            <p className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-1">Mã vận đơn</p>
                            <h2 className="text-3xl font-black text-slate-800">{shipment.shipmentNumber}</h2>
                        </div>
                        <div className="mt-4 md:mt-0 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg font-bold">
                            {shipment.currentStatus}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Tuyến đường</p>
                            <p className="text-lg font-bold text-slate-800">{shipment.origin} <span className="text-blue-500">→</span> {shipment.destination}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Container / Tàu</p>
                            <p className="text-lg font-bold text-slate-800">{shipment.containerNumber || "Chưa cấp"} / {shipment.vesselName || "Chưa cấp"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">ETA Dự kiến</p>
                            <p className="text-lg font-bold text-slate-800">
                                {shipment.ETA ? new Date(shipment.ETA).toLocaleDateString("vi-VN") : "Chưa cập nhật"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tracking Timeline */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-8">
                    <h3 className="text-xl font-bold text-slate-800 mb-8">Lịch sử hành trình</h3>
                    <div className="relative border-l-2 border-blue-100 ml-3 md:ml-4 space-y-8">
                        {shipment.statusHistory.map((history, index) => (
                            <div key={index} className="relative pl-8 md:pl-10">
                                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow"></div>
                                <div className="flex flex-col md:flex-row md:items-center justify-between">
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-800">{history.status}</h4>
                                        <p className="text-slate-600 mt-1">{history.note || "Hệ thống tự động cập nhật trạng thái."}</p>
                                    </div>
                                    <div className="mt-2 md:mt-0 text-sm font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-md self-start">
                                        {new Date(history.timestamp).toLocaleString("vi-VN", { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Danh sách chứng từ đã tải lên */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-xl font-bold text-slate-800 mb-6">Chứng từ đính kèm</h3>
                    
                    {documents.length === 0 ? (
                        <p className="text-slate-500 italic mb-4">Chưa có chứng từ nào được tải lên.</p>
                    ) : (
                        <div className="space-y-4 mb-6">
                            {documents.map(doc => (
                                <div key={doc._id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-blue-800">{doc.documentType}</span>
                                        {/* Thẻ a (link) để ấn vào xem/tải file */}
                                        <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline mt-1">
                                            {doc.fileName}
                                        </a>
                                    </div>
                                    <div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            doc.status === 'APPROVED' ? 'bg-green-100 text-green-700' 
                                            : doc.status === 'REJECTED' ? 'bg-red-100 text-red-700' 
                                            : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {doc.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Form Tải lên Chứng từ - Gọi lại fetchDocuments khi upload thành công */}
                    <div className="pt-6 border-t border-slate-100">
                        <UploadDocument 
                            shipmentId={id} 
                            onUploadSuccess={() => fetchDocuments()} 
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ShipmentDetail;