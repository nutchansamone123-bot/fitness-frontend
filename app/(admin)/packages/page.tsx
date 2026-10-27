"use client";

import { useEffect, useState, FormEvent } from "react";
import { PackageService } from "../../lib/services";
import {
    Package as PackageIcon,
    Plus,
    Edit,
    Trash2,
    Loader2,
    AlertCircle,
    X,
    Clock,
    DollarSign,
    CheckCircle2,
    AlertTriangle,
} from "lucide-react";

interface PackageItem {
    id: string | number;
    name: string;
    priceLak?: number;
    price?: number;
    durationDays?: number;
    duration_days?: number;
    sessions?: number;
}

export default function PackagesPage() {
    const [packages, setPackages] = useState<PackageItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | number | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        priceLak: "",
        durationDays: "",
        sessions: "",
    });
    const [submitting, setSubmitting] = useState(false);

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [packageToDelete, setPackageToDelete] = useState<PackageItem | null>(null);
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

    const fetchPackages = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await PackageService.getAll();
            const data = (res as any)?.data || res || [];
            setPackages(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch packages:", err);
            setError("ບໍ່ສາມາດດຶງຂໍ້ມູນແພັກເກັດໄດ້");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    const handleOpenModal = (pkg: PackageItem | null = null) => {
        if (pkg) {
            setEditingId(pkg.id);
            setFormData({
                name: pkg.name || "",
                priceLak: String(pkg.priceLak ?? pkg.price ?? ""),
                durationDays: String(pkg.durationDays ?? pkg.duration_days ?? ""),
                sessions: String(pkg.sessions ?? "0"),
            });
        } else {
            setEditingId(null);
            setFormData({ name: "", priceLak: "", durationDays: "", sessions: "0" });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const payload = {
                name: formData.name,
                priceLak: Number(formData.priceLak),
                durationDays: Number(formData.durationDays),
                sessions: Number(formData.sessions),
            };

            if (editingId) {
                await PackageService.update(editingId, payload);
                showToast("ອັບເດດແພັກເກັດສຳເລັດ!");
            } else {
                await PackageService.create(payload);
                showToast("ເພີ່ມແພັກເກັດໃໝ່ສຳເລັດ!");
            }

            setIsModalOpen(false);
            fetchPackages();
        } catch (err: any) {
            console.error("Failed to save package:", err);
            if (err?.response?.status === 403) {
                showToast("ທ່ານບໍ່ມີສິດໃນການເພີ່ມ ຫຼື ແກ້ໄຂແພັກເກັດ", "error");
            } else {
                showToast("ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກຂໍ້ມູນ", "error");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleOpenDeleteModal = (pkg: PackageItem) => {
        setPackageToDelete(pkg);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!packageToDelete) return;
        try {
            setDeleting(true);
            await PackageService.delete(packageToDelete.id);
            showToast("ລຶບແພັກເກັດສຳເລັດ!");
            fetchPackages();
            setIsDeleteModalOpen(false);
            setPackageToDelete(null);
        } catch (err: any) {
            console.error("Failed to delete package:", err);
            if (err?.response?.status === 403) {
                showToast("ທ່ານບໍ່ມີສິດໃນການລຶບແພັກເກັດ", "error");
            } else {
                showToast("ບໍ່ສາມາດລຶບຂໍ້ມູນໄດ້", "error");
            }
        } finally {
            setDeleting(false);
        }
    };

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

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        ຈັດການແພັກເກັດ (Packages)
                    </h1>
                    <p className="text-sm text-zinc-400">
                        ເພີ່ມ, ແກ້ໄຂ ແລະ ຈັດການແພັກເກັດສະມາຊິກຟິດເນສ
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center gap-2 bg-[#F95738] hover:bg-[#e0482c] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-[#F95738]/20"
                >
                    <Plus className="w-4 h-4" />
                    <span>ເພີ່ມແພັກເກັດໃໝ່</span>
                </button>
            </div>

            {error && (
                <div className="flex items-center gap-2 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[300px] gap-3 text-zinc-400">
                    <Loader2 className="w-8 h-8 animate-spin text-[#F95738]" />
                    <span className="text-sm">ກຳລັງໂຫຼດຂໍ້ມູນ...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {packages.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-zinc-500 bg-[#18181B] border border-zinc-800 rounded-2xl">
                            ບໍ່ມີຂໍ້ມູນແພັກເກັດໃນລະບົບ
                        </div>
                    ) : (
                        packages.map((pkg) => (
                            <div
                                key={pkg.id}
                                className="bg-[#18181B] border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between hover:border-zinc-700 transition-all"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-[#F95738]/10 rounded-xl text-[#F95738]">
                                                <PackageIcon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white">
                                                    {pkg.name}
                                                </h3>
                                                <p className="text-xs text-zinc-400 mt-0.5">
                                                    ຈຳນວນຄັ້ງ: {pkg.sessions ?? 0} ຄັ້ງ
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 space-y-2 border-t border-zinc-800/80 pt-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-zinc-400 flex items-center gap-1.5">
                                                <DollarSign className="w-4 h-4 text-emerald-400" /> ລາຄາ:
                                            </span>
                                            <span className="font-bold text-emerald-400 text-base">
                                                {Number(pkg.priceLak || pkg.price || 0).toLocaleString()} LAK
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-zinc-400 flex items-center gap-1.5">
                                                <Clock className="w-4 h-4 text-blue-400" /> ເວລາ:
                                            </span>
                                            <span className="text-white font-medium">
                                                {pkg.durationDays || pkg.duration_days} ມື້
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center gap-2 pt-4 border-t border-zinc-800/80">
                                    <button
                                        onClick={() => handleOpenModal(pkg)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold transition-all"
                                    >
                                        <Edit className="w-3.5 h-3.5 text-amber-400" />
                                        <span>ແກ້ໄຂ</span>
                                    </button>
                                    <button
                                        onClick={() => handleOpenDeleteModal(pkg)}
                                        className="flex items-center justify-center p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-[#18181B] border border-zinc-800 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-white">
                                {editingId ? "ແກ້ໄຂແພັກເກັດ" : "ເພີ່ມແພັກເກັດໃໝ່"}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-zinc-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                                    ຊື່ແພັກເກັດ
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#F95738]"
                                    placeholder="ຕົວຢ່າງ: Monthly Pass"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                                    ລາຄາ (LAK)
                                </label>
                                <input
                                    type="number"
                                    required
                                    value={formData.priceLak}
                                    onChange={(e) => setFormData({ ...formData, priceLak: e.target.value })}
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#F95738]"
                                    placeholder="ຕົວຢ່າງ: 350000"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                                    ໄລຍະເວລາ (ເປັນມື້)
                                </label>
                                <input
                                    type="number"
                                    required
                                    value={formData.durationDays}
                                    onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#F95738]"
                                    placeholder="ຕົວຢ່າງ: 30"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                                    ຈຳນວນຄັ້ງ (Sessions)
                                </label>
                                <input
                                    type="number"
                                    required
                                    value={formData.sessions}
                                    onChange={(e) => setFormData({ ...formData, sessions: e.target.value })}
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#F95738]"
                                    placeholder="ຕົວຢ່າງ: 0"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-semibold rounded-xl transition-all"
                                >
                                    ຍົກເລີກ
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-5 py-2 bg-[#F95738] hover:bg-[#e0482c] text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-[#F95738]/20 flex items-center gap-2"
                                >
                                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                    <span>ບັນທຶກ</span>
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
                                ທ່ານໝັ້ນໃຈບໍວ່າຕ້ອງການລົບແພັກເກັດ <span className="text-white font-semibold">"{packageToDelete?.name}"</span> ນີ້? ຂໍ້ມູນຈະຖືກລຶບອອກຈາກລະບົບຖາວອນ.
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