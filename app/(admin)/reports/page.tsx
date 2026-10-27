"use client";

import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Loader2, AlertCircle, Wallet, UserCheck, UserX, Clock, Package, X, AlertTriangle } from "lucide-react";
import { MemberService } from "@/lib/services";

export default function ReportsPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [financialData, setFinancialData] = useState<any>(null);
    const [checkInReport, setCheckInReport] = useState<any>(null);
    const [totalRevenue, setTotalRevenue] = useState<number>(0);
    const [totalExpense, setTotalExpense] = useState<number>(0);
    const [productsList, setProductsList] = useState<any[]>([]);

    // Dynamic Modal State (ຮອງຮັບທັງສະມາຊິກ ແລະ ສິນຄ້າ)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalType, setModalType] = useState<"checkin" | "active" | "expiring" | "expired" | "expiring_products" | "out_of_stock">("checkin");
    const [modalLoading, setModalLoading] = useState(false);
    const [modalMemberList, setModalMemberList] = useState<any[]>([]);

    const [calculatedStats, setCalculatedStats] = useState({
        activeMembers: 0,
        expiringSoonCount: 0,
        expiredMembers: 0,
        totalCheckIns: 0,
        expiringProductsCount: 0,
        outOfStockCount: 0,
    });

    const todayStr = new Date().toISOString().split('T')[0];
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

    const [startDate, setStartDate] = useState(firstDayOfMonth);
    const [endDate, setEndDate] = useState(todayStr);

    const fetchReports = async () => {
        setLoading(true);
        setError("");
        try {
            const token = typeof window !== "undefined"
                ? sessionStorage.getItem("token") || sessionStorage.getItem("accessToken") || localStorage.getItem("token") || localStorage.getItem("accessToken")
                : null;

            const headers = {
                ...(token ? { "Authorization": `Bearer ${token}` } : {})
            };

            const [resFinancial, resCheckIns, resExpense, resMembers, resProducts] = await Promise.all([
                fetch(`https://fitness-bxqs.onrender.com/reports/financial?startDate=${startDate}&endDate=${endDate}`, { headers }),
                fetch(`https://fitness-bxqs.onrender.com/reports/check-ins?startDate=${startDate}&endDate=${endDate}`, { headers }),
                fetch(`https://fitness-bxqs.onrender.com/expenses/expense/total`, { headers }),
                MemberService.getAll().catch(() => []),
                fetch(`https://fitness-bxqs.onrender.com/products`, { headers }).then(res => res.json()).catch(() => [])
            ]);

            if (!resFinancial.ok || !resCheckIns.ok) {
                throw new Error("ບໍ່ສາມາດດຶງຂໍ້ມູນລາຍງານໄດ້");
            }

            const financialJson = await resFinancial.json();
            const checkInsJson = await resCheckIns.json();

            setFinancialData(financialJson);
            setCheckInReport(checkInsJson);

            // ຈັດການຂໍ້ມູນສິນຄ້າ
            const fetchedProducts = Array.isArray(resProducts) ? resProducts : resProducts.products || resProducts.data || [];
            setProductsList(fetchedProducts);

            let expiringProdCount = 0;
            let outStockCount = 0;

            fetchedProducts.forEach((p: any) => {
                const stock = Number(p.stock ?? 0);
                if (stock === 0) {
                    outStockCount++;
                } else if (stock <= 5) {
                    expiringProdCount++;
                }
            });

            let backendRevenue = 0;
            if (financialJson?.incomeByCategory && Array.isArray(financialJson.incomeByCategory)) {
                backendRevenue = financialJson.incomeByCategory.reduce((sum: number, item: any) => {
                    return sum + Number(item._sum?.amountLak || 0);
                }, 0);
            }

            setTotalRevenue(backendRevenue);

            if (resExpense.ok) {
                const expenseJson = await resExpense.json();
                const finalExpense = expenseJson.totalExpense ?? expenseJson.total ?? 0;
                setTotalExpense(Number(finalExpense) || 0);
            }

            const membersList = (resMembers as any)?.data || resMembers || [];
            const now = new Date();
            let active = 0;
            let expiringSoon = 0;
            let expired = 0;

            membersList.forEach((m: any) => {
                const expDate = m.expireDate ? new Date(m.expireDate) : null;
                const remaining = m.remainingSessions ?? 1;

                const isExpiredByDate = expDate && expDate < now;
                const isExpiredBySessions = remaining <= 0;

                if (isExpiredByDate || isExpiredBySessions) {
                    expired++;
                } else {
                    active++;
                    let isExpiring = false;
                    if (remaining > 0 && remaining <= 3) {
                        isExpiring = true;
                    } else if (expDate) {
                        const diffDays = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                        if (diffDays >= 0 && diffDays <= 7) {
                            isExpiring = true;
                        }
                    }

                    if (isExpiring) {
                        expiringSoon++;
                    }
                }
            });

            const stats = checkInsJson?.stats || checkInsJson || {};
            const totalCheckInsValue = stats.totalCheckInsInPeriod ?? stats.totalCheckIns ?? stats.total ?? stats.count ?? 0;

            setCalculatedStats({
                activeMembers: membersList.length > 0 ? active : (stats.activeMembers || 0),
                expiringSoonCount: membersList.length > 0 ? expiringSoon : (stats.expiringSoonCount || 0),
                expiredMembers: membersList.length > 0 ? expired : (stats.expiredMembers || 0),
                totalCheckIns: totalCheckInsValue,
                expiringProductsCount: expiringProdCount,
                outOfStockCount: outStockCount,
            });

        } catch (err: any) {
            console.error("Failed to fetch reports:", err);
            setError("ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນລາຍງານ");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = async (type: "checkin" | "active" | "expiring" | "expired" | "expiring_products" | "out_of_stock") => {
        setModalType(type);
        setIsModalOpen(true);
        setModalLoading(true);

        const titles = {
            checkin: "ລາຍຊື່ຜູ້ທີ່ Check-In ໃນຊ່ວງເວລານີ້",
            active: "ລາຍຊື່ສະມາຊິກ Active (ຍັງໃຊ້ງານຢູ່)",
            expiring: "ລາຍຊື່ສະມາຊິກໃກ້ໝົດອາຍຸ",
            expired: "ລາຍຊື່ສະມາຊິກໝົດອາຍຸແລ້ວ",
            expiring_products: "ລາຍຊື່ສິນຄ້າໃກ້ຈະໝົດ (Stock <= 5)",
            out_of_stock: "ລາຍຊື່ສິນຄ້າທີ່ໝົດແລ້ວ (Stock = 0)",
        };
        setModalTitle(titles[type]);

        try {
            if (type === "expiring_products" || type === "out_of_stock") {
                const filtered = productsList
                    .filter((p: any) => {
                        const stock = Number(p.stock ?? 0);
                        if (type === "out_of_stock") return stock === 0;
                        return stock > 0 && stock <= 5;
                    })
                    .map((p: any) => ({
                        fullName: p.name,
                        code: `ID: ${p.id} | Barcode: ${p.barcode || "-"}`,
                        subInfo: `Stock: ${p.stock ?? 0} ຊິ້ນ`
                    }));
                setModalMemberList(filtered);
                setModalLoading(false);
                return;
            }

            const token = typeof window !== "undefined"
                ? sessionStorage.getItem("token") || sessionStorage.getItem("accessToken") || localStorage.getItem("token") || localStorage.getItem("accessToken")
                : null;
            const headers = { ...(token ? { "Authorization": `Bearer ${token}` } : {}) };

            const resMembers = await MemberService.getAll().catch(() => []);
            const membersList = (resMembers as any)?.data || resMembers || [];
            const now = new Date();

            if (type === "checkin") {
                const res = await fetch(`https://fitness-bxqs.onrender.com/reports/check-ins?startDate=${startDate}&endDate=${endDate}`, { headers });
                let fetchedList: any[] = [];
                if (res.ok) {
                    const data = await res.json();
                    fetchedList = data.history || data.checkIns || data.data || data.details || data.recentCheckIns || [];
                }

                if (!Array.isArray(fetchedList) || fetchedList.length === 0) {
                    const start = new Date(startDate);
                    const end = new Date(endDate);
                    end.setHours(23, 59, 59, 999);

                    fetchedList = membersList
                        .filter((m: any) => {
                            if (!m.lastCheckIn) return false;
                            const checkInDate = new Date(m.lastCheckIn);
                            return checkInDate >= start && checkInDate <= end;
                        })
                        .sort((a: any, b: any) => new Date(b.lastCheckIn).getTime() - new Date(a.lastCheckIn).getTime())
                        .map((m: any) => ({
                            fullName: m.fullName,
                            code: m.code,
                            subInfo: m.lastCheckIn ? new Date(m.lastCheckIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'
                        }));
                } else {
                    fetchedList = fetchedList.map((item: any) => ({
                        fullName: item.fullName || item.memberName || 'ສະມາຊິກ',
                        code: item.code || item.memberCode || 'N/A',
                        subInfo: item.checkInTime ? new Date(item.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (item.time || '')
                    }));
                }
                setModalMemberList(fetchedList);

            } else {
                let filtered: any[] = [];

                membersList.forEach((m: any) => {
                    const expDate = m.expireDate ? new Date(m.expireDate) : null;
                    const remaining = m.remainingSessions ?? 1;

                    const isExpiredByDate = expDate && expDate < now;
                    const isExpiredBySessions = remaining <= 0;

                    const subInfoText = expDate
                        ? `ໝົດອາຍຸ: ${new Date(expDate).toLocaleDateString()}`
                        : `ເຫຼືອ: ${m.remainingSessions ?? 'N/A'} ຄັ້ງ`;

                    if (type === "expired") {
                        if (isExpiredByDate || isExpiredBySessions) {
                            filtered.push({ fullName: m.fullName, code: m.code, subInfo: subInfoText });
                        }
                    } else if (type === "active") {
                        if (!isExpiredByDate && !isExpiredBySessions) {
                            filtered.push({ fullName: m.fullName, code: m.code, subInfo: subInfoText });
                        }
                    } else if (type === "expiring") {
                        if (!isExpiredByDate && !isExpiredBySessions) {
                            let isExpiring = false;
                            if (remaining > 0 && remaining <= 3) {
                                isExpiring = true;
                            } else if (expDate) {
                                const diffDays = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                                if (diffDays >= 0 && diffDays <= 7) isExpiring = true;
                            }
                            if (isExpiring) {
                                filtered.push({ fullName: m.fullName, code: m.code, subInfo: subInfoText });
                            }
                        }
                    }
                });

                setModalMemberList(filtered);
            }
        } catch (err) {
            console.error("Failed to load modal details:", err);
        } finally {
            setModalLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [startDate, endDate]);

    const netProfit = totalRevenue - totalExpense;

    return (
        <div className="space-y-6 font-sans relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                        <BarChart3 className="w-7 h-7 text-[#F95738]" />
                        ລາຍງານ ແລະ ສະຖິຕິລວມ
                    </h1>
                    <p className="text-sm text-zinc-400">
                        ສະຫຼຸບຍອດລາຍຮັບ, ລາຍຈ່າຍ ແລະ ສະຖິຕິສະມາຊິກປະຈຳວັນທີທີ່ເລືອກ
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-[#18181B] border border-zinc-800 px-3 py-1.5 rounded-xl text-sm text-white">
                        <span className="text-zinc-400 text-xs">ຈາກ:</span>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="bg-transparent text-white focus:outline-none text-xs cursor-pointer [color-scheme:dark]"
                        />
                        <span className="text-zinc-400 text-xs">ຫາ:</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="bg-transparent text-white focus:outline-none text-xs cursor-pointer [color-scheme:dark]"
                        />
                    </div>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Summary Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="bg-[#18181B] border border-zinc-800 p-5 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-zinc-400">
                        <span className="text-xs uppercase font-semibold">ລາຍຮັບລວມ</span>
                        <DollarSign className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="text-xl font-bold text-emerald-400">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `${totalRevenue.toLocaleString()} ₭`}
                    </div>
                </div>

                <div className="bg-[#18181B] border border-zinc-800 p-5 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-zinc-400">
                        <span className="text-xs uppercase font-semibold">ລາຍຈ່າຍລວມ</span>
                        <DollarSign className="w-5 h-5 text-rose-400" />
                    </div>
                    <div className="text-xl font-bold text-rose-400">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `${totalExpense.toLocaleString()} ₭`}
                    </div>
                </div>

                <div className="bg-[#18181B] border border-zinc-800 p-5 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-zinc-400">
                        <span className="text-xs uppercase font-semibold">ກຳໄລສຸດທິ</span>
                        <Wallet className="w-5 h-5 text-sky-400" />
                    </div>
                    <div className={`text-xl font-bold ${netProfit >= 0 ? 'text-sky-400' : 'text-rose-400'}`}>
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `${netProfit.toLocaleString()} ₭`}
                    </div>
                </div>

                {/* 📌 Card ເພີ່ມໃໝ່: ສິນຄ້າໃກ້ຈະໝົດ */}
                <div
                    onClick={() => handleOpenModal("expiring_products")}
                    className="bg-[#18181B] border border-zinc-800 p-5 rounded-2xl space-y-2 cursor-pointer hover:border-amber-500 transition-all group"
                >
                    <div className="flex items-center justify-between text-zinc-400">
                        <span className="text-xs uppercase font-semibold group-hover:text-amber-400 transition-colors">ສິນຄ້າໃກ້ຈະໝົດ</span>
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="text-xl font-bold text-amber-400">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `${calculatedStats.expiringProductsCount} ລາຍການ`}
                    </div>
                </div>

                {/* 📌 Card ເພີ່ມໃໝ່: ສິນຄ້າໝົດແລ້ວ */}
                <div
                    onClick={() => handleOpenModal("out_of_stock")}
                    className="bg-[#18181B] border border-zinc-800 p-5 rounded-2xl space-y-2 cursor-pointer hover:border-rose-500 transition-all group"
                >
                    <div className="flex items-center justify-between text-zinc-400">
                        <span className="text-xs uppercase font-semibold group-hover:text-rose-400 transition-colors">ສິນຄ້າໝົດແລ້ວ</span>
                        <Package className="w-5 h-5 text-rose-400" />
                    </div>
                    <div className="text-xl font-bold text-rose-400">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `${calculatedStats.outOfStockCount} ລາຍການ`}
                    </div>
                </div>

                <div
                    onClick={() => handleOpenModal("active")}
                    className="bg-[#18181B] border border-zinc-800 p-5 rounded-2xl space-y-2 cursor-pointer hover:border-amber-500 transition-all group"
                >
                    <div className="flex items-center justify-between text-zinc-400">
                        <span className="text-xs uppercase font-semibold group-hover:text-amber-400 transition-colors">ສະມາຊິກ Active</span>
                        <Users className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="text-xl font-bold text-white">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `${calculatedStats.activeMembers} ຄົນ`}
                    </div>
                </div>
            </div>

            {/* Detailed Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#18181B] border border-zinc-800 p-6 rounded-2xl space-y-4">
                    <h3 className="text-base font-bold text-white flex items-center justify-between">
                        <span>ລາຍຮັບແຍກຕາມໝວດໝູ່ (Income Categories)</span>
                        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">Income</span>
                    </h3>
                    {loading ? (
                        <div className="flex items-center justify-center py-8 text-zinc-400 gap-2">
                            <Loader2 className="w-5 h-5 animate-spin text-[#F95738]" />
                            <span>ກຳລັງໂຫຼດ...</span>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {financialData?.incomeByCategory && financialData.incomeByCategory.length > 0 ? (
                                financialData.incomeByCategory.map((item: any, idx: number) => (
                                    <div key={idx} className="bg-[#0F0F12] border border-zinc-800 p-3.5 rounded-xl flex items-center justify-between text-sm">
                                        <div>
                                            <div className="font-semibold text-white">{item.category || 'ບໍ່ລະບຸໝວດໝູ່'}</div>
                                            {item.paymentMethod && <div className="text-xs text-zinc-400">ຊ່ອງທາງ: {item.paymentMethod}</div>}
                                        </div>
                                        <div className="font-bold text-emerald-400">
                                            {Number(item._sum?.amountLak || 0).toLocaleString()} ₭
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-zinc-500 text-center py-6">ບໍ່ມີຂໍ້ມູນລາຍຮັບໃນຊ່ວງເວລານີ້</div>
                            )}
                        </div>
                    )}
                </div>

                <div className="bg-[#18181B] border border-zinc-800 p-6 rounded-2xl space-y-4">
                    <h3 className="text-base font-bold text-white flex items-center justify-between">
                        <span>ລາຍຈ່າຍແຍກຕາມໝວດໝູ່ (Expense Categories)</span>
                        <span className="text-xs font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md">Expense</span>
                    </h3>
                    {loading ? (
                        <div className="flex items-center justify-center py-8 text-zinc-400 gap-2">
                            <Loader2 className="w-5 h-5 animate-spin text-[#F95738]" />
                            <span>ກຳລັງໂຫຼດ...</span>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {financialData?.expenseByCategory && financialData.expenseByCategory.length > 0 ? (
                                financialData.expenseByCategory.map((item: any, idx: number) => (
                                    <div key={idx} className="bg-[#0F0F12] border border-zinc-800 p-3.5 rounded-xl flex items-center justify-between text-sm">
                                        <div>
                                            <div className="font-semibold text-white">{item.category || 'ບໍ່ລະບຸໝວດໝູ່'}</div>
                                        </div>
                                        <div className="font-bold text-rose-400">
                                            {Number(item._sum?.amountLak || 0).toLocaleString()} ₭
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-zinc-500 text-center py-6">ບໍ່ມີຂໍ້ມູນລາຍຈ່າຍໃນຊ່ວງເວລານີ້</div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Check-In Stats Structure */}
            <div className="bg-[#18181B] border border-zinc-800 p-6 rounded-2xl space-y-4">
                <h3 className="text-base font-bold text-white flex items-center justify-between">
                    <span>ສະຖິຕິການເຊັກອິນ ແລະ ສະຖານະສະມາຊິກ</span>
                    <span className="text-xs font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-md">Check-Ins & Members</span>
                </h3>
                {loading ? (
                    <div className="flex items-center justify-center py-8 text-zinc-400 gap-2">
                        <Loader2 className="w-5 h-5 animate-spin text-[#F95738]" />
                        <span>ກຳລັງໂຫຼດ...</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div
                            onClick={() => handleOpenModal("checkin")}
                            className="bg-[#0F0F12] border border-zinc-800 p-4 rounded-xl flex items-center gap-3 cursor-pointer hover:border-sky-500 transition-all group"
                        >
                            <div className="p-3 bg-sky-500/10 rounded-xl text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-all">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-xs text-zinc-400 group-hover:text-sky-400 transition-colors">ຈຳນວນ Check-In ລວມ</div>
                                <div className="text-lg font-bold text-white mt-0.5">{calculatedStats.totalCheckIns} ຄັ້ງ</div>
                            </div>
                        </div>

                        <div
                            onClick={() => handleOpenModal("active")}
                            className="bg-[#0F0F12] border border-zinc-800 p-4 rounded-xl flex items-center gap-3 cursor-pointer hover:border-emerald-500 transition-all group"
                        >
                            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                <UserCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-xs text-zinc-400 group-hover:text-emerald-400 transition-colors">ສະມາຊິກ Active</div>
                                <div className="text-lg font-bold text-white mt-0.5">{calculatedStats.activeMembers} ຄົນ</div>
                            </div>
                        </div>

                        <div
                            onClick={() => handleOpenModal("expiring")}
                            className="bg-[#0F0F12] border border-zinc-800 p-4 rounded-xl flex items-center gap-3 cursor-pointer hover:border-amber-500 transition-all group"
                        >
                            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-all">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-xs text-zinc-400 group-hover:text-amber-400 transition-colors">ໃກ້ໝົດອາຍຸ</div>
                                <div className="text-lg font-bold text-white mt-0.5">{calculatedStats.expiringSoonCount} ຄົນ</div>
                            </div>
                        </div>

                        <div
                            onClick={() => handleOpenModal("expired")}
                            className="bg-[#0F0F12] border border-zinc-800 p-4 rounded-xl flex items-center gap-3 cursor-pointer hover:border-rose-500 transition-all group"
                        >
                            <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-all">
                                <UserX className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-xs text-zinc-400 group-hover:text-rose-400 transition-colors">ໝົດອາຍຸແລ້ວ</div>
                                <div className="text-lg font-bold text-white mt-0.5">{calculatedStats.expiredMembers} ຄົນ</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Dynamic Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-[#18181B] border border-zinc-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                {modalType === "checkin" && <Calendar className="w-5 h-5 text-sky-400" />}
                                {modalType === "active" && <UserCheck className="w-5 h-5 text-emerald-400" />}
                                {modalType === "expiring" && <Clock className="w-5 h-5 text-amber-400" />}
                                {modalType === "expired" && <UserX className="w-5 h-5 text-rose-400" />}
                                {modalType === "expiring_products" && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                                {modalType === "out_of_stock" && <Package className="w-5 h-5 text-rose-400" />}
                                <span>{modalTitle}</span>
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-zinc-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {modalLoading ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-3 text-zinc-400">
                                <Loader2 className="w-8 h-8 animate-spin text-[#F95738]" />
                                <span className="text-sm">ກຳລັງໂຫຼດລາຍຊື່...</span>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                                {modalMemberList.length === 0 ? (
                                    <div className="text-center py-10 text-zinc-500 text-sm">
                                        ບໍ່ມີລາຍຊື່ໃນໝວດໝູ່ນີ້
                                    </div>
                                ) : (
                                    modalMemberList.map((item, idx) => (
                                        <div key={idx} className="bg-[#0F0F12] border border-zinc-800 p-3.5 rounded-xl flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center font-bold justify-center text-xs ${modalType === "checkin" ? "bg-sky-500/10 text-sky-400" :
                                                        modalType === "active" ? "bg-emerald-500/10 text-emerald-400" :
                                                            modalType === "expiring" ? "bg-amber-500/10 text-amber-400" :
                                                                modalType === "expired" ? "bg-rose-500/10 text-rose-400" :
                                                                    modalType === "expiring_products" ? "bg-amber-500/10 text-amber-400" : "bg-rose-500/10 text-rose-400"
                                                    }`}>
                                                    {idx + 1}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-white">{item.fullName || 'ບໍ່ມີຊື່'}</div>
                                                    <div className="text-xs text-zinc-400">{item.code || 'N/A'}</div>
                                                </div>
                                            </div>
                                            <div className={`text-xs font-mono font-bold ${modalType === "expiring_products" ? "text-amber-400" :
                                                    modalType === "out_of_stock" ? "text-rose-400" : "text-zinc-400"
                                                }`}>
                                                {item.subInfo}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        <div className="flex justify-end pt-2 border-t border-zinc-800">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-semibold rounded-xl transition-all"
                            >
                                ປິດ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}