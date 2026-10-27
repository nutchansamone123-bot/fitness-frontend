import api from "./api";

// 1. Expenses API (ລາຍຈ່າຍ)
export const ExpenseService = {
    getAll: () => api.get("/expenses"),
    getTotal: () => api.get("/expenses/expense/total"),
    getById: (id: string | number) => api.get(`/expenses/${id}`),
    create: (data: any) => api.post("/expenses", data),
    update: (id: string | number, data: any) => api.patch(`/expenses/${id}`, data),
    delete: (id: string | number) => api.delete(`/expenses/${id}`),
};

// 2. Members API (ສະມາຊິກ)
export const MemberService = {
    getAll: () => api.get("/members"),
    getById: (id: string | number) => api.get(`/members/${id}`),
    create: (data: any) => api.post("/members", data),
    update: (id: string | number, data: any) => api.patch(`/members/${id}`, data),
    delete: (id: string | number) => api.delete(`/members/${id}`),
};

// 3. Packages API (ແພັກເກັດ)
export const PackageService = {
    getAll: () => api.get("/packages"),
    getById: (id: string | number) => api.get(`/packages/${id}`),
    create: (data: any) => api.post("/packages", data),
    update: (id: string | number, data: any) => api.patch(`/packages/${id}`, data),
    delete: (id: string | number) => api.delete(`/packages/${id}`),
};

// 4. Payments API (ປະຫວັດການຊຳລະ)
export const PaymentService = {
    getAll: () => api.get("/payments"),
    getTotalRevenue: () => api.get("/payments/revenue/total"),
    getById: (id: string | number) => api.get(`/payments/${id}`),
    create: (data: any) => api.post("/payments", data),
    delete: (id: string | number) => api.delete(`/payments/${id}`),
};

// 5. Products API (ສິນຄ້າ - ເພີ່ມໃໝ່ຮອງຮັບລະບົບຂາຍສິນຄ້າ)
export const ProductService = {
    getAll: () => api.get("/products"),
    getById: (id: string | number) => api.get(`/products/${id}`),
    create: (data: any) => api.post("/products", data),
    update: (id: string | number, data: any) => api.patch(`/products/${id}`, data),
    delete: (id: string | number) => api.delete(`/products/${id}`),
};

// 6. Users API (ຜູ້ໃຊ້/ພະນັກງານ)
export const UserService = {
    getAll: () => api.get("/users"),
    getById: (id: string | number) => api.get(`/users/${id}`),
    create: (data: any) => api.post("/users", data),
    update: (id: string | number, data: any) => api.patch(`/users/${id}`, data),
    delete: (id: string | number) => api.delete(`/users/${id}`),
};

// 7. Auth API
export const AuthService = {
    login: (credentials: { phone?: string; password?: string }) =>
        api.post("/auth/login", credentials),
    getProfile: () => api.get("/auth/me"),
};