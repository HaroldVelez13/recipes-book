import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CategoryEntity } from '../category/category.entity';
import { CommentEntity } from '../comment/comment.entity';
import { StepEntity } from '../step/step.entity';
import { UserEntity } from '../user/user.entity';
import { TypeEntity } from '../type/type.entity';
import { IngredientEntity } from '../ingredient/ingredient.entity';

@Entity('recipes')
export class RecipeEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  title?: string;

  @Column({ type: 'text' })
  body?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @Column({ nullable: true })
  editedAt?: Date;

  @Column({ default: true })
  published?: boolean;

  @Column({ default: 0 })
  claps?: number;

  @Column({ default: 0 })
  views?: number;

  @OneToMany(type => StepEntity, step => step.recipe)
  steps?: StepEntity[];

  @OneToMany(type => CommentEntity, comment => comment.recipe)
  comments?: CommentEntity[];

  @ManyToOne(type => UserEntity, user => user.recipes)
  author?: UserEntity;

  @ManyToMany(type => CategoryEntity, category => category.recipes)
  @JoinTable({ name: 'recipe_categories' })
  categories?: CategoryEntity[];

  @ManyToOne(type => TypeEntity, type => type.recipes)
  type?: TypeEntity;

  @ManyToMany(() => IngredientEntity, ingredient => ingredient.recipes)
  ingredients?: IngredientEntity[];
}
