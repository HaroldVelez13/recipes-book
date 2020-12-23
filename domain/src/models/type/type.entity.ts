import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { RecipeEntity } from '../recipe/recipe.entity';

@Entity('types')
export class TypeEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ unique: true })
  name?: string;

  @Column()
  iconType?: string;

  @Column()
  iconName?: string;

  @OneToMany(type => RecipeEntity, recipe => recipe.type)
  recipes?: RecipeEntity[];
}
