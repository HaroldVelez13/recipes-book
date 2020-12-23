import { IsInt, IsNotEmpty, Length } from 'class-validator';

export class StepDto {

  @Length(5, 250)
  title: string;

  @IsNotEmpty()
  @Length(15)
  body?: string;

  @IsInt()
  timeReference?: number;

}
