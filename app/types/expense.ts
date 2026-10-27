export interface Expense {
    id: number;
    title: string;
    amountLak: number;
    category: string;
    note?: string | null;
    createdAt: string;
}

export type CreateExpenseDto = Omit<Expense, 'id' | 'createdAt'>;