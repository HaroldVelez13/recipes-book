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
import { StepDto } from 'src/models/step/step.dto';

import { User } from '../auth/decorators/user.decorator';
import { StepService } from './step.service';

@Controller('api/article/:recipeId/step')
export class StepController {
  constructor(private readonly service: StepService) {}

  @Get()
  getAll(
    @Param('recipeId') recipeId: number,
    @Query('page') page: number,
    @Query('take') take: number,
  ) {
    try {
      return this.service.getSteps(recipeId, page, take);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':stepId')
  async getOne(@Param('stepId') stepId: number) {
    try {
      return await this.service.getOneStep(stepId);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    }
  }

  @Post()
  @UseGuards(AuthGuard())
  async create(
    @Param('recipeId') recipeId: number,
    @Body() stepDto: StepDto,
    @User() user: any,
  ) {
    try {
      return await this.service.createStep(recipeId, stepDto, user.email);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_ACCEPTABLE);
    }
  }

  @Put(':stepId')
  @UseGuards(AuthGuard())
  async update(@Param('stepId') stepId: number, @Body() stepDto: StepDto) {
    try {
      return await this.service.updateStep(stepId, stepDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_ACCEPTABLE);
    }
  }

  @Delete(':stepId')
  @UseGuards(AuthGuard())
  async remove(@Param('stepId') stepId: number) {
    try {
      return await this.service.removeStep(stepId);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    }
  }
}
