# API Gateway & Tools Portal

## Tổng quan

Dự án gồm hai phần chính:
- **Back-end**: Node.js, Express, MongoDB, RESTful API, quản lý xác thực, phân quyền, quản lý file, project, reservoir, v.v.
- **Front-end**: Vue 3, Vite, Element Plus, giao diện quản trị, đăng nhập một lần (SSO), quản lý người dùng, công cụ, báo cáo, v.v.

---

## Cấu trúc thư mục

```
API_GATEWAY/
  back-end/      # Source code back-end (Node.js/Express)
  front-end/     # Source code front-end (Vue 3)
```

---

## Back-end

- **Tech stack**: Node.js, Express, MongoDB, Mongoose, Passport, JWT, Joi, Docker
- **Tính năng**:
  - Xác thực, phân quyền, quản lý tài khoản
  - Quản lý project, reservoir, file, báo cáo, v.v.
  - RESTful API, tài liệu Swagger
  - Hỗ trợ Docker Compose

### Cài đặt & chạy local

```bash
cd back-end
npm install
npm run dev
```

### Chạy bằng Docker

```bash
cd back-end
docker-compose up
```

### Biến môi trường cần thiết (ví dụ trong file `.env`):

```
NODE_ENV=development
PORT=3000
MONGODB_URL=mongodb://localhost:27017/node-boilerplate
JWT_SECRET=your_jwt_secret
JWT_ISSUER=your_issuer
SUPER_ADMIN_USERNAME=admin
SUPER_ADMIN_PASSWORD=admin
SUPER_ADMIN_EMAIL=admin@example.com
ICT_HOST=http://localhost:xxxx
```

### Tài liệu API
- Swagger: `/v1/docs` (chỉ bật ở chế độ development)

---

## Front-end

- **Tech stack**: Vue 3, Vite, Element Plus, Pinia, Vue Router, i18n, TailwindCSS
- **Tính năng**:
  - Đăng nhập một lần (SSO), quản lý người dùng, phân quyền
  - Quản lý project, reservoir, báo cáo, file, v.v.
  - Giao diện hiện đại, responsive

### Cài đặt & chạy local

```bash
cd front-end
npm install
npm run dev
```

### Build production

```bash
npm run build
```

### Tuỳ biến giao diện
- Sửa file: `src/styles/themes/variables.scss`

---

## Đóng góp

- Vui lòng đọc file `back-end/CONTRIBUTING.md` để biết quy tắc đóng góp, style code, commit message, v.v.

## Lịch sử thay đổi

- Xem chi tiết trong `back-end/CHANGELOG.md` và `front-end/CHANGELOG.md`

## License

- Dự án sử dụng giấy phép MIT. Xem file `back-end/LICENSE`. 