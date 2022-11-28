import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto.ts';
import { Event } from 'src/events/entities/event.entity';
import { Code, DataSource, Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavour } from './entities/flavour.entity';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavour)
    private readonly flavourRepository: Repository<Flavour>,
    private readonly dataSource: DataSource,
  ) {}

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.coffeeRepository.find({
      relations: {
        flavours: true,
      },
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: string) {
    const coffee = await this.coffeeRepository.findOne({
      where: { id: +id },
      relations: {
        flavours: true,
      },
    });
    if (!coffee) {
      // throw new HttpException(`Coffee #${id} not found`, HttpStatus.NOT_FOUND);
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  async create(createCoffeeDto: CreateCoffeeDto) {
    const flavours = await Promise.all(
      createCoffeeDto.flavours.map((name) => this.preloadFlavourByName(name)),
    );

    const coffee = this.coffeeRepository.create({
      ...createCoffeeDto,
      flavours,
    });
    return this.coffeeRepository.save(coffee);
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    // updateCoffeeDto.flavours && <= checks if flavours are undefined to prevent error. Can't map an empty array
    const flavours =
      updateCoffeeDto.flavours &&
      (await Promise.all(
        updateCoffeeDto.flavours.map((flavour) =>
          this.preloadFlavourByName(flavour),
        ),
      ));

    const coffee = await this.coffeeRepository.preload({
      id: +id,
      ...updateCoffeeDto,
      flavours,
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee with id #${id} not found`);
    }
    return this.coffeeRepository.save(coffee);
  }

  async remove(id: string) {
    // re-use exisiting findOne method
    const coffee = await this.findOne(id);
    return this.coffeeRepository.remove(coffee);
  }

  async reccomend(coffee: Coffee) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      coffee.reccomendations++;

      const reccomendEvent = new Event();
      reccomendEvent.name = 'reccomend_coffee';
      reccomendEvent.type = 'coffee';
      reccomendEvent.payload = { coffeeId: coffee.id };

      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(reccomendEvent);

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private async preloadFlavourByName(name: string): Promise<Flavour> {
    const existingFlavour = await this.flavourRepository.findOne({
      where: { name },
    }); // 👈 notice the "where"
    // If the flavour exists already, return the existing flavour
    if (existingFlavour) {
      return existingFlavour;
    }
    // If the flavour does NOT exist, create a new Flavour class instance amd return it
    return this.flavourRepository.create({ name });
  }
}
