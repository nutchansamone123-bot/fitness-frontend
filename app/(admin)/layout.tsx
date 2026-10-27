"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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

            if (userRole !== "ADMIN") {
                if (userRole === "STAFF") {
                    router.replace("/staff");
                } else {
                    router.replace("/login");
                }
                return;
            }

            setAuthorized(true);
        } catch (err) {
            console.error("Auth check error:", err);
            router.replace("/login");
        }
    }, [router]);

    if (!authorized) {
        return (
            <div className="min-h-screen bg-[#09090B] flex items-center justify-center text-zinc-400">
                <div className="flex items-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin text-[#F95738]" />
                    <span>ກຳລັງກວດສອບສິດການເຂົ້າເຖິງ...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#09090B] text-zinc-100 font-sans antialiased">
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
            <main className="flex-1 overflow-y-auto p-8 transition-all duration-300">
                <div className="max-w-7xl mx-auto font-sans">{children}</div>
            </main>
        </div>
    );
}