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

  @ManyToOne(() => Users, (users) => users.id, { cascade: true })
  user: Users;

  @OneToMany(() => Guesses, (guess) => guess.location)
  guesses: Guesses[];
}
