export interface Member {
    id: number;
    code: string;
    fullName: string;
    phone: string;
    photoUrl?: string | null;
    packageId?: number | null;
    packageName?: string | null;
    expireDate?: string | null;
    remainingSessions?: number | null;
    lastCheckIn?: string | null;
    createdAt?: string;
}

export type CreateMemberDto = Omit<Member, 'id' | 'createdAt'>;