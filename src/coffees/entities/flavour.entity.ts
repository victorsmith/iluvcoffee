import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Coffee } from './coffee.entity';

@Entity()
export class Flavour {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // Coffee is the owner in relationship => no need to use jointable() decorator
  @ManyToMany((type) => Coffee, (coffee) => coffee.flavours)
  coffees: Coffee[];
}
