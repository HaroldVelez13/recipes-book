import { IsDefined, IsNotEmpty } from 'class-validator';

export class RecipeDto {

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  body: string;

  @IsDefined()
  categoryIds: number[];

  @IsDefined()
  typeId: number;

}
