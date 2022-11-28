import { Coffee } from 'src/coffees/entities/coffee.entity';
import { Flavour } from 'src/coffees/entities/flavour.entity';
import { CoffeeRefactor1669614442214 } from 'src/migrations/1669614442214-CoffeeRefactor';
import { SchemaSync1669615234962 } from 'src/migrations/1669615234962-SchemaSync';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'pass123',
  database: 'postgres',
  entities: [Coffee, Flavour],
  migrations: [CoffeeRefactor1669614442214, SchemaSync1669615234962],
});
