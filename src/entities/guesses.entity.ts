import {
  Entity,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { CustomBaseEntity } from './base.entity';
import { Locations } from './locations.entity';
import { Users } from './users.entity';

@Entity()
export class Guesses extends CustomBaseEntity {
  @Column()
  distance: number;

  @ManyToOne(() => Users, (user) => user.id, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user_id: string;

  @ManyToOne(() => Locations, (location) => location.id, { cascade: true })
  @JoinColumn({ name: 'quote_id' })
  location_id: string;
}
