import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientEntity } from 'src/models/ingredient/ingredient.entity';

import { RecipeModule } from '../recipe/recipe.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { IngredientController } from './ingredient.controller';
import { IngredientService } from './ingredient.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([IngredientEntity]),
    AuthModule,
    forwardRef(() => UserModule),
    forwardRef(() => RecipeModule),
  ],
  controllers: [IngredientController],
  providers: [IngredientService],
  exports: [IngredientService],
})
export class IngredientModule {}
