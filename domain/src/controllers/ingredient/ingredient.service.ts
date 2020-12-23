import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IngredientDto } from 'src/models/ingredient/ingredient.dto';
import { IngredientEntity } from 'src/models/ingredient/ingredient.entity';
import { Repository } from 'typeorm';


@Injectable()
export class IngredientService {
  constructor(
    @InjectRepository(IngredientEntity)
    private readonly ingredientRepo: Repository<IngredientEntity>,
  ) {}

  async createIngredient(
    ingredientDto: IngredientDto,
  ): Promise<IngredientEntity> {
    const ingredient = new IngredientEntity();
    ingredient.name = ingredientDto.name;
    ingredient.quantity = ingredientDto.quantity;
    ingredient.unit = ingredientDto.unit;
    ingredient.iconName = ingredientDto.iconName;
    ingredient.iconType = ingredientDto.iconType;
    const createdIngredient = await this.ingredientRepo.save(ingredient);
    return this.getOneIngredient(createdIngredient.id);
  }

  async getIngredients( page: number, take: number): Promise<IngredientEntity[]> {
    return this.ingredientRepo.find({
      skip: take * (page - 1),
      take, 
      order: {
        id: 'DESC',
      },
    });
  }

  async getOneIngredient(ingredientId: number) {
    return this.ingredientRepo.findOneOrFail(ingredientId);
  }

  async updateIngredient(ingredientId: number, ingredientDto: IngredientDto): Promise<IngredientEntity> {
    const ingredient = await this.ingredientRepo.findOneOrFail(ingredientId);
    const ingredientDtoWithPayload: IngredientEntity = {
      editedAt: new Date(),
      ...ingredientDto,
    };
    await this.ingredientRepo.update(ingredientId, ingredientDtoWithPayload);
    return await this.ingredientRepo.findOneOrFail(ingredientId);
  }

  async removeIngredient(ingredientId: number): Promise<IngredientEntity> {
    const ingredient = await this.ingredientRepo.findOneOrFail(ingredientId);
    return this.ingredientRepo.remove(ingredient);
  }
}
