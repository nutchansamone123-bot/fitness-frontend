export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    imageUrl?: string;
    stock: number;
    badge?: "SALE" | "NEW" | null;
}