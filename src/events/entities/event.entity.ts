import { type } from 'os';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

// This is a composite index
@Index(['name', 'type'])
@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Index()
  @Column()
  name: string;

  @Column('json')
  payload: Record<string, any>;
}
