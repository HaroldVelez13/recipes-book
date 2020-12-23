import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecipeDto } from 'src/models/recipe/recipe.dto';
import { RecipeEntity } from 'src/models/recipe/recipe.entity';
import { CategoryEntity } from 'src/models/category/category.entity';
import { UserEntity } from 'src/models/user/user.entity';
import { Repository } from 'typeorm';

import { CategoryService } from '../category/category.service';
import { CommentService } from '../comment/comment.service';
import { StepService } from '../step/step.service';
import { UserService } from '../user/user.service';
import { TypeService } from '../type/type.service';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(RecipeEntity) private readonly recipeRepo: Repository<RecipeEntity>,
    private readonly catService: CategoryService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => CommentService))
    private readonly commentService: CommentService,
    @Inject(forwardRef(() => StepService))
    private readonly stepService: StepService,
    @Inject(forwardRef(() => TypeService))
    private readonly typeService: TypeService,
  ) { }

  getCount(): Promise<number> {
    return this.recipeRepo.count({});
  }

  getRecipes(page = 1, take = 25): Promise<RecipeEntity[]> {
    let skip = take * (page - 1);
    return this.recipeRepo.find({
      skip: skip,
      take,
      order: {
        id: -1,
      },
    });
  }
  getRecipesDetail(page = 1, take = 25): Promise<RecipeEntity[]> {
    const skip =  take * (page - 1);
    return this.recipeRepo
      .createQueryBuilder('recipe')
      .leftJoin('recipe.author', 'author') // n->1
      .addSelect(['author.username','author.avatar'])
      .leftJoin('recipe.type', 'type') // n->1
      .addSelect(['type'])
      .loadRelationCountAndMap('recipe.comments', 'recipe.comments')
      .loadRelationCountAndMap('recipe.steps', 'recipe.steps')
      .skip((page - 1) * take)
      .take(take)
      .orderBy('recipe.createdAt', 'DESC')
      .take(take)
      .skip(skip)
      .getMany();
  }

  getRecipesCountByUser(user: UserEntity): Promise<number> {
    return this.recipeRepo.count({
      where: {
        author: user,
      },
    });
  }

  getRecipesByUser(user: UserEntity, page = 1, take = 25): Promise<RecipeEntity[]> {
    return this.recipeRepo.find({
      skip: take * (page - 1),
      take,
      order: {
        createdAt: 'DESC',
      },
      where: {
        author: user,
      },
    });
  }

  async getRecipesCountByCategory(category: CategoryEntity): Promise<number> {
    const recipesCount = await this.recipeRepo
      .createQueryBuilder('recipe')
      .innerJoin('recipe.categories', 'category', 'category.id = :catId', { catId: category.id })
      .getCount();
    return recipesCount;
  }

  async getRecipesByCategory(category: CategoryEntity, page = 1, take = 25): Promise<RecipeEntity[]> {
    const recipes = await this.recipeRepo
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.author', 'user', 'user.id = recipe.author') // n->1
      .leftJoinAndSelect('recipe.comments', 'comment', 'comment.recipe = recipe.id') // 1->n
      .leftJoinAndSelect('recipe.steps', 'step', 'step.recipe = recipe.id') // 1->n
      .innerJoinAndSelect('recipe.categories', 'category', 'category.id = :catId', {
        catId: category.id,
      })
      .skip((page - 1) * take)
      .take(take)
      .orderBy('recipe.createdAt', 'DESC')
      .getMany();
    return recipes;
  }

  async getRecipesCountByAuthor(author: UserEntity): Promise<number> {
    const recipesCount = await this.recipeRepo.count({
      where: {
        author,
      },
    });
    return recipesCount;
  }

  async getRecipesByAuthor(author: UserEntity, page = 1, take = 25): Promise<RecipeEntity[]> {
    const recipes = await this.recipeRepo.find({
      where: {
        author,
      },
      order: {
        createdAt: 'DESC',
      },
      take,
      skip: (page - 1) * take,
      relations: ['comments', 'steps', 'categories', 'author'],
    });
    return recipes;
  }

  getOneRecipe(recipeId: number): Promise<RecipeEntity> {
    return this.recipeRepo.findOneOrFail(recipeId, {
      relations: ['comments', 'steps', 'categories', 'author'],
    });
  }

  async createRecipe(recipeDto: RecipeDto, userEmail: string, typeId: number): Promise<RecipeEntity> {
    const recipeToCreate: RecipeEntity = { ...recipeDto };
    recipeToCreate.author = await this.userService.getOneUserByEmail(userEmail);
    recipeToCreate.type = await this.typeService.getOneType(typeId);
    recipeToCreate.categories = await this.categoryIdsToEntities(recipeDto.categoryIds);
    return this.recipeRepo.save(recipeToCreate);
  }

  async updateRecipe(recipeId: number, recipeDto: RecipeDto): Promise<RecipeEntity> {
    await this.recipeRepo.findOneOrFail(recipeId);
    const categoryIds = [...recipeDto.categoryIds];
    delete recipeDto.categoryIds;
    const typeId = recipeDto.typeId;
    delete recipeDto.typeId;

    const recipeDtoWithPayload: RecipeEntity = {
      editedAt: new Date(),
      ...recipeDto,
    };
    await this.recipeRepo.update(recipeId, recipeDtoWithPayload);
    const recipeUpdated = await this.recipeRepo.findOneOrFail(recipeId);
    recipeUpdated.categories = await this.categoryIdsToEntities(categoryIds);
    recipeUpdated.type = await this.typeService.getOneType(typeId);
    return await this.recipeRepo.save(recipeUpdated);
  }

  async removeRecipe(recipeId: number): Promise<RecipeEntity> {
    const recipe = await this.recipeRepo.findOneOrFail(recipeId, { relations: ['comments', 'steps'] });
    for (const com of recipe.comments) {
      await this.commentService.removeComment(com.id);
    }
    for (const step of recipe.steps) {
      await this.stepService.removeStep(step.id);
    }
    return this.recipeRepo.remove(recipe);
  }

  // private
  private async categoryIdsToEntities(catIds: number[]): Promise<CategoryEntity[]> {
    const entities: CategoryEntity[] = [];
    for (const catId of catIds) {
      const entity = await this.catService.getOneCategory(catId);
      entities.push(entity);
    }
    return entities;
  }
}
