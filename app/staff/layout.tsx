"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QrCode, ShoppingCart, History, Lock, LogOut, Loader2 } from "lucide-react";

export default function StaffLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const [staffName, setStaffName] = useState("ພະນັກງານ");

    useEffect(() => {
        try {
            const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
            const userStr = localStorage.getItem("user");

            if (!token || !userStr) {
                router.replace("/login");
                return;
            }

            const user = JSON.parse(userStr);
            const userRole = user?.role?.toUpperCase();

            if (userRole !== "STAFF" && userRole !== "ADMIN") {
                router.replace("/login");
                return;
            }

            setStaffName(user?.name || user?.username || "ພະນັກງານ");
            setAuthorized(true);
        } catch (err) {
            console.error("Auth check error:", err);
            router.replace("/login");
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.clear();
        router.replace("/login");
    };

    if (!authorized) {
        return (
            <div className="min-h-screen bg-[#09090B] flex items-center justify-center text-zinc-400">
                <div className="flex items-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                    <span>ກຳລັງກວດສອບສິດການເຂົ້າເຖິງ...</span>
                </div>
            </div>
        );
    }

    const navItems = [
        { id: "checkin", name: "1. ສະແກນ Check-in", icon: QrCode },
        { id: "minibar", name: "2. ຂາຍສິນຄ້າ (Product Sales)", icon: ShoppingCart },
        { id: "history", name: "3. ປະຫວັດ Check-in ມື້ນີ້", icon: History },
    ];

    return (
        <div className="min-h-screen bg-[#09090B] text-zinc-100 font-sans antialiased flex flex-col">
            {/* Header */}
            <header className="bg-[#121215] border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-500/20">
                        COUNTER POS
                    </div>
                    <h1 className="text-lg font-bold text-white tracking-wide">Micro Fitness Hub</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <div className="text-xs text-zinc-400">ພະນັກງານດູແລ</div>
                        <div className="text-sm font-semibold text-white">{staffName}</div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 px-3 py-2 rounded-xl text-xs font-medium transition-colors border border-rose-500/20 cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" />
                        ອອກຈາກລະບົບ
                    </button>
                </div>
            </header>

            {/* Sub-Navigation Tabs */}
            <div className="bg-[#121215]/60 border-b border-zinc-800/60 px-6 py-2">
                <div className="max-w-7xl mx-auto flex overflow-x-auto gap-2 no-scrollbar">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const currentTab = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("tab") || "checkin" : "checkin";
                        const isActive = currentTab === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    const params = new URLSearchParams(window.location.search);
                                    params.set("tab", item.id);
                                    window.history.pushState({}, "", `?${params.toString()}`);
                                    window.dispatchEvent(new Event("popstate"));
                                }}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all shrink-0 cursor-pointer ${isActive
                                    ? "bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20 font-bold"
                                    : "bg-[#18181B] text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800/80"
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{item.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-6">
                {children}
            </main>
        </div>
    );
}