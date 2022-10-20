import { Entity, Column, OneToMany } from 'typeorm';
import { Locations } from './locations.entity';
import { Guesses } from './guesses.entity';
import { CustomBaseEntity } from './base.entity';

@Entity()
export class Users extends CustomBaseEntity {
  @Column({ unique: true }) // Not alowing 2 of the same emails
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @OneToMany(
    () => Locations,
    location => location.user_id,
  )
  locations: Locations[];

  @OneToMany(
    () => Guesses,
    guess => guess.user_id,
  )
  guesses: Guesses[];
}
