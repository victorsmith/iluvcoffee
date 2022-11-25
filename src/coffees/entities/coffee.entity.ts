import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// @Entity('coffees') // sql table name will be 'coffees' here
@Entity() // sql table name will be 'coffee' by default
export class Coffee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column('json', { nullable: true })
  flavours: string[];
}
