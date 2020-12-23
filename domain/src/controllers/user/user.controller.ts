import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from 'src/models/user/user.dto';

import { User } from '../auth/decorators/user.decorator';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/count')
  @UseGuards(AuthGuard())
  getCount() {
    try {
      return this.userService.getCount();
    } catch (err) {
      throw new HttpException(null, HttpStatus.NO_CONTENT);
    }
  }

  @Get()
  @UseGuards(AuthGuard())
  getAll(@Query('page') page: number, @Query('take') take: number) {
    try {
      return this.userService.getUsers(page, take);
    } catch (err) {
      throw new HttpException(null, HttpStatus.NO_CONTENT);
    }
  }

  @Get('/own')
  @UseGuards(AuthGuard())
  async getOwn(@User() user: any) {
    try {
      const userOwnInfo = this.userService.getOneUserRecipesByEmail(user.email);
      return userOwnInfo;
    } catch (err) {
      throw new HttpException(null, HttpStatus.NO_CONTENT);
    }
  }

  @Get('/own/recipes')
  @UseGuards(AuthGuard())
  async getOwnRecipes(@User() user: any, @Query('page') page: number, @Query('take') take: number) {
    try {
      const recipesOfUser = this.userService.getOneUserRecipesByEmail(user.email, page, take);
      return recipesOfUser;
    } catch (err) {
      throw new HttpException(null, HttpStatus.NO_CONTENT);
    }
  }

  @Get('/own/recipes/count')
  @UseGuards(AuthGuard())
  async getOwnRecipesCount(@User() user: any) {
    try {
      const countOfUserRecipes = this.userService.getOneUserRecipesCountByEmail(user.email);
      return countOfUserRecipes;
    } catch (err) {
      throw new HttpException(null, HttpStatus.NO_CONTENT);
    }
  }

  @Put(':userId')
  @UseGuards(AuthGuard())
  async edit(@Param('userId') userId: number, @Body() userDto: UserDto) {
    try {
      const ret = await this.userService.editUser(userId, userDto);
      return ret;
    } catch (err) {
      throw new HttpException(null, HttpStatus.NO_CONTENT);
    }
  }

  @Delete(':userId')
  @UseGuards(AuthGuard())
  async delete(@Param('userId') userId: number) {
    try {
      const user = await this.userService.getOneUserById(userId);
      const ret = await this.userService.deleteUser(user);
      return ret;
    } catch (err) {
      throw new HttpException(null, HttpStatus.NO_CONTENT);
    }
  }

  @Get('/authors')
  getAuthors(@Query('page') page: number, @Query('take') take: number) {
    try {
      return this.userService.getAuthors(page, take);
    } catch (err) {
      throw new HttpException(null, HttpStatus.NO_CONTENT);
    }
  }
}
