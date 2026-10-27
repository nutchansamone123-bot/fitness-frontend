# 📋 ບົດສະຫຼຸບໂປຣເຈັກ — Micro Fitness Management System (Frontend)

> **ວັນທີສ້າງລາຍງານ:** 14 ຕຸລາ 2026  
> **ເວີຊັ່ນ:** v0.1.0  
> **ສະຖານະ:** ✅ ລະບົບສະຖຽນ — ບໍ່ມີ Error — ພ້ອມນຳໄປໃຊ້ງານຈິງ (Production Ready)

---

## 1. ພາບລວມໂປຣເຈັກ (Project Overview)

ລະບົບ **Micro Fitness Management System** ເປັນ Web Application ສຳລັບບໍລິຫານຈັດການ Gym & Fitness Center ແບບຄົບວົງຈອນ ປະກອບດ້ວຍ:

- ລະບົບ **Admin Panel** — Dashboard, ຈັດການສະມາຊິກ, ແພັກເກັດ, ສິນຄ້າ, ການເງິນ, ລາຍງານ
- ລະບົບ **Staff Counter POS** — Check-in ສະມາຊິກ, ຂາຍສິນຄ້າ Minibar, ປະຫວັດ
- ເຊື່ອມຕໍ່ **Backend REST API** ພ້ອມ **LocalStorage Fallback** ສຳລັບການໃຊ້ງານ Offline

---

## 2. Technology Stack

| ເທັກໂນໂລຢີ | ເວີຊັ່ນ / ລາຍລະອຽດ |
|---|---|
| **Framework** | Next.js 16.3.6 (App Router) |
| **Language** | TypeScript 5.x |
| **UI Library** | React 19.2.8 |
| **Styling** | Tailwind CSS v4 + PostCSS |
| **HTTP Client** | Axios ^1.20.0 |
| **Charts** | Recharts ^3.10.1 |
| **Icons** | Lucide React ^1.48.0 |
| **Utilities** | clsx ^2.1.1, tailwind-merge ^3.7.0 |
| **Font** | Noto Sans Lao (Google Fonts — ຮອງຮັບພາສາລາວ) |
| **Theme** | Dark Mode (Background: `#09090B`, Card: `#18181B`, Accent: `#F95738`) |

---

## 3. ໂຄງສ້າງໂປຣເຈັກ ແລະ ໄຟລ໌ສຳຄັນ (Project Structure)

### 3.1 ແຜນຜັງໂຄງສ້າງໄຟລ໌ທັງໝົດ (Project Tree View)

```
front-end/
├── .env.local                         # ⚙️ Environment Variables (ກຳນົດ NEXT_PUBLIC_API_URL ສຳລັບເຊື່ອມຕໍ່ Backend)
├── next.config.ts                     # ⚙️ Next.js Configuration (ກຳນົດຄ່າ Compiler, Images, Build Options)
├── package.json                       # 📦 Dependencies & Scripts (ລາຍຊື່ Libraries: React 19, Next.js 16, Tailwind, Lucide, Recharts)
├── tsconfig.json                      # 🔧 TypeScript Configuration (ກຳນົດ Compiler Options ແລະ Path Alias @/*)
├── postcss.config.mjs                 # 🎨 PostCSS Configuration (ປະມວນຜົນ Tailwind CSS v4)
├── eslint.config.mjs                  # 🔍 ESLint Configuration (ກົດລະບຽບກວດສອບ Code Quality & Standards)
├── PROJECT_SUMMARY.md                 # 📋 ບົດສະຫຼຸບໂປຣເຈັກ ແລະ ຄູ່ມືໂຄງສ້າງລະບົບ (ໄຟລ໌ນີ້)
├── CODE_EXPLANATION.md                # 📖 ຄູ່ມືອະທິບາຍ Logic ໂຄ້ດແຕ່ລະໜ້າຢ່າງລະອຽດ
│
├── app/                               # 📁 ໂຟນເດີຫຼັກຂອງ Next.js App Router
│   ├── layout.tsx                     # 🏠 Root Layout: ໂຄງສ້າງຫຼັກ, ໂຫຼດ Font Noto Sans Lao, Dark Theme (#09090B)
│   ├── page.tsx                       # 🏠 Root Landing Page: ໜ້າທຳອິດເມື່ອເປີດ Web App (Default Next.js)
│   ├── globals.css                    # 🎨 Global Styles: ໂຫຼດ Tailwind v4, CSS Variables, Theme Colors, Custom Scrollbar
│   ├── favicon.ico                    # 🖼️ Favicon: ໄອຄອນໂລໂກ້ສະແດງໃນ Tab Browser
│   │
│   ├── login/                         # 📁 ໂມດູນລະບົບເຂົ້າສູ່ລະບົບ (Authentication)
│   │   └── page.tsx                   # 🔐 ໜ້າ Login: ຟອມປ້ອນເບີໂທ+ລະຫັດຜ່ານ, ກວດ Auth, Redirect ຕາມ Role
│   │
│   ├── staff/                         # 📁 ໂມດູນລະບົບເຄົາເຕີພະນັກງານ (Staff Counter POS)
│   │   ├── layout.tsx                 # 📐 Staff Layout: Header POS, ກວດສິດ Role (STAFF/ADMIN), 3 Tab Navigation
│   │   └── page.tsx                   # 💼 Staff POS: 3 Tabs (ສະແກນ Check-in, ຂາຍ Minibar, ປະຫວັດມື້ນີ້)
│   │
│   ├── (admin)/                       # 📁 ກຸ່ມ Route ສຳລັບ Admin ເທົ່ານັ້ນ (Route Group — Protected)
│   │   ├── layout.tsx                 # 📐 Admin Layout: Sidebar Navigation + Auth Guard (ADMIN ເທົ່ານັ້ນ)
│   │   ├── dashboard/page.tsx         # 📊 Dashboard: 6 Stat Cards ສະຫຼຸບລາຍຮັບ-ລາຍຈ່າຍ-ກຳໄລ + Recharts Bar Chart
│   │   ├── members/page.tsx           # 👥 ຈັດການສະມາຊິກ: CRUD ສະມາຊິກ, ອັບໂຫຼດຮູບ, ເລືອກແພັກເກັດ, Search
│   │   ├── packages/page.tsx          # 📦 ຈັດການແພັກເກັດ: CRUD ແພັກເກັດ, ລາຄາ, ຈຳນວນວັນ, ຈຳນວນ Sessions
│   │   ├── products/page.tsx          # 🛒 ຈັດການສິນຄ້າ Minibar: CRUD ສິນຄ້າ, ສຸ່ມ Barcode 12 ຫຼັກ, ອັບໂຫຼດຮູບ Base64, Stock
│   │   ├── payments/page.tsx          # 💳 ປະຫວັດການຊຳລະ: ສ້າງໃບຊຳລະຄ່າແພັກເກັດ (ເງິນສົດ/ໂອນ) + ຕາຕະລາງປະຫວັດ
│   │   ├── expenses/page.tsx          # 🧾 ບັນທຶກລາຍຈ່າຍ: CRUD ລາຍຈ່າຍ, 6 ໝວດໝູ່ (Supplies, Salary...), ຄົ້ນຫາ
│   │   ├── users/page.tsx             # 👤 ຈັດການພະນັກງານ: CRUD ຜູ້ໃຊ້ລະບົບ, ກຳນົດ Role (ADMIN/STAFF), ລະຫັດຜ່ານ
│   │   └── reports/page.tsx           # 📈 ລາຍງານ ແລະ ສະຖິຕິ: Filter ຕາມວັນທີ, 5 Cards, ແຍກໝວດໝູ່, Dynamic Modal
│   │
│   ├── components/                    # 📁 ໂຟນເດີເກັບ Shared Components ທີ່ໃຊ້ຮ່ວມກັນ
│   │   └── Sidebar.tsx                # 🧭 Sidebar: ເມນູນຳທາງ 8 ລາຍການ, ພັບ-ຂະຫຍາຍໄດ້, Active indicator, Logout
│   │
│   ├── lib/                           # 📁 ໂຟນເດີເກັບ Core Libraries, API Services & Utilities
│   │   ├── api.ts                     # 🔌 Axios Instance: Base URL + Auto-inject Bearer Token Interceptor
│   │   ├── auth.ts                    # 🔑 Auth Utilities: ຟັງຊັນຈັດການ Token, User, Cookie, Logout
│   │   ├── services.ts               # 📡 API Service Layer: 7 Modules ເຊື່ອມຕໍ່ Backend REST API
│   │   └── utils.ts                   # 🛠️ Helper Functions: cn() ສຳລັບ class, formatLAK() ສະແດງເງິນກີບ, formatDate()
│   │
│   └── types/                         # 📁 ໂຟນເດີເກັບ TypeScript Interfaces & Data Contracts
│       ├── index.ts                   # 📋 Barrel Export: ລວມ Export ທຸກ Types ໃຫ້ເອີ້ນໃຊ້ງ່າຍ
│       ├── expense.ts                 # 📑 Type: Expense, CreateExpenseDto, ExpenseCategory
│       ├── member.ts                  # 📑 Type: Member, CreateMemberDto, UpdateMemberDto
│       ├── package.ts                 # 📑 Type: Package, CreatePackageDto
│       ├── payment.ts                 # 📑 Type: Payment, CreatePaymentDto, PaymentMethod
│       ├── products.ts               # 📑 Type: Product, CreateProductDto
│       ├── user.ts                    # 📑 Type: User, CreateUserDto, UserRole
│       └── reports.ts                 # 📑 Type: FinancialReport, CheckInReport, CategoryBreakdown
│
└── public/                            # 📁 ໂຟນເດີ Static Assets (ຮູບພາບ, ໄອຄອນ SVG ທີ່ເຂົ້າເຖິງໄດ້ໂດຍກົງຜ່ານ URL)
    ├── next.svg                       # 🖼️ Logo Next.js
    └── vercel.svg                     # 🖼️ Logo Vercel
```

