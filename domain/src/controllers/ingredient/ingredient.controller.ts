import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IngredientDto } from 'src/models/ingredient/ingredient.dto';
import { IngredientService } from './ingredient.service';

@Controller('api/ingredient')
export class IngredientController {
  constructor(private readonly service: IngredientService) {}

  @Get()
  getAll(
    @Query('page') page: number,
    @Query('take') take: number,
  ) {
    try {
      return this.service.getIngredients(page, take);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':ingredientId')
  async getOne(@Param('ingredientId') ingredientId: number) {
    try {
      return await this.service.getOneIngredient(ingredientId);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    }
  }

  @Post()
  @UseGuards(AuthGuard())
  async create(
    @Body() ingredientDto: IngredientDto,
  ) {
    try {
      return await this.service.createIngredient(ingredientDto);
    } catch (err) {
      console.log(err);
      throw new HttpException(err, HttpStatus.NOT_ACCEPTABLE);
    }
  }

  @Put(':ingredientId')
  @UseGuards(AuthGuard())
  async update(@Param('ingredientId') ingredientId: number, @Body() ingredientDto: IngredientDto) {
    try {
      return await this.service.updateIngredient(ingredientId, ingredientDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_ACCEPTABLE);
    }
  }

  @Delete(':ingredientId')
  @UseGuards(AuthGuard())
  async remove(@Param('ingredientId') ingredientId: number) {
    try {
      return await this.service.removeIngredient(ingredientId);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    }
  }
}
