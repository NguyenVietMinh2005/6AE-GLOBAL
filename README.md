# 🚢 6AE-GLOBAL - Hệ Thống Quản Lý Vận Tải & Logistics Toàn Cầu

Hệ thống quản trị và tra cứu logistics toàn diện, tối ưu quy trình quản lý chuỗi cung ứng, theo dõi lô hàng, thủ tục hải quan, chứng từ vận tải và thanh toán hóa đơn.

---

## 📌 Mục lục

- [Tính năng nổi bật](#-tính-năng-nổi-bật)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Hướng dẫn cài đặt & Khởi chạy](#-hướng-dẫn-cài-đặt--khởi-chạy)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Cấu hình Backend](#2-cấu-hình-backend)
  - [3. Cấu hình Frontend](#3-cấu-hình-frontend)
- [Tài khoản & Phân quyền](#-tài-khoản--phân-quyền)
- [Danh sách API Endpoints chính](#-danh-sách-api-endpoints-chính)
- [Lưu ý bảo mật](#-lưu-ý-bảo-mật)
- [Giấy phép](#-giấy-phép)

---

## 🌟 Tính năng nổi bật

### 1. Dành cho Khách hàng (Customer Portal)
* **Tra cứu vận đơn (Public Tracking):** Tìm kiếm và theo dõi hành trình lộ trình hàng hóa trực tiếp bằng mã vận đơn (`trackingNumber`) mà không bắt buộc đăng nhập.
* **Cổng khách hàng:** Xem danh sách toàn bộ các lô hàng cá nhân, chi tiết từng chặng đường, container và ngày dự kiến cập cảng.
* **Quản lý chứng từ trực tuyến:** Tải lên chứng từ điện tử (vận đơn đường biển B/L, hóa đơn thương mại, packing list...).
* **Hệ thống thông báo:** Nhận cập nhật trạng thái đơn hàng tức thời qua chuông thông báo (Notification Bell).
* **Bảo mật tài khoản:** Đăng nhập, đăng ký và lấy lại mật khẩu thông qua mã xác thực OTP gửi trực tiếp về Email.

### 2. Dành cho Quản trị viên & Nhân viên (Admin/Employee Portal)
* **Bảng điều khiển (Dashboard Overview):** Thống kê số lượng tổng lô hàng, số lô đang vận chuyển, tiến độ xử lý.
* **Quản lý lô hàng (Shipment Manager):** Tạo mới lô hàng, cập nhật trạng thái hành trình (Pending, In Transit, Customs Cleared, Delivered...).
* **Quản lý nghiệp vụ đầy đủ:**
  * Báo giá (Quotations) & Đặt chỗ (Bookings).
  * Vận chuyển container & thủ tục Hải quan (Customs).
  * Quản lý giao nhận chặng cuối (Deliveries).
  * Hóa đơn (Invoices) & Thanh toán (Payments).
* **Lưu trữ tài liệu đám mây:** Tích hợp Cloudinary lưu trữ và phân phát file/tài liệu PDF, hình ảnh an toàn.

---

## 🛠 Công nghệ sử dụng

### Backend
* **Runtime:** [Node.js](https://nodejs.org/) (ES Modules)
* **Framework:** [Express.js](https://expressjs.com/) (v5)
* **Cơ sở dữ liệu:** [MongoDB](https://www.mongodb.com/) qua [Mongoose](https://mongoosejs.com/)
* **Xác thực & Bảo mật:** [JWT (JSON Web Token)](https://jwt.io/), [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js)
* **Upload tệp tin:** [Multer](https://github.com/expressjs/multer) & [Cloudinary SDK](https://cloudinary.com/)
* **Gửi email thông báo / OTP:** [Nodemailer](https://nodemailer.com/)

### Frontend
* **Core:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
* **Định tuyến:** [React Router DOM v7](https://reactrouter.com/)
* **Giao diện & Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **HTTP Client:** [Axios](https://axios-http.com/)

---

## 📂 Cấu trúc dự án

```text
6AE-GLOBAL/
├── backend/                     # Mã nguồn Backend API
│   ├── src/
│   │   ├── config/              # Cấu hình CSDL (MongoDB)
│   │   ├── controllers/         # Bộ điều khiển xử lý logic nghiệp vụ
│   │   ├── middleware/          # Xác thực JWT, phân quyền, upload Cloudinary
│   │   ├── models/              # Schema Mongoose (Shipment, User, Invoice...)
│   │   ├── routes/              # Khai báo các API routes
│   │   └── app.js               # Điểm khởi chạy ứng dụng Express
│   ├── .env.example             # File cấu hình biến môi trường mẫu
│   └── package.json
│
├── frontend/                    # Mã nguồn giao diện React Client
│   ├── src/
│   │   ├── api/                 # Axios instance cấu hình interceptors
│   │   ├── assets/              # Hình ảnh, logo, vector
│   │   ├── components/          # Components tái sử dụng (Notification, Upload...)
│   │   ├── pages/               # Trang ứng dụng (Home, Auth, Customer, Admin)
│   │   ├── App.jsx              # Định tuyến Router chính
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore                   # Loại bỏ file nhạy cảm và node_modules
└── README.md                    # Tài liệu hướng dẫn dự án
```

---

## 📋 Yêu cầu hệ thống

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt:
* **Node.js:** Phiên bản `>= 18.x` hoặc mới hơn.
* **npm:** Phiên bản `>= 9.x` (thường đi kèm với Node.js) hoặc `yarn` / `pnpm`.
* **MongoDB:** Tài khoản MongoDB Atlas (Cloud) hoặc phiên bản MongoDB Community chạy cục bộ.
* **Cloudinary Account:** Tài khoản miễn phí tại [cloudinary.com](https://cloudinary.com/) để lấy API Key lưu trữ file.
* **Gmail App Password:** Mật khẩu ứng dụng 16 ký tự của Google để gửi mã OTP khôi phục mật khẩu.

---

## 🚀 Hướng dẫn cài đặt & Khởi chạy

### 1. Clone Repository

Mở Terminal và clone dự án về máy:

```bash
git clone https://github.com/NguyenVietMinh2005/6AE-GLOBAL.git
cd 6AE-GLOBAL
```

---

### 2. Cấu hình Backend

1. **Di chuyển vào thư mục backend và cài đặt thư viện:**
   ```bash
   cd backend
   npm install
   ```

2. **Thiết lập biến môi trường:**
   Tạo file `.env` bằng cách sao chép từ file `.env.example`:
   ```bash
   # Trên Windows (PowerShell):
   copy .env.example .env

   # Trên Linux/macOS:
   cp .env.example .env
   ```

3. **Cập nhật thông tin trong file `backend/.env`:**
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/6ae_global?retryWrites=true&w=majority
   JWT_SECRET=ma_khoa_bao_mat_jwt_cua_ban
   
   # Cấu hình gửi mail OTP qua Gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_16_digit_app_password

   # Cấu hình Cloudinary để tải ảnh và tài liệu
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Khởi động server Backend:**
   ```bash
   # Chế độ phát triển (tự động reload khi sửa code):
   npm run dev

   # Chế độ thông thường:
   npm start
   ```
   *Backend sẽ khởi chạy tại:* `http://localhost:5000`

---

### 3. Cấu hình Frontend

1. **Mở một cửa sổ Terminal mới và di chuyển vào thư mục frontend:**
   ```bash
   cd frontend
   npm install
   ```

2. **Khởi chạy ứng dụng Frontend:**
   ```bash
   npm run dev
   ```
   *Frontend sẽ khởi chạy tại:* `http://localhost:5173`

---

## 👥 Tài khoản & Phân quyền

Hệ thống hỗ trợ 3 nhóm quyền chính:

| Quyền (Role) | Mô tả | Cổng truy cập |
|:---|:---|:---|
| **CUSTOMER** | Khách hàng xuất nhập khẩu | Đăng nhập tại `/login` |
| **EMPLOYEE** | Nhân viên vận hành logistics | Đăng nhập tại `/admin-login` |
| **ADMIN** | Quản trị viên cấp cao | Đăng nhập tại `/admin-login` |

---

## 🔌 Danh sách API Endpoints chính

Mọi request yêu cầu xác thực cần gửi kèm Header: `Authorization: Bearer <TOKEN>`.

### Xác thực & Người dùng (`/api/auth`)
* `POST /api/auth/register` - Đăng ký tài khoản khách hàng mới.
* `POST /api/auth/login` - Đăng nhập hệ thống (trả về JWT Token và thông tin quyền).
* `POST /api/auth/forgot-password` - Gửi mã OTP xác nhận về email.
* `POST /api/auth/reset-password` - Đặt lại mật khẩu mới bằng OTP.

### Quản lý vận chuyển (`/api/shipments`)
* `GET /api/shipments` - Danh sách tất cả các lô hàng (Admin / Employee).
* `POST /api/shipments` - Tạo mới lô hàng vận chuyển.
* `GET /api/shipments/tracking/:trackingNumber` - Tra cứu công khai lộ trình theo mã vận đơn.
* `PUT /api/shipments/:id/status` - Cập nhật trạng thái tiến trình đơn hàng.

### Quản lý chứng từ & tài liệu (`/api/documents`)
* `POST /api/documents/upload` - Tải lên chứng từ vận tải (PDF, JPG, PNG) lên Cloudinary.
* `GET /api/documents/shipment/:shipmentId` - Lấy danh sách chứng từ của lô hàng.

### Nghiệp vụ mở rộng
* `/api/bookings` - Quản lý yêu cầu booking tàu/xe.
* `/api/customs` - Theo dõi tờ khai và trạng thái thông quan hải quan.
* `/api/containers` - Quản lý số hiệu và tình trạng container.
* `/api/invoices` & `/api/payments` - Xuất hóa đơn cước và xác nhận thanh toán.

---

## 🔒 Lưu ý bảo mật

* **Tuyệt đối không commit file `.env`:** Toàn bộ thông tin nhạy cảm (mật khẩu CSDL, JWT Secret, thông tin xác thực mail, Cloudinary API Key) chỉ được lưu tại `.env` trên môi trường chạy thực tế và đã được `.gitignore` bảo vệ.
* **Tạo mật khẩu ứng dụng Gmail:** Không sử dụng mật khẩu chính của tài khoản Google. Sử dụng tính năng **App Passwords** trong phần Cài đặt bảo mật 2 lớp của Google Account.
* **CORS Whitelist:** Trong môi trường Production, cấu hình biến `CLIENT_URL` trong file `.env` trỏ chính xác về domain Frontend của bạn.

---

## 📄 Giấy phép

Dự án phát triển nội bộ cho **6AE-GLOBAL Logistics Platform**. Mọi quyền được bảo lưu.
