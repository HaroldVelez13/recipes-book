import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeEntity } from 'src/models/type/type.entity';

import { RecipeModule } from '../recipe/recipe.module';
import { AuthModule } from '../auth/auth.module';
import { TypeController } from './type.controller';
import { TypeService } from './type.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeEntity]),
    forwardRef(() => AuthModule),
    forwardRef(() => RecipeModule),
  ],
  controllers: [TypeController],
  providers: [TypeService],
  exports: [TypeService],
})
export class TypeModule {}