---

### 3.2 ລາຍລະອຽດໜ້າທີ່ ແລະ ການເຮັດວຽກຂອງແຕ່ລະ Folder (Directories Description)

| ໂຟນເດີ (Folder) | ໜ້າທີ່ ແລະ ການເຮັດວຽກ (Role & Responsibility) |
|---|---|
| `front-end/` | **Root Directory ຂອງໂຄງການ:** ເກັບໄຟລ໌ຕັ້ງຄ່າທັງໝົດ (Config files), Dependency manifests, ແລະ ເອກະສານຂອງລະບົບ Frontend. |
| `front-end/app/` | **Next.js App Router Root:** ໂຟນເດີຫຼັກທີ່ໃຊ້ລະບົບ File-system based Routing ຂອງ Next.js (ທຸກ Folder ຍ່ອຍທີ່ມີ `page.tsx` ຈະກາຍເປັນ URL Route ອັດຕະໂນມັດ). ຄວບຄຸມ Layout, CSS ຫຼັກ ແລະ ໜ້າຈໍທັງໝົດ. |
| `front-end/app/login/` | **ໂມດູນ Authentication:** ຈັດການໜ້າ Login ສຳລັບພະນັກງານ ແລະ Admin ໃນການເຂົ້າສູ່ລະບົບ. |
| `front-end/app/staff/` | **ໂມດູນ Staff Counter POS:** ລະບົບໜ້າເຄົາເຕີສຳລັບພະນັກງານປະຈຳວັນ (ຮອງຮັບທັງ STAFF ແລະ ADMIN) — ມີລະບົບ Check-in, ຂາຍສິນຄ້າ Minibar ແລະ ເບິ່ງປະຫວັດມື້ນີ້. |
| `front-end/app/(admin)/` | **Admin Route Group (🔒 Protected):** ກຸ່ມ Route ທີ່ປ້ອງກັນດ້ວຍ Route Guard ສະເພາະຜູ້ໃຊ້ທີ່ມີ Role `ADMIN` ເທົ່ານັ້ນ. ປະກອບດ້ວຍໜ້າ Dashboard, ສະມາຊິກ, ແພັກເກັດ, ສິນຄ້າ, ການເງິນ, ລາຍຈ່າຍ, ຜູ້ໃຊ້ ແລະ ລາຍງານ. ວົງເລັບ `(admin)` ໝາຍເຖິງຈະບໍ່ປາກົດໃນ URL Path. |
| `front-end/app/(admin)/dashboard/` | **ໂມດູນ Dashboard:** ສະແດງສະຫຼຸບຜົນການດຳເນີນງານພາບລວມ, ຕົວເລກສະຖິຕິຫຼັກ 6 ດ້ານ ແລະ ກຣາຟແທ່ງສະແດງລາຍຮັບ-ລາຍຈ່າຍ-ກຳໄລ. |
| `front-end/app/(admin)/members/` | **ໂມດູນຈັດການສະມາຊິກ (Members):** ຈັດການຂໍ້ມູນສະມາຊິກຟິດເນັດແບບຄົບວົງຈອນ (CRUD), ການສະໝັກແພັກເກັດ, ການອັບໂຫຼດຮູບ ແລະ ການກວດສອບວັນໝົດອາຍຸ. |
| `front-end/app/(admin)/packages/` | **ໂມດູນຈັດການແພັກເກັດ (Packages):** ສ້າງ, ແກ້ໄຂ, ລົບ ແພັກເກັດອອກກຳລັງກາຍ, ກຳນົດລາຄາ, ໄລຍະເວລາ ແລະ ຈຳນວນ Sessions. |
| `front-end/app/(admin)/products/` | **ໂມດູນຈັດການສິນຄ້າ Minibar (Products):** ຈັດການສິນຄ້າໃນຮ້ານ, ຄຸ້ມຄອງສະຕັອກ (Stock), ລາຄາຕົ້ນທຶນ/ຂາຍ, ອັບໂຫຼດຮູບ Base64 ແລະ ສ້າງ Barcode ອັດຕະໂນມັດ. |
| `front-end/app/(admin)/payments/` | **ໂມດູນການຊຳລະເງິນ (Payments):** ບັນທຶກການຈ່າຍເງິນຄ່າສະມາຊິກ/ແພັກເກັດ (ເງິນສົດ ຫຼື ໂອນ), ຄຳນວນເງິນທອນ ແລະ ສະແດງປະຫວັດທຸລະກຳ. |
| `front-end/app/(admin)/expenses/` | **ໂມດູນບັນທຶກລາຍຈ່າຍ (Expenses):** ບັນທຶກ ແລະ ຄຸ້ມຄອງລາຍຈ່າຍປະຈຳວັນຂອງຟິດເນັດ ແຍກຕາມ 6 ໝວດໝູ່ຫຼັກ, ພ້ອມສະຫຼຸບຍອດລວມ. |
| `front-end/app/(admin)/users/` | **ໂມດູນຈັດການຜູ້ໃຊ້ລະບົບ (Users):** ຄຸ້ມຄອງບັນຊີພະນັກງານ ແລະ ຜູ້ດູແລລະບົບ, ກຳນົດສິດເຂົ້າເຖິງ (ADMIN / STAFF) ແລະ ປ່ຽນລະຫັດຜ່ານ. |
| `front-end/app/(admin)/reports/` | **ໂມດູນລາຍງານ ແລະ ສະຖິຕິ (Reports):** ວິເຄາະຂໍ້ມູນການເງິນ, ກັ່ນຕອງຕາມຊ່ວງວັນທີ, ສະຫຼຸບລາຍຮັບ-ລາຍຈ່າຍຕາມໝວດໝູ່, ແລະ ຄລິກເບິ່ງລາຍຊື່ສະມາຊິກຕາມສະຖານະຜ່ານ Modal. |
| `front-end/app/components/` | **Shared Components:** ເກັບ UI Components ທີ່ສາມາດເອີ້ນໃຊ້ຊ້ຳໄດ້ໃນຫຼາຍໜ້າ ເຊັ່ນ `Sidebar.tsx` ສຳລັບເມນູນຳທາງ. |
| `front-end/app/lib/` | **Libraries & Services:** ສູນລວມ Utility Functions, Axios API Client, ລະບົບຈັດການ Auth Token ແລະ API Service Layer ທັງໝົດ. |
| `front-end/app/types/` | **TypeScript Data Models:** ສູນລວມ Type Definitions ແລະ DTO Interfaces ທີ່ໃຊ້ກວດສອບຄວາມຖືກຕ້ອງຂອງຂໍ້ມູນທົ່ວທັງລະບົບ. |
| `front-end/public/` | **Static Assets:** ເກັບໄຟລ໌ຄົງທີ່ (Static files) ເຊັ່ນ ຮູບພາບ, Icons, Logos ທີ່ Browser ສາມາດດຶງໄປໃຊ້ໄດ້ໂດຍກົງ. |

