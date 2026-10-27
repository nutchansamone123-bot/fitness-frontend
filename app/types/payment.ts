export interface Payment {
    id: number;
    memberId: number;
    memberName?: string;
    packageId: number;
    packageName?: string;
    amountLak: number;
    paymentMethod: 'CASH' | 'TRANSFER'; // ເງິນສົດ ຫຼື ໂອນ
    note?: string | null;
    createdAt: string;
}

export type CreatePaymentDto = Omit<Payment, 'id' | 'createdAt'>;