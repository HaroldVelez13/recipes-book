import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { RecipeEntity } from '../recipe/recipe.entity';

@Entity('categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ unique: true })
  title?: string;

  @Column({ type: 'text', default: '', nullable: true })
  body?: string;

  @ManyToMany(type => RecipeEntity, recipe => recipe.categories)
  recipes?: RecipeEntity[];
}