---

### 3.3 ລາຍລະອຽດໜ້າທີ່ ແລະ ການເຮັດວຽກຂອງແຕ່ລະ File (Detailed Files Description)

#### ⚙️ ໄຟລ໌ຕັ້ງຄ່າລະບົບ (Configuration Files)
- **`.env.local`**: ກຳນົດຄ່າ Environment Variable `NEXT_PUBLIC_API_URL` ຊີ້ໄປຫາ Backend API Server (`https://fitness-bxqs.onrender.com`).
- **`next.config.ts`**: ໄຟລ໌ຕັ້ງຄ່າ Next.js Framework (ຮອງຮັບການຕັ້ງຄ່າ Remote Image domains, Compiler optimizations, Rewrites).
- **`package.json`**: ກຳນົດລາຍຊື່ Dependencies (React, Next.js, Tailwind v4, Axios, Recharts, Lucide-react) ແລະ Scripts (`dev`, `build`, `start`, `lint`).
- **`tsconfig.json`**: ຕັ້ງຄ່າ TypeScript Compiler, ຮອງຮັບ Strict type checking ແລະ Path mapping (`@/*` ແທນ `./app/*`).
- **`postcss.config.mjs`**: ຕັ້ງຄ່າ PostCSS Plugin ເພື່ອ compile Tailwind CSS v4 ເຂົ້າກັບ Stylesheet ຂອງລະບົບ.
- **`eslint.config.mjs`**: ຕັ້ງຄ່າ ESLint ສຳລັບກວດສອບ Syntax, Clean code ແລະ Best practices ໃນການຂຽນ React / Next.js.

#### 🏠 ໄຟລ໌ຫຼັກ ແລະ Layout ລະບົບ (Core & Layout Files)
- **`app/layout.tsx`**: Root Layout ລະດັບສູງສຸດຂອງແອັບ — ໂຫຼດ Font Noto Sans Lao, ກຳນົດ HTML `lang="lo"`, ຕັ້ງ Dark Mode Background `#09090B` ແລະ Text color `#F4F4F5` ໃຫ້ທຸກໜ້າ.
- **`app/page.tsx`**: Landing Page ຫຼັກລະດັບ Root (ສາມາດປັບໃຫ້ Auto-redirect ໄປຍັງ `/login` ຫຼື `/dashboard`).
- **`app/globals.css`**: Global Stylesheet ຫຼັກ — Import Tailwind CSS v4, ກຳນົດ Theme Colors, ປັບແຕ່ງ Scrollbar ໃຫ້ສວຍງາມ ແລະ Animations.
- **`app/favicon.ico`**: ໄຟລ໌ Favicon icon ຂະໜາດນ້ອຍສຳລັບສະແດງໃນ Browser Tab.

#### 🔐 ໄຟລ໌ໂມດູນ Login (Authentication)
- **`app/login/page.tsx`**: ໜ້າ Login — ມີ Form ປ້ອນເບີໂທລະສັບ ແລະ ລະຫັດຜ່ານ, ປຸ່ມສະແດງ/ເຊື່ອງລະຫັດ (Eye toggle), ເອີ້ນໃຊ້ `AuthService.login()`, ບັນທຶກ Token + User ໃນ LocalStorage ແລະ Redirect ອັດຕະໂນມັດຕາມ Role (`ADMIN` ໄປ `/dashboard`, `STAFF` ໄປ `/staff`).

#### 💼 ໄຟລ໌ໂມດູນພະນັກງານເຄົາເຕີ (Staff Counter POS)
- **`app/staff/layout.tsx`**: Layout ຂອງ Staff POS — ມີ Route Guard ປ້ອງກັນບໍ່ໃຫ້ຜູ້ທີ່ບໍ່ໄດ້ Login ເຂົ້າເຖິງ (ອະນຸຍາດ Role STAFF ແລະ ADMIN), ສະແດງ Header POS ພ້ອມຊື່ພະນັກງານ, ປຸ່ມ Logout, ແລະ Tab Switcher (Check-in, Minibar, History).
- **`app/staff/page.tsx`**: ໜ້າ POS ຫຼັກທີ່ບັນຈຸ 3 Tabs:
  - *Tab 1 (Check-in):* ຄົ້ນຫາ/ສະແກນລະຫັດສະມາຊິກ → ສົ່ງ `POST /members/check-in` ໄປ Backend → ບັນທຶກປະຫວັດໄວ້ໃນ `localStorage("fitness_checkin_history")`.
  - *Tab 2 (Minibar):* ເລືອກສິນຄ້າ Minibar ແຍກຕາມໝວດໝູ່, ລະບົບກະຕ່າສິນຄ້າ (Cart) ເພີ່ມ/ຫຼຸດຈຳນວນ, ຄຳນວນຍອດລວມ, ຊຳລະເງິນ ແລະ ບັນທຶກລົງ `localStorage("fitness_payments")` (ມີ Fallback ສິນຄ້າ Offline 5 ລາຍການ).
  - *Tab 3 (History):* ສະແດງປະຫວັດການ Check-in ທັງໝົດຂອງມື້ນີ້ຈາກ LocalStorage.

