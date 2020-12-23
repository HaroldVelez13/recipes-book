import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { RecipeEntity } from '../recipe/recipe.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ unique: true })
  username?: string;

  @Column({ default: '', type: 'text' })
  avatar?: string;

  @Column({ unique: true })
  email?: string;

  @Column({ select: false })
  salt?: string;

  @Column({ select: false })
  password?: string;

  @Column()
  firstname?: string;

  @Column()
  lastname?: string;

  @Column({ default: false })
  isAuthor?: boolean;

  @Column({ default: false })
  isAdmin?: boolean;

  @OneToMany(type => RecipeEntity, recipe => recipe.author)
  recipes?: RecipeEntity[];
}
