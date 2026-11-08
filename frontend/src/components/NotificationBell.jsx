import { useState, useEffect, useRef } from "react";

import api from "../api/axios";

export default function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    

    // Gom tất cả vào chung một useEffect
    // Gom tất cả vào chung một useEffect
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await api.get("/notifications");
                setNotifications(response.data.data);
            } catch (error) {
                console.error("Lỗi lấy thông báo:", error);
            }
        };

        // 1. Gọi ngay lập tức lần đầu khi mới mở web
        fetchNotifications();
        
        // 2. THÊM ĐOẠN NÀY: Tự động chạy ngầm hàm lấy thông báo mỗi 10 giây (10000ms)
        const intervalId = setInterval(() => {
            fetchNotifications();
        }, 10000);
        
        // 3. Xử lý click ra ngoài để đóng dropdown
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        
        document.addEventListener("mousedown", handleClickOutside);
        
        // 4. Nhớ dọn dẹp bộ đếm giờ khi tắt component để tránh rò rỉ bộ nhớ
        return () => {
            clearInterval(intervalId);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []); // Array rỗng đảm bảo chỉ chạy 1 lần duy nhất khi load trang

    const handleMarkAsRead = async (id, isRead) => {
        if (isRead) return; 
        
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(prev => 
                prev.map(notif => notif._id === id ? { ...notif, isRead: true } : notif)
            );
        } catch (error) {
            console.error("Lỗi cập nhật thông báo:", error);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Nút Chuông */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors focus:outline-none"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
                
                {/* Badge đếm số */}
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown danh sách thông báo */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                    <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800">Thông báo của bạn</h3>
                        {unreadCount > 0 && (
                            <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                {unreadCount} chưa đọc
                            </span>
                        )}
                    </div>
                    
                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-6 text-center text-slate-500 text-sm">
                                Bạn chưa có thông báo nào.
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div 
                                    key={notif._id}
                                    onClick={() => handleMarkAsRead(notif._id, notif.isRead)}
                                    className={`p-4 border-b border-slate-50 cursor-pointer transition-colors hover:bg-slate-50 ${!notif.isRead ? 'bg-blue-50/50' : ''}`}
                                >
                                    <div className="flex gap-3">
                                        <div className="flex-shrink-0 mt-1">
                                            {/* Chấm xanh hiển thị trạng thái chưa đọc */}
                                            {!notif.isRead && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm ${!notif.isRead ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>
                                                {notif.title}
                                            </p>
                                            <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                                                {notif.message}
                                            </p>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-xs font-semibold text-blue-600">
                                                    {notif.shipmentId?.shipmentNumber}
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    {new Date(notif.createdAt).toLocaleDateString("vi-VN")}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}