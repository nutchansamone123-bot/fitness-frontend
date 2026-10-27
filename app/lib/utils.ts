import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ຟັງຊັນຮວມ Tailwind CSS classes
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// ຟັງຊັນຈັດ Format ເງິນກີບ (LAK) ເຊັ່ນ: 350000 -> 350,000 LAK
export function formatLAK(amount: number): string {
    return new Intl.NumberFormat("lo-LA").format(amount) + " LAK";
}

// ຟັງຊັນຈັດ Format ວັນທີ
export function formatDate(dateString: string): string {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("lo-LA", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
    });
}