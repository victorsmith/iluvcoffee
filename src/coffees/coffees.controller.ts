import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

@Controller('coffees')
export class CoffeesController {
  @Get()
  findAll(@Query() paginationQuery) {
    const { limit, offset } = paginationQuery;
    return `Limit:${limit}, Offset: ${offset}`;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `Id of coffee = ${id}`;
  }

  @Post()
  @HttpCode(HttpStatus.GONE)
  create(@Body() body) {
    return body;
  }

  @Patch(':id')
  patchById(@Param('id') id: string, @Body() body) {
    return `Patching record with id: ${id}. Body is now: ${body}`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `Deleting record with id #${id}`;
  }
}
