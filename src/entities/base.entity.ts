import {
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class CustomBaseEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' }) // Date_time with timezone
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' }) // Date_time with timezone
  updatedAt: Date;
}
