import { PartialType } from '@nestjs/mapped-types';
import { CreateCoffeeDto } from './create-coffee.dto';

export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto) {
  // Partial type:
  // 1: Inherits all validation rules
  // 2: Does the optional labelling automatically
}
