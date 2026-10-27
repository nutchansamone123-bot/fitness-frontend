"use client";

import { useState, useEffect } from "react";
import { MemberService, PackageService } from "@/lib/services";
import {
    Users,
    UserPlus,
    Search,
    Pencil,
    Trash2,
    Loader2,
    AlertCircle,
    X,
    CheckCircle,
    AlertTriangle,
    Upload,
    Maximize2,
    User
} from "lucide-react";

export default function MembersPage() {
    const [members, setMembers] = useState<any[]>([]);
    const [packages, setPackages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    // 👉 Toast State
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const showToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, 3000);
    };

    // Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<any>(null);

    // Delete Dialog States
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState<any>(null);

    // 👉 Image Preview Modal State & PhotoUrl State
    const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null);

    // 👉 Package Details Modal State
    const [selectedPackageDetails, setSelectedPackageDetails] = useState<any>(null);

    // Form States
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        packageId: "",
        photoUrl: "",
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // 1. ດຶງຂໍ້ມູນ Members & Packages
    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            const [resMembers, resPackages]: [any, any] = await Promise.all([
                MemberService.getAll(),
                PackageService.getAll(),
            ]);

            const memberList = resMembers?.data || resMembers || [];
            const packageList = resPackages?.data || resPackages || [];

            setMembers(memberList);
            setPackages(packageList);
        } catch (err: any) {
            setError("ບໍ່ສາມາດໂຫຼດຂໍ້ມູນສະມາຊິກໄດ້: " + (err.message || "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handle Input Changes
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle File Change (ເກັບ File Object ໄວ້ສົ່ງ FormData)
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                showToast("ໄຟລ໌ຮູບໃຫຍ່ເກີນໄປ (ກະລຸນາໃຊ້ຂະໜາດຕ່ຳກວ່າ 10MB)", "error");
                return;
            }
            setSelectedFile(file);
            const previewUrl = URL.createObjectURL(file);
            setFormData(prev => ({ ...prev, photoUrl: previewUrl }));
            showToast("ເລືອກຮູບພາບສຳເລັດແລ້ວ!");
        }
    };

    // 2. ເเพີ່ມສະມາຊິກ (Create ດ້ວຍ FormData ດຶງຈຳນວນຄັ້ງ ແລະ ມື້ຈາກ Package ທີ່ເລືອກ)
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (actionLoading) return;
        setActionLoading(true);
        setError("");
        try {
            // 🔍 ຄົ້ນຫາ Package ທີ່ເລືອກ ເเพື່ອດຶງຈຳນວນ sessions ແລະ duration ຕົວຈິງ
            const selectedPkg = packages.find(p => String(p.id) === String(formData.packageId));
            const initialSessions = selectedPkg?.sessions || selectedPkg?.totalSessions || 30;
            const durationDays = selectedPkg?.durationDays || selectedPkg?.duration || 365;

            const data = new FormData();
            data.append("code", `MEM${Math.floor(100 + Math.random() * 900)}`);
            data.append("fullName", formData.name.trim());
            data.append("phone", formData.phone.trim());
            data.append("packageId", formData.packageId ? String(formData.packageId) : "1");

            const expireDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            data.append("expireDate", expireDate);
            data.append("remainingSessions", String(initialSessions));

            if (selectedFile) {
                data.append("photo", selectedFile);
            }

            const token = localStorage.getItem("token") || localStorage.getItem("accessToken") || sessionStorage.getItem("token");
            const res = await fetch("https://fitness-bxqs.onrender.com/members", {
                method: "POST",
                headers: {
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                },
                body: data,
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "ເພີ່ມສະມາຊິກບໍ່ສຳເລັດ");

            showToast("ເພີ່ມສະມາຊິກໃໝ່ ສຳເລັດ!");
            setIsAddModalOpen(false);
            setFormData({ name: "", phone: "", packageId: "", photoUrl: "" });
            setSelectedFile(null);
            await fetchData();
        } catch (err: any) {
            const errorMsg = err?.message || "ເກີດຂໍ້ຜິດພາດໃນການເພີ່ມສະມາຊິກ";
            showToast(errorMsg, "error");
        } finally {
            setActionLoading(false);
        }
    };

    // 3. ເເປີດ Modal ແກ້ໄຂ
    const openEditModal = (member: any) => {
        setSelectedMember(member);
        setFormData({
            name: member.fullName || member.name || "",
            phone: member.phone || "",
            packageId: member.packageId
                ? String(member.packageId)
                : member.package?.id
                    ? String(member.package.id)
                    : "",
            photoUrl: member.photoUrl || member.photo || member.avatar || "",
        });
        setSelectedFile(null);
        setIsEditModalOpen(true);
    };

    // 4. ແກ້ໄຂສະມາຊິກ (Update ດ້ວຍ FormData ພ້ອມກວດສອບການປ່ຽນແປງ Package)
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMember || actionLoading) return;
        setActionLoading(true);
        setError("");

        try {
            const selectedPkg = packages.find(p => String(p.id) === String(formData.packageId));

            // ຖ້າປ່ຽນ Package ໃຫ້ໃຊ້ sessions ຂອງ package ໃໝ່, ຖ້າ package ເດີມໃຫ້ໃຊ້ remainingSessions ທີ່ເຫຼືອຢູ່
            const isPackageChanged = String(selectedMember.packageId) !== String(formData.packageId);
            const newSessions = isPackageChanged
                ? (selectedPkg?.sessions || selectedPkg?.totalSessions || 30)
                : (selectedMember.remainingSessions ?? 30);

            const data = new FormData();
            data.append("code", selectedMember.code || `MEM${Math.floor(100 + Math.random() * 900)}`);
            data.append("fullName", formData.name.trim());
            data.append("phone", formData.phone.trim());
            data.append("packageId", formData.packageId ? String(formData.packageId) : "1");
            data.append("expireDate", selectedMember.expireDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
            data.append("remainingSessions", String(newSessions));

            if (selectedFile) {
                data.append("photo", selectedFile);
            }

            const token = localStorage.getItem("token") || localStorage.getItem("accessToken") || sessionStorage.getItem("token");
            const res = await fetch(`https://fitness-bxqs.onrender.com/members/${selectedMember.id}`, {
                method: "PATCH",
                headers: {
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                },
                body: data,
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "ອັບເດດຂໍ້ມູນບໍ່ສຳເລັດ");

            showToast("ອັບເດດຂໍ້ມູນສະມາຊິກ ສຳເລັດ!");
            setIsEditModalOpen(false);
            setSelectedMember(null);
            setFormData({ name: "", phone: "", packageId: "", photoUrl: "" });
            setSelectedFile(null);
            await fetchData();
        } catch (err: any) {
            const msg = err?.message || "ເກີດຂໍ້ຜິດພາດໃນການແກ້ໄຂຂໍ້ມູນ";
            showToast(msg, "error");
        } finally {
            setActionLoading(false);
        }
    };

    // 5. ເປີດ Delete Dialog
    const openDeleteModal = (member: any) => {
        setMemberToDelete(member);
        setIsDeleteModalOpen(true);
    };

    // 6. ຢືນຢັນລົບສະມາຊິກ
    const confirmDelete = async () => {
        if (!memberToDelete) return;

        setActionLoading(true);
        try {
            await MemberService.delete(memberToDelete.id);
            showToast("ລົບສະມາຊິກອອກຈາກລະບົບສຳເລັດແລ້ວ!", "success");
            setIsDeleteModalOpen(false);
            setMemberToDelete(null);
            fetchData();
        } catch (err: any) {
            const errorMsg = err?.response?.data?.message || "ເກີດຂໍ້ຜິດພາດໃນການລົບສະມາຊິກ";
            showToast(errorMsg, "error");
        } finally {
            setActionLoading(false);
        }
    };

    // Search Filter
    const filteredMembers = members.filter(
        (m) =>
            (m.fullName || m.name)?.toLowerCase().includes(search.toLowerCase()) ||
            m.phone?.includes(search) ||
            m.code?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 relative font-sans">
            {/* Toast Notification */}
            {toast && (
                <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-5 duration-300">
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md ${toast.type === "success"
                        ? "bg-emerald-950/95 border-emerald-500/30 text-emerald-200"
                        : "bg-rose-950/95 border-rose-500/30 text-rose-200"
                        }`}>
                        {toast.type === "success" ? (
                            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                        ) : (
                            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                        )}
                        <span className="text-sm font-medium">{toast.message}</span>
                        <button onClick={() => setToast(null)} className="ml-2 text-zinc-400 hover:text-white transition-colors cursor-pointer">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#18181B] p-6 rounded-2xl border border-zinc-800">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Users className="w-7 h-7 text-[#F95738]" />
                        ຈັດການສະມາຊິກ (Members)
                    </h1>
                    <p className="text-sm text-zinc-400 mt-1">
                        ລາຍຊື່ສະມາຊິກທັງໝົດ, ການແກ້ໄຂ ແລະ ສະຖານະການນຳໃຊ້
                    </p>
                </div>

                <button
                    onClick={() => {
                        setFormData({ name: "", phone: "", packageId: "", photoUrl: "" });
                        setSelectedFile(null);
                        setIsAddModalOpen(true);
                    }}
                    className="bg-[#F95738] hover:bg-[#e0482b] text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-lg shadow-[#F95738]/20 cursor-pointer"
                >
                    <UserPlus className="w-4 h-4" />
                    ເພີ່ມສະມາຊິກໃໝ່
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="ຄົ້ນຫາຊື່, ເບີໂທ ຫຼື ລະຫັດ Code..."
                    className="w-full bg-[#18181B] border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#F95738]"
                />
            </div>

            {/* Table List */}
            <div className="bg-[#18181B] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
                {loading ? (
                    <div className="p-12 text-center text-zinc-500 flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-[#F95738]" />
                        <span>ກຳລັງໂຫຼດຂໍ້ມູນ...</span>
                    </div>
                ) : filteredMembers.length === 0 ? (
                    <div className="p-12 text-center text-zinc-500">
                        ບໍ່ມີຂໍ້ມູນສະມາຊິກໃນລະບົບ
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-zinc-300">
                            <thead className="bg-[#0F0F12] text-xs font-semibold uppercase text-zinc-400 border-b border-zinc-800">
                                <tr>
                                    <th className="px-6 py-4">ຮູບພາບ</th>
                                    <th className="px-6 py-4">ລະຫັດ (ID / Code)</th>
                                    <th className="px-6 py-4">ຊື່ສະມາຊິກ</th>
                                    <th className="px-6 py-4">ເບີໂທລະສັບ</th>
                                    <th className="px-6 py-4">ແພັກເກັດ & ຈຳນວນຄັ້ງ</th>
                                    <th className="px-6 py-4 text-center">ຈັດການ (Action)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/60">
                                {filteredMembers.map((member) => {
                                    const memberName = member.fullName || member.name;
                                    const rawPhoto = member.photoUrl || member.photo || member.avatar || member.image;

                                    let memberPhoto = "";
                                    if (rawPhoto) {
                                        if (rawPhoto.startsWith("http://") || rawPhoto.startsWith("https://") || rawPhoto.startsWith("data:image") || rawPhoto.startsWith("blob:")) {
                                            memberPhoto = rawPhoto;
                                        } else if (rawPhoto.startsWith("/")) {
                                            memberPhoto = `https://fitness-bxqs.onrender.com${rawPhoto}`;
                                        } else {
                                            memberPhoto = `https://fitness-bxqs.onrender.com/uploads/${rawPhoto}`;
                                        }
                                    }

                                    // 👉 ຄິດໄລ່ຈຳນວນຄັ້ງທີ່ເຫຼືອ (Remaining Sessions)
                                    const remaining = member.remainingSessions ?? member.sessionsLeft ?? member.remainingCount ?? 0;
                                    const isExpired = remaining <= 0;

                                    return (
                                        <tr key={member.id} className="hover:bg-zinc-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                {memberPhoto ? (
                                                    <div
                                                        onClick={() => setPreviewImage({ url: memberPhoto, name: memberName })}
                                                        className="relative group w-10 h-10 rounded-full overflow-hidden border border-zinc-700 cursor-pointer"
                                                        title="ຄລິກເພື່ອເບິ່ງຮູບຂະໜາດໃຫຍ່"
                                                    >
                                                        <img
                                                            src={memberPhoto}
                                                            alt={memberName}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                        />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                            <Maximize2 className="w-3.5 h-3.5 text-white" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500">
                                                        <User className="w-5 h-5" />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-xs text-zinc-400">ID: {member.id}</div>
                                                <div className="text-xs font-bold text-[#F95738]">{member.code || "-"}</div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-white">
                                                {memberName}
                                            </td>
                                            <td className="px-6 py-4">{member.phone || "-"}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1.5 items-start">
                                                    <button
                                                        onClick={() => {
                                                            const pkgData = member.package || packages.find(p => p.id === member.packageId);
                                                            if (pkgData) {
                                                                setSelectedPackageDetails(pkgData);
                                                            } else {
                                                                showToast("ບໍ່ພົບຂໍ້ມູນລາຍລະອຽດແພັກເກັດ", "error");
                                                            }
                                                        }}
                                                        className="px-3 py-1 bg-[#F95738]/10 text-[#F95738] border border-[#F95738]/20 rounded-full text-xs font-medium hover:bg-[#F95738]/20 transition-colors cursor-pointer flex items-center gap-1.5"
                                                        title="ຄລິກເພື່ອເບິ່ງລາຍລະອຽດແພັກເກັດ"
                                                    >
                                                        <span>{member.package?.name || member.packageName || "ທົ່ວໄປ"}</span>
                                                    </button>

                                                    {/* 👉 ສະແດງສະຖານະຈຳນວນຄັ້ງທີ່ເຫຼືອ */}
                                                    {isExpired ? (
                                                        <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[11px] font-bold px-2.5 py-0.5 rounded-md inline-flex items-center gap-1">
                                                            <AlertCircle className="w-3 h-3" /> ແພັກເກັດໝົດແລ້ວ (0 ຄັ້ງ)
                                                        </span>
                                                    ) : (
                                                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold px-2.5 py-0.5 rounded-md inline-flex items-center gap-1">
                                                            ເຫຼືອ: {remaining} ຄັ້ງ
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => openEditModal(member)}
                                                        className="p-2 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 rounded-lg transition-colors cursor-pointer"
                                                        title="ແກ້ໄຂ"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>

                                                    <button
                                                        onClick={() => openDeleteModal(member)}
                                                        className="p-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors cursor-pointer"
                                                        title="ລົບ"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Package Details Modal */}
            {selectedPackageDetails && (
                <div
                    onClick={() => setSelectedPackageDetails(null)}
                    className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#18181B] border border-zinc-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative"
                    >
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                            <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                📦 ລາຍລະອຽດແພັກເກັດ
                            </h3>
                            <button
                                onClick={() => setSelectedPackageDetails(null)}
                                className="text-zinc-400 hover:text-white bg-zinc-800/60 p-1.5 rounded-full transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4 bg-[#0F0F12] p-5 rounded-2xl border border-zinc-800/80">
                            <div>
                                <span className="text-xs text-zinc-500 block">ຊື່ແພັກເກັດ</span>
                                <span className="text-base font-bold text-[#F95738]">
                                    {selectedPackageDetails.name || "-"}
                                </span>
                            </div>

                            <div>
                                <span className="text-xs text-zinc-500 block">ລາຄາ</span>
                                <span className="text-xl font-bold text-emerald-400">
                                    {(selectedPackageDetails.priceLak || selectedPackageDetails.price)
                                        ? `${Number(selectedPackageDetails.priceLak || selectedPackageDetails.price).toLocaleString()} ກີບ`
                                        : "ບໍ່ລະບຸ"}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-800">
                                <div>
                                    <span className="text-xs text-zinc-500 block">ໄລຍະເວລາ (ວັນ)</span>
                                    <span className="text-sm font-semibold text-white">
                                        {selectedPackageDetails.durationDays || selectedPackageDetails.duration || "-"} ວັນ
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs text-zinc-500 block">ຈຳນວນຄັ້ງ (Sessions)</span>
                                    <span className="text-sm font-semibold text-white">
                                        {selectedPackageDetails.sessions || selectedPackageDetails.totalSessions || "ບໍ່ຈຳກັດ"} ຄັ້ງ
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={() => setSelectedPackageDetails(null)}
                                className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer w-full"
                            >
                                ປິດໜ້າຕ່າງ
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Preview Modal */}
            {previewImage && (
                <div
                    onClick={() => setPreviewImage(null)}
                    className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#18181B] border border-zinc-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative"
                    >
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                            <h3 className="text-white font-semibold text-base truncate max-w-[380px]">
                                ຮູບໂປຣໄຟລ໌: <span className="text-[#F95738]">{previewImage.name}</span>
                            </h3>
                            <button
                                onClick={() => setPreviewImage(null)}
                                className="text-zinc-400 hover:text-white bg-zinc-800/60 p-1.5 rounded-full transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="w-full flex items-center justify-center bg-[#0F0F12] rounded-2xl overflow-hidden border border-zinc-800/80 p-2">
                            <img
                                src={previewImage.url}
                                alt={previewImage.name}
                                className="max-h-[70vh] w-auto object-contain rounded-xl shadow-lg"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={() => setPreviewImage(null)}
                                className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer"
                            >
                                ປິດໜ້າຕ່າງ
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal ເພີ່ມສະມາຊິກ */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#18181B] border border-zinc-800 rounded-2xl w-full max-w-md p-6 space-y-5">
                        <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                            <h3 className="text-lg font-bold text-white">ເພີ່ມສະມາຊິກໃໝ່</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-500 hover:text-white cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1">ຊື່-ນາມສະກຸນ</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="ປ້ອນຊື່..."
                                    className="w-full bg-[#0F0F12] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F95738]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1">ເບີໂທລະສັບ</label>
                                <input
                                    type="text"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="020..."
                                    className="w-full bg-[#0F0F12] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F95738]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1">ຮູບໂປຣໄຟລ໌</label>
                                <div className="flex items-center gap-4">
                                    {formData.photoUrl ? (
                                        <img src={formData.photoUrl} alt="Preview" className="w-14 h-14 rounded-full object-cover border border-zinc-700" />
                                    ) : (
                                        <div className="w-14 h-14 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500">
                                            <User className="w-6 h-6" />
                                        </div>
                                    )}
                                    <label className="flex-1 cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors border border-zinc-700">
                                        <Upload className="w-4 h-4 text-[#F95738]" />
                                        <span>ເລືອກໄຟລ໌ຮູບຈາກເຄື່ອງ</span>
                                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1">ເລືອກແພັກເກັດ</label>
                                <select
                                    name="packageId"
                                    required
                                    value={formData.packageId}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#0F0F12] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F95738]"
                                >
                                    <option value="">-- ເລືອກແພັກເກັດ --</option>
                                    {packages.map((pkg) => (
                                        <option key={pkg.id} value={pkg.id}>
                                            {pkg.name} ({pkg.sessions || pkg.totalSessions || 0} ຄັ້ງ - {pkg.price?.toLocaleString() || pkg.priceLak?.toLocaleString() || 0} ກີບ)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-400 hover:bg-zinc-800 cursor-pointer"
                                >
                                    ຍົກເລີກ
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="px-5 py-2.5 bg-[#F95738] hover:bg-[#e0482b] text-white rounded-xl text-sm font-semibold flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                                >
                                    {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    ບັນທຶກ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal ແກ້ໄຂສະມາຊິກ */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#18181B] border border-zinc-800 rounded-2xl w-full max-w-md p-6 space-y-5">
                        <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                            <h3 className="text-lg font-bold text-white">ແກ້ໄຂຂໍ້ມູນສະມາຊິກ</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-zinc-500 hover:text-white cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1">ຊື່-ນາມສະກຸນ</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#0F0F12] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F95738]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1">ເບີໂທລະສັບ</label>
                                <input
                                    type="text"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#0F0F12] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F95738]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1">ຮູບໂປຣໄຟລ໌</label>
                                <div className="flex items-center gap-4">
                                    {formData.photoUrl ? (
                                        <img src={formData.photoUrl} alt="Preview" className="w-14 h-14 rounded-full object-cover border border-zinc-700" />
                                    ) : (
                                        <div className="w-14 h-14 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500">
                                            <User className="w-6 h-6" />
                                        </div>
                                    )}
                                    <label className="flex-1 cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors border border-zinc-700">
                                        <Upload className="w-4 h-4 text-amber-400" />
                                        <span>ປ່ຽນໄຟລ໌ຮູບໃໝ່</span>
                                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1">ເລືອກແພັກເກັດ</label>
                                <select
                                    name="packageId"
                                    required
                                    value={formData.packageId}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#0F0F12] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F95738]"
                                >
                                    <option value="">-- ເລືອກແພັກເກັດ --</option>
                                    {packages.map((pkg) => (
                                        <option key={pkg.id} value={pkg.id}>
                                            {pkg.name} ({pkg.sessions || pkg.totalSessions || 0} ຄັ້ງ - {pkg.price?.toLocaleString() || pkg.priceLak?.toLocaleString() || 0} ກີບ)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-400 hover:bg-zinc-800 cursor-pointer"
                                >
                                    ຍົກເລີກ
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-semibold flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                                >
                                    {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    ບັນທຶກການແກ້ໄຂ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#18181B] border border-zinc-800 w-full max-w-sm rounded-2xl p-6 space-y-5 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                            <div className="flex items-center gap-2 text-rose-500">
                                <AlertTriangle className="w-5 h-5" />
                                <h3 className="text-lg font-bold text-white">ຢືນຢັນການລົບ</h3>
                            </div>
                            <button onClick={() => setIsDeleteModalOpen(false)} className="text-zinc-400 hover:text-white transition-colors cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-sm text-zinc-300">
                            ທ່ານແນ່ໃຈບໍວ່າຕ້ອງການລົບສະມາຊິກ <span className="text-white font-semibold">{memberToDelete?.fullName || memberToDelete?.name}</span> ຄົນນີ້? ຂໍ້ມູນຈະຖືກລົບອອກຈາກລະບົບຖາວອນ.
                        </p>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer"
                            >
                                ຍົກເລີກ
                            </button>
                            <button
                                type="button"
                                disabled={actionLoading}
                                onClick={confirmDelete}
                                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                            >
                                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "ລົບຂໍ້ມູນ"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}