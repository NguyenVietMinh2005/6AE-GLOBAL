import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login"; // Cổng Khách hàng
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import AdminLogin from "./pages/auth/AdminLogin"; 
import Tracking from "./pages/customer/Tracking";
import Home from "./pages/Home";

import CustomerDashboard from "./pages/customer/Dashboard";
import ShipmentDetail from "./pages/customer/ShipmentDetail";
import AdminDashboard from "./pages/admin/Dashboard";

const PrivateRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    
    if (!token || !userStr) return <Navigate to="/" replace />;
    
    const user = JSON.parse(userStr);
    if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* PUBLIC ROUTES */}
                <Route path="/" element={<Home />} />
                <Route path="/tracking" element={<Tracking />} />
                <Route path="/login" element={<Login />} /> {/* Sửa lại đúng path="/login" tại đây */}
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                
                {/* ROUTE RIÊNG CHO NHÂN VIÊN */}
                <Route path="/admin-login" element={<AdminLogin />} /> 

                {/* PRIVATE ROUTES */}
                <Route path="/customer" element={<PrivateRoute allowedRoles={["CUSTOMER"]}><CustomerDashboard /></PrivateRoute>} />
                <Route path="/customer/shipment/:id" element={<PrivateRoute allowedRoles={["CUSTOMER"]}><ShipmentDetail /></PrivateRoute>} />
                <Route path="/admin/*" element={<PrivateRoute allowedRoles={["ADMIN", "EMPLOYEE"]}><AdminDashboard /></PrivateRoute>} />
            </Routes>
        </Router>
    );
}

export default App;