import { useState } from "react";
import api from "../api/axios"; // Điều chỉnh lại đường dẫn cho đúng với dự án của bạn

// Component này cần nhận vào shipmentId của lô hàng đang được xem
function UploadDocument({ shipmentId, onUploadSuccess }) {
    const [file, setFile] = useState(null);
    const [documentType, setDocumentType] = useState("COMMERCIAL_INVOICE");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    const handleFileChange = (e) => {
        // Lấy ra file đầu tiên mà người dùng chọn
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!file) {
            setMessage({ text: "Vui lòng chọn một tệp để tải lên!", type: "error" });
            return;
        }

        setLoading(true);
        setMessage({ text: "", type: "" });

        // Khởi tạo FormData để chứa file và dữ liệu text đi kèm
        const formData = new FormData();
        formData.append("file", file);
        formData.append("shipmentId", shipmentId);
        formData.append("documentType", documentType);

        try {
            const response = await api.post("/documents", formData, {
                headers: {
                    "Content-Type": "multipart/form-data" // Bắt buộc phải có header này
                }
            });
            
            setMessage({ text: "Tải chứng từ lên thành công!", type: "success" });
            setFile(null); // Reset lại ô chọn file
            
            // Gọi hàm callback để báo cho component cha (ShipmentDetail) biết mà load lại danh sách
            if (onUploadSuccess) {
                onUploadSuccess(response.data.data);
            }
        } catch (error) {
            console.error("Lỗi upload:", error);
            setMessage({ 
                text: error.response?.data?.message || "Lỗi tải file. Vui lòng thử lại.", 
                type: "error" 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mt-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Tải lên Chứng từ</h3>
            
            {message.text && (
                <div className={`p-4 mb-5 rounded-lg font-medium ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Loại chứng từ <span className="text-red-500">*</span></label>
                    <select 
                        value={documentType}
                        onChange={(e) => setDocumentType(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                    >
                        <option value="COMMERCIAL_INVOICE">Hóa đơn thương mại (Commercial Invoice)</option>
                        <option value="PACKING_LIST">Phiếu đóng gói (Packing List)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Chọn Tệp <span className="text-red-500">*</span></label>
                    <input 
                        type="file" 
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 outline-none"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading || !file}
                    className={`w-full py-3 px-4 rounded-xl text-white font-bold shadow-md transition-transform ${loading || !file ? "bg-slate-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5"}`}
                >
                    {loading ? "Đang xử lý tải lên..." : "Xác nhận Upload"}
                </button>
            </form>
        </div>
    );
}

export default UploadDocument;