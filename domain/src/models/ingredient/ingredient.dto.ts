import { IsNotEmpty, Allow } from 'class-validator';

export class IngredientDto {

  @IsNotEmpty()
  name: string;

  @Allow()
  quantity?: string;

  @Allow()
  unit?: string;

  @Allow()
  iconName?: string;

  @Allow()
  iconType?: string;

  

}
