import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StepEntity } from 'src/models/step/step.entity';

import { RecipeModule } from '../recipe/recipe.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { StepController } from './step.controller';
import { StepService } from './step.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([StepEntity]),
    AuthModule,
    forwardRef(() => UserModule),
    forwardRef(() => RecipeModule),
  ],
  controllers: [StepController],
  providers: [StepService],
  exports: [StepService],
})
export class StepModule {}
