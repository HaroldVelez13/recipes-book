import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeEntity } from 'src/models/recipe/recipe.entity';

import { AuthModule } from '../auth/auth.module';
import { CategoryModule } from '../category/category.module';
import { StepModule } from '../step/step.module';
import { TypeModule } from '../type/type.module';
import { CommentModule } from '../comment/comment.module';
import { UserModule } from '../user/user.module';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecipeEntity]),
    AuthModule,
    CategoryModule,
    StepModule,
    TypeModule,
    forwardRef(() => CommentModule),
    forwardRef(() => UserModule),
  ],
  controllers: [RecipeController],
  providers: [RecipeService],
  exports: [RecipeService],
})
export class RecipeModule {}
