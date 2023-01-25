import { Entity, Column, OneToMany, CreateDateColumn } from 'typeorm';
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

  @Column()
  profilePicture: string;

  @Column({ nullable: true })
  resetToken: string;

  @CreateDateColumn({type: 'timestamptz', nullable: true }) // Date_time with timezone
  resetTokenExpiration: Date;

  @OneToMany(
    () => Locations,
    locations => locations.user_id,
  )
  locations: Locations[];

  @OneToMany(
    () => Guesses,
    guesses => guesses.user_id,
  )
  guesses: Guesses[];
}
