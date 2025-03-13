# Software License Store

Một trang web bán license phần mềm được xây dựng bằng Nuxt 3, với giao diện hiện đại và đầy đủ tính năng.

## Tính năng

- **Đa ngôn ngữ**: Hỗ trợ tiếng Anh và tiếng Việt thông qua @nuxtjs/i18n
- **Chế độ tối/sáng**: Hỗ trợ chế độ tối và sáng thông qua @nuxtjs/color-mode
- **Tối ưu SEO**: Sử dụng SSR cho các trang cần SEO và CSR cho các trang không cần SEO
- **Xác thực người dùng**: Hệ thống đăng nhập/đăng ký với phân quyền người dùng và admin
- **Quản lý giỏ hàng**: Hệ thống giỏ hàng đầy đủ tính năng
- **Giao diện hiện đại**: Sử dụng Tailwind CSS với hiệu ứng glassmorphism và gradient

## Cấu trúc dự án

```
├── assets/             # Tài nguyên tĩnh (CSS, hình ảnh)
├── components/         # Các component Vue
│   ├── common/         # Component dùng chung
│   └── product/        # Component liên quan đến sản phẩm
├── composables/        # Composables Vue
│   └── api/            # Composables xử lý API
├── layouts/            # Layouts
├── middleware/         # Middleware (auth, admin)
├── pages/              # Các trang
│   ├── admin/          # Trang quản trị
│   ├── auth/           # Trang xác thực
│   ├── products/       # Trang sản phẩm
│   └── user/           # Trang người dùng
├── plugins/            # Plugins
├── public/             # Tài nguyên công khai
├── server/             # API server
│   └── api/            # API endpoints
├── static/             # Tài nguyên tĩnh không thay đổi
└── stores/             # Pinia stores
```

## Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy server phát triển
npm run dev

# Build cho production
npm run build

# Chạy server production
npm run start
```

## Tài khoản demo

### Tài khoản người dùng
- Email: user@example.com
- Mật khẩu: password

### Tài khoản admin
- Email: admin@example.com
- Mật khẩu: admin

## Công nghệ sử dụng

- [Nuxt 3](https://nuxt.com/) - Framework Vue.js
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Pinia](https://pinia.vuejs.org/) - State management
- [i18n](https://i18n.nuxtjs.org/) - Đa ngôn ngữ
- [Color Mode](https://color-mode.nuxtjs.org/) - Chế độ tối/sáng

## Tác giả

- **tun009** - [GitHub](https://github.com/tun009)

## License

Dự án này được cấp phép theo giấy phép MIT - xem file [LICENSE](LICENSE) để biết thêm chi tiết.
