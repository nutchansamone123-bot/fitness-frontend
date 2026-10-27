"use client";

import { useState, useEffect } from "react";
import { Package, Plus, Search, Trash2, Edit, AlertCircle, Loader2, Tag, CheckCircle2, Sparkles, Upload, X, AlertTriangle, Maximize2 } from "lucide-react";

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // 👉 Toast State
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const showToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);

    // Delete Dialog States
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<any>(null);

    // Image Preview Modal State
    const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null);

    const [formData, setFormData] = useState({
        barcode: "",
        name: "",
        category: "Supplements",
        costPriceLak: "",
        priceLak: "",
        stock: "",
        imageUrl: "",
    });

    // ດຶງຂໍ້ມູນສິນຄ້າທັງໝົດ
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const token = typeof window !== "undefined"
                ? sessionStorage.getItem("token") || sessionStorage.getItem("accessToken") || localStorage.getItem("token") || localStorage.getItem("accessToken")
                : null;

            const headers = {
                ...(token ? { "Authorization": `Bearer ${token}` } : {})
            };

            const res = await fetch("https://fitness-bxqs.onrender.com/products", { headers });
            if (!res.ok) throw new Error("ບໍ່ສາມາດດຶງຂໍ້ມູນສິນຄ້າໄດ້");
            const data = await res.json();
            setProducts(Array.isArray(data) ? data : data.products || []);
        } catch (err: any) {
            console.error("Failed to fetch products:", err);
            showToast("ເກີດຂໍ້ຜິດພາດໃນการໂຫຼດຂໍ້ມູນສິນຄ້າ", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // ສຸ່ມເລກ Barcode 12 ຫຼັກ
    const handleGenerateBarcode = () => {
        const randomBarcode = Math.floor(100000000000 + Math.random() * 900000000000).toString();
        setFormData(prev => ({ ...prev, barcode: randomBarcode }));
    };

    // ຈັດການເລືອກໄຟລ໌ຮູບພາບ (ແປງເປັນ Base64 ເພື່ອສົ່ງຜ່ານ JSON)
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showToast("ໄຟລ໌ຮູບໃຫຍ່ເກີນໄປ (ກະລຸນາໃຊ້ຂະໜາດຕ່ຳກວ່າ 5MB)", "error");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
                showToast("ອັບໂຫຼດຮູບພາບສຳເລັດແລ້ວ!");
            };
            reader.readAsDataURL(file);
        }
    };

    // ເປີດ Modal ເเพີ່ມສິນຄ້າ
    const handleOpenCreateModal = () => {
        setIsEditMode(false);
        setCurrentId(null);
        setFormData({ barcode: "", name: "", category: "Supplements", costPriceLak: "", priceLak: "", stock: "", imageUrl: "" });
        setIsModalOpen(true);
    };

    // ເປີດ Modal ແກ້ໄຂສິນຄ້າ
    const handleOpenEditModal = (item: any) => {
        setIsEditMode(true);
        setCurrentId(item.id);
        setFormData({
            barcode: item.barcode || "",
            name: item.name || "",
            category: item.category || "Supplements",
            costPriceLak: item.costPriceLak?.toString() || "",
            priceLak: item.priceLak?.toString() || "",
            stock: item.stock?.toString() || "",
            imageUrl: item.imageUrl || item.image || "",
        });
        setIsModalOpen(true);
    };

    // ບັນທຶກຂໍ້ມູນ (ສົ່ງແບບ JSON Payload ປົກກະຕິ)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (actionLoading) return;
        setActionLoading(true);

        try {
            const payload = {
                name: formData.name.trim(),
                barcode: formData.barcode.trim() || undefined,
                category: formData.category || undefined,
                costPriceLak: Number(formData.costPriceLak) || 0,
                priceLak: Number(formData.priceLak) || 0,
                stock: Number(formData.stock) || 0,
                imageUrl: formData.imageUrl || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=80",
                isActive: true
            };

            const token = typeof window !== "undefined"
                ? sessionStorage.getItem("token") || sessionStorage.getItem("accessToken") || localStorage.getItem("token") || localStorage.getItem("accessToken")
                : null;

            const url = isEditMode
                ? `https://fitness-bxqs.onrender.com/products/${currentId}`
                : "https://fitness-bxqs.onrender.com/products";

            const method = isEditMode ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                },
                body: JSON.stringify(payload)
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.message || (isEditMode ? "ບໍ່ສາມາດອັບເດດສິນຄ້າໄດ້" : "ບໍ່ສາມາດເພີ່ມສິນຄ້າໄດ້"));

            setIsModalOpen(false);
            showToast(isEditMode ? "ອັບເດດຂໍ້ມູນສິນຄ້າສຳເລັດແລ້ວ!" : "ເພີ່ມສິນຄ້າໃໝ່ສຳເລັດແລ້ວ!");
            await fetchProducts();
        } catch (err: any) {
            console.error("Failed to save product:", err);
            showToast(err.message || "ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກຂໍ້ມູນ", "error");
        } finally {
            setActionLoading(false);
        }
    };

    // ເປີດ Delete Dialog
    const openDeleteModal = (item: any) => {
        setProductToDelete(item);
        setIsDeleteModalOpen(true);
    };

    // ຢືນຢັນລົບສິນຄ້າ
    const confirmDelete = async () => {
        if (!productToDelete) return;
        setActionLoading(true);

        try {
            const token = typeof window !== "undefined"
                ? sessionStorage.getItem("token") || sessionStorage.getItem("accessToken") || localStorage.getItem("token") || localStorage.getItem("accessToken")
                : null;

            const headers = {
                ...(token ? { "Authorization": `Bearer ${token}` } : {})
            };

            const res = await fetch(`https://fitness-bxqs.onrender.com/products/${productToDelete.id}`, {
                method: "DELETE",
                headers
            });

            if (!res.ok) throw new Error("ບໍ່ສາມາດລຶບສິນຄ້າໄດ້");

            showToast("ລຶບສິນຄ້າອອກຈາກລະບົບສຳເລັດແລ້ວ!");
            setIsDeleteModalOpen(false);
            setProductToDelete(null);
            await fetchProducts();
        } catch (err: any) {
            console.error("Failed to delete product:", err);
            showToast("ເກີດຂໍ້ຜິດພາດໃນການລຶບສິນຄ້າ", "error");
        } finally {
            setActionLoading(false);
        }
    };

    // ກອງຂໍ້ມູນຕາມຄຳຄົ້ນຫາ
    const filteredProducts = products.filter((item) =>
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.barcode?.includes(searchQuery) ||
        item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id?.toString().includes(searchQuery)
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
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#18181B] p-6 rounded-2xl border border-zinc-800">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                        <Package className="w-7 h-7 text-[#F95738]" />
                        ຈັດການສິນຄ້າ (Products)
                    </h1>
                    <p className="text-sm text-zinc-400 mt-1">
                        ເພີ່ມ, ແກ້ໄຂ ແລະ ຕິດຕາມສະຕັອກສິນຄ້າພາຍໃນຮ້ານ
                    </p>
                </div>

                <button
                    onClick={handleOpenCreateModal}
                    className="inline-flex items-center gap-2 bg-[#F95738] hover:bg-[#e0482d] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-[#F95738]/20 cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    ເພີ່ມສິນຄ້າໃໝ່
                </button>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-3 bg-[#18181B] border border-zinc-800 px-4 py-3 rounded-2xl w-full sm:w-80">
                <Search className="w-5 h-5 text-zinc-500" />
                <input
                    type="text"
                    placeholder="ຄົ້ນຫາ ID, ຊື່ສິນຄ້າ, ບາໂຄດ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-white focus:outline-none text-sm w-full placeholder:text-zinc-600"
                />
            </div>

            {/* Products Table */}
            <div className="bg-[#18181B] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
                {loading ? (
                    <div className="flex items-center justify-center py-20 text-zinc-500 gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-[#F95738]" />
                        <span>ກຳລັງໂຫຼດຂໍ້ມູນສິນຄ້າ...</span>
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-800 text-zinc-400 text-xs uppercase bg-[#0F0F12]">
                                    <th className="py-4 px-6 font-semibold">ຮູບພາບ</th>
                                    <th className="py-4 px-6 font-semibold">ID / ຊື່ສິນຄ້າ</th>
                                    <th className="py-4 px-6 font-semibold">ໝວດໝູ່</th>
                                    <th className="py-4 px-6 font-semibold">ລາຄາທຶນ</th>
                                    <th className="py-4 px-6 font-semibold">ລາຄາຂາຍ</th>
                                    <th className="py-4 px-6 font-semibold">ສະຕັອກ</th>
                                    <th className="py-4 px-6 font-semibold text-center">ຈັດການ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/60 text-sm text-zinc-300">
                                {filteredProducts.map((item) => {
                                    const rawPhoto = item.imageUrl || item.image || item.photoUrl;
                                    let productPhoto = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=80";

                                    if (rawPhoto) {
                                        if (rawPhoto.startsWith("http://") || rawPhoto.startsWith("https://") || rawPhoto.startsWith("data:image")) {
                                            productPhoto = rawPhoto;
                                        } else if (rawPhoto.startsWith("/")) {
                                            productPhoto = `https://fitness-bxqs.onrender.com${rawPhoto}`;
                                        } else {
                                            productPhoto = `https://fitness-bxqs.onrender.com/uploads/${rawPhoto}`;
                                        }
                                    }

                                    return (
                                        <tr key={item.id} className="hover:bg-zinc-800/30 transition-colors">
                                            <td className="py-4 px-6">
                                                <div
                                                    onClick={() => setPreviewImage({ url: productPhoto, name: item.name })}
                                                    className="relative group w-10 h-10 rounded-xl overflow-hidden border border-zinc-700 cursor-pointer"
                                                    title="ຄລິກເພື່ອເບິ່ງຮູບຂະໜາດໃຫຍ່"
                                                >
                                                    <img
                                                        src={productPhoto}
                                                        alt={item.name}
                                                        onError={(e) => {
                                                            e.currentTarget.src = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=80";
                                                        }}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                        <Maximize2 className="w-3.5 h-3.5 text-white" />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[11px] font-mono font-bold bg-[#F95738]/10 text-[#F95738] px-2 py-0.5 rounded border border-[#F95738]/20">
                                                        ID: {item.id}
                                                    </span>
                                                </div>
                                                <div className="font-semibold text-white">{item.name}</div>
                                                <div className="text-xs text-zinc-500 font-mono">Barcode: {item.barcode || "-"}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="inline-flex items-center gap-1 bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-lg text-xs">
                                                    <Tag className="w-3 h-3 text-[#F95738]" />
                                                    {item.category || "General"}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-zinc-400 font-mono">
                                                {Number(item.costPriceLak || 0).toLocaleString()} ₭
                                            </td>
                                            <td className="py-4 px-6 text-emerald-400 font-bold font-mono">
                                                {Number(item.priceLak || 0).toLocaleString()} ₭
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${item.stock > 5 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                                                    }`}>
                                                    {item.stock} ຊິ້ນ
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleOpenEditModal(item)}
                                                        className="p-2 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 rounded-lg transition-colors cursor-pointer"
                                                        title="ແກ້ໄຂສິນຄ້າ"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(item)}
                                                        className="p-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors cursor-pointer"
                                                        title="ລຶບສິນຄ້າ"
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
                ) : (
                    <div className="text-center py-16 text-zinc-500 space-y-2">
                        <Package className="w-10 h-10 mx-auto opacity-40" />
                        <p>ບໍ່ພົບຂໍ້ມູນສິນຄ້າ</p>
                    </div>
                )}
            </div>

            {/* Modal ເພີ່ມ/ແກ້ໄຂສິນຄ້າ */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-[#18181B] border border-zinc-800 w-full max-w-lg rounded-2xl p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                {isEditMode ? <Edit className="w-5 h-5 text-amber-400" /> : <Plus className="w-5 h-5 text-[#F95738]" />}
                                {isEditMode ? "ແກ້ໄຂຂໍ້ມູນສິນຄ້າ" : "ເພີ່ມສິນຄ້າໃໝ່"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs text-zinc-400">ຊື່ສິນຄ້າ</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-[#0F0F12] border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#F95738]"
                                        placeholder="ເຊັ່ນ: Whey Protein"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs text-zinc-400">Barcode</label>
                                        <button
                                            type="button"
                                            onClick={handleGenerateBarcode}
                                            className="text-[10px] text-[#F95738] hover:underline flex items-center gap-1 cursor-pointer"
                                        >
                                            <Sparkles className="w-3 h-3" /> ສຸ່ມບາໂຄດ
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.barcode}
                                        onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                                        className="w-full bg-[#0F0F12] border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#F95738]"
                                        placeholder="ກົດສຸ່ມ ຫຼື ພິມ..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs text-zinc-400">ໝວດໝູ່ (Category)</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-[#0F0F12] border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#F95738]"
                                    >
                                        <option value="Supplements">Supplements (ອາຫານເສີມ)</option>
                                        <option value="Energy Drinks">Energy Drinks (ເຄື່ອງດື່ມ)</option>
                                        <option value="Equipment">Equipment (ອຸປະກອນອອກກຳລັງກາຍ)</option>
                                        <option value="Apparel">Apparel (ເສື້ອຜ້າ/ເຄື່ອງແຕ່ງກາຍ)</option>
                                        <option value="General">General (ທົ່ວໄປ)</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs text-zinc-400">ຈຳນວນສະຕັອກ</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        className="w-full bg-[#0F0F12] border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#F95738]"
                                        placeholder="20"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs text-zinc-400">ລາຄາທຶນ (LAK)</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.costPriceLak}
                                        onChange={(e) => setFormData({ ...formData, costPriceLak: e.target.value })}
                                        className="w-full bg-[#0F0F12] border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#F95738]"
                                        placeholder="350000"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs text-zinc-400">ລາຄາຂາຍ (LAK)</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.priceLak}
                                        onChange={(e) => setFormData({ ...formData, priceLak: e.target.value })}
                                        className="w-full bg-[#0F0F12] border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#F95738]"
                                        placeholder="450000"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs text-zinc-400">ຮູບພາບສິນຄ້າ</label>
                                <div className="flex items-center gap-4">
                                    {formData.imageUrl && (
                                        <img src={formData.imageUrl} alt="Preview" className="w-14 h-14 rounded-xl object-cover border border-zinc-700" />
                                    )}
                                    <label className="flex-1 cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors border border-zinc-700">
                                        <Upload className="w-4 h-4 text-[#F95738]" />
                                        <span>ເລືອກໄຟລ໌ຮູບຈາກເຄື່ອງ</span>
                                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm transition-colors cursor-pointer"
                                >
                                    ຍົກເລີກ
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className={`px-5 py-2.5 text-white rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer ${isEditMode ? "bg-amber-500 hover:bg-amber-600" : "bg-[#F95738] hover:bg-[#e0482d]"
                                        }`}
                                >
                                    {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {isEditMode ? "ບັນທຶກການແກ້ໄຂ" : "ບັນທຶກສິນຄ້າ"}
                                </button>
                            </div>
                        </form>
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
                                ຮູບສິນຄ້າ: <span className="text-[#F95738]">{previewImage.name}</span>
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
                            ທ່ານແນ່ໃຈບໍວ່າຕ້ອງການລົບສິນຄ້າ <span className="text-white font-semibold">{productToDelete?.name}</span> (ID: {productToDelete?.id}) ນີ້? ຂໍ້ມູນຈະຖືກລົບອອກຈາກລະບົບຖາວອນ.
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