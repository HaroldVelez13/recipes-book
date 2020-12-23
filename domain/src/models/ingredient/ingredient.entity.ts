import { Column, CreateDateColumn, Entity, ManyToMany,JoinTable, PrimaryGeneratedColumn } from 'typeorm';

import { RecipeEntity } from '../recipe/recipe.entity';

@Entity('ingredients')
export class IngredientEntity {

  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name?: string;

  @Column()
  quantity?: string;

  @Column()
  unit?: string;
  
  @Column()
  iconName?: string;

  @Column()
  iconType?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @Column({ nullable: true })
  editedAt?: Date;

  @ManyToMany(() => RecipeEntity, recipe => recipe.ingredients)
  recipes?: RecipeEntity[];

}
