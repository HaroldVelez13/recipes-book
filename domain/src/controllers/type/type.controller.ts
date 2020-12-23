import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Put,Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TypeDto } from 'src/models/type/type.dto';

import { TypeService } from './type.service';

@Controller('api/type')
export class TypeController {
  constructor(private typeService: TypeService) {}

  @Get('/count')
  async getCount() {
    try {
      return await this.typeService.getCount();
    } catch (err) {
      throw new HttpException(err, HttpStatus.NO_CONTENT);
    }
  }
  @Get()
  @UseGuards(AuthGuard())
  getAll(@Query('page') page: number, @Query('take') take: number) {
    try {
      return this.typeService.getTypes(page, take);
    } catch (err) {
      throw new HttpException(null, HttpStatus.NO_CONTENT);
    }
  }

  @Get(':typeId')
  async getOne(@Param('typeId') typeId: number) {
    try {
      return await this.typeService.getOneType(typeId);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    }
  }

  @Post()
  @UseGuards(AuthGuard())
  async create(@Body() TypeDto: TypeDto) {
    try {
      return await this.typeService.createType(TypeDto);
    } catch (err) {
      console.log(err);
      throw new HttpException(err, HttpStatus.NOT_ACCEPTABLE);
    }
  }

  @Put(':typeId')
  @UseGuards(AuthGuard())
  async edit(@Param('typeId') typeId: number, @Body() typeDto: TypeDto) {
    try {
      const ret = await this.typeService.editType(typeId, typeDto);
      return ret;
    } catch (err) {
      throw new HttpException(null, HttpStatus.NO_CONTENT);
    }
  }

  @Delete(':typeId')
  @UseGuards(AuthGuard())
  async delete(@Param('typeId') typeId: number) {
    try {
      const type = await this.typeService.getOneType(typeId);
      const ret = await this.typeService.deleteType(type);
      return ret;
    } catch (err) {
      throw new HttpException(null, HttpStatus.NO_CONTENT);
    }
  }
}
