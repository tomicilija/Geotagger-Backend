import { BaseEntity } from 'typeorm';
export declare class CustomBaseEntity extends BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}
