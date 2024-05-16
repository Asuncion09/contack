import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateContactDto {
  @IsString()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  nickname: string;

  @IsBoolean()
  @IsOptional()
  isFavorite: boolean;

  @IsString()
  @IsOptional()
  userEmail: string;
}
