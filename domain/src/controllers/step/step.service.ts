import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StepDto } from 'src/models/step/step.dto';
import { StepEntity } from 'src/models/step/step.entity';
import { Repository } from 'typeorm';

import { RecipeService } from '../recipe/recipe.service';
import { UserService } from '../user/user.service';

@Injectable()
export class StepService {
  constructor(
    @InjectRepository(StepEntity)
    private readonly stepRepo: Repository<StepEntity>,
    @Inject(forwardRef(() => RecipeService))
    private readonly recipeService: RecipeService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async createStep(
    recipeId: number,
    stepDto: StepDto,
    userEmail: string,
  ): Promise<StepEntity> {
    const recipe= await this.recipeService.getOneRecipe(recipeId);
    const step = new StepEntity();
    step.recipe = recipe;
    step.title = stepDto.title;
    step.body = stepDto.body;
    step.timeReference = stepDto.timeReference;
    const createdstep = await this.stepRepo.save(step);
    return this.getOneStep(createdstep.id);
  }

  async getSteps(recipeId: number, page: number, take: number): Promise<StepEntity[]> {
    const recipe = await this.recipeService.getOneRecipe(recipeId);
    if (recipe) {
      return recipe.steps;
    }
  }

  async getOneStep(stepId: number) {
    return this.stepRepo.findOneOrFail(stepId, {
      relations: ['recipe'],
    });
  }

  async updateStep(stepId: number, stepDto: StepDto): Promise<StepEntity> {
    const step = await this.stepRepo.findOneOrFail(stepId);
    const stepDtoWithPayload: StepEntity = {
      ...stepDto,
    };
    await this.stepRepo.update(stepId, stepDtoWithPayload);
    return await this.stepRepo.findOneOrFail(stepId);
  }

  async removeStep(stepId: number): Promise<StepEntity> {
    const step = await this.stepRepo.findOneOrFail(stepId);
    return this.stepRepo.remove(step);
  }
}
