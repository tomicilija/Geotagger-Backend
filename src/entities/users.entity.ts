import { Entity, Column, OneToMany } from 'typeorm';
import { Locations } from './locations.entity';
import { Guesses } from './guesses.entity';
import { CustomBaseEntity } from './base.entity';
import { type } from 'os';

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

  @Column()
  profilePicture: string;

  @OneToMany(
    () => Locations,
    (locations) => locations.user,
  )
  locations: Locations[];

  @OneToMany(
    () => Guesses,
    (guesses) => guesses.user,
  )
  guesses: Guesses[];
}
