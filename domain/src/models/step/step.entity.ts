import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { RecipeEntity } from '../recipe/recipe.entity';

@Entity('steps')
export class StepEntity {

  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  title?: string;

  @Column()
  body?: string;

  @Column()
  timeReference?: number;

  @ManyToOne(type => RecipeEntity, recipe => recipe.steps)
  recipe?: RecipeEntity;

}