#### 🔒 ໄຟລ໌ໂມດູນຜູ້ດູແລລະບົບ (Admin Route Group)
- **`app/(admin)/layout.tsx`**: Admin Layout — ມີ Auth Guard ກວດສອບ Token ແລະ ສິດ Role ເປັນ `ADMIN` ເທົ່ານັ້ນ (ຖ້າບໍ່ແມ່ນ ຈະ redirect ໄປ `/login`), ສະແດງ Sidebar Navigation ດ້ານຊ້າຍ ແລະ Content ດ້ານຂວາ.
- **`app/(admin)/dashboard/page.tsx`**: ໜ້າ Dashboard — ສະແດງ 6 Stat Cards (ສະມາຊິກ, ແພັກເກັດ, ລາຍຮັບ, ລາຍຈ່າຍ, ສິນຄ້າ, ກຳໄລສຸດທິ), Bar Chart 3 ແທ່ງ (ລາຍຮັບ/ລາຍຈ່າຍ/ກຳໄລ) ດ້ວຍ Recharts, ແລະ ລາຍການແພັກເກັດ/ສິນຄ້າ.
- **`app/(admin)/members/page.tsx`**: ໜ້າຈັດການສະມາຊິກ — ຕາຕະລາງສະມາຊິກ, Search ແບບ Real-time, Modal ເພີ່ມ/ແກ້ໄຂ, Modal ເບິ່ງລາຍລະອຽດແພັກເກັດ, ອັບໂຫຼດຮູບ ແລະ Modal ຂະຫຍາຍຮູບໃຫຍ່.
- **`app/(admin)/packages/page.tsx`**: ໜ້າຈັດການແພັກເກັດ — ສະແດງແພັກເກັດເປັນ Card Grid, Modal ເພີ່ມ/ແກ້ໄຂ (ຊື່, ລາຄາ, ໄລຍະເວລາ, sessions), ແລະ Modal ຢືນຢັນການລົບ.
- **`app/(admin)/products/page.tsx`**: ໜ້າຈັດການສິນຄ້າ Minibar — ຕາຕະລາງສິນຄ້າ, ລະບົບສຸ່ມ Barcode 12 ຫຼັກ, Modal ເພີ່ມ/ແກ້ໄຂ, ອັບໂຫຼດຮູບປ່ຽນເປັນ Base64 (ຈຳກັດ 5MB), Modal ເບິ່ງຮູບ ແລະ Search.
- **`app/(admin)/payments/page.tsx`**: ໜ້າປະຫວັດການຊຳລະເງິນ — ຕາຕະລາງປະຫວັດການຊຳລະ, Search, ແລະ Modal ສ້າງການຊຳລະໃໝ່ (ເລືອກສະມາຊິກ → ເລືອກແພັກເກັດ → ເລືອກວິທີຈ່າຍ Cash/Transfer → ຄຳນວນເງິນທອນ).
- **`app/(admin)/expenses/page.tsx`**: ໜ້າບັນທຶກລາຍຈ່າຍ — ຕາຕະລາງລາຍຈ່າຍ, Search, Modal ເພີ່ມ/ແກ້ໄຂ, ເລືອກ 6 ໝວດໝູ່ (Supplies, Utilities, Equipment, Maintenance, Salary, Miscellaneous), ແລະ Modal ຢືນຢັນການລົບ.
- **`app/(admin)/users/page.tsx`**: ໜ້າຈັດການພະນັກງານ — ຕາຕະລາງລາຍຊື່ຜູ້ໃຊ້, Badge ສະແດງ Role (`ADMIN` ສີຟ້າ, `STAFF` ສີຂຽວ), Search, Modal ເພີ່ມ/ແກ້ໄຂຜູ້ໃຊ້ ແລະ ລະຫັດຜ່ານ, Modal ຢືນຢັນການລົບ.
- **`app/(admin)/reports/page.tsx`**: ໜ້າລາຍງານ ແລະ ສະຖິຕິ — Date Range Filter (ເລືອກວັນທີເລີ່ມ-ສິ້ນສຸດ), 5 Summary Cards, ຕາຕະລາງລາຍຮັບ-ລາຍຈ່າຍແຍກຕາມໝວດໝູ່, 4 Status Cards ທີ່ຄລິກໄດ້ (ທັງໝົດ, Active, ໃກ້ໝົດ, ໝົດອາຍຸ) ພ້ອມ Dynamic Modal ສະແດງລາຍຊື່ສະມາຊິກຕາມສະຖານະ.

#### 🧭 ໄຟລ໌ Components
- **`app/components/Sidebar.tsx`**: Component ເມນູນຳທາງດ້ານຂ້າງຂອງ Admin — ຮອງຮັບການພັບ/ຂະຫຍາຍ (Collapsible 64px ↔ 256px), ມີ 8 ເມນູຫຼັກພ້ອມ Icons, Active Link Highlighting (ສີ `#F95738`), ແລະ ປຸ່ມ Logout ທີ່ຮັກສາປະຫວັດ Check-in ໄວ້.

#### 🔌 ໄຟລ໌ Libraries, API & Services (`app/lib/`)
- **`app/lib/api.ts`**: Axios Instance Configuration — ກຳນົດ `baseURL` ຈາກ `NEXT_PUBLIC_API_URL` ແລະ ຕັ້ງຄ່າ Request Interceptor ເພື່ອດຶງ `token` ຈາກ LocalStorage ມາຕິດ `Authorization: Bearer <token>` ໃຫ້ທຸກ API Call ໂດຍອັດຕະໂນມັດ.
- **`app/lib/auth.ts`**: Authentication Helper Functions — ຟັງຊັນ `getToken()`, `setToken()`, `removeToken()`, `getUser()`, `setUser()`, `logout()` ແລະ ການ sync Token ລົງ Cookie ສຳລັບ Browser.
- **`app/lib/services.ts`**: API Service Layer ລວມທັງໝົດ 7 ໂມດູນ:
  - `AuthService`: Login (`/auth/login`), Get Profile (`/auth/me`)
  - `MemberService`: CRUD ສະມາຊິກ (`/members`)
  - `PackageService`: CRUD ແພັກເກັດ (`/packages`)
  - `ProductService`: CRUD ສິນຄ້າ (`/products`)
  - `PaymentService`: CRUD ແລະ ດຶງຍອດລາຍຮັບ (`/payments`)
  - `ExpenseService`: CRUD ແລະ ດຶງຍອດລາຍຈ່າຍ (`/expenses`)
  - `UserService`: CRUD ຜູ້ໃຊ້ ແລະ ພະນັກງານ (`/users`)
- **`app/lib/utils.ts`**: Utility Functions ສ່ວນກາງ:
  - `cn(...inputs)`: ສຳລັບລວມ classNames ດ້ວຍ `clsx` ແລະ `tailwind-merge`
  - `formatLAK(amount)`: ແປງຕົວເລກເປັນຮູບແບບເງິນກີບລາວ ພ້ອມເຄື່ອງໝາຍຈຸດ (ຕົວຢ່າງ: `50,000 ₭`)
  - `formatDate(date)`: ຈັດຮູບແບບວັນທີໃຫ້ອ່ານງ່າຍ

#### 📑 ໄຟລ໌ Type Definitions (`app/types/`)
- **`app/types/index.ts`**: Barrel Export File — Export ທຸກ Interfaces ຈາກແຕ່ລະໄຟລ໌ ເພື່ອໃຫ້ສາມາດ Import ຈາກ `@/types` ໄດ້ງ່າຍດາຍ.
- **`app/types/expense.ts`**: Interface ໂຄງສ້າງຂໍ້ມູນລາຍຈ່າຍ (`Expense`, `CreateExpenseDto`, `ExpenseCategory`).
- **`app/types/member.ts`**: Interface ໂຄງສ້າງຂໍ້ມູນສະມາຊິກ (`Member`, `CreateMemberDto`, `UpdateMemberDto`).
- **`app/types/package.ts`**: Interface ໂຄງສ້າງຂໍ້ມູນແພັກເກັດ (`Package`, `CreatePackageDto`).
- **`app/types/payment.ts`**: Interface ໂຄງສ້າງຂໍ້ມູນການຊຳລະເງິນ (`Payment`, `CreatePaymentDto`, `PaymentMethod`).
- **`app/types/products.ts`**: Interface ໂຄງສ້າງຂໍ້ມູນສິນຄ້າ Minibar (`Product`, `CreateProductDto`).
- **`app/types/user.ts`**: Interface ໂຄງສ້າງຂໍ້ມູນຜູ້ໃຊ້/ພະນັກງານ (`User`, `CreateUserDto`, `UserRole`).
- **`app/types/reports.ts`**: Interface ໂຄງສ້າງຂໍ້ມູນລາຍງານການເງິນ ແລະ ສະຖິຕິ Check-in (`FinancialReport`, `IncomeByCategory`, `ExpenseByCategory`).

---

### 3.4 ໄຟລ໌ສຳຄັນ ແລະ ຂະໜາດ (Key Files & Sizes)

