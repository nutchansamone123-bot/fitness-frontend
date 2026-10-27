"use client";

import { useEffect, useState } from "react";
import { User, Shield, Plus, Search, Phone, Lock, Loader2, AlertCircle, X, CheckCircle2, Pencil, Trash2, AlertTriangle, UserCog } from "lucide-react";

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingUser, setEditingUser] = useState<any | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        password: "",
        role: "STAFF",
    });

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<any | null>(null);
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
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
            const res = await fetch("https://fitness-bxqs.onrender.com/users", {
                headers: {
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                }
            });
            const data = await res.json();

            if (Array.isArray(data)) {
                setUsers(data);
            } else if (data.data && Array.isArray(data.data)) {
                setUsers(data.data);
            } else {
                setUsers([]);
            }
        } catch (err: any) {
            console.error("Failed to fetch users:", err);
            setError("ບໍ່ສາມາດດຶງຂໍ້ມູນພະນັກງານໄດ້");
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleOpenCreateModal = () => {
        setEditingUser(null);
        setFormData({ name: "", phone: "", password: "", role: "STAFF" });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item: any) => {
        setEditingUser(item);
        setFormData({
            name: item.name || item.fullName || "",
            phone: item.phone || "",
            password: "",
            role: item.role || "STAFF",
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.phone) return;

        if (!editingUser && !formData.password) {
            showToast("ກະລຸນາປ້ອນລະຫັດຜ່ານ", "error");
            return;
        }

        setSubmitting(true);
        try {
            const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
            const payload: any = {
                name: formData.name,
                phone: formData.phone,
                role: formData.role,
            };

            if (formData.password && formData.password.trim() !== "") {
                payload.password = formData.password;
            }

            // ดึง ID ให้ครอบคลุมทุกรูปแบบ (id, _id, userId, uuid)
            const userId = editingUser?.id ?? editingUser?._id ?? editingUser?.userId;

            let res;
            if (editingUser) {
                // 1. ลองส่งแบบ PUT ก่อน
                res = await fetch(`https://fitness-bxqs.onrender.com/users/${userId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { "Authorization": `Bearer ${token}` } : {})
                    },
                    body: JSON.stringify(payload)
                });

                // 2. ถ้า PUT ไม่ผ่าน ลองส่งแบบ PATCH
                if (!res.ok) {
                    res = await fetch(`https://fitness-bxqs.onrender.com/users/${userId}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            ...(token ? { "Authorization": `Bearer ${token}` } : {})
                        },
                        body: JSON.stringify(payload)
                    });
                }
            } else {
                res = await fetch(`https://fitness-bxqs.onrender.com/users`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { "Authorization": `Bearer ${token}` } : {})
                    },
                    body: JSON.stringify(payload)
                });
            }

            if (!res.ok) throw new Error("Failed to save user");

            showToast(editingUser ? "ອັບເດດຂໍ້ມູນພະນັກງານສຳເລັດ!" : "ເພີ່ມພະນັກງານໃໝ່ສຳເລັດ!");
            fetchUsers();
            setIsModalOpen(false);
            setEditingUser(null);
            setFormData({ name: "", phone: "", password: "", role: "STAFF" });
        } catch (err: any) {
            console.error("Failed to save user:", err);
            showToast("ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກຂໍ້ມູນ", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleOpenDeleteModal = (item: any) => {
        setUserToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;
        try {
            setDeleting(true);
            const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
            const userId = userToDelete.id ?? userToDelete._id ?? userToDelete.userId;

            const res = await fetch(`https://fitness-bxqs.onrender.com/users/${userId}`, {
                method: "DELETE",
                headers: {
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                }
            });

            if (!res.ok) throw new Error("Failed to delete user");

            showToast("ລຶບພະນັກງານສຳເລັດ!");
            fetchUsers();
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
        } catch (err) {
            console.error("Failed to delete user:", err);
            showToast("ບໍ່ສາມາດລົບພະນັກງານໄດ້", "error");
        } finally {
            setDeleting(false);
        }
    };

    const filteredUsers = users.filter((item: any) => {
        const name = (item.name || item.fullName || "").toLowerCase();
        const phone = (item.phone || "").toLowerCase();
        const term = searchTerm.toLowerCase();
        return name.includes(term) || phone.includes(term);
    });

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
                        <UserCog className="w-7 h-7 text-[#F95738]" />
                        ຈັດການພະນັກງານ (Users)
                    </h1>
                    <p className="text-sm text-zinc-400">
                        ຈັດການບັນຊີຜູ້ໃຊ້ ແລະ ສິດທິການເຂົ້າເຖິງລະບົບຂອງພະນັກງານ
                    </p>
                </div>
                <button
                    onClick={handleOpenCreateModal}
                    className="inline-flex items-center justify-center gap-2 bg-[#F95738] hover:bg-[#e0482b] text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-lg shadow-[#F95738]/20"
                >
                    <Plus className="w-4 h-4" />
                    ເພີ່ມພະນັກງານໃໝ່
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ຄົ້ນຫາຊື່ພະນັກງານ ຫຼື ເບີໂທ..."
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
                        <span>ກຳລັງໂຫຼດຂໍ້ມູນພະນັກງານ...</span>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-12 text-zinc-500 text-sm">
                        ບໍ່ມີຂໍ້ມູນພະນັກງານໃນລະບົບ
                    </div>
                ) : (
                    <table className="w-full text-left text-sm text-zinc-300">
                        <thead className="bg-[#0F0F12] text-zinc-400 text-xs uppercase border-b border-zinc-800">
                            <tr>
                                <th className="px-6 py-4">ຊື່ພະນັກງານ</th>
                                <th className="px-6 py-4">ເບີໂທລະສັບ</th>
                                <th className="px-6 py-4">ສິດທິ (Role)</th>
                                <th className="px-6 py-4 text-center">ຈັດການ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60">
                            {filteredUsers.map((item: any) => (
                                <tr key={item.id || item._id || item.userId} className="hover:bg-zinc-800/30 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-white flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                                            <User className="w-4 h-4 text-[#F95738]" />
                                        </div>
                                        <span>{item.name || item.fullName}</span>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-300">
                                        <div className="flex items-center gap-1.5">
                                            <Phone className="w-3.5 h-3.5 text-zinc-500" />
                                            <span>{item.phone || "-"}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${item.role === 'ADMIN'
                                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                            : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                                            }`}>
                                            <Shield className="w-3 h-3" />
                                            {item.role || "STAFF"}
                                        </span>
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

            {/* Modal ເພີ່ມ/ແກ້ໄຂ ພະນັກງານ */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="bg-[#18181B] border border-zinc-800 w-full max-w-md rounded-2xl p-6 space-y-5 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <UserCog className="w-5 h-5 text-[#F95738]" />
                                {editingUser ? "ແກ້ໄຂຂໍ້ມູນພະນັກງານ" : "ເພີ່ມພະນັກງານໃໝ່"}
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
                                    ຊື່ ແລະ ນາມສະກຸນ (Name) *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="ເຊັ່ນ: John Doe"
                                    className="w-full bg-[#0F0F12] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#F95738]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1">
                                    ເບີໂທລະສັບ (Phone) *
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="ເຊັ່ນ: 02099991111"
                                    className="w-full bg-[#0F0F12] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#F95738]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1">
                                    ລະຫັດຜ່ານ (Password) {editingUser && <span className="text-zinc-500">(ປະຫວ່າງໄວ້ຖ້າບໍ່ຕ້ອງການປ່ຽນ)</span>}
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    {...(!editingUser ? { required: true } : {})}
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="••••••••"
                                    className="w-full bg-[#0F0F12] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#F95738]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1">
                                    ສິດທິຜູ້ໃຊ້ (Role) *
                                </label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#0F0F12] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#F95738]"
                                >
                                    <option value="STAFF">STAFF (ພະນັກງານທົ່ວໄປ)</option>
                                    <option value="ADMIN">ADMIN (ຜູ້ດູແລລະບົບ)</option>
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
                                            {editingUser ? "ອັບເດດ" : "ບັນທຶກ"}
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
                                ທ່ານໝັ້ນໃຈບໍວ່າຕ້ອງການລົບພະນັກງານ <span className="text-white font-semibold">"{userToDelete?.name || userToDelete?.fullName}"</span> ນີ້? ຂໍ້ມູນຈະຖືກລຶບອອກຈາກລະບົບຖາວອນ.
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