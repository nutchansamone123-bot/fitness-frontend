"use client";

import { useEffect, useState } from "react";
import { Expense } from "../../types/expense";
import { ExpenseService } from "../../lib/services";
import api from "../../lib/api";
import {
    Receipt,
    Plus,
    Search,
    Calendar,
    Tag,
    Loader2,
    AlertCircle,
    X,
    CheckCircle2,
    Pencil,
    Trash2,
    AlertTriangle
} from "lucide-react";

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingExpense, setEditingExpense] = useState<any | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        amountLak: "",
        category: "UTILITIES",
    });

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState<any | null>(null);
    const [deleting, setDeleting] = useState(false);

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

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = () => {
        setLoading(true);
        setError("");
        ExpenseService.getAll()
            .then((res: any) => {
                setExpenses(res.data || res || []);
            })
            .catch((err: any) => {
                console.error("Failed to fetch expenses:", err);
                setError("ບໍ່ສາມາດດຶງຂໍ້ມູນລາຍຈ່າຍໄດ້");
                setExpenses([]);
            })
            .finally(() => setLoading(false));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleOpenCreateModal = () => {
        setEditingExpense(null);
        setFormData({ title: "", amountLak: "", category: "UTILITIES" });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item: any) => {
        setEditingExpense(item);
        const amount = item.amountLak ?? item.amountPaid ?? item.amount ?? "";
        setFormData({
            title: item.title || "",
            amountLak: amount !== "" ? String(amount) : "",
            category: item.category || "UTILITIES",
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.amountLak) return;

        setSubmitting(true);
        try {
            const amountVal = Number(formData.amountLak);

            const payload: any = {
                title: formData.title,
                amount: amountVal,
                amountLak: amountVal,
                category: formData.category,
            };

            if (editingExpense) {
                const expenseId = editingExpense.id ?? editingExpense._id ?? editingExpense.expenseId;
                try {
                    await ExpenseService.update(expenseId, payload);
                } catch (err) {
                    await api.put(`/expenses/${expenseId}`, payload);
                }
                showToast("ອັບເດດລາຍຈ່າຍສຳເລັດ!");
            } else {
                try {
                    await ExpenseService.create(payload);
                } catch (err) {
                    await api.post("/expenses", payload);
                }
                showToast("ເພີ່ມລາຍຈ່າຍໃໝ່ສຳເລັດ!");
            }

            fetchExpenses();
            setIsModalOpen(false);
            setEditingExpense(null);
            setFormData({ title: "", amountLak: "", category: "UTILITIES" });
        } catch (err: any) {
            console.error("Failed to save expense:", err);
            showToast("ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກລາຍຈ່າຍ", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleOpenDeleteModal = (item: any) => {
        setExpenseToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!expenseToDelete) return;
        const id = expenseToDelete.id || expenseToDelete._id;
        try {
            setDeleting(true);
            try {
                await ExpenseService.delete(id);
            } catch (err) {
                await api.delete(`/expenses/${id}`);
            }
            showToast("ລຶບລາຍຈ່າຍສຳເລັດ!");
            fetchExpenses();
            setIsDeleteModalOpen(false);
            setExpenseToDelete(null);
        } catch (err) {
            console.error("Failed to delete expense:", err);
            showToast("ບໍ່ສາມາດລົບລາຍຈ່າຍໄດ້", "error");
        } finally {
            setDeleting(false);
        }
    };

    const filteredExpenses = expenses.filter((item) =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 font-sans relative">
            {/* Toast Notification */}
            {toast.show && (
                <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-[#18181B] border border-zinc-800 text-white px-5 py-3.5 rounded-2xl shadow-2xl">
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
                        <Receipt className="w-7 h-7 text-[#F95738]" />
                        ຈັດການລາຍຈ່າຍ (Expenses)
                    </h1>
                    <p className="text-sm text-zinc-400">
                        ບັນທຶກ ແລະ ກວດສອບລາຍຈ່າຍທັງໝົດຂອງຢິມ
                    </p>
                </div>
                <button
                    onClick={handleOpenCreateModal}
                    className="inline-flex items-center justify-center gap-2 bg-[#F95738] hover:bg-[#e0482b] text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-lg shadow-[#F95738]/20"
                >
                    <Plus className="w-4 h-4" />
                    ເພີ່ມລາຍຈ່າຍໃໝ່
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ຄົ້ນຫາລາຍຈ່າຍ..."
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
                        <span>ກຳລັງໂຫຼດຂໍ້ມູນລາຍຈ່າຍ...</span>
                    </div>
                ) : filteredExpenses.length === 0 ? (
                    <div className="text-center py-12 text-zinc-500 text-sm">
                        ບໍ່ມີຂໍ້ມູນລາຍຈ່າຍໃນລະບົບ
                    </div>
                ) : (
                    <table className="w-full text-left text-sm text-zinc-300">
                        <thead className="bg-[#0F0F12] text-zinc-400 text-xs uppercase border-b border-zinc-800">
                            <tr>
                                <th className="px-6 py-4">ລາຍການ</th>
                                <th className="px-6 py-4">ໝວດໝູ່</th>
                                <th className="px-6 py-4">ວັນທີບັນທຶກ</th>
                                <th className="px-6 py-4 text-right">ຈຳນວນເງິນ (LAK)</th>
                                <th className="px-6 py-4 text-center">ຈັດການ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60">
                            {filteredExpenses.map((item: any) => (
                                <tr key={item.id} className="hover:bg-zinc-800/30 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-white">{item.title}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                                            <Tag className="w-3 h-3 text-[#F95738]" />
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-zinc-400 whitespace-nowrap">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                                            <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-rose-400 whitespace-nowrap">
                                        -{Number(item.amountLak || item.amountPaid || item.amount || 0).toLocaleString()} LAK
                                    </td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleOpenEditModal(item)}
                                                className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
                                                title="ແກ້ໄຂ"
                                            >
                                                <Pencil className="w-4 h-4 text-amber-400" />
                                            </button>
                                            <button
                                                onClick={() => handleOpenDeleteModal(item)}
                                                className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
                                                title="ລົບ"
                                            >
                                                <Trash2 className="w-4 h-4 text-rose-400" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal ເພີ່ມ/ແກ້ໄຂ ລາຍຈ່າຍ */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="bg-[#18181B] border border-zinc-800 w-full max-w-md rounded-2xl p-6 space-y-5 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Receipt className="w-5 h-5 text-[#F95738]" />
                                {editingExpense ? "ແກ້ໄຂລາຍຈ່າຍ" : "ເພີ່ມລາຍຈ່າຍໃໝ່"}
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
                                    ຊື່ລາຍການລາຍຈ່າຍ *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="ເຊັ່ນ: ຄ່າໄຟຟ້າ, ຊື້ດຳເບລເພີ່ມ"
                                    className="w-full bg-[#0F0F12] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#F95738]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1">
                                    ຈຳນວນເງິນ (LAK) *
                                </label>
                                <input
                                    type="number"
                                    name="amountLak"
                                    required
                                    value={formData.amountLak}
                                    onChange={handleInputChange}
                                    placeholder="0"
                                    className="w-full bg-[#0F0F12] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#F95738]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1">
                                    ໝວດໝູ່
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#0F0F12] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#F95738]"
                                >
                                    <option value="SUPPLIES">SUPPLIES (ນ້ຳດື່ມ, ນ້ຳແຂງ, ອຸປະກອນສຳນັກງານ)</option>
                                    <option value="UTILITIES">UTILITIES (ຄ່ານ້ຳ, ຄ່າໄຟ, ອິນເຕີເນັດ)</option>
                                    <option value="EQUIPMENT">EQUIPMENT (ອຸປະກອນ, ເຄື່ອງອອກກຳລັງກາຍ)</option>
                                    <option value="MAINTENANCE">MAINTENANCE (ຄ່າສ້ອມແປງ)</option>
                                    <option value="SALARY">SALARY (ເງິນເດືອນພະນັກງານ)</option>
                                    <option value="MISCELLANEOUS">MISCELLANEOUS / OPERATIONAL (ອື່ນໆ)</option>
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
                                    className="flex-1 bg-[#F95738] hover:bg-[#e0482b] text-white py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-4 h-4" />
                                            {editingExpense ? "ອັບເດດ" : "ບັນທຶກ"}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="bg-[#18181B] border border-zinc-800 w-full max-w-sm rounded-2xl p-6 space-y-5 shadow-2xl text-center">
                        <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-bold text-white">ຢືນຢັນການລົບ</h3>
                            <p className="text-sm text-zinc-400">
                                ທ່ານໝັ້ນໃຈບໍວ່າຕ້ອງການລົບລາຍຈ່າຍ <span className="text-white font-semibold">"{expenseToDelete?.title}"</span> ນີ້? ຂໍ້ມູນຈະຖືກລຶບອອກຈາກລະບົບຖາວອນ.
                            </p>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-2.5 rounded-xl text-sm font-medium transition-colors"
                            >
                                ຍົກເລີກ
                            </button>
                            <button
                                type="button"
                                disabled={deleting}
                                onClick={confirmDelete}
                                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                {deleting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    "ລົບຂໍ້ມູນ"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}