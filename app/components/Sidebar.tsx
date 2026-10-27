"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Package,
    CreditCard,
    Receipt,
    UserCog,
    LogOut,
    Dumbbell,
    BarChart3,
    Boxes
} from "lucide-react";

const menuItems = [
    { name: "Dashboard & POS", href: "/dashboard", icon: LayoutDashboard },
    { name: "ຈັດການສະມາຊິກ", href: "/members", icon: Users },
    { name: "ຈັດການແພັກເກັດ", href: "/packages", icon: Package },
    { name: "ຈັດການສິນຄ້າ", href: "/products", icon: Boxes },
    { name: "ປະຫວັດການຊໍາລະ", href: "/payments", icon: CreditCard },
    { name: "ບັນທຶກລາຍຈ່າຍ", href: "/expenses", icon: Receipt },
    { name: "ຈັດການພະນັກງານ", href: "/users", icon: UserCog },
    { name: "ລາຍງານ ແລະ ສະຖິຕິ", href: "/reports", icon: BarChart3 },
];

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        const savedHistory = localStorage.getItem("fitness_checkin_history") || sessionStorage.getItem("fitness_checkin_history");

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        if (savedHistory) {
            localStorage.setItem("fitness_checkin_history", savedHistory);
        }

        router.push("/login");
    };

    return (
        <aside className={`transition-all duration-300 bg-[#0F0F12] border-r border-zinc-800 text-zinc-300 flex flex-col h-screen sticky top-0 ${isCollapsed ? 'w-20' : 'w-64'}`}>
            {/* Header / Brand: ກົດທີ່ໂລໂກ້ເພື່ອປິດ-ເປີດ Sidebar */}
            <div
                onClick={onToggle}
                className="p-6 border-b border-zinc-800/80 flex items-center gap-3 cursor-pointer hover:bg-zinc-800/40 transition-colors"
                title="ຄລິກເພື່ອປິດ-ເປີດ Sidebar"
            >
                <div className="p-2 bg-[#F95738] text-white rounded-xl shadow-lg shadow-[#F95738]/20 shrink-0">
                    <Dumbbell className="w-6 h-6" />
                </div>
                {!isCollapsed && (
                    <div className="overflow-hidden whitespace-nowrap">
                        <h1 className="font-bold text-lg text-white tracking-wide">FITNESS</h1>
                        <p className="text-xs text-zinc-500 font-medium">Admin & Counter POS</p>
                    </div>
                )}
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto overflow-x-hidden">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={isCollapsed ? item.name : ""}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                    ? "bg-[#F95738] text-white shadow-md shadow-[#F95738]/25"
                                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                                }`}
                        >
                            <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "text-zinc-400"}`} />
                            {!isCollapsed && <span className="truncate">{item.name}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile & Logout */}
            <div className="p-4 border-t border-zinc-800/80">
                <button
                    onClick={handleLogout}
                    title={isCollapsed ? "ອອກຈາກລະບົບ" : ""}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                    <LogOut className="w-5 h-5 shrink-0" />
                    {!isCollapsed && <span className="truncate">ອອກຈາກລະບົບ</span>}
                </button>
            </div>
        </aside>
    );
}