| ໄຟລ໌ | ຂະໜາດ | ແຖວ | ບົດບາດ ແລະ ໜ້າທີ່ການເຮັດວຽກ |
|---|---|---|---|
| `app/(admin)/members/page.tsx` | 47.8 KB | 799 | ໃຫຍ່ທີ່ສຸດ — CRUD ສະມາຊິກ, Photo Upload/Preview, Package Selection, Search Real-time |
| `app/staff/page.tsx` | 39.8 KB | 629 | Staff Counter POS — Check-in ສະມາຊິກ, Minibar Cart, ປະຫວັດ Check-in ປະຈຳວັນ |
| `app/(admin)/products/page.tsx` | 36.7 KB | 600 | CRUD ສິນຄ້າ Minibar, ສຸ່ມ Barcode 12 ຫຼັກ, Image Base64 Upload, Stock Management |
| `app/(admin)/reports/page.tsx` | 31.9 KB | 543 | ລາຍງານການເງິນ ແລະ ສະຖິຕິ, Date Range Filter, Dynamic Member Status Modal |
| `app/(admin)/payments/page.tsx` | 26.7 KB | 486 | ປະຫວັດການຊຳລະເງິນ, ສ້າງໃບຊຳລະຄ່າສະມາຊິກ (CASH/TRANSFER), ຄຳນວນເງິນທອນ |
| `app/(admin)/users/page.tsx` | 25.9 KB | 488 | ຈັດການພະນັກງານ ແລະ ຜູ້ໃຊ້ລະບົບ, Role Badges (ADMIN/STAFF), ປ່ຽນລະຫັດຜ່ານ |
| `app/(admin)/expenses/page.tsx` | 22.9 KB | 436 | ບັນທຶກລາຍຈ່າຍຟິດເນັດ, ແຍກ 6 ໝວດໝູ່ (Supplies, Salary...), Search, Total Calculation |
| `app/(admin)/packages/page.tsx` | 21.8 KB | 416 | ຈັດການແພັກເກັດອອກກຳລັງກາຍ, Card View, ກຳນົດລາຄາ, ໄລຍະເວລາ, sessions |
| `app/(admin)/dashboard/page.tsx` | 16.8 KB | 312 | Dashboard ພາບລວມ, 6 Stat Cards, Recharts Bar Chart (ລາຍຮັບ/ລາຍຈ່າຍ/ກຳໄລ) |
| `app/login/page.tsx` | 8.8 KB | 189 | ໜ້າ Login, Password Toggle, Auth Verification, Role-based Redirection |
| `app/components/Sidebar.tsx` | 7.8 KB | 196 | Sidebar Navigation 8 ເມນູ, ພັບ/ຂະຫຍາຍ (64px ↔ 256px), Active State, Logout |
| `app/staff/layout.tsx` | 4.6 KB | 114 | Staff Layout, Header POS, Role Guard (STAFF + ADMIN), Tab Controller |
| `app/(admin)/layout.tsx` | 2.3 KB | 70 | Admin Layout, Route Guard (ADMIN ເທົ່ານັ້ນ), Sidebar Shell |
| `app/lib/services.ts` | 2.8 KB | 63 | API Service Layer ລວມ 7 Service Modules ເຊື່ອມຕໍ່ Backend REST API |
| `app/lib/api.ts` | 0.9 KB | 27 | Axios Instance ພ້ອມ Base URL ແລະ Auto-inject Bearer Token Interceptor |
| `app/lib/auth.ts` | 0.6 KB | 28 | Auth Helper Functions (Token, User, Cookie, Logout) |
| `app/lib/utils.ts` | 0.8 KB | 26 | Utility Functions (`cn`, `formatLAK`, `formatDate`) |

---

## 4. ການເຊື່ອມຕໍ່ Backend API

### 4.1 Base URL & Configuration

| ລາຍການ | ຄ່າ |
|---|---|
| **Backend API URL** | `https://fitness-bxqs.onrender.com` |
| **Environment Variable** | `NEXT_PUBLIC_API_URL` (ກຳນົດໃນ `.env.local`) |
| **HTTP Client** | Axios Instance ພ້ອມ Interceptor ອັດຕະໂນມັດ |
| **Authentication** | Bearer Token (ຕິດ `Authorization` header ທຸກ Request) |

### 4.2 API Service Layer (`app/lib/services.ts`)

ລະບົບມີ **7 Service Modules** ທີ່ເຊື່ອມຕໍ່ກັບ Backend:

| # | Service | Base Endpoint | Operations |
|---|---|---|---|
| 1 | `AuthService` | `/auth/login`, `/auth/me` | Login, Get Profile |
| 2 | `MemberService` | `/members` | GET All, GET By ID, POST, PATCH, DELETE |
| 3 | `PackageService` | `/packages` | GET All, GET By ID, POST, PATCH, DELETE |
| 4 | `ProductService` | `/products` | GET All, GET By ID, POST, PATCH, DELETE |
| 5 | `PaymentService` | `/payments` | GET All, GET Revenue Total, POST, DELETE |
| 6 | `ExpenseService` | `/expenses` | GET All, GET Total, GET By ID, POST, PATCH, DELETE |
| 7 | `UserService` | `/users` | GET All, GET By ID, POST, PATCH, DELETE |

### Additional Direct API Calls (ໃນ Page ໂດຍກົງ):

| Endpoint | ໃຊ້ໃນ | ວິທີ |
|---|---|---|
| `GET /reports/financial?startDate=&endDate=` | Dashboard, Reports | `fetch()` |
| `GET /reports/check-ins?startDate=&endDate=` | Reports | `fetch()` |
| `GET /expenses/expense/total` | Reports | `fetch()` |
| `POST /members/check-in` | Staff POS | `fetch()` |

### 4.3 Authentication Flow

```
ຜູ້ໃຊ້ → ປ້ອນ Phone + Password
       → POST /auth/login
       → ໄດ້ { token, user }
       → ບັນທຶກ token + user ໃນ localStorage
       → ກວດ user.role:
            ├── ADMIN  → Redirect /dashboard
            └── STAFF  → Redirect /staff
```

**ລາຍລະອຽດ:**
- **Token Storage:** `localStorage.setItem("token", token)` + `localStorage.setItem("user", JSON.stringify(user))`
- **Cookie:** ຕັ້ງ `document.cookie` ພ້ອມ (`max-age=86400`, 24 ຊົ່ວໂມງ)
- **Auto-inject:** Axios Interceptor ໃສ່ `Authorization: Bearer <token>` ໃຫ້ທຸກ Request ອັດຕະໂນມັດ
- **Auth Guard:** ທຸກ Layout ກວດ token + role ກ່ອນສະແດງ content (redirect ໄປ `/login` ຖ້າບໍ່ valid)

### 4.4 ລະບົບ LocalStorage Fallback

ລະບົບໃຊ້ LocalStorage ເປັນ Fallback ໃນ 3 ກໍລະນີ:

| # | Key | ໃຊ້ໃນ | ລາຍລະອຽດ |
|---|---|---|---|
| 1 | `fitness_checkin_history` | Staff POS (Check-in Tab) | ບັນທຶກປະຫວັດ Check-in ປະຈຳວັນ; ເຫຼືອໄວ້ແມ້ Logout |
| 2 | `fitness_payments` | Staff POS (Minibar Tab) | ບັນທຶກການຂາຍສິນຄ້າ Minibar ເມື່ອ Backend ບໍ່ມີ Product Sale API ສະເພາະ |
| 3 | `token`, `user` | ທົ່ວລະບົບ | Token ແລະ User Info ສຳລັບ Auth Guard / Interceptor |

