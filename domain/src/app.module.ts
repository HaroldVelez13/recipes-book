import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DATABASE_CONFIG } from './config/database.config';
import { RecipeModule } from './controllers/recipe/recipe.module';
import { AuthModule } from './controllers/auth/auth.module';
import { CommentModule } from './controllers/comment/comment.module';
import { StepModule } from './controllers/step/step.module';
import { UserModule } from './controllers/user/user.module';
import { CategoryModule } from './controllers/category/category.module';
import { TypeModule } from './controllers/type/type.module';
import { IngredientModule } from './controllers/ingredient/ingredient.module';




@Module({
  imports: [
    TypeOrmModule.forRoot(DATABASE_CONFIG),
    AuthModule,
    UserModule,
    TypeModule,
    RecipeModule,
    StepModule,
    CommentModule,
    CategoryModule,
    IngredientModule,
  ]
})
export class AppModule { }
