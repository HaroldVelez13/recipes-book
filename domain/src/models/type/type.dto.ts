import { Allow, IsNotEmpty } from 'class-validator';

export class TypeDto {


  @IsNotEmpty()
  name?: string;

  @Allow()
  iconType?: string;

  @Allow()
  iconName?: string;

}
