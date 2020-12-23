import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeDto } from 'src/models/type/type.dto';
import { TypeEntity } from 'src/models/type/type.entity';
import { Repository } from 'typeorm';

import { RecipeService } from '../recipe/recipe.service';

@Injectable()
export class TypeService {
  constructor(
    @InjectRepository(TypeEntity)
    private typeRepo: Repository<TypeEntity>,
    @Inject(forwardRef(() => RecipeService))
    private readonly recipeService: RecipeService,
  ) {}

  getCount(): Promise<number> {
    return this.typeRepo.count({});
  }

  getTypes(page = 1, take = 25): Promise<TypeEntity[]> {
    let skip = take * (page - 1);
    return this.typeRepo.find({
      skip: skip,
      take,
      order: {
        id: -1,
      },
    });
  }

  async getOneType(TypeId: number): Promise<TypeEntity> {
    return await this.typeRepo.findOneOrFail(TypeId,{
      relations: ['recipes'],
    });
  }

  async createType(type: TypeDto): Promise<TypeEntity> {
    return await this.typeRepo.save(type);
  }

  async deleteType(type: TypeDto): Promise<TypeEntity> {
    return await this.typeRepo.remove(type);
  }

  async editType(typeId: number, type: TypeDto): Promise<TypeEntity> {
    await this.typeRepo.findOneOrFail(typeId);
    await this.typeRepo.update(typeId, type);
    return this.typeRepo.findOneOrFail(typeId);
  }
}
