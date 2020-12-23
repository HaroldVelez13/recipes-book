import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecipeEntity } from 'src/models/recipe/recipe.entity';
import { UserDto } from 'src/models/user/user.dto';
import { UserEntity } from 'src/models/user/user.entity';
import { Repository } from 'typeorm';

import { RecipeService } from '../recipe/recipe.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    @Inject(forwardRef(() => RecipeService))
    private readonly recipeService: RecipeService,
  ) {}

  getCount(): Promise<number> {
    return this.userRepo.count({});
  }

  getUsers(page = 1, take = 25): Promise<UserEntity[]> {
    let skip = take * (page - 1);
    return this.userRepo.find({
      skip: skip,
      take,
      order: {
        id: -1,
      },
    });
  }

  getAuthors(page = 1, take = 25): Promise<UserEntity[]> {
    return this.userRepo.find({
      /* skip: take * (page - 1),
      take, */
      where: {
        isAuthor: true,
      },
    });
  }

  async getOneUserByEmail(email: string): Promise<UserEntity> {
    return await this.userRepo.findOneOrFail({
      where: {
        email,
      },
    });
  }

  async getOneUserRecipesByEmail(
    email: string,
    page?: number,
    take?: number,
  ): Promise<RecipeEntity[]> {
    let skip = take * (page - 1);
    const u = await this.userRepo.findOneOrFail({
      where: {
        email
      },
    });
    return await this.recipeService.getRecipesByUser(u, page, take);
  }
  async getOneUserRecipesCountByEmail(email: string): Promise<number> {
    const u = await this.userRepo.findOneOrFail({
      where: {
        email,
      },
    });
    return await this.recipeService.getRecipesCountByUser(u);
  }

  async getOneUserSaltByEmail(email: string): Promise<UserEntity> {
    return await this.userRepo
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .select(['user.salt'])
      .getOne();
  }

  async getOneUserByEmailAndPassword(email: string, password: string): Promise<UserEntity> {
    return await this.userRepo.findOneOrFail({
      where: {
        email,
        password,
      },
    });
  }

  async getOneUserById(id: number): Promise<UserEntity> {
    return await this.userRepo.findOneOrFail({
      where: {
        id,
      },
    });
  }

  async createUser(user: UserDto): Promise<UserEntity> {
    return await this.userRepo.save(user);
  }

  async deleteUser(user: UserDto): Promise<UserEntity> {
    return await this.userRepo.remove(user);
  }

  async editUser(userId: number, user: UserDto): Promise<UserEntity> {
    await this.userRepo.findOneOrFail(userId);
    await this.userRepo.update(userId, user);
    return this.userRepo.findOneOrFail(userId);
  }
}
