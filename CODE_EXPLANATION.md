# 📖 ຄູ່ມື ແລະ ຄຳອະທິບາຍລະອຽດກ່ຽວກັບໂຄ້ດ (CODE EXPLANATION)
## ລະບົບ Micro Fitness Management System (Frontend)

ເອກະສານສະບັບນີ້ຖືກສ້າງຂຶ້ນເພື່ອອະທິບາຍໂຄງສ້າງ ແລະ ໂຄ້ດສ່ວນທີ່ສຳຄັນທັງໝົດຂອງລະບົບ **Micro Fitness Management System** ໂດຍແບ່ງຕາມໂມດູນ ແລະ ໜ້າທີ່ການເຮັດວຽກຢ່າງລະອຽດ ພ້ອມຍົກຕົວຢ່າງ Logic, ການຮັບ-ສົ່ງຂໍ້ມູນຜ່ານ API ແລະ LocalStorage ເພື່ອຄວາມສະດວກໃນການຮຽນຮູ້, ບຳລຸງຮັກສາ (Maintenance) ແລະ ພັດທະນາຕໍ່ຍອດ.

---

## ສາລະບານ (Table of Contents)

1. [ໂຄງສ້າງພື້ນຖານ ແລະ ການຕັ້ງຄ່າລະບົບ (Core & Configuration)](#1-ໂຄງສ້າງພື້ນຖານ-ແລະ-ການຕັ້ງຄ່າລະບົບ)
   - [Environment Configuration (`.env.local`)](#11-environment-configuration-envlocal)
   - [Root Layout (`app/layout.tsx`)](#12-root-layout-applayouttsx)
   - [Global Styles (`app/globals.css`)](#13-global-styles-appglobalscss)
2. [ລະບົບ Network, Authentication & Utilities (`app/lib/`)](#2-ລະບົບ-network-authentication--utilities-applib)
   - [Axios Instance & Interceptor (`app/lib/api.ts`)](#21-axios-instance--interceptor-applibapits)
   - [Auth Token Utilities (`app/lib/auth.ts`)](#22-auth-token-utilities-applibauthts)
   - [API Service Layer (`app/lib/services.ts`)](#23-api-service-layer-applibservicests)
   - [Utility Functions (`app/lib/utils.ts`)](#24-utility-functions-applibutilsts)
3. [ລະບົບກຳນົດໂຄງສ້າງຂໍ້ມູນ (Type Definitions - `app/types/`)](#3-ລະບົບກຳນົດໂຄງສ້າງຂໍ້ມູນ-type-definitions-apptypes)
4. [ລະບົບ Navigation & Layout Guards](#4-ລະບົບ-navigation--layout-guards)
   - [Admin Navigation Sidebar (`app/components/Sidebar.tsx`)](#41-admin-navigation-sidebar-appcomponentssidebartsx)
   - [Admin Layout & Route Guard (`app/(admin)/layout.tsx`)](#42-admin-layout--route-guard-appadminlayouttsx)
   - [Staff Layout & Tab Controller (`app/staff/layout.tsx`)](#43-staff-layout--tab-controller-appstafflayouttsx)
5. [ລະບົບເຂົ້າສູ່ລະບົບ (Authentication Module)](#5-ລະບົບເຂົ້າສູ່ລະບົບ-authentication-module)
   - [Login Page (`app/login/page.tsx`)](#51-login-page-apploginpagetsx)
6. [ລະບົບໜ້າເຄົາເຕີພະນັກງານ (Staff Counter POS)](#6-ລະບົບໜ້າເຄົາເຕີພະນັກງານ-staff-counter-pos)
   - [Staff POS Page (`app/staff/page.tsx`)](#61-staff-pos-page-appstaffpagetsx)
7. [ລະບົບບໍລິຫານຈັດການສຳລັບ Admin (`app/(admin)/`)](#7-ລະບົບບໍລິຫານຈັດການສຳລັບ-admin-appadmin)
   - [Admin Dashboard (`app/(admin)/dashboard/page.tsx`)](#71-admin-dashboard-appadmindashboardpagetsx)
   - [ຈັດການສະມາຊິກ (`app/(admin)/members/page.tsx`)](#72-ຈັດການສະມາຊິກ-appadminmemberspagetsx)
   - [ຈັດການແພັກເກັດ (`app/(admin)/packages/page.tsx`)](#73-ຈັດການແພັກເກັດ-appadminpackagespagetsx)
   - [ຈັດການສິນຄ້າ Minibar (`app/(admin)/products/page.tsx`)](#74-ຈັດການສິນຄ້າ-minibar-appadminproductspagetsx)
   - [ປະຫວັດການຊຳລະເງິນ (`app/(admin)/payments/page.tsx`)](#75-ປະຫວັດການຊຳລະເງິນ-appadminpaymentspagetsx)
   - [ບັນທຶກລາຍຈ່າຍ (`app/(admin)/expenses/page.tsx`)](#76-ບັນທຶກລາຍຈ່າຍ-appadminexpensespagetsx)
   - [ຈັດການພະນັກງານ/ຜູ້ໃຊ້ (`app/(admin)/users/page.tsx`)](#77-ຈັດການພະນັກງານຜູ້ໃຊ້-appadminuserspagetsx)
   - [ລາຍງານ ແລະ ສະຖິຕິ (`app/(admin)/reports/page.tsx`)](#78-ລາຍງານ-ແລະ-ສະຖິຕິ-appadminreportspagetsx)

---

## 1. ໂຄງສ້າງພື້ນຖານ ແລະ ການຕັ້ງຄ່າລະບົບ

### 1.1 Environment Configuration (`.env.local`)
- **ຊື່ໄຟລ໌ ແລະ ທີ່ມາ (Source Path):** `front-end/.env.local`
- **ມັນແມ່ນຫຍັງ (What it is):** ເປັນໄຟລ໌ກຳນົດຄ່າຕົວປ່ຽນສະພາບແວດລ້ອມ (Environment Variables) ຂອງໂຄງການ ໂດຍສະເພາະແມ່ນການຊີ້ URL ໄປຍັງ Backend API Server.
- **ມັນເຮັດວຽກຈັ່ງໃດ (How it works):** 
  Next.js ຈະໂຫຼດຕົວປ່ຽນທີ່ຂຶ້ນຕົ້ນດ້ວຍ `NEXT_PUBLIC_` ເພື່ອໃຫ້ສາມາດເຂົ້າເຖິງໄດ້ທັງຝັ່ງ Client ແລະ Server:
  ```env
  NEXT_PUBLIC_API_URL=https://fitness-bxqs.onrender.com
  ```
  ເມື່ອໂຄ້ດໃນລະບົບເອີ້ນໃຊ້ `process.env.NEXT_PUBLIC_API_URL`, ຄ່າດັ່ງກ່າວຈະຖືກນຳໄປໃຊ້ເປັນ Base URL ໃນການເຊື່ອມຕໍ່ກັບ API.

---

### 1.2 Root Layout (`app/layout.tsx`)
- **ຊື່ໄຟລ໌ ແລະ ທີ່ມາ (Source Path):** `front-end/app/layout.tsx`
- **ມັນແມ່ນຫຍັງ (What it is):** ເປັນ Root Layout ຫຼັກທີ່ຫຸ້ມຫໍ່ທຸກໆໜ້າໃນ Web Application ນີ້. ເຮັດໜ້າທີ່ໂຫຼດ Font ພາສາລາວ (Noto Sans Lao), ກຳນົດ Title/Metadata ແລະ Theme ພື້ນຖານ.
- **ມັນເຮັດວຽກຈັ່ງໃດ (How it works):**
  1. ໂຫຼດ Font Google `Noto_Sans_Lao` ພ້ອມກຳນົດ Variable `--font-noto-sans-lao` ເພື່ອໃຫ້ສະແດງພາສາລາວໄດ້ຖືກຕ້ອງແລະສວຍງາມ.
  2. ກຳນົດຄ່າ `lang="lo"` ແລະ `bg-[#09090B] text-zinc-100` ໃຫ້ກັບ `<body>` ເພື່ອໃຫ້ທຸກໜ້າເປັນສີ Dark Theme ທັນສະໄໝ.
  ```tsx
  const notoSansLao = Noto_Sans_Lao({
    subsets: ["lao"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-noto-sans-lao",
  });
  ```

---

### 1.3 Global Styles (`app/globals.css`)
- **ຊື່ໄຟລ໌ ແລະ ທີ່ມາ (Source Path):** `front-end/app/globals.css`
- **ມັນແມ່ນຫຍັງ (What it is):** ເປັນໄຟລ໌ CSS ສູນກາງສຳລັບ import Tailwind CSS v4 ແລະ ກຳນົດ Style ພື້ນຖານເຊັ່ນ Font Family, Scrollbar ແລະ ສີພື້ນຫຼັງ.
- **ມັນເຮັດວຽກຈັ່ງໃດ (How it works):** 
  ນຳໃຊ້ `@import "tailwindcss";` ເພື່ອດຶງ Style ທັງໝົດຂອງ Tailwind ມາໃຊ້ໃນທົ່ວລະບົບ ແລະ ຜູກ Font Noto Sans Lao ເຂົ້າກັບ class `font-sans`.

---

## 2. ລະບົບ Network, Authentication & Utilities (`app/lib/`)

### 2.1 Axios Instance & Interceptor (`app/lib/api.ts`)
- **ຊື່ໄຟລ໌ ແລະ ທີ່ມາ (Source Path):** `front-end/app/lib/api.ts`
- **ມັນແມ່ນຫຍັງ (What it is):** ເປັນໂມດູນສ້າງ Instance ຂອງ Axios ທີ່ໃຊ້ເປັນຕົວກາງສົ່ງ Request ໄປຫາ Backend ພ້ອມລະບົບ Request Interceptor ສຳລັບແນບ JWT Token ອັດຕະໂນມັດ.
- **ມັນເຮັດວຽກຈັ່ງໃດ (How it works):**
  1. ສ້າງ `axios.create` ໂດຍຕັ້ງ `baseURL` ຈາກ `NEXT_PUBLIC_API_URL` (ຫຼື fallback ໄປ Render.com).
  2. ຕັ້ງຄ່າ `api.interceptors.request.use`: ກວດສອບວ່າຖ້າມີ `token` ໃນ `localStorage`, ຈະແນບ `Authorization: Bearer <token>` ເຂົ້າໄປໃນ HTTP Header ຂອງທຸກໆ Request ໂດຍອັດຕະໂນມັດ ເຮັດໃຫ້ບໍ່ຕ້ອງຂຽນໃສ່ token ຊ້ຳຊ້ອນໃນແຕ່ລະໜ້າ.
  ```typescript
  api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
          if (typeof window !== "undefined") {
              const token = localStorage.getItem("token");
              if (token && config.headers) {
                  config.headers.Authorization = `Bearer ${token}`;
              }
          }
          return config;
      },
      (error: unknown) => Promise.reject(error)
  );
  ```

---

### 2.2 Auth Token Utilities (`app/lib/auth.ts`)
- **ຊື່ໄຟລ໌ ແລະ ທີ່ມາ (Source Path):** `front-end/app/lib/auth.ts`
- **ມັນແມ່ນຫຍັງ (What it is):** ເປັນໄຟລ໌ Helper Functions ຈັດການເກັບ, ດຶງ, ລຶບ ແລະ ກວດສອບ Token ໃນ `localStorage`.
- **ມັນເຮັດວຽກຈັ່ງໃດ (How it works):**
  - `setToken(token: string)`: ບັນທຶກ JWT Token ລົງ `localStorage`.
  - `getToken()`: ດຶງຄ່າ Token ອອກມາໃຊ້.
  - `removeToken()`: ລຶບ Token ແລະ ຂໍ້ມູນ User ອອກຈາກ `localStorage` ເມື່ອ Logout.
  - `isAuthenticated()`: ຄືນຄ່າ `true/false` ໂດຍກວດສອບວ່າມີ Token ຫຼື ບໍ່.

---

### 2.3 API Service Layer (`app/lib/services.ts`)
- **ຊື່ໄຟລ໌ ແລະ ທີ່ມາ (Source Path):** `front-end/app/lib/services.ts`
- **ມັນແມ່ນຫຍັງ (What it is):** ເປັນຊັ້ນ Service Layer ທີ່ຮວບຮວມທຸກ API Calls ອອກເປັນ 7 ໂມດູນຫຼັກ ຕາມ Endpoints ຂອງ Backend ເພື່ອໃຫ້ເອີ້ນໃຊ້ງານງ່າຍ, ເປັນລະບຽບ ແລະ ບໍ່ມີໂຄ້ດຊ້ຳຊ້ອນ.
- **ມັນເຮັດວຽກຈັ່ງໃດ (How it works):** 
  ແຕ່ລະ Service ຈະນຳໃຊ້ `api` ຈາກ `api.ts` ເພື່ອຮຽກ API Method ຕ່າງໆ:
  1. **`ExpenseService`**: ຈັດການລາຍຈ່າຍ (`/expenses`, `/expenses/expense/total`, CRUD).
  2. **`MemberService`**: ຈັດການສະມາຊິກ (`/members`, CRUD).
  3. **`PackageService`**: ຈັດການແພັກເກັດຟິດເນັດ (`/packages`, CRUD).
  4. **`PaymentService`**: ຈັດການປະຫວັດການຊຳລະ ແລະ ລາຍຮັບ (`/payments`, `/payments/revenue/total`).
  5. **`ProductService`**: ຈັດການສິນຄ້າ Minibar (`/products`, CRUD).
  6. **`UserService`**: ຈັດການບັນຊີພະນັກງານ ແລະ Admin (`/users`, CRUD).
  7. **`AuthService`**: ຈັດການເຂົ້າສູ່ລະບົບ (`/auth/login`) ແລະ ດຶງໂປຣໄຟລ໌ (`/auth/me`).

  *ຕົວຢ່າງການເອີ້ນໃຊ້:*
  ```typescript
  // ດຶງຂໍ້ມູນລາຍຈ່າຍທັງໝົດ
  const res = await ExpenseService.getAll();
  // ເພີ່ມແພັກເກັດໃໝ່
  await PackageService.create({ name: "VIP 1 Year", priceLak: 3500000 });
  ```

---

### 2.4 Utility Functions (`app/lib/utils.ts`)
- **ຊື່ໄຟລ໌ ແລະ ທີ່ມາ (Source Path):** `front-end/app/lib/utils.ts`
- **ມັນແມ່ນຫຍັງ (What it is):** ເປັນໂມດູນເກັບຟັງຊັນຊ່ວຍເຫຼືອທົ່ວໄປ (Utilities) ສຳລັບການຈັດຮູບແບບຕົວເລກເງິນກີບ, ວັນທີ ແລະ ການຈັດການ Classname ຂອງ Tailwind.
- **ມັນເຮັດວຽກຈັ່ງໃດ (How it works):**
  - `cn(...inputs)`: ຜະສົມຜະສານ Class ຂອງ Tailwind ຜ່ານ `clsx` ແລະ `tailwind-merge` ເພື່ອປ້ອງກັນ Class ຂັດກັນ.
  - `formatLAK(amount: number)`: ຈັດຮູບແບບຕົວເລກໃຫ້ມີຈຸດຂັ້ນຫຼັກພັນຕາມມາດຕະຖານເງິນກີບລາວ ພ້ອມຕື່ມທ້າຍ `LAK` ເຊັ່ນ: `350000` $\rightarrow$ `"350,000 LAK"`.
  - `formatDate(dateString: string)`: ແປງວັນທີ ISO ເປັນວັນທີແບບທ້ອງຖິ່ນລາວ (`lo-LA`).

---

## 3. ລະບົບກຳນົດໂຄງສ້າງຂໍ້ມູນ (Type Definitions - `app/types/`)

- **ຊື່ໄຟລ໌ ແລະ ທີ່ມາ (Source Path):** 
  - `front-end/app/types/index.ts` (Index Export)
  - `front-end/app/types/member.ts` (Member & CreateMemberDto)
  - `front-end/app/types/package.ts` (Package & CreatePackageDto)
  - `front-end/app/types/products.ts` (Product)
  - `front-end/app/types/payment.ts` (Payment & CreatePaymentDto)
  - `front-end/app/types/expense.ts` (Expense & CreateExpenseDto)
  - `front-end/app/types/user.ts` (User & CreateUserDto)
  - `front-end/app/types/reports.ts` (FinancialReport)
- **ມັນແມ່ນຫຍັງ (What it is):** ເປັນໄຟລ໌ TypeScript Interfaces ກຳນົດ Data Types ຂອງ Model ຕ່າງໆໃນລະບົບ ເພື່ອໃຫ້ມີ Type Safety, ປ້ອງກັນ Bug ໃນເວລາ Compile, ແລະ ສະໜອງ Auto-complete ໃນ IDE.
- **ມັນເຮັດວຽກຈັ່ງໃດ (How it works):**
  ແຕ່ລະໄຟລ໌ກຳນົດ Field ສຳຄັນເຊັ່ນ:
  - `Member`: `id`, `code`, `fullName`, `phone`, `photoUrl`, `remainingSessions`, `expireDate`, `packageId`.
  - `Product`: `id`, `barcode`, `name`, `category`, `costPriceLak`, `priceLak`, `stock`, `imageUrl`.
  - `Payment`: `id`, `memberId`, `packageId`, `amountLak`, `paidCurrency`, `exchangeRate`, `paymentMethod`.
  - `Expense`: `id`, `title`, `amountLak`, `category`, `createdAt`.
  - `User`: `id`, `name`, `phone`, `role: "ADMIN" | "STAFF"`.

---

## 4. ລະບົບ Navigation & Layout Guards

### 4.1 Admin Navigation Sidebar (`app/components/Sidebar.tsx`)
- **ຊື່ໄຟລ໌ ແລະ ທີ່ມາ (Source Path):** `front-end/app/components/Sidebar.tsx`
- **ມັນແມ່ນຫຍັງ (What it is):** ເປັນ Component ແຖບເມນູດ້ານຂ້າງ (Sidebar Navigation) ສຳລັບລະບົບ Admin ເຊິ່ງຮອງຮັບການ ຫຍໍ້/ຂະຫຍາຍ (Toggle Collapse), ໄຮໄລ້ເມນູທີ່ກຳລັງເປີດຢູ່ (Active State), ແລະ ປຸ່ມອອກຈາກລະບົບ (Logout).
- **ມັນເຮັດວຽກຈັ່ງໃດ (How it works):**
  1. **ກວດສອບ Active Route:** ໃຊ້ `usePathname()` ຈາກ `next/navigation` ເພື່ອປຽບທຽບ Path ປັດຈຸບັນກັບ `item.href`. ຖ້າກົງກັນຈະໃສ່ສີໄຮໄລ້ສີສົ້ມ (`#F95738`).
  2. **Toggle ຫຍໍ້/ຂະຫຍາຍ:** ຮັບ Props `isCollapsed` ແລະ `onToggle` ຈາກ Layout ປັບຄວາມກວ້າງລະຫວ່າງ `w-20` (ຫຍໍ້) ແລະ `w-64` (ເຕັມ).
  3. **Logout Logic ພິເສດ:** ໃນຟັງຊັນ `handleLogout`, ລະບົບຈະອ່ານປະຫວັດ Check-in ທີ່ເກັບໄວ້ (`fitness_checkin_history`), ລຶບ Token ແລະ User ອອກ, ແລ້ວຂຽນປະຫວັດກັບຄືນ ເພື່ອບໍ່ໃຫ້ປະຫວັດ Check-in ຂອງໜ້າເຄົາເຕີສູນຫາຍ ເມື່ອມີການປ່ຽນກະ ຫຼື ອອກຈາກລະບົບ.

---

### 4.2 Admin Layout & Route Guard (`app/(admin)/layout.tsx`)
- **ຊື່ໄຟລ໌ ແລະ ທີ່ມາ (Source Path):** `front-end/app/(admin)/layout.tsx`
- **ມັນແມ່ນຫຍັງ (What it is):** ເປັນ Route Layout ທີ່ຫຸ້ມຫໍ່ທຸກໆໜ້າໃນກຸ່ມ `(admin)` ເຊິ່ງເຮັດໜ້າທີ່ເປັນ **Authentication & Authorization Guard** ເພື່ອປ້ອງກັນບໍ່ໃຫ້ຜູ້ທີ່ບໍ່ແມ່ນ `ADMIN` ເຂົ້າເຖິງໜ້າຈັດການລະບົບ.
- **ມັນເຮັດວຽກຈັ່ງໃດ (How it works):**
  1. ເມື່ອ Component ໂຫຼດ, `useEffect` ຈະອ່ານ `token` ແລະ `user` ຈາກ `localStorage`.
  2. ຖ້າບໍ່ພົບ Token $\rightarrow$ ສົ່ງຜູ້ໃຊ້ໄປ `/login` ທັນທີດ້ວຍ `router.replace("/login")`.
  3. ຖ້າພົບ User ແຕ່ Role ເປັນ `STAFF` $\rightarrow$ ສົ່ງຕໍ່ໄປຍັງໜ້າ `/staff`.
  4. ຖ້າ Role ແມ່ນ `ADMIN` $\rightarrow$ ຕັ້ງ `authorized = true` ແລະ ສະແດງໜ້າ Admin ພ້ອມ Sidebar.
  ```typescript
  if (userRole !== "ADMIN") {
      if (userRole === "STAFF") router.replace("/staff");
      else router.replace("/login");
      return;
  }
  setAuthorized(true);
  ```

---

### 4.3 Staff Layout & Tab Controller (`app/staff/layout.tsx`)
- **ຊື່ໄຟລ໌ ແລະ ທີ່ມາ (Source Path):** `front-end/app/staff/layout.tsx`
- **ມັນແມ່ນຫຍັງ (What it is):** ເປັນ Layout ສຳລັບໜ້າເຄົາເຕີ POS ຂອງພະນັກງານ ປະກອບດ້ວຍ Header ບອກຊື່ພະນັກງານ, ປຸ່ມ Logout, ແລະ ແຖບ Sub-Navigation Tabs 3 ແຖບ (ສະແກນ Check-in, ຂາຍສິນຄ້າ Minibar, ປະຫວັດ Check-in).
- **ມັນເຮັດວຽກຈັ່ງໃດ (How it works):**
  1. **Auth Guard:** ອະນຸຍາດໃຫ້ທັງ `STAFF` ແລະ `ADMIN` ເຂົ້າໃຊ້ງານໄດ້.
  2. **URL SearchParams State:** ເມື່ອກົດເລືອກ Tab ຈະປ່ຽນ Query Param `?tab=checkin`, `?tab=minibar`, ຫຼື `?tab=history` ຜ່ານ `window.history.pushState` ແລະ ສັ່ງ `dispatchEvent(new Event("popstate"))` ເຮັດໃຫ້ໜ້າປ່ຽນແທັບໄດ້ໄວໂດຍບໍ່ຕ້ອງ Reload ໜ້າເວັບ.

---

## 5. ລະບົບເຂົ້າສູ່ລະບົບ (Authentication Module)

### 5.1 Login Page (`app/login/page.tsx`)
- **ຊື່ໄຟລ໌ ແລະ ທີ່ມາ (Source Path):** `front-end/app/login/page.tsx`
- **ມັນແມ່ນຫຍັງ (What it is):** ເປັນໜ້າຟອມເຂົ້າສູ່ລະບົບດ້ວຍເບີໂທລະສັບ (Phone) ແລະ ລະຫັດຜ່ານ (Password) ຮອງຮັບການສະແດງ/ເຊື່ອງລະຫັດຜ່ານ, ການກວດສອບຄວາມຖືກຕ້ອງ ແລະ ການແຍກສິດ Redirect ຕາມ Role.
- **ມັນເຮັດວຽກຈັ່ງໃດ (How it works):**
  1. ຮັບຂໍ້ມູນ `phone` ແລະ `password` ຈາກ Form State.
  2. ສົ່ງ Request ໄປຍັງ API `POST /auth/login` ຜ່ານ `AuthService.login(...)`.
  3. ເມື່ອ Backend ຕອບກັບສຳເລັດ:
     - ດຶງ JWT Token ມາເກັບໄວ້ໃນ `localStorage.setItem("token", token)` ແລະ `document.cookie`.
     - ດຶງຂໍ້ມູນ User ມາເກັບໄວ້ໃນ `localStorage.setItem("user", JSON.stringify(user))`.
  4. **Role Redirection:**
     - ຖ້າ `user.role === "ADMIN"` $\rightarrow$ ສົ່ງໄປ `/dashboard`
     - ຖ້າ `user.role === "STAFF"` $\rightarrow$ ສົ່ງໄປ `/staff`
  ```typescript
  const res = await AuthService.login({ phone, password });
  const token = res?.data?.token || res?.token;
  const user = res?.data?.user || res?.user;
  if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      if (user?.role?.toUpperCase() === "ADMIN") router.push("/dashboard");
      else router.push("/staff");
  }
  ```

---

## 6. ລະບົບໜ້າເຄົາເຕີພະນັກງານ (Staff Counter POS)

### 6.1 Staff POS Page (`app/staff/page.tsx`)
- **ຊື່ໄຟລ໌ ແລະ ທີ່ມາ (Source Path):** `front-end/app/staff/page.tsx`
- **ມັນແມ່ນຫຍັງ (What it is):** ເປັນໜ້າຫຼັກຂອງພະນັກງານປະຈຳເຄົາເຕີທີ່ຮວມເອົາ 3 ຟັງຊັນສຳຄັນໄວ້ໃນໜ້າດຽວ:
  1. **ແທັບ 1 (Check-in):** ສະແກນ Barcode ຫຼື ເລືອກລາຍຊື່ສະມາຊິກເພື່ອເຂົ້າໃຊ້ບໍລິການ Gym.
  2. **ແທັບ 2 (Minibar Sales):** ລະບົບຂາຍສິນຄ້າໜ້າເຄົາເຕີ ເລືອກສິນຄ້າ, ໃສ່ກະຕ່າ, ໄລ່ເງິນ ແລະ ບັນທຶກລາຍຮັບ.
  3. **ແທັບ 3 (Today History):** ເບິ່ງປະຫວັດການ Check-in ທັງໝົດໃນມື້ນີ້.
- **ມັນເຮັດວຽກຈັ່ງໃດ (How it works):**

  #### A. Check-in Flow:
  - ພະນັກງານພິມ/ສະແກນ Barcode ຫຼື ກົດປຸ່ມ Check-in ຈາກຕາຕະລາງລາຍຊື່.
  - ສົ່ງ `POST` ໄປຍັງ `https://fitness-bxqs.onrender.com/members/check-in` ພ້ອມ Body: `{ code: barcode }`.
  - ເມື່ອສຳເລັດ ລະບົບຈະຕັດຄັ້ງ (`remainingSessions - 1`), ສະແດງສະຖານະຜົນການ Check-in, ແລະ ບັນທຶກລົງ `localStorage` ພາຍໃຕ້ Key `"fitness_checkin_history"`.

  #### B. Minibar Sales & Cart Flow:
  - ດຶງລາຍການສິນຄ້າຈາກ `GET /products`.
  - ມີລະບົບ Cart State: `addToCart(product)`, `updateQuantity(id, delta)`, `removeFromCart(id)`.
  - ຄຳນວນຍອດລວມ:
    ```typescript
    const totalAmount = cart.reduce((sum, item) => sum + (item.priceLak * item.quantity), 0);
    ```
  - ເມື່ອກົດຊຳລະເງິນ (`handleCheckout`), ລະບົບຈະບັນທຶກລາຍການຂາຍລົງ `"fitness_payments"` ໃນ `localStorage`, ລ້າງກະຕ່າ ແລະ ສະແດງ Toast ແຈ້ງເຕືອນສຳເລັດ.

  #### C. Today History Flow:
  - ໂຫຼດຂໍ້ມູນຈາກ `localStorage.getItem("fitness_checkin_history")` ມາສະແດງໃນຕາຕະລາງພ້ອມເວລາທີ່ Check-in ຢ່າງຊັດເຈນ.

---

## 7. ລະບົບບໍລິຫານຈັດການສຳລັບ Admin (`app/(admin)/`)

### 7.1 Admin Dashboard (`app/(admin)/dashboard/page.tsx`)
- **ຊື່ໄຟລ໌ ແລະ ທີ່ມາ (Source Path):** `front-end/app/(admin)/dashboard/page.tsx`
- **ມັນແມ່ນຫຍັງ (What it is):** ເປັນໜ້າ Dashboard ພາບລວມຂອງທຸລະກິດ ສຳລັບຜູ້ບໍລິຫານ ສະແດງບັດສະຖິຕິຫຼັກ 5 ບັດ (ສະມາຊິກທັງໝົດ, ລາຍຮັບເດືອນນີ້, ລາຍຈ່າຍເດືອນນີ້, ກຳໄລສຸດທິ, ຈຳນວນສິນຄ້າ/ແພັກເກັດ) ພ້ອມກຣາຟແທ່ງ (Bar Chart) ປຽບທຽບລາຍຮັບ-ລາຍຈ່າຍ.
- **ມັນເຮັດວຽກຈັ່ງໃດ (How it works):**
  1. ດຶງຂໍ້ມູນແບບ **Parallel** ດ້ວຍ `Promise.all` ເພື່ອຄວາມວ່ອງໄວ:
     - `MemberService.getAll()` $\rightarrow$ ນັບຈຳນວນສະມາຊິກ
     - `fetch('/reports/financial?startDate=...&endDate=...')` $\rightarrow$ ຄຳນວນລາຍຮັບເດືອນນີ້
     - `ExpenseService.getAll()` $\rightarrow$ ຄຳນວນລາຍຈ່າຍເດືອນນີ້
     - `fetch('/products')` & `fetch('/packages')` $\rightarrow$ ນັບສິນຄ້າ ແລະ ແພັກເກັດ
  2. ຄຳນວນກຳໄລສຸດທິ (Net Profit):
     ```typescript
     const netProfit = stats.monthlyRevenue - stats.monthlyExpense;
     ```
  3. ນຳໃຊ້ Library `recharts` ສະແດງກຣາຟແທ່ງສີຂຽວ (ລາຍຮັບ) ແລະ ສີແດງ (ລາຍຈ່າຍ) ພ້ອມ Custom Tooltip ຈັດ Format ເງິນກີບ.

---

### 7.2 ຈັດການສະມາຊິກ (`app/(admin)/members/page.tsx`)
- **ຊື່ໄຟລ໌ ແລະ ທີ່ມາ (Source Path):** `front-end/app/(admin)/members/page.tsx`
- **ມັນແມ່ນຫຍັງ (What it is):** ເປັນໂມດູນທີ່ໃຫຍ່ ແລະ ສຳຄັນທີ່ສຸດ ສຳລັບຈັດການຂໍ້ມູນສະມາຊິກ Gym ແບບຄົບວົງຈອນ (CRUD): ລົງທະບຽນໃໝ່, ອັບໂຫຼດຮູບພາບ, ເລືອກແພັກເກັດ, ຄຳນວນວັນໝົດອາຍຸ, ຄົ້ນຫາ, ແກ້ໄຂ ແລະ ລຶບສະມາຊິກ.
- **ມັນເຮັດວຽກຈັ່ງໃດ (How it works):**
  1. **ການອັບໂຫຼດຮູບພາບ (Multipart Form-Data):** ໃຊ້ `FormData` ເພື່ອຮອງຮັບການສົ່ງໄຟລ໌ຮູບສະມາຊິກໄປຍັງ Backend:
     ```typescript
     const data = new FormData();
     data.append("code", `MEM${Math.floor(100 + Math.random() * 900)}`);
     data.append("fullName", formData.name.trim());
     data.append("phone", formData.phone.trim());
     data.append("packageId", formData.packageId);
     data.append("expireDate", expireDate);
     data.append("remainingSessions", String(initialSessions));
     if (selectedFile) data.append("photo", selectedFile);
     ```
  2. **Logic ຄຳນວນວັນໝົດອາຍຸອັດຕະໂນມັດ:** ອີງຕາມ Package ທີ່ເລືອກ: ດຶງ `durationDays` ແລະ `sessions` ຂອງ Package ມາກຳນົດ `expireDate` ແລະ `remainingSessions` ໃຫ້ສະມາຊິກໃໝ່ທັນທີ.
  3. **ການແກ້ໄຂສະມາຊິກ:** ຖ້າມີການປ່ຽນ Package ຈະ Reset sessions ໃຫ້ໃໝ່, ແຕ່ຖ້າເປັນ Package ເດີມຈະຮັກສາຄ່າ `remainingSessions` ທີ່ເຫຼືອຢູ່.
  4. **Image Modal Preview:** ກົດທີ່ຮູບສະມາຊິກເພື່ອເບິ່ງຮູບຂະໜາດເຕັມໃນ Modal ໄດ້.

---

### 7.3 ຈັດການແພັກເກັດ (`app/(admin)/packages/page.tsx`)
- **ຊື່ໄຟລ໌ ແລະ ທີ່ມາ (Source Path):** `front-end/app/(admin)/packages/page.tsx`
- **ມັນແມ່ນຫຍັງ (What it is):** ເປັນໜ້າຈັດການແພັກເກັດສະມາຊິກຟິດເນັດ (ເຊັ່ນ: ລາຍວັນ, ລາຍເດືອນ, ລາຍ 3 ເດືອນ, ລາຍປີ) ກຳນົດລາຄາ, ອາຍຸການໃຊ້ງານ (ມື້) ແລະ ຈຳນວນຄັ້ງທີ່ສາມາດເຂົ້າຫຼິ້ນໄດ້.
- **ມັນເຮັດວຽກຈັ່ງໃດ (How it works):**
  - **Fetch Data:** ເອີ້ນໃຊ້ `PackageService.getAll()`.
  - **Create/Update Modal:** ໃຊ້ Form ດຽວກັນສຳລັບເພີ່ມ ແລະ ແກ້ໄຂ ໂດຍກວດສອບວ່າຖ້າມີ `editingId` ຈະເອີ້ນ `PackageService.update(editingId, payload)` ຖ້າບໍ່ມີຈະເອີ້ນ `PackageService.create(payload)`.
  - **Delete Modal:** ມີ Modal ຢືນຢັນກ່ອນລຶບເພື່ອປ້ອງກັນການກົດພາດ.

---

### 7.4 ຈັດການສິນຄ້າ Minibar (`app/(admin)/products/page.tsx`)
- **ຊື່ໄຟລ໌ ແລະ ທີ່ມາ (Source Path):** `front-end/app/(admin)/products/page.tsx`
- **ມັນແມ່ນຫຍັງ (What it is):** ເປັນໜ້າຈັດການສາງສິນຄ້າ Minibar ເຊັ່ນ: ເຄື່ອງດື່ມ, ອາຫານເສີມ (Whey Protein), ອຸປະກອນອອກກຳລັງກາຍ. ຮອງຮັບ Barcode Generator, ການອັບໂຫຼດຮູບພາບແບບ Base64, ຕິດຕາມສະຕັອກ ແລະ ຕົ້ນທຶນ-ລາຄາຂາຍ.
- **ມັນເຮັດວຽກຈັ່ງໃດ (How it works):**
  1. **ສຸ່ມເລກ Barcode:** ມີປຸ່ມກົດ Generate ເລກ Barcode 12 ຫຼັກອັດຕະໂນມັດ ຖ້າສິນຄ້າບໍ່ມີ Barcode ມາຈາກໂຮງງານ.
  2. **Image Base64 Converter:** ເມື່ອເລືອກໄຟລ໌ຮູບພາບ, ລະບົບໃຊ້ `FileReader.readAsDataURL(file)` ເພື່ອແປງຮູບເປັນ Base64 String ເກັບໃນ State ແລະ ສົ່ງຜ່ານ JSON ໄປຍັງ API ໂດຍກົງ.
  3. **Stock & Profit Tracking:** ສະແດງຈຳນວນຄົງເຫຼືອໃນສາງ ແລະ ຄຳນວນສ່ວນຕ່າງລະຫວ່າງຕົ້ນທຶນ (`costPriceLak`) ແລະ ລາຄາຂາຍ (`priceLak`).

---

### 7.5 ປະຫວັດການຊຳລະເງິນ (`app/(admin)/payments/page.tsx`)
- **ຊື່ໄຟລ໌ ແລະ ທີ່ມາ (Source Path):** `front-end/app/(admin)/payments/page.tsx`
- **ມັນແມ່ນຫຍັງ (What it is):** ເປັນໜ້າບັນທຶກ ແລະ ເບິ່ງປະຫວັດການຊຳລະເງິນຄ່າສະມາຊິກ ຫຼື ຄ່າບໍລິການຕ່າງໆ ຮອງຮັບຫຼາຍສະກຸນເງິນ (LAK, THB, USD) ພ້ອມອັດຕາແລກປ່ຽນ ແລະ ວິທີການຊຳລະ (CASH, BCEL_ONE, TRANSFER).
- **ມັນເຮັດວຽກຈັ່ງໃດ (How it works):**
  1. **Auto-Fill Data ຕາມສະມາຊິກ/ແພັກເກັດ:** ເມື່ອເລືອກ Member ຫຼື Package, ລະບົບຈະດຶງລາຄາຂອງແພັກເກັດມາຕື່ມໃສ່ຊ່ອງ `amountLak` ໂດຍອັດຕະໂນມັດ.
  2. **Exchange Rate Logic:** ຄຳນວນເງິນທອນ (`changeLak`) ແລະ ເງິນທີ່ຕ້ອງຈ່າຍຕົວຈິງຕາມສະກຸນເງິນທີ່ເລືອກ:
     ```typescript
     // ສົ່ງ payload ໄປບັນທຶກ
     await PaymentService.create({
         memberId: Number(formData.memberId),
         packageId: Number(formData.packageId),
         amountLak: Number(formData.amountLak),
         paymentMethod: formData.paymentMethod,
         paidCurrency: formData.paidCurrency,
         exchangeRate: Number(formData.exchangeRate),
         amountPaid: Number(formData.amountPaid)
     });
     ```
  3. ລາຍການຊຳລະໃໝ່ຈະຖືກເພີ່ມເຂົ້າຖານຂໍ້ມູນ ແລະ ນຳໄປຄຳນວນເປັນລາຍຮັບໃນໜ້າ Dashboard ແລະ Reports.

---

### 7.6 ບັນທຶກລາຍຈ່າຍ (`app/(admin)/expenses/page.tsx`)
- **ຊື່ໄຟລ໌ ແລະ ທີ່ມາ (Source Path):** `front-end/app/(admin)/expenses/page.tsx`
- **ມັນແມ່ນຫຍັງ (What it is):** ເປັນໂມດູນບັນທຶກ ແລະ ຕິດຕາມລາຍຈ່າຍທັງໝົດຂອງ Gym (ເຊັ່ນ: ຄ່ານ້ຳ, ຄ່າໄຟ, ເງິນເດືອນພະນັກງານ, ຄ່າເຊົ່າສະຖານທີ່, ຄ່າຊື້ອຸປະກອນ, ຄ່າບຳລຸງຮັກສາ).
- **ມັນເຮັດວຽກຈັ່ງໃດ (How it works):**
  - **ໝວດໝູ່ລາຍຈ່າຍ (Categories):** ແບ່ງອອກເປັນ 6 ໝວດ: `UTILITIES`, `RENT`, `SALARY`, `MAINTENANCE`, `EQUIPMENT`, `MARKETING`, `OTHER`.
  - **Summary Calculation:** ຄຳນວນຍອດລວມລາຍຈ່າຍທັງໝົດໃນ Client:
    ```typescript
    const total = expenses.reduce((sum, item) => sum + (Number(item.amountLak) || 0), 0);
    ```
  - **CRUD Operations:** ເອີ້ນໃຊ້ `ExpenseService.create`, `ExpenseService.update`, ແລະ `ExpenseService.delete` ພ້ອມສະແດງ Toast ແຈ້ງເຕືອນ.

---

### 7.7 ຈັດການພະນັກງານ/ຜູ້ໃຊ້ (`app/(admin)/users/page.tsx`)
- **ຊື່ໄຟລ໌ ແລະ ທີ່ມາ (Source Path):** `front-end/app/(admin)/users/page.tsx`
- **ມັນແມ່ນຫຍັງ (What it is):** ເປັນໜ້າຈັດການບັນຊີຜູ້ໃຊ້ງານລະບົບ ທັງຜູ້ດູແລລະບົບ (`ADMIN`) ແລະ ພະນັກງານເຄົາເຕີ (`STAFF`) ສຳລັບສ້າງບັນຊີ, ປ່ຽນລະຫັດຜ່ານ, ປ່ຽນ Role ຫຼື ລຶບບັນຊີ.
- **ມັນເຮັດວຽກຈັ່ງໃດ (How it works):**
  - ສົ່ງ Request ໄປຍັງ `GET /users`, `POST /users`, `PATCH /users/:id`, `DELETE /users/:id` ພ້ອມແນບ Bearer Token.
  - ເມື່ອເພີ່ມພະນັກງານໃໝ່ ຈະກຳນົດ `name`, `phone`, `password`, ແລະ `role: "STAFF" | "ADMIN"`.
  - ມີລະບົບຄົ້ນຫາຕາມຊື່ ແລະ ເບີໂທລະສັບ ເພື່ອຄວາມວ່ອງໄວໃນການຈັດການ.

---

### 7.8 ລາຍງານ ແລະ ສະຖິຕິ (`app/(admin)/reports/page.tsx`)
- **ຊື່ໄຟລ໌ ແລະ ທີ່ມາ (Source Path):** `front-end/app/(admin)/reports/page.tsx`
- **ມັນແມ່ນຫຍັງ (What it is):** ເປັນສູນກາງລາຍງານສະຖິຕິ ແລະ ການວິເຄາະຂອງລະບົບ ຮອງຮັບການເລືອກຊ່ວງເວລາ (Date Range: Start Date $\rightarrow$ End Date) ເພື່ອວິເຄາະລາຍຮັບ, ລາຍຈ່າຍ, ສະຖິຕິ Check-in ຂອງສະມາຊິກ, ແລະ ມີ Dynamic Modal ສະແດງລາຍຊື່ສະມາຊິກທີ່ກຳລັງຈະໝົດອາຍຸ ຫຼື ໝົດອາຍຸແລ້ວ.
- **ມັນເຮັດວຽກຈັ່ງໃດ (How it works):**
  1. **Query Params ຕາມວັນທີ:** ເມື່ອປ່ຽນ `startDate` ຫຼື `endDate`, ລະບົບຈະ fetch ຂໍ້ມູນໃໝ່:
     - `GET /reports/financial?startDate=${startDate}&endDate=${endDate}`
     - `GET /reports/check-ins?startDate=${startDate}&endDate=${endDate}`
     - `GET /expenses/expense/total`
  2. **ການຄຳນວນສະຖານະສະມາຊິກ (Member Expiration Analytics):**
     - ສະມາຊິກໃຊ້ງານປົກກະຕິ (Active Members): `remainingSessions > 0` ແລະ ຍັງບໍ່ຮອດວັນໝົດອາຍຸ.
     - ໃກ້ໝົດອາຍຸ (Expiring Soon): ເຫຼືອເວລາ $\le 7$ ມື້ ຫຼື ເຫຼືອຈຳນວນຄັ້ງ $\le 3$ ຄັ້ງ.
     - ໝົດອາຍຸແລ້ວ (Expired Members): `remainingSessions === 0` ຫຼື ກາຍວັນໝົດອາຍຸແລ້ວ.
  3. **Interactive Drill-down Modal:** ເມື່ອກົດທີ່ກ່ອງສະຖິຕິ (ເຊັ່ນ: ກ່ອງສະມາຊິກໃກ້ໝົດອາຍຸ), Modal ຈະເປີດຂຶ້ນພ້ອມສະແດງລາຍຊື່, ເບີໂທ ແລະ ວັນໝົດອາຍຸຂອງສະມາຊິກກຸ່ມນັ້ນໂດຍສະເພາະ.

---

## 8. ສະຫຼຸບພາບລວມການໄຫຼຂອງຂໍ້ມູນ (Data Flow Architecture)

```mermaid
graph TD
    User([ຜູ້ໃຊ້ງານ: Admin / Staff]) -->|1. ເຂົ້າສູ່ລະບົບ| Login[app/login/page.tsx]
    Login -->|2. POST /auth/login| BackendAPI[(Backend REST API)]
    BackendAPI -->|3. Return JWT Token + User Role| Login
    Login -->|4. ເກັບ Token & Role| LocalStorage[(LocalStorage & Cookies)]
    
    LocalStorage -->|5. Role = ADMIN| AdminLayout[app/(admin)/layout.tsx]
    LocalStorage -->|6. Role = STAFF| StaffLayout[app/staff/layout.tsx]
    
    AdminLayout --> AdminPages[Dashboard / Members / Packages / Products / Payments / Expenses / Users / Reports]
    StaffLayout --> StaffPOS[Check-in / Minibar Sales / Today History]
    
    AdminPages -->|Axios with Bearer Token| BackendAPI
    StaffPOS -->|Fetch with Bearer Token| BackendAPI
    StaffPOS -->|Sync Offline Fallback| LocalStorage
```

---
*ເອກະສານນີ້ຖືກສ້າງຂຶ້ນເພື່ອເປັນຄູ່ມືອ້າງອີງທາງເທັກນິກສຳລັບໂຄງການ Micro Fitness Management System.*