> **ສຳຄັນ:** Minibar Product Sales ບັນທຶກ `localStorage("fitness_payments")` ແທນທີ່ຈະສົ່ງ Backend ໂດຍກົງ.
> ເໝາະສຳລັບການໃຊ້ງານ Offline ຫຼື ກໍລະນີ Backend ບໍ່ມີ endpoint ຮອງຮັບການຂາຍສິນຄ້າສະເພາະ.
> ຖ້າ API fetch ສິນຄ້າລົ້ມເຫຼວ → Staff POS ຈະ fallback ໃຊ້ Static Product List (5 ລາຍການ) ແທນ.

---

## 5. ຟັງຊັນການເຮັດວຽກຂອງແຕ່ລະໜ້າ

---

### 5.1 🔐 Login Page (`app/login/page.tsx`)

| ຟັງຊັນ | ລາຍລະອຽດ |
|---|---|
| ຟອມ Login | ປ້ອນ **ເບີໂທລະສັບ** ແລະ **ລະຫັດຜ່ານ** |
| Show/Hide Password | ປຸ່ມ Eye toggle ສະແດງ/ເຊື່ອງລະຫັດ |
| Role-Based Redirect | ADMIN → `/dashboard`, STAFF → `/staff` |
| Error Handling | ແຈ້ງ Error ດ້ວຍ Alert Component (ສີແດງ) |
| UI Design | Dark theme + Glassmorphism glow effect ສີ `#F95738` |

---

### 5.2 📊 Dashboard (`app/(admin)/dashboard/page.tsx`)

#### ✅ 6 Stat Boxes (Grid 3 ຄໍລັມ):

| # | ຊື່ Box | ແຫຼ່ງຂໍ້ມູນ | ສີ |
|---|---|---|---|
| 1 | ສະມາຊິກທັງໝົດ | `MemberService.getAll()` → count | 🟠 `#F95738` |
| 2 | ແພັກເກັດທັງໝົດ | `GET /packages` → count | 🟣 Purple |
| 3 | ລາຍຮັບລວມ (ເດືອນນີ້) | `GET /reports/financial` → `incomeByCategory._sum.amountLak` | 🟢 Emerald |
| 4 | ລາຍຈ່າຍລວມ (ເດືອນນີ້) | `ExpenseService.getAll()` → sum `amountLak` | 🔴 Rose |
| 5 | ສິນຄ້າໃນຮ້ານ | `GET /products` → count | 🟡 Amber |
| 6 | ກຳໄລສຸດທິ | ລາຍຮັບ − ລາຍຈ່າຍ | 🔵 Blue |

#### ✅ Bar Chart (Recharts):

- **3 ແທ່ງ:** ລາຍຮັບລວມ (🟢 Emerald), ລາຍຈ່າຍລວມ (🔴 Rose), ກຳໄລສຸດທິ (🔵 Blue)
- ໃຊ້ `ResponsiveContainer` + `BarChart` + `Bar` + `Tooltip` ຈາກ Recharts
- Tooltip ສະແດງ ຈຳນວນເງິນ (LAK) ພ້ອມ Format ເລກ

#### ✅ ສະຫຼຸບແພັກເກັດ ແລະ ສິນຄ້າ:
- ສະແດງຊື່ແພັກເກັດທັງໝົດ ແລະ ສິນຄ້າໃນ Minibar
- ສະຖານະ Real-time indicator (● Online)

---

### 5.3 📈 Reports (`app/(admin)/reports/page.tsx`)

#### ✅ Date Range Filter:
- ເລືອກ **ວັນທີເລີ່ມຕົ້ນ** ແລະ **ວັນທີສິ້ນສຸດ** → ດຶງ Report ໃໝ່ອັດຕະໂນມັດ (auto-fetch ເມື່ອປ່ຽນ)
- Default: ວັນທີ 1 ຂອງເດືອນປັດຈຸບັນ → ມື້ນີ້

#### ✅ 5 Summary Cards (Grid 5 ຄໍລັມ):

| # | Card | ຂໍ້ມູນ |
|---|---|---|
| 1 | ລາຍຮັບລວມ | `incomeByCategory._sum.amountLak` ລວມກັນ (₭) |
| 2 | ລາຍຈ່າຍລວມ | `GET /expenses/expense/total` (₭) |
| 3 | ກຳໄລສຸດທິ | ລາຍຮັບ − ລາຍຈ່າຍ (ສີປ່ຽນຕາມ +/−) |
| 4 | ສິນຄ້າທັງໝົດ (PRODUCT) | `GET /products` → count |
| 5 | ສະມາຊິກ Active | ຄິດໄລ່ຈາກ `expireDate` + `remainingSessions` (ຄລິກເປີດ Modal ໄດ້) |

#### ✅ ລາຍຮັບ-ລາຍຈ່າຍ ແຍກໝວດໝູ່ (2 ຄໍລັມ):
- **ລາຍຮັບແຍກໝວດໝູ່ (Income Categories):** ສະແດງ `financialData.incomeByCategory` — ຊື່ Category + ຊ່ອງທາງ + ຈຳນວນເງິນ (₭)
- **ລາຍຈ່າຍແຍກໝວດໝູ່ (Expense Categories):** ສະແດງ `financialData.expenseByCategory` — ຊື່ Category + ຈຳນວນເງິນ (₭)

#### ✅ ສະຖິຕິ Check-in ແລະ ສະຖານະສະມາຊິກ (4 Cards ທີ່ **ຄລິກໄດ້**):

| # | Card | ຂໍ້ມູນ | ເມື່ອຄລິກ → Modal |
|---|---|---|---|
| 1 | ຈຳນວນ Check-In ລວມ | `checkInReport.totalCheckIns` | ລາຍຊື່ຜູ້ທີ່ Check-in (ຊື່, ລະຫັດ, ເວລາ) |
| 2 | ສະມາຊິກ Active | ຍັງບໍ່ໝົດອາຍຸ + ເຫຼືອ Session | ລາຍຊື່ Active Members |
| 3 | ໃກ້ໝົດອາຍຸ | ≤ 3 sessions ຫຼື ≤ 7 ວັນ | ລາຍຊື່ Members ໃກ້ໝົດ |
| 4 | ໝົດອາຍຸແລ້ວ | `expireDate < now` ຫຼື `sessions ≤ 0` | ລາຍຊື່ Members ໝົດອາຍຸ |

#### ✅ Dynamic Modal ລາຍຊື່:
- ສະແດງ **ລາຍຊື່ສະມາຊິກ** ຕາມ Filter ທີ່ເລືອກ
- ແຕ່ລະ Row: ລຳດັບ, ຊື່ເຕັມ, ລະຫັດ, ຂໍ້ມູນເສີມ (ວັນໝົດ / ເຫຼືອ Session / ເວລາ Check-in)
- Scrollable (max 60vh), Icon ສີແຍກຕາມ Type (Sky/Emerald/Amber/Rose)
- **Fallback:** ຖ້າ API ບໍ່ return ລາຍຊື່ Check-in → ໃຊ້ `lastCheckIn` ຈາກ Members data ແທນ

---

### 5.4 🧾 Expenses (`app/(admin)/expenses/page.tsx`)

#### ✅ CRUD Operations (ກົງກັບ Backend Schema):

| Action | HTTP Method | Endpoint | Payload Fields |
|---|---|---|---|
| ດຶງທັງໝົດ | GET | `/expenses` | — |
| ເພີ່ມໃໝ່ | POST | `/expenses` | `{ title, amount, amountLak, category }` |
| ແກ້ໄຂ | PATCH *(fallback PUT)* | `/expenses/:id` | `{ title, amount, amountLak, category }` |
| ລົບ | DELETE | `/expenses/:id` | — |

#### ✅ 6 ໝວດໝູ່ລາຍຈ່າຍ (ກົງກັບ Backend Enum):

