import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentDto } from 'src/models/comment/comment.dto';
import { CommentEntity } from 'src/models/comment/comment.entity';
import { Repository } from 'typeorm';

import { RecipeService } from '../recipe/recipe.service';
import { UserService } from '../user/user.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepo: Repository<CommentEntity>,
    @Inject(forwardRef(() => RecipeService))
    private readonly recipeService: RecipeService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async createComment(
    recipeId: number,
    commentDto: CommentDto,
    userEmail: string,
  ): Promise<CommentEntity> {
    const recipe = await this.recipeService.getOneRecipe(recipeId);
    const comment = new CommentEntity();
    comment.recipe = recipe;
    comment.message = commentDto.message;
    comment.author = (await this.userService.getOneUserByEmail(userEmail)).username;
    const createdComment = await this.commentRepo.save(comment);
    return this.getOneComment(createdComment.id);
  }

  async getComments(recipeId: number, page: number, take: number): Promise<CommentEntity[]> {
    const recipe = await this.recipeService.getOneRecipe(recipeId);
    if (recipe) {
      return recipe.comments;
    }
  }

  async getOneComment(commentId: number) {
    return this.commentRepo.findOneOrFail(commentId, {
      relations: ['recipe'],
    });
  }

  async updateComment(commentId: number, commentDto: CommentDto): Promise<CommentEntity> {
    const comment = await this.commentRepo.findOneOrFail(commentId);
    const commentDtoWithPayload: CommentEntity = {
      editedAt: new Date(),
      ...commentDto,
    };
    await this.commentRepo.update(commentId, commentDtoWithPayload);
    return await this.commentRepo.findOneOrFail(commentId);
  }

  async removeComment(commentId: number): Promise<CommentEntity> {
    const comment = await this.commentRepo.findOneOrFail(commentId);
    return this.commentRepo.remove(comment);
  }
}
