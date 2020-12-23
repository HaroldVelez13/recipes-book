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
import { RecipeDto } from 'src/models/recipe/recipe.dto';

import { User } from '../auth/decorators/user.decorator';
import { CategoryService } from '../category/category.service';
import { UserService } from '../user/user.service';
import { RecipeService } from './recipe.service';

@Controller('api/recipe')
export class RecipeController {
  constructor(
    private readonly service: RecipeService,
    private readonly categoryService: CategoryService,
    private readonly userService: UserService,
  ) {}

  @Get('/count')
  async getCount() {
    try {
      return await this.service.getCount();
    } catch (err) {
      throw new HttpException(err, HttpStatus.NO_CONTENT);
    }
  }

  @Get()
  getAll(@Query('page') page: number, @Query('take') take: number) {
    try {
      return this.service.getRecipes(page, take);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':recipeId')
  async getOne(@Param('recipeId') recipeId: number) {
    try {
      return await this.service.getOneRecipe(recipeId);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    }
  }

  @Post()
  @UseGuards(AuthGuard())
  async create(@Body() RecipeDto: RecipeDto, @User() user: any) {
    try {
      return await this.service.createRecipe(RecipeDto, user.email, 1);
    } catch (err) {
      console.log(err);
      throw new HttpException(err, HttpStatus.NOT_ACCEPTABLE);
    }
  }

  @Put(':recipeId')
  @UseGuards(AuthGuard())
  async update(@Param('recipeId') recipeId: number, @Body() RecipeDto: RecipeDto) {
    try {
      return await this.service.updateRecipe(recipeId, RecipeDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_ACCEPTABLE);
    }
  }

  @Delete(':recipeId')
  @UseGuards(AuthGuard())
  async remove(@Param('recipeId') recipeId: number) {
    try {
      return await this.service.removeRecipe(recipeId);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    }
  }

  @Get('category/:categoryId/count')
  async getCountByCategory(@Param('categoryId') categoryId: number) {
    try {
      const category = await this.categoryService.getOneCategory(categoryId);
      return await this.service.getRecipesCountByCategory(category);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NO_CONTENT);
    }
  }

  @Get('category/:categoryId')
  async getByCategory(
    @Param('categoryId') categoryId: number,
    @Query('page') page: number,
    @Query('take') take: number,
  ) {
    try {
      const category = await this.categoryService.getOneCategory(categoryId);
      return await this.service.getRecipesByCategory(category, page, take);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NO_CONTENT);
    }
  }

  @Get('author/:authorId/count')
  async getCountByAuthor(@Param('authorId') authorId: number) {
    try {
      const author = await this.userService.getOneUserById(authorId);
      return await this.service.getRecipesCountByAuthor(author);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NO_CONTENT);
    }
  }

  @Get('author/:authorId')
  async getByAuthor(
    @Param('authorId') authorId: number,
    @Query('page') page: number,
    @Query('take') take: number,
  ) {
    try {
      const author = await this.userService.getOneUserById(authorId);
      return await this.service.getRecipesByAuthor(author, page, take);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NO_CONTENT);
    }
  }
}