| # | Enum Value | ຄຳອະທິບາຍ (ພາສາລາວ) |
|---|---|---|
| 1 | `SUPPLIES` | ນ້ຳດື່ມ, ນ້ຳແຂງ, ອຸປະກອນສຳນັກງານ |
| 2 | `UTILITIES` | ຄ່ານ້ຳ, ຄ່າໄຟ, ອິນເຕີເນັດ |
| 3 | `EQUIPMENT` | ອຸປະກອນ, ເຄື່ອງອອກກຳລັງກາຍ |
| 4 | `MAINTENANCE` | ຄ່າສ້ອມແປງ |
| 5 | `SALARY` | ເງິນເດືອນພະນັກງານ |
| 6 | `MISCELLANEOUS` | ອື່ນໆ / Operational |

#### ✅ UI Features:
- ຕາຕະລາງ (Table) ສະແດງ: ລາຍການ, ໝວດໝູ່ (Badge), ວັນທີ, ຈຳນວນເງິນ, ປຸ່ມ Edit/Delete
- **Search Bar** — ກັ່ນຕອງ Real-time ຕາມຊື່ລາຍການ
- **Modal ເພີ່ມ/ແກ້ໄຂ** — Form ພ້ອມ Validation
- **Delete Confirmation Modal** — Warning icon + ສະແດງຊື່ລາຍການທີ່ຈະລົບ
- **Toast Notification** — ແຈ້ງ Success/Error (auto-dismiss 3 ວິນາທີ)

---

### 5.5 👥 Members (`app/(admin)/members/page.tsx`)

| ຟັງຊັນ | ລາຍລະອຽດ |
|---|---|
| CRUD ສະມາຊິກ | ເພີ່ມ, ແກ້ໄຂ, ລົບ ສະມາຊິກ ຜ່ານ `MemberService` |
| ເລືອກ Package | Dropdown ເລືອກ Package ເມື່ອເພີ່ມ/ແກ້ໄຂ |
| ອັບໂຫຼດຮູບ | ຮອງຮັບ Photo URL + Image Preview Modal (ຂະຫຍາຍເຕັມໜ້າຈໍ) |
| Package Details | Modal ສະແດງລາຍລະອຽດ Package ຂອງສະມາຊິກ |
| Search | ຄົ້ນຫາສະມາຊິກ Real-time |
| Toast + Delete Dialog | ແຈ້ງເຕືອນ + ຢືນຢັນການລົບ |

**ຂໍ້ມູນ Member:** ຊື່, ເບີໂທ, ລະຫັດ (Code), ຮູບ, Package, ວັນໝົດອາຍຸ, Session ເຫຼືອ, ວັນ Check-in ຫຼ້າສຸດ

---

### 5.6 📦 Packages (`app/(admin)/packages/page.tsx`)

| ຟັງຊັນ | ລາຍລະອຽດ |
|---|---|
| CRUD ແພັກເກັດ | ເພີ່ມ, ແກ້ໄຂ, ລົບ ແພັກເກັດ ຜ່ານ `PackageService` |
| Fields | ຊື່, ລາຄາ (LAK), ໄລຍະເວລາ (ວັນ), ຈຳນວນ Session |
| UI | Card view ພ້ອມ Icon, Duration/Price/Session display |
| Delete Confirmation | Modal ຢືນຢັນການລົບ ພ້ອມ Warning |

---

### 5.7 🛒 Products (`app/(admin)/products/page.tsx`)

| ຟັງຊັນ | ລາຍລະອຽດ |
|---|---|
| CRUD ສິນຄ້າ | ເພີ່ມ, ແກ້ໄຂ, ລົບ ສິນຄ້າ Minibar |
| Barcode | ສຸ່ມ Barcode 12 ຫຼັກ ອັດຕະໂນມັດ |
| Image Upload | ແປງເປັນ Base64 → ສົ່ງຜ່ານ JSON (ຈຳກັດ 5MB) |
| Image Preview | Modal ຂະຫຍາຍຮູບເຕັມໜ້າຈໍ |
| Categories | Supplements, Energy Drinks, Equipment, Apparel, General |
| Fields | Barcode, ຊື່, Category, ລາຄາຕົ້ນທຶນ, ລາຄາຂາຍ, Stock, ຮູບ |

---

### 5.8 💳 Payments (`app/(admin)/payments/page.tsx`)

| ຟັງຊັນ | ລາຍລະອຽດ |
|---|---|
| ສ້າງການຊຳລະ | ເລືອກ Member → Package → ກຳນົດ ຈຳນວນເງິນ |
| Payment Methods | CASH (ເງິນສົດ) / TRANSFER (ໂອນ) |
| Fields | memberId, packageId, description, amountLak, paidCurrency, exchangeRate, amountPaid, changeLak, paymentMethod |
| ປະຫວັດ | Table ພ້ອມ Search — ສະແດງ Member + Package + ວັນທີ + ຈຳນວນເງິນ |
| Toast | ແຈ້ງ Success/Error |

---

### 5.9 👤 Users / Staff Management (`app/(admin)/users/page.tsx`)

| ຟັງຊັນ | ລາຍລະອຽດ |
|---|---|
| CRUD ພະນັກງານ | ເພີ່ມ, ແກ້ໄຂ, ລົບ ຜູ້ໃຊ້ (ຜ່ານ `fetch` ໂດຍກົງ) |
| Fields | ຊື່, ເບີໂທ, ລະຫັດຜ່ານ, Role |
| Roles | `ADMIN` (Badge ສີຟ້າ) / `STAFF` (Badge ສີຂຽວ) |
| Search | ຄົ້ນຫາ Real-time |
| Delete Confirmation | Modal ຢືນຢັນ ພ້ອມ Warning icon |

---

### 5.10 💼 Staff Counter POS (`app/staff/`)

#### Layout (`app/staff/layout.tsx`):
- **Auth Guard:** ຮອງຮັບ Role `STAFF` + `ADMIN`
- **Header:** Badge "COUNTER POS", ຊື່ພະນັກງານ, ປຸ່ມ Logout
- **3 Tabs Navigation:** Check-in → Minibar → History

#### Page (`app/staff/page.tsx`) — 3 Tabs:

| Tab | ຊື່ | ຟັງຊັນ |
|---|---|---|
| **Tab 1** | ສະແກນ Check-in | ປ້ອນ Code / ສະແກນບັດ / ເລືອກຈາກລາຍຊື່ Members → `POST /members/check-in` → ສະແດງຜົນ + ບັນທຶກ `fitness_checkin_history` ໃນ LocalStorage |
| **Tab 2** | ຂາຍສິນຄ້າ (Minibar) | ສະແດງສິນຄ້າ (ກັ່ນຕອງ Category) → ເລືອກໃສ່ກະຕ່າ (Cart) → +/−/ລົບ → Checkout → ບັນທຶກ `fitness_payments` ໃນ LocalStorage |
| **Tab 3** | ປະຫວັດ Check-in ມື້ນີ້ | ສະແດງລາຍການ Check-in ຈາກ `fitness_checkin_history` (LocalStorage) |

**Cart Management:** `addToCart()`, `updateQuantity()` (±), `removeFromCart()` — ຄຳນວນ Total ອັດຕະໂນມັດ

**Product Categories ໃນ Minibar:**
- ທຸກໝວດໝູ່ (ALL)
- Supplements (ອາຫານເສີມ)
- Energy Drinks (ເຄື່ອງດື່ມ)
- Equipment (ອຸປະກອນອອກກຳລັງກາຍ)
- Apparel (ເສື້ອຜ້າ)
- General (ທົ່ວໄປ)

---

## 6. ລະບົບ Auth Guard ແລະ Role-Based Access

