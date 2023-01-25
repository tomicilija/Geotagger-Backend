import {
  Entity,
  JoinColumn,
  ManyToOne,
  Column,
  OneToMany,
} from 'typeorm';

import { Users } from './users.entity';
import { Guesses } from './guesses.entity';
import { CustomBaseEntity } from './base.entity';

@Entity()
export class Locations extends CustomBaseEntity {
  @Column()
  name: string;

  @Column({ name: 'latitude', type: 'decimal' })
  latitude: number;

  @Column({ name: 'longitude', type: 'decimal' })
  longitude: number;

  @Column()
  image: string;

  @Column()
  user_id: string;

  @ManyToOne(() => Users, (user) => user.id, { cascade: true })
  @JoinColumn({ name: 'user_id'})
  user: string;

  @OneToMany(() => Guesses, (guess) => guess.location_id)
  guesses: Guesses[];
}
