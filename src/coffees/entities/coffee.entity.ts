import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Flavour } from './flavour.entity';

// @Entity('coffees') // sql table name will be 'coffees' here
@Entity() // sql table name will be 'coffee' by default
export class Coffee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  brand: string;

  // @Column('json', { nullable: true })
  @JoinTable()
  @ManyToMany((type) => Flavour, (flavour) => flavour.coffees, {
    cascade: true, // ['insert flavours which dont exist in "Flavours" table']
  })
  flavours: Flavour[];
}
