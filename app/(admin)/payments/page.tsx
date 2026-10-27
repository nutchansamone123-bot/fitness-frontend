"use client";

import { useEffect, useState } from "react";
import { Payment } from "../../types/payment";
import { Member } from "../../types/member";
import { Package } from "../../types/package";
import { PaymentService, MemberService, PackageService } from "../../lib/services";
import {
    CreditCard,
    Plus,
    Search,
    Calendar,
    User,
    Package as PackageIcon,
    Loader2,
    AlertCircle,
    X,
    CheckCircle2,
} from "lucide-react";

export default function PaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);

    // Toast Notification State
    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
        show: false,
        message: "",
        type: 'success',
    });

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast((prev) => ({ ...prev, show: false }));
        }, 3000);
    };

    // ປັບປຸງ State ໃຫ້ມີຟິວຄົບຖ້ວນຕາມ JSON ທີ່ຕ້ອງການ
    const [formData, setFormData] = useState({
        memberId: "",
        packageId: "",
        description: "ຊຳລະຄ່າແພັກເກັດ",
        amountLak: "",
        paidCurrency: "LAK",
        exchangeRate: 1,
        amountPaid: "",
        changeLak: 0,
        paymentMethod: "CASH",
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        setError("");
        try {
            const [paymentsRes, membersRes, packagesRes] = await Promise.all([
                PaymentService.getAll(),
                MemberService.getAll(),
                PackageService.getAll(),
            ]);
            setPayments((paymentsRes as any).data || paymentsRes || []);
            setMembers((membersRes as any).data || membersRes || []);
            setPackages((packagesRes as any).data || packagesRes || []);
        } catch (err: unknown) {
            console.error("Failed to fetch payments data:", err);
            setError("ບໍ່ສາມາດດຶງຂໍ້ມູນການຊຳລະເງິນໄດ້ ຫຼື API ເກີດຂໍ້ຜິດພາດ");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        if (name === "packageId") {
            const selectedPkg = packages.find((p) => p.id === Number(value));
            const price = selectedPkg ? String(selectedPkg.priceLak || selectedPkg.price || 0) : formData.amountLak;
            setFormData((prev) => ({
                ...prev,
                packageId: value,
                amountLak: price,
                amountPaid: price, // ໃຫ້ຈຳນວນເງິນຈ່າຍຕົງກັນອັດຕະໂນມັດ
                description: selectedPkg ? `ຊຳລະຄ່າແພັກເກັດ ${selectedPkg.name}` : prev.description
            }));
        } else if (name === "amountLak" || name === "amountPaid") {
            const numVal = value;
            setFormData((prev) => ({
                ...prev,
                [name]: numVal,
                ...(name === "amountLak" ? { amountPaid: numVal } : {})
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.memberId || !formData.amountLak) return;

        const amount = Number(formData.amountLak);
        const amountPaidVal = Number(formData.amountPaid || formData.amountLak);

        if (isNaN(amount) || amount <= 0) {
            showToast("ກະລຸນາປ້ອນຈຳນວນເງິນໃຫ້ຖືກຕ້ອງ", "error");
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                memberId: Number(formData.memberId),
                packageId: formData.packageId ? Number(formData.packageId) : null,
                description: formData.description,
                amountLak: amount,
                paidCurrency: formData.paidCurrency,
                exchangeRate: Number(formData.exchangeRate),
                amountPaid: amountPaidVal,
                changeLak: Number(formData.changeLak),
                paymentMethod: formData.paymentMethod,
            };

            await PaymentService.create(payload);

            await fetchInitialData();
            setIsModalOpen(false);
            setFormData({
                memberId: "",
                packageId: "",
                description: "ຊຳລະຄ່າແພັກເກັດ",
                amountLak: "",
                paidCurrency: "LAK",
                exchangeRate: 1,
                amountPaid: "",
                changeLak: 0,
                paymentMethod: "CASH",
            });
            showToast("ບັນທຶກການຊຳລະເງິນສຳເລັດ!");
        } catch (err: unknown) {
            console.error("Failed to process payment:", err);
            showToast("ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກການຊຳລະເງິນ", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const filteredPayments = payments.filter((item: any) => {
        const term = searchTerm.toLowerCase();
        const memberName = (item.memberName || item.member?.fullName || "").toLowerCase();
        const memberPhone = item.memberPhone || item.member?.phone || "";
        const paymentId = String(item.id);

        return (
            memberName.includes(term) ||
            memberPhone.includes(term) ||
            paymentId.includes(term)
        );
    });

    return (
        <div className="space-y-6 font-sans relative">
            {/* Toast Notification */}
            {toast.show && (
                <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-[#18181B] border border-zinc-800 text-white px-5 py-3.5 rounded-2xl shadow-2xl animate-fade-in">
                    {toast.type === 'success' ? (
                        <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                    ) : (
                        <div className="w-7 h-7 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                            <AlertCircle className="w-4 h-4" />
                        </div>
                    )}
                    <span className="text-sm font-medium">{toast.message}</span>
                    <button
                        onClick={() => setToast((prev) => ({ ...prev, show: false }))}
                        className="text-zinc-400 hover:text-white ml-2"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                        <CreditCard className="w-7 h-7 text-[#F95738]" />
                        ຈັດການການຊຳລະເງິນ (Payments)
                    </h1>
                    <p className="text-sm text-zinc-400">
                        ປະຫວັດການຊຳລະເງິນຄ່າສະມາຊິກ ແລະ ລາຍຮັບທັງໝົດ
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 bg-[#F95738] hover:bg-[#e0482b] text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-lg shadow-[#F95738]/20"
                >
                    <Plus className="w-4 h-4" />
                    ບັນທຶກການຊຳລະເງິນ
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ຄົ້ນຫາຊື່ສະມາຊິກ, ເບີໂທ ຫຼື ລະຫັດບິນ..."
                    className="w-full bg-[#18181B] border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#F95738] transition-colors"
                />
            </div>

            {error && (
                <div className="flex items-center gap-2 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Table */}
            <div className="bg-[#18181B] border border-zinc-800 rounded-2xl overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12 gap-2 text-zinc-400">
                        <Loader2 className="w-5 h-5 animate-spin text-[#F95738]" />
                        <span>ກຳລັງໂຫຼດຂໍ້ມູນການຊຳລະເງິນ...</span>
                    </div>
                ) : filteredPayments.length === 0 ? (
                    <div className="text-center py-12 text-zinc-500 text-sm">
                        ບໍ່ມີຂໍ້ມູນການຊຳລະເງິນໃນລະບົບ
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-zinc-300">
                            <thead className="bg-[#0F0F12] text-zinc-400 text-xs uppercase border-b border-zinc-800">
                                <tr>
                                    <th className="px-6 py-4">ລະຫັດບິນ</th>
                                    <th className="px-6 py-4">ສະມາຊິກ</th>
                                    <th className="px-6 py-4">ແພັກເກັດ</th>
                                    <th className="px-6 py-4">ລາຍລະອຽດ</th>
                                    <th className="px-6 py-4">ຮູບແບບການຊຳລະ</th>
                                    <th className="px-6 py-4">ວັນທີຊຳລະ</th>
                                    <th className="px-6 py-4 text-right">ຈຳນວນເງິນ (LAK)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/60">
                                {filteredPayments.map((item: any) => (
                                    <tr key={item.id} className="hover:bg-zinc-800/30 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-zinc-400">
                                            #{item.id}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-white">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-zinc-500" />
                                                <span>{item.memberName || item.member?.fullName || `Member #${item.memberId}`}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-zinc-300">
                                                <PackageIcon className="w-3.5 h-3.5 text-[#F95738]" />
                                                <span>{item.packageName || item.package?.name || "-"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-zinc-400">
                                            {item.description || "-"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                                                {item.paymentMethod || "CASH"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-zinc-400 whitespace-nowrap">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                                                <span>
                                                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-emerald-400 whitespace-nowrap">
                                            +{(item.amountLak || 0).toLocaleString()} LAK
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal ບັນທຶກການຊຳລະເງິນ */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="bg-[#18181B] border border-zinc-800 w-full max-w-md rounded-2xl p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-[#F95738]" />
                                ບັນທຶກການຊຳລະເງິນໃໝ່
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-zinc-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1">
                                    ເລືອກສະມາຊິກ *
                                </label>
                                <select
                                    name="memberId"
                                    required
                                    value={formData.memberId}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#0F0F12] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#F95738]"
                                >
                                    <option value="">-- ເລືອກສະມາຊິກ --</option>
                                    {members.map((m: any) => (
                                        <option key={m.id} value={m.id}>
                                            {m.fullName} ({m.phone || "ບໍ່ມີເບີໂທ"})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1">
                                    ເລືອກແພັກເກັດ (ເລືອກເພື່ອດຶງລາຄາ)
                                </label>
                                <select
                                    name="packageId"
                                    value={formData.packageId}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#0F0F12] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#F95738]"
                                >
                                    <option value="">-- ເລືອກແພັກເກັດ --</option>
                                    {packages.map((pkg: any) => (
                                        <option key={pkg.id} value={pkg.id}>
                                            {pkg.name} ({Number(pkg.priceLak || pkg.price || 0).toLocaleString()} LAK)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1">
                                    ລາຍລະອຽດ (Description) *
                                </label>
                                <input
                                    type="text"
                                    name="description"
                                    required
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#0F0F12] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#F95738]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1">
                                        ຈຳນວນເງິນ (LAK) *
                                    </label>
                                    <input
                                        type="number"
                                        name="amountLak"
                                        required
                                        min="1"
                                        value={formData.amountLak}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        className="w-full bg-[#0F0F12] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#F95738]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1">
                                        ຈຳນວນເງິນທີ່ຈ່າຍ *
                                    </label>
                                    <input
                                        type="number"
                                        name="amountPaid"
                                        required
                                        min="1"
                                        value={formData.amountPaid}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        className="w-full bg-[#0F0F12] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#F95738]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1">
                                        สกุลเงิน (Paid Currency)
                                    </label>
                                    <select
                                        name="paidCurrency"
                                        value={formData.paidCurrency}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#0F0F12] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#F95738]"
                                    >
                                        <option value="LAK">LAK</option>
                                        <option value="USD">USD</option>
                                        <option value="THB">THB</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1">
                                        ອັດຕາແລກປ່ຽນ (Exchange Rate)
                                    </label>
                                    <input
                                        type="number"
                                        name="exchangeRate"
                                        value={formData.exchangeRate}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#0F0F12] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#F95738]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1">
                                    ຮູບແບບການຊຳລະ *
                                </label>
                                <select
                                    name="paymentMethod"
                                    value={formData.paymentMethod}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#0F0F12] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#F95738]"
                                >
                                    <option value="CASH">ເງິນສົດ (CASH)</option>
                                    <option value="TRANSFER">ໂອນຜ່ານທະນາຄານ (TRANSFER)</option>
                                    <option value="CREDIT_CARD">ບັດເຄຣດິດ (CREDIT CARD)</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-2.5 rounded-xl text-sm font-medium transition-colors"
                                >
                                    ຍົກເລີກ
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-[#F95738] hover:bg-[#e0482b] text-white py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {submitting ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-4 h-4" />
                                            ຢືນຢັນການຊຳລະ
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}