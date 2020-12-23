import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from 'src/models/comment/comment.entity';

import { RecipeModule } from '../recipe/recipe.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity]),
    AuthModule,
    forwardRef(() => UserModule),
    forwardRef(() => RecipeModule),
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
