import { IsEmail, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterDto {
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(1)
  name: string;

  @IsEmail()
  email: string;

  // esto para limpiar los espacio en blanco
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(6)
  password: string;
}
