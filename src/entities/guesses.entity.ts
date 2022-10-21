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
  user: Users;

  @ManyToOne(() => Locations, (location) => location.id, { cascade: true })
  location: Locations;
}
