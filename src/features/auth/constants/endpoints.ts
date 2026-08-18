/**
 * Auth Endpoints — Danh sách các đường dẫn API cho feature Authentication.
 * chức theo hướng Modular để dễ dàng quản lý và tránh xung đột.
 */
export const AUTH_ENDPOINTS = {
    /** Đăng nhập hệ thống */
    LOGIN: '/auth/login',
    /** Đăng ký tài khoản mới */
    REGISTER: '/auth/register',
    /** Đăng xuất (hủy token) */
    LOGOUT: '/auth/logout',
    /** Lấy thông tin người dùng hiện tại */
    ME: '/auth/me',
    /** Làm mới access token */
    REFRESH: '/auth/refresh',
} as const