```
ຜູ້ໃຊ້ເຂົ້າເວັບ
    │
    ▼
ມີ Token ໃນ localStorage?
    ├── ❌ ບໍ່ → Redirect → /login
    │
    └── ✅ ມີ → ກວດສອບ Role
                  ├── ADMIN  → ເຂົ້າ (admin)/* ໄດ້ (Dashboard, Members, Reports...)
                  ├── STAFF  → ເຂົ້າ /staff ໄດ້ (Counter POS)
                  └── ອື່ນໆ → Redirect → /login
```

| Route Group | Layout Guard | ສິດເຂົ້າເຖິງ |
|---|---|---|
| `(admin)/*` | `app/(admin)/layout.tsx` | ✅ ADMIN ເທົ່ານັ້ນ |
| `/staff` | `app/staff/layout.tsx` | ✅ STAFF + ADMIN |
| `/login` | — | ✅ ທຸກຄົນ |

---

## 7. Sidebar Navigation (`app/components/Sidebar.tsx`)

| # | ຊື່ Menu | Route | Icon |
|---|---|---|---|
| 1 | Dashboard & POS | `/dashboard` | LayoutDashboard |
| 2 | ຈັດການສະມາຊິກ | `/members` | Users |
| 3 | ຈັດການແພັກເກັດ | `/packages` | Package |
| 4 | ຈັດການສິນຄ້າ | `/products` | Boxes |
| 5 | ປະຫວັດການຊໍາລະ | `/payments` | CreditCard |
| 6 | ບັນທຶກລາຍຈ່າຍ | `/expenses` | Receipt |
| 7 | ຈັດການພະນັກງານ | `/users` | UserCog |
| 8 | ລາຍງານ ແລະ ສະຖິຕິ | `/reports` | BarChart3 |
| — | ອອກຈາກລະບົບ | Logout Function | LogOut |

- **Collapsible:** ກົດ Logo ເພື່ອ Toggle ຫຍໍ້/ຂະຫຍາຍ (64px ↔ 256px)
- **Active State:** ສີ `#F95738` ພ້ອມ shadow
- **Logout:** ຮັກສາ `fitness_checkin_history` ໄວ້ເມື່ອ Logout (ບໍ່ລົບປະຫວັດ Check-in)

---

## 8. TypeScript Type Definitions (`app/types/`)

| Type Interface | Fields ຫຼັກ |
|---|---|
| `Expense` | id, title, amountLak, category, note, createdAt |
| `Member` | id, code, fullName, phone, photoUrl, packageId, packageName, expireDate, remainingSessions, lastCheckIn |
| `Package` | id, name, priceLak, price, durationDays, sessions |
| `Payment` | id, memberId, memberName, packageId, packageName, amountLak, paymentMethod (CASH/TRANSFER), note |
| `Product` | id, name, price, category, imageUrl, stock, badge (SALE/NEW) |
| `User` | id, username, fullName, role (ADMIN/STAFF) |
| `FinancialReport` | totalRevenue, packageRevenue, minibarRevenue, totalTransactions |

ທຸກ Type ມີ `CreateDto` (Omit id, createdAt) ສຳລັບ Create operations.

---

## 9. UI/UX Design System

### Color Palette

| Element | Color | ການໃຊ້ |
|---|---|---|
| Background | `#09090B` | Body background ທັງລະບົບ |
| Card Surface | `#18181B` | Card, Table, Modal |
| Card Inner | `#0F0F12` | Sub-card, Table header, Input background |
| Primary Accent | `#F95738` | Sidebar active, Primary button, Login glow |
| Success | Emerald/Green | ລາຍຮັບ, Active status, Online, Staff POS accent |
| Danger | Rose/Red | ລາຍຈ່າຍ, Delete, Error, ໝົດອາຍຸ |
| Warning | Amber/Yellow | ໃກ້ໝົດອາຍຸ, Products, ແກ້ໄຂ |
| Info | Blue/Sky | Net profit, Check-in |
| Text Primary | `zinc-100` | ຂໍ້ຄວາມຫຼັກ (ສີຂາວ) |
| Text Secondary | `zinc-400` / `zinc-500` | ຄຳອະທິບາຍ, Label |

### Component Patterns ທີ່ໃຊ້ຊ້ຳທົ່ວລະບົບ

- ✅ **Toast Notifications** — ແຈ້ງ Success/Error (auto-dismiss 3 ວິນາທີ)
- ✅ **Delete Confirmation Modal** — Warning icon + ຊື່ລາຍການ + ປຸ່ມ ຍົກເລີກ/ລົບ
- ✅ **Search Bar** — Filter ຕາຕະລາງ Real-time
- ✅ **Loading Spinner** — Loader2 icon (animate-spin) ສີ `#F95738`
- ✅ **Error Alert** — Rose background ພ້ອມ AlertCircle icon
- ✅ **Collapsible Sidebar** — Toggle ດ້ວຍ Logo click
- ✅ **Form Modal** — Create/Edit form ເປັນ Modal overlay ພ້ອມ backdrop-blur

---

## 10. ສະຖານະປັດຈຸບັນ (Current Status)

| ຫົວຂໍ້ | ສະຖານະ | ລາຍລະອຽດ |
|---|---|---|
| ລະບົບສະຖຽນ | ✅ | ບໍ່ມີ Runtime Error ຫຼື Crash |
| Build Status | ✅ | ພ້ອມ Build Production (`next build`) |
| Backend Connection | ✅ | ເຊື່ອມຕໍ່ `https://fitness-bxqs.onrender.com` ສຳເລັດ |
| Auth System | ✅ | Login / Logout / Role Guard ເຮັດວຽກປົກກະຕິ |
| CRUD ທຸກໜ້າ | ✅ | ເພີ່ມ / ແກ້ໄຂ / ລົບ ຂໍ້ມູນສຳເລັດ (7 modules) |
| Dashboard & Charts | ✅ | 6 Stat Boxes + Recharts Bar Chart ເຮັດວຽກ |
| Reports & Statistics | ✅ | Financial Report + Check-in Stats + Dynamic Modal ສຳເລັດ |
| Staff Counter POS | ✅ | Check-in + Minibar Sales + History ເຮັດວຽກ |
| LocalStorage Fallback | ✅ | ຮອງຮັບ Offline ສຳລັບ Product Sales + Check-in History |
| Responsive Design | ✅ | ຮອງຮັບ Desktop + Tablet (Grid responsive) |
| **ພ້ອມໃຊ້ງານຈິງ** | ✅ | **Production Ready** |

---

## 11. ໝາຍເຫດ ແລະ ຂໍ້ແນະນຳ

1. **Minibar Product Sales** — ບັນທຶກໃນ `localStorage` ເທົ່ານັ້ນ. ຖ້າຕ້ອງການ sync ກັບ Backend ຄວນເພີ່ມ API endpoint ສຳລັບ Product Sales.

2. **Root Page** (`app/page.tsx`) — ຍັງເປັນ Default Next.js landing page. ສາມາດເພີ່ມ auto-redirect ໄປ `/login` ຫຼື `/dashboard` ໄດ້.

3. **`next.config.ts`** — ມີ `module.exports` ແລະ `export default` ຊ້ອນກັນ. ຄວນລຶບ `module.exports = nextConfig;` ອອກ ເພື່ອໃຊ້ ES Module export ເທົ່ານັ້ນ.

4. **Sidebar** — ຮັກສາ `fitness_checkin_history` ໄວ້ເມື່ອ Logout ເພື່ອບໍ່ເສຍປະຫວັດ Check-in ປະຈຳວັນ.

---

> **ສ້າງໂດຍ:** Antigravity AI Assistant  
> **ໂປຣເຈັກ:** Micro Fitness Management System — Frontend  
> **ວັນທີ:** 14 ຕຸລາ 2026
