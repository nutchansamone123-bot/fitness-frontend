"use client";

import { useEffect, useState } from "react";
import { MemberService, ExpenseService } from "../../lib/services";
import {
    Users,
    CreditCard,
    TrendingUp,
    Receipt,
    ArrowUpRight,
    ArrowDownRight,
    Loader2,
    AlertCircle,
    Package,
    Layers
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
    CartesianGrid
} from "recharts";

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalMembers: 0,
        monthlyRevenue: 0,
        monthlyExpense: 0,
        totalProducts: 0,
        totalPackages: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const todayStr = new Date().toISOString().split('T')[0];
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const token = typeof window !== "undefined"
                    ? sessionStorage.getItem("token") || sessionStorage.getItem("accessToken") || localStorage.getItem("token") || localStorage.getItem("accessToken")
                    : null;

                const headers = {
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                };

                const [membersRes, financialRes, expensesRes, productsRes, packagesRes] = await Promise.all([
                    MemberService.getAll().catch(() => ({ data: [] })),
                    fetch(`https://fitness-bxqs.onrender.com/reports/financial?startDate=${firstDayOfMonth}&endDate=${todayStr}`, { headers }).then(res => res.json()).catch(() => null),
                    ExpenseService.getAll().catch(() => ({ data: [] })),
                    fetch("https://fitness-bxqs.onrender.com/products", { headers })
                        .then(res => res.json())
                        .catch(() => []),
                    fetch("https://fitness-bxqs.onrender.com/packages", { headers })
                        .then(res => res.json())
                        .catch(() => [])
                ]);

                const members = (membersRes as any)?.data || membersRes || [];
                const expenses = (expensesRes as any)?.data || expensesRes || [];
                const products = Array.isArray(productsRes) ? productsRes : productsRes.products || [];
                const pkgs = Array.isArray(packagesRes) ? packagesRes : packagesRes.packages || packagesRes.data || [];

                let calculatedRevenue = 0;
                if (financialRes?.incomeByCategory && Array.isArray(financialRes.incomeByCategory)) {
                    calculatedRevenue = financialRes.incomeByCategory.reduce((sum: number, item: any) => {
                        return sum + Number(item._sum?.amountLak || 0);
                    }, 0);
                }

                const totalExpense = Array.isArray(expenses)
                    ? expenses.reduce((sum: number, item: any) => sum + (Number(item.amountLak) || Number(item.amountPaid) || Number(item.amount) || 0), 0)
                    : 0;

                setStats({
                    totalMembers: Array.isArray(members) ? members.length : 0,
                    monthlyRevenue: calculatedRevenue,
                    monthlyExpense: totalExpense,
                    totalProducts: products.length,
                    totalPackages: pkgs.length,
                });
            } catch (err: any) {
                console.error("Failed to fetch dashboard data:", err);
                setError("ບໍ່ສາມາດດຶງຂໍ້ມູນສະຫຼຸບຜົນໄດ້");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Formatter สำหรับแกน Y ให้ดูง่าย (เช่น 10M, 500k)
    const formatYAxis = (value: number) => {
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(0)}M`;
        }
        if (value >= 1000) {
            return `${(value / 1000).toFixed(0)}k`;
        }
        return value.toString();
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-zinc-400">
                <Loader2 className="w-8 h-8 animate-spin text-[#F95738]" />
                <span className="text-sm">ກຳລັງໂຫຼດຂໍ້ມູນ Dashboard...</span>
            </div>
        );
    }

    const netProfit = stats.monthlyRevenue - stats.monthlyExpense;

    // ຂໍ້ມູນສຳລັບ BarChart
    const chartData = [
        { name: "ລາຍຮັບລວມ", amount: stats.monthlyRevenue, color: "#10B981" },
        { name: "ລາຍຈ່າຍລວມ", amount: stats.monthlyExpense, color: "#F43F5E" },
        { name: "ກຳໄລສຸດທິ", amount: netProfit, color: "#3B82F6" },
    ];

    return (
        <div className="space-y-6 font-sans">
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                    ພາບລວມລະບົບ (Dashboard)
                </h1>
                <p className="text-sm text-zinc-400">
                    ສະຫຼຸບລາຍຮັບ-ລາຍຈ່າຍ, ແພັກເກັດ, ສະຖິຕິສະມາຊິກ ແລະ ສິນຄ້າທັງໝົດ
                </p>
            </div>

            {error && (
                <div className="flex items-center gap-2 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* 6 Boxes ສະຖິຕິ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="bg-[#18181B] border border-zinc-800 p-4 rounded-xl flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                            ສະມາຊິກທັງໝົດ
                        </span>
                        <div className="p-2 bg-[#F95738]/10 rounded-lg text-[#F95738]">
                            <Users className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <h3 className="text-xl font-bold text-white">
                            {stats.totalMembers.toLocaleString()}
                        </h3>
                        <p className="text-[11px] text-zinc-500 mt-0.5">ຄົນໃນລະບົບ</p>
                    </div>
                </div>

                <div className="bg-[#18181B] border border-zinc-800 p-4 rounded-xl flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                            ແພັກເກັດທັງໝົດ
                        </span>
                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                            <Layers className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <h3 className="text-xl font-bold text-purple-400">
                            {stats.totalPackages.toLocaleString()}
                        </h3>
                        <p className="text-[11px] text-zinc-500 mt-0.5">ແພັກເກັດໃນລະບົບ</p>
                    </div>
                </div>

                <div className="bg-[#18181B] border border-zinc-800 p-4 rounded-xl flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                            ລາຍຮັບລວມ
                        </span>
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                            <TrendingUp className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <h3 className="text-lg font-bold text-emerald-400">
                            {stats.monthlyRevenue.toLocaleString()} <span className="text-[11px] font-normal text-zinc-400">LAK</span>
                        </h3>
                        <p className="text-[11px] text-emerald-500/80 flex items-center gap-0.5 mt-0.5">
                            <ArrowUpRight className="w-3 h-3" />
                            <span>ລາຍຮັບທັງໝົດເດືອນນີ້</span>
                        </p>
                    </div>
                </div>

                <div className="bg-[#18181B] border border-zinc-800 p-4 rounded-xl flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                            ລາຍຈ່າຍລວມ
                        </span>
                        <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400">
                            <Receipt className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <h3 className="text-lg font-bold text-rose-400">
                            {stats.monthlyExpense.toLocaleString()} <span className="text-[11px] font-normal text-zinc-400">LAK</span>
                        </h3>
                        <p className="text-[11px] text-rose-500/80 flex items-center gap-0.5 mt-0.5">
                            <ArrowDownRight className="w-3 h-3" />
                            <span>ລາຍຈ່າຍທັງໝົດເດືອນນີ້</span>
                        </p>
                    </div>
                </div>

                <div className="bg-[#18181B] border border-zinc-800 p-4 rounded-xl flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                            ສິນຄ້າໃນຮ້ານ
                        </span>
                        <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                            <Package className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <h3 className="text-xl font-bold text-amber-400">
                            {stats.totalProducts.toLocaleString()}
                        </h3>
                        <p className="text-[11px] text-zinc-500 mt-0.5">ລາຍການສິນຄ້າ</p>
                    </div>
                </div>

                <div className="bg-[#18181B] border border-zinc-800 p-4 rounded-xl flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                            ກຳໄລສຸດທິ
                        </span>
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                            <CreditCard className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <h3 className="text-lg font-bold text-white">
                            {netProfit.toLocaleString()}{" "}
                            <span className="text-[11px] font-normal text-zinc-400">LAK</span>
                        </h3>
                        <p className="text-[11px] text-zinc-500 mt-0.5">ລາຍຮັບ - ລາຍຈ່າຍ</p>
                    </div>
                </div>
            </div>

            {/* Bar Chart Section (ຂະຫຍາຍເຕັມ) */}
            <div className="bg-[#18181B] border border-zinc-800 p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-[#F95738]" />
                        <span>ກຣາບແທ່ງ (Bar Chart) ສະຫຼຸບການເງິນປະຈຳເດືອນ</span>
                    </h3>
                    <span className="text-xs text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">Real-time</span>
                </div>

                <div className="h-[300px] w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                            <XAxis dataKey="name" stroke="#A1A1AA" fontSize={13} tickLine={false} />
                            <YAxis
                                stroke="#A1A1AA"
                                fontSize={12}
                                tickLine={false}
                                tickFormatter={formatYAxis}
                            />
                            <Tooltip
                                cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                                contentStyle={{
                                    backgroundColor: "#09090B",
                                    borderColor: "#27272A",
                                    borderRadius: "12px",
                                    color: "#FFFFFF",
                                    padding: "12px 16px",
                                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)"
                                }}
                                formatter={(value: any) => [
                                    <span key="val" className="font-bold text-white">
                                        {Number(value || 0).toLocaleString()} LAK
                                    </span>,
                                    "ຈຳນວນເງິນ"
                                ]}
                                labelStyle={{ color: "#F95738", fontWeight: "bold", marginBottom: "4px" }}
                            />
                            <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}