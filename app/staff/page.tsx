"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle, Loader2, UserCheck, ShieldCheck, History as HistoryIcon, ShoppingCart, Trash2, Plus, Minus, Eye, X } from "lucide-react";

export default function StaffPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<string>("checkin");

    // Check-in States
    const [barcode, setBarcode] = useState("");
    const [checkInResult, setCheckInResult] = useState<any>(null);
    const [checkInLoading, setCheckInLoading] = useState(false);
    const [checkInError, setCheckInError] = useState("");

    // Members States
    const [membersList, setMembersList] = useState<any[]>([]);
    const [fetchingMembers, setFetchingMembers] = useState(false);

    // Product Sales States
    const [products, setProducts] = useState<any[]>([]);
    const [fetchingProducts, setFetchingProducts] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [cart, setCart] = useState<any[]>([]);
    const [checkoutLoading, setCheckoutLoading] = useState(false);

    // Toast Notification State ສຳລັບແຈ້ງເຕືອນຊຳລະເງິນສຳເລັດ
    const [toastMessage, setToastMessage] = useState("");

    // Modal State ສຳລັບເບິ່ງລາຍລະອຽດສິນຄ້າ
    const [selectedProductDetail, setSelectedProductDetail] = useState<any>(null);

    // ໝວດໝູ່ຕາມທີ່ກຳນົດ
    const categories = [
        { id: "ALL", name: "ທຸກໝວດໝູ່" },
        { id: "Supplements", name: "Supplements (ອາຫານເສີມ)" },
        { id: "Energy Drinks", name: "Energy Drinks (ເຄື່ອງດื่ม)" },
        { id: "Equipment", name: "Equipment (ອຸປະກອນອອກກຳລັງກາຍ)" },
        { id: "Apparel", name: "Apparel (ເສື້ອຜ້າ/ເຄື່ອງແຕ່ງກາຍ)" },
        { id: "General", name: "General (ທົ່ວໄປ)" },
    ];

    // History States
    const [historyList, setHistoryList] = useState<any[]>([]);

    useEffect(() => {
        const updateTabFromUrl = () => {
            const params = new URLSearchParams(window.location.search);
            const tab = params.get("tab") || "checkin";
            setActiveTab(tab);
        };

        updateTabFromUrl();
        window.addEventListener("popstate", updateTabFromUrl);
        return () => window.removeEventListener("popstate", updateTabFromUrl);
    }, []);

    const loadHistory = () => {
        try {
            const savedHistory = localStorage.getItem("fitness_checkin_history");
            if (savedHistory) {
                setHistoryList(JSON.parse(savedHistory));
            } else {
                setHistoryList([]);
            }
        } catch (err) {
            console.error("Load local history error:", err);
        }
    };

    useEffect(() => {
        loadHistory();
    }, []);

    useEffect(() => {
        if (activeTab === "checkin") {
            fetchMembersList();
        } else if (activeTab === "minibar") {
            fetchProducts();
        } else if (activeTab === "history") {
            loadHistory();
        }
    }, [activeTab]);

    const fetchMembersList = async () => {
        setFetchingMembers(true);
        try {
            const token = typeof window !== "undefined"
                ? sessionStorage.getItem("token") || sessionStorage.getItem("accessToken") || localStorage.getItem("token") || localStorage.getItem("accessToken")
                : null;
            const res = await fetch("https://fitness-bxqs.onrender.com/members", {
                headers: { ...(token ? { "Authorization": `Bearer ${token}` } : {}) }
            });
            const data = await res.json();
            if (res.ok) {
                const list = Array.isArray(data) ? data : data.members || data.data || [];
                setMembersList(list);
            }
        } catch (err) {
            console.error("Fetch members error:", err);
        } finally {
            setFetchingMembers(false);
        }
    };

    const fetchProducts = async () => {
        setFetchingProducts(true);
        try {
            const token = typeof window !== "undefined"
                ? sessionStorage.getItem("token") || sessionStorage.getItem("accessToken") || localStorage.getItem("token") || localStorage.getItem("accessToken")
                : null;
            const res = await fetch("https://fitness-bxqs.onrender.com/products", {
                headers: { ...(token ? { "Authorization": `Bearer ${token}` } : {}) }
            });
            const data = await res.json();
            if (res.ok) {
                const list = Array.isArray(data) ? data : data.products || [];
                const enhancedList = list.map((p: any, idx: number) => ({
                    ...p,
                    category: p.category || "Supplements",
                    imageUrl: p.imageUrl || "https://images.unsplash.com/photo-1556742049-0a67d55362ec?auto=format&fit=crop&w=600&q=80",
                    badge: idx % 3 === 0 ? "SALE" : idx % 5 === 0 ? "NEW" : null
                }));
                setProducts(enhancedList);
            }
        } catch (err) {
            console.error("Fetch products error:", err);
        } finally {
            setFetchingProducts(false);
        }
    };

    const handleCheckIn = async (targetCode: string) => {
        if (!targetCode || !targetCode.trim()) return;
        setCheckInLoading(true);
        setCheckInError("");
        setCheckInResult(null);

        try {
            const token = typeof window !== "undefined"
                ? sessionStorage.getItem("token") || sessionStorage.getItem("accessToken") || localStorage.getItem("token") || localStorage.getItem("accessToken")
                : null;
            const res = await fetch("https://fitness-bxqs.onrender.com/members/check-in", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ code: targetCode.trim() })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Check-in ບໍ່ສຳເລັດ");

            setCheckInResult(data);
            setBarcode("");

            const memberInfo = data.member || data;
            const newHistoryItem = {
                fullName: memberInfo.fullName || "ສະມາຊິກ",
                code: memberInfo.code || targetCode.trim(),
                packageName: memberInfo.packageName || "N/A",
                createdAt: new Date().toISOString()
            };

            setHistoryList((prev) => {
                const updated = [newHistoryItem, ...prev];
                localStorage.setItem("fitness_checkin_history", JSON.stringify(updated));
                return updated;
            });
        } catch (err: any) {
            setCheckInError(err.message || "ເກີດຂໍ້ຜິດພາດ");
        } finally {
            setCheckInLoading(false);
        }
    };

    // Cart Management
    const addToCart = (product: any) => {
        setCart(prev => {
            const existing = prev.find(item => (item.id || item._id) === (product.id || product._id));
            const currentStock = Number(product.stock ?? 99);
            if (existing) {
                if (existing.quantity >= currentStock) {
                    alert("ສິນຄ້າໃນ Stock ໝົດແລ້ວ!");
                    return prev;
                }
                return prev.map(item => (item.id || item._id) === (product.id || product._id) ? { ...item, quantity: item.quantity + 1 } : item);
            }
            if (currentStock <= 0) {
                alert("ສິນຄ້າໃນ Stock ໝົດແລ້ວ!");
                return prev;
            }
            return [...prev, { ...product, id: product.id || product._id, quantity: 1 }];
        });
    };

    const updateQuantity = (id: string | number, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = item.quantity + delta;
                const currentStock = Number(item.stock ?? 99);
                if (delta > 0 && newQty > currentStock) {
                    alert("ເກີນຈຳນວນ Stock ທີ່ມີ!");
                    return item;
                }
                return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
        }).filter(Boolean));
    };

    const removeFromCart = (id: string | number) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return;

        setCheckoutLoading(true);
        try {
            const token = typeof window !== "undefined"
                ? sessionStorage.getItem("token") || sessionStorage.getItem("accessToken") || localStorage.getItem("token") || localStorage.getItem("accessToken")
                : null;
            const headers = {
                "Content-Type": "application/json",
                ...(token ? { "Authorization": `Bearer ${token}` } : {})
            };

            // 1. Loop ຕັດ Stock ສິນຄ້າແຕ່ລະໂຕໃນ Backend ຜ່ານ PATCH
            for (const cartItem of cart) {
                const productId = cartItem.id || cartItem._id;
                const currentStock = Number(cartItem.stock || 0);
                const purchasedQty = Number(cartItem.quantity || 0);
                const newStock = Math.max(0, currentStock - purchasedQty);

                try {
                    await fetch(`https://fitness-bxqs.onrender.com/products/${productId}`, {
                        method: "PATCH",
                        headers: headers,
                        body: JSON.stringify({ stock: newStock }),
                    });
                } catch (err) {
                    console.error(`Failed to update stock for product ${productId}:`, err);
                }
            }

            const totalAmount = cart.reduce((sum, item) => sum + ((item.priceLak || item.price || item.unitPrice || 0) * item.quantity), 0);

            // 2. ບັນທຶກຂໍ້ມູນລາຍຮັບໃຫ້ກົງກັບໂຄງສ້າງທີ່ໜ້າ Payments ຕ້ອງການ
            const paymentData = {
                id: Date.now(),
                items: cart,
                amountLak: totalAmount,
                amount: totalAmount, // ຮອງຮັບໜ້າ Payments ທີ່ອ່ານ field amount
                category: "PRODUCT_SALE",
                type: "INCOME",
                paymentMethod: "CASH",
                title: `ຂາຍສິນຄ້າ Minibar (${cart.length} ລາຍການ)`,
                description: `ຂາຍສິນຄ້າ Minibar (${cart.length} ລາຍການ)`,
                createdAt: new Date().toISOString()
            };

            const existingPayments = JSON.parse(localStorage.getItem("fitness_payments") || "[]");
            localStorage.setItem("fitness_payments", JSON.stringify([paymentData, ...existingPayments]));

            setCart([]);
            setToastMessage("ຊຳລະເງິນສຳເລັດ, ຕັດ Stock ແລະ ບັນທຶກລາຍຮັບແລ້ວ!");
            setTimeout(() => {
                setToastMessage("");
            }, 3000);

            // ໂຫຼດລາຍຊື່ສິນຄ້າໃໝ່ເພື່ອອັບເດດ Stock Real-time
            fetchProducts();

        } catch (err: any) {
            console.error("Checkout error:", err);
            alert(err.message || "ເກີດຂໍ້ຜິດພາດໃນການຊຳລະເງິນ");
        } finally {
            setCheckoutLoading(false);
        }
    };

    const filteredProducts = products.filter(p => {
        return selectedCategory === "ALL" || p.category === selectedCategory;
    });

    const memberData = checkInResult?.member || checkInResult;

    return (
        <div className="bg-[#0F0F12] border border-zinc-800/80 p-6 rounded-2xl relative text-zinc-300 font-sans">
            {toastMessage && (
                <div className="fixed top-6 right-6 z-50 bg-emerald-500 text-zinc-950 font-bold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Tab 1: Check-in */}
            {activeTab === "checkin" && (
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">ລະບົບສະແກນ Check-in ສະມາຊິກ</h2>
                        <p className="text-sm text-zinc-400">ສະແກນບັດ, ປ້ອນ Code ຫຼື ເລືອກຈາກລາຍຊື່ດ້ານລ່າງ</p>
                    </div>

                    {checkInError && (
                        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <span>{checkInError}</span>
                            </div>
                            <button onClick={() => setCheckInError("")}><span className="text-zinc-400 hover:text-white">✕</span></button>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        <div className="lg:col-span-6 space-y-6">
                            <form onSubmit={(e) => { e.preventDefault(); handleCheckIn(barcode); }} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">ລະຫັດສະມາຊິກ (CODE)</label>
                                    <input
                                        type="text"
                                        value={barcode}
                                        onChange={(e) => setBarcode(e.target.value)}
                                        placeholder="ປ້ອນ ຫຼື ສະແກນ Code..."
                                        className="w-full bg-[#18181B] border border-zinc-800 focus:border-emerald-500 text-white px-4 py-3.5 rounded-xl text-sm focus:outline-none transition-all"
                                        disabled={checkInLoading}
                                        autoFocus
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={checkInLoading || !barcode.trim()}
                                    className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-zinc-950 font-bold py-3.5 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                                >
                                    {checkInLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                                    <span>ຢືນຢັນ Check-in</span>
                                </button>
                            </form>

                            <div className="pt-4 border-t border-zinc-800/80">
                                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                    <UserCheck className="w-4 h-4 text-emerald-400" />
                                    <span>ເລືອກສະມາຊິກທີ່ມີຢູ່ຈິງ (Quick Check-in)</span>
                                </h3>
                                {fetchingMembers ? (
                                    <div className="text-xs text-zinc-400 flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" /> ກຳລັງໂຫຼດລາຍຊື່ສະມາຊິກ...
                                    </div>
                                ) : membersList.length === 0 ? (
                                    <p className="text-xs text-zinc-500">ບໍ່ພົບຂໍ້ມູນສະມາຊິກໃນລະບົບ</p>
                                ) : (
                                    <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                                        {membersList.map((m, index) => {
                                            const memberCode = m.code || m.barcode;
                                            const memberName = m.fullName || m.name || `ສະມາຊິກ #${index + 1}`;
                                            return (
                                                <div key={m.id || m._id || index} className="bg-[#18181B] border border-zinc-800/80 p-3 rounded-xl flex justify-between items-center hover:border-zinc-700 transition-all">
                                                    <div>
                                                        <div className="text-sm font-semibold text-white">{memberName}</div>
                                                        <div className="text-xs text-zinc-400">Code: <span className="text-emerald-400">{memberCode || "ບໍ່ມີ"}</span></div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        disabled={!memberCode}
                                                        onClick={() => { if (memberCode) setBarcode(memberCode); }}
                                                        className="bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-30 cursor-pointer"
                                                    >
                                                        ເລືອກ
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="lg:col-span-6">
                            {checkInResult ? (
                                <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 space-y-5 relative h-full flex flex-col justify-between">
                                    <button onClick={() => setCheckInResult(null)} className="absolute top-4 right-4 text-emerald-400 hover:text-white cursor-pointer">✕</button>
                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-3 bg-emerald-500/20 rounded-xl">
                                                <ShieldCheck className="w-7 h-7 text-emerald-400" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white text-lg">Check-in ສຳເລັດແລ້ວ!</h3>
                                                <p className="text-xs text-emerald-400">{checkInResult.message || "SUCCESS"}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-3 pt-3 border-t border-emerald-500/20 text-sm text-zinc-300">
                                            <div className="flex justify-between items-center bg-[#18181B]/60 p-3 rounded-xl border border-emerald-500/10">
                                                <span className="text-zinc-400">ຊື່-ນາມສະກຸນ:</span>
                                                <span className="font-bold text-white text-base">{memberData?.fullName || "ບໍ່ລະບຸ"}</span>
                                            </div>
                                            <div className="flex justify-between items-center bg-[#18181B]/60 p-3 rounded-xl border border-emerald-500/10">
                                                <span className="text-zinc-400">ລະຫັດ (Code):</span>
                                                <span className="font-bold text-emerald-400">{memberData?.code || "-"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full min-h-[320px] bg-[#18181B]/50 border border-zinc-800/80 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 text-center text-zinc-500 space-y-2">
                                    <UserCheck className="w-10 h-10 text-zinc-600 mb-1" />
                                    <p className="text-sm font-medium text-zinc-400">ຍັງບໍ່ມີການ Check-in</p>
                                    <p className="text-xs text-zinc-600">ກະລຸນາປ້ອນ Code ຫຼື ກົດເລືອກສະມາຊິກຈາກລາຍຊື່ຝ່າຍຊ້າຍ</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Tab 2: Product Sales */}
            {activeTab === "minibar" && (
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                                <ShoppingCart className="w-6 h-6 text-emerald-400" />
                                ຂາຍສິນຄ້າ (Product Sales)
                            </h2>
                            <p className="text-sm text-zinc-400">ເລືອກຊື້ສິນຄ້າ ແລະ ເຄື່ອງດื่มພາຍໃນ Fitness</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="bg-[#18181B] border border-zinc-800 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500 cursor-pointer font-medium"
                            >
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {fetchingProducts ? (
                        <div className="flex items-center gap-2 text-zinc-400 py-12 justify-center">
                            <Loader2 className="w-5 h-5 animate-spin text-emerald-400" /> ກຳລັງໂຫຼດສິນຄ້າ...
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                            {/* Product Grid */}
                            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {filteredProducts.map((product) => {
                                    const currentStock = product.stock ?? 0;
                                    return (
                                        <div
                                            key={product.id || product._id}
                                            className="bg-[#18181B] border border-zinc-800/80 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all flex flex-col justify-between group"
                                        >
                                            <div
                                                onClick={() => setSelectedProductDetail(product)}
                                                className="relative h-44 w-full bg-zinc-900 overflow-hidden cursor-pointer"
                                                title="ຄລິກເພື່ອເບິ່ງຮູບເຕັມ"
                                            >
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="bg-black/70 text-white text-xs px-3 py-1 rounded-lg flex items-center gap-1">
                                                        <Eye className="w-3.5 h-3.5" /> ເບິ່ງຮູບເຕັມ
                                                    </span>
                                                </div>
                                                {product.badge && (
                                                    <span className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-md text-white uppercase tracking-wider ${product.badge === 'SALE' ? 'bg-[#76a032]' : 'bg-black/80 border border-zinc-700'
                                                        }`}>
                                                        {product.badge}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="text-sm font-medium text-white line-clamp-1">{product.name}</h3>
                                                    <span className="text-[11px] text-zinc-500">Stock ເຫຼືອ: <strong className={currentStock > 0 ? "text-zinc-300" : "text-rose-400"}>{currentStock}</strong></span>
                                                </div>

                                                <div className="flex items-center justify-between pt-2">
                                                    <span className="text-emerald-400 font-bold text-sm">
                                                        {(product.priceLak || product.price || product.unitPrice || 0).toLocaleString()} ₭
                                                    </span>
                                                    <button
                                                        disabled={currentStock <= 0}
                                                        onClick={() => addToCart(product)}
                                                        className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-zinc-950 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-emerald-500/20 flex items-center gap-1"
                                                    >
                                                        <Plus className="w-3.5 h-3.5" /> ເລືອກ
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Cart */}
                            <div className="lg:sticky lg:top-6 bg-[#18181B] border border-zinc-800/80 p-5 rounded-2xl flex flex-col justify-between">
                                <div className="space-y-4">
                                    <h2 className="text-base font-bold text-white border-b border-zinc-800 pb-3 flex items-center justify-between">
                                        <span>ລາຍການສິນຄ້າໃນບິນ</span>
                                        <span className="text-xs text-zinc-400">{cart.length} ລາຍການ</span>
                                    </h2>

                                    <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                                        {cart.length === 0 ? (
                                            <p className="text-xs text-zinc-500 text-center py-8">ຍັງບໍ່ມີສິນຄ້າໃນຕະກຣ້າ</p>
                                        ) : (
                                            cart.map((item) => (
                                                <div key={item.id} className="flex items-center justify-between text-sm bg-[#0F0F12] p-3 rounded-xl border border-zinc-800/60 gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-white font-medium truncate">{item.name}</div>
                                                        <div className="text-xs text-emerald-400 font-semibold">
                                                            {(item.priceLak || item.price || item.unitPrice || 0).toLocaleString()} ₭
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <div className="flex items-center bg-zinc-800 rounded-lg border border-zinc-700">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, -1)}
                                                                className="p-1 hover:bg-zinc-700 text-zinc-300 rounded-l-lg transition-colors cursor-pointer"
                                                            >
                                                                <Minus className="w-3 h-3" />
                                                            </button>
                                                            <span className="px-2 text-xs font-bold text-white">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, 1)}
                                                                className="p-1 hover:bg-zinc-700 text-zinc-300 rounded-r-lg transition-colors cursor-pointer"
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </button>
                                                        </div>

                                                        <button
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors cursor-pointer border border-rose-500/20"
                                                            title="ລຶບອອກຈາກບິນ"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-zinc-800 space-y-4">
                                    <div className="flex items-center justify-between text-base font-bold text-white">
                                        <span>ຍອດລວມທັງໝົດ:</span>
                                        <span className="text-emerald-400">
                                            {cart.reduce((sum, item) => sum + ((item.priceLak || item.price || item.unitPrice || 0) * item.quantity), 0).toLocaleString()} ₭
                                        </span>
                                    </div>
                                    <button
                                        disabled={cart.length === 0 || checkoutLoading}
                                        onClick={handleCheckout}
                                        className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-zinc-950 font-bold py-2.5 rounded-xl transition-colors text-sm cursor-pointer shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                                    >
                                        {checkoutLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                        <span>ຊຳລະເງິນ ແລະ ຕັດ Stock (Checkout)</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Modal ສະແດງຮູບເຕັມ */}
            {selectedProductDetail && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-[#18181B] border border-zinc-800 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                        <button
                            onClick={() => setSelectedProductDetail(null)}
                            className="absolute top-4 right-4 bg-black/70 hover:bg-black text-white p-2 rounded-full transition-colors z-10 cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="relative w-full bg-black flex items-center justify-center p-2 flex-1 min-h-[300px]">
                            <img
                                src={selectedProductDetail.imageUrl}
                                alt={selectedProductDetail.name}
                                className="max-h-[60vh] w-auto max-w-full object-contain rounded-lg"
                            />
                        </div>

                        <div className="p-5 space-y-4 bg-[#18181B] border-t border-zinc-800">
                            <div>
                                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                                    {selectedProductDetail.category}
                                </span>
                                <h3 className="text-lg font-bold text-white mt-2">{selectedProductDetail.name}</h3>
                                <p className="text-xs text-zinc-400 mt-1">Stock คงเหลือ: {selectedProductDetail.stock ?? 0} ชิ้น</p>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <div>
                                    <span className="text-xs text-zinc-400 block">ລາຄາ:</span>
                                    <span className="text-emerald-400 font-bold text-xl">
                                        {(selectedProductDetail.priceLak || selectedProductDetail.price || selectedProductDetail.unitPrice || 0).toLocaleString()} ₭
                                    </span>
                                </div>
                                <button
                                    disabled={(selectedProductDetail.stock ?? 0) <= 0}
                                    onClick={() => {
                                        addToCart(selectedProductDetail);
                                        setSelectedProductDetail(null);
                                    }}
                                    className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-zinc-950 font-bold px-6 py-2.5 rounded-xl text-sm transition-all cursor-pointer shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" /> ເພີ່ມໃສ່ບິນ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab 3: History */}
            {activeTab === "history" && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">ປະຫວັດ Check-in ທີ່ຜ່ານມາ</h2>
                            <p className="text-sm text-zinc-400">ລາຍຊື່ສະມາຊິກທີ່ເຮັດການ Check-in ຜ່ານອຸປະກອນນີ້</p>
                        </div>
                        <button
                            onClick={() => {
                                setHistoryList([]);
                                localStorage.removeItem("fitness_checkin_history");
                            }}
                            className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer"
                        >
                            ລຶບປະຫວັດທັງໝົດ
                        </button>
                    </div>

                    <div className="space-y-3">
                        {historyList.length === 0 ? (
                            <div className="text-center py-12 bg-[#18181B]/50 border border-zinc-800/80 border-dashed rounded-2xl">
                                <HistoryIcon className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
                                <p className="text-zinc-400 text-sm font-medium">ຍັງບໍ່ມີປະຫວັດ Check-in</p>
                            </div>
                        ) : (
                            historyList.map((h, index) => (
                                <div key={index} className="bg-[#18181B] border border-zinc-800/80 p-4 rounded-xl flex justify-between items-center hover:border-zinc-700 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
                                            {historyList.length - index}
                                        </div>
                                        <div>
                                            <div className="text-white font-semibold text-base">{h.fullName}</div>
                                            <div className="text-xs text-zinc-400">Code: <strong className="text-emerald-400">{h.code}</strong></div>
                                        </div>
                                    </div>
                                    <div className="text-right text-xs text-emerald-400">
                                        {new Date(h.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}