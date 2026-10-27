export interface Package {
    id: number;
    name: string;
    priceLak: number;
    price?: number;
    durationDays: number | null;
    sessions: number | null;
}

export type CreatePackageDto = Omit<Package, 'id'>;
export type UpdatePackageDto = Partial<CreatePackageDto>;