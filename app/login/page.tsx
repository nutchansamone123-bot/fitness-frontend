"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/lib/services";
import {
    Lock,
    Phone,
    Dumbbell,
    Loader2,
    AlertCircle,
    ArrowRight,
    Eye,
    EyeOff,
} from "lucide-react";

export default function LoginPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        phone: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.phone || !formData.password) {
            setError("ກະລຸນາປ້ອນເບີໂທ ແລະ ລະຫັດຜ່ານ");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res: any = await AuthService.login({
                phone: formData.phone,
                password: formData.password,
            });

            const token =
                res?.data?.token ||
                res?.data?.accessToken ||
                res?.token ||
                res?.accessToken;

            const user = res?.data?.user || res?.user;

            if (token) {
                localStorage.setItem("token", token);
                if (user) {
                    localStorage.setItem("user", JSON.stringify(user));
                }
                document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;

                const userRole = user?.role?.toUpperCase();

                if (userRole === "ADMIN") {
                    router.push("/dashboard");
                } else if (userRole === "STAFF") {
                    router.push("/staff");
                } else {
                    router.push("/dashboard");
                }
            } else {
                setError("ບໍ່ພົບ Token ຈາກລະບົບ ກະລຸນາກວດສອບ Backend API");
            }
        } catch (err: any) {
            console.error("Login Error:", err);
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "ເບີໂທ ຫຼື ລະຫັດຜ່ານ ບໍ່ຖືກຕ້ອງ";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0F0F12] flex items-center justify-center p-4 font-sans relative overflow-hidden">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#F95738]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md space-y-8 relative z-10">
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#F95738]/10 border border-[#F95738]/20 text-[#F95738] mb-2 shadow-lg shadow-[#F95738]/10">
                        <Dumbbell className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">
                        GYM MANAGEMENT
                    </h1>
                    <p className="text-sm text-zinc-400">
                        ເຂົ້າສູ່ລະບົບເພື່ອຈັດການ Gym & Fitness ຂອງທ່ານ
                    </p>
                </div>

                <div className="bg-[#18181B] border border-zinc-800/80 rounded-2xl p-8 shadow-2xl space-y-6">
                    {error && (
                        <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                                ເບີໂທລະສັບ (Phone Number)
                            </label>
                            <div className="relative">
                                <Phone className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <input
                                    type="text"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="ເຊັ່ນ: 02055551111"
                                    className="w-full bg-[#0F0F12] border border-zinc-800 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#F95738] transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                                ລະຫັດຜ່ານ (Password)
                            </label>
                            <div className="relative">
                                <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="••••••••"
                                    className="w-full bg-[#0F0F12] border border-zinc-800 rounded-xl pl-12 pr-12 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#F95738] transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#F95738] hover:bg-[#e0482b] text-white font-semibold py-3.5 px-4 rounded-xl text-sm transition-all shadow-lg shadow-[#F95738]/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>ກຳລັງກວດສອບຂໍ້ມູນ...</span>
                                </>
                            ) : (
                                <>
                                    <span>ເຂົ້າສູ່ລະບົບ</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-zinc-600">
                    Gym Management System &copy; {new Date().getFullYear()}
                </p>
            </div>
        </div>
    );
}