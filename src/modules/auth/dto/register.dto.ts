import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    required: false,
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsOptional()
  email: string;

  @ApiProperty({
    description: 'Username',
    example: 'user2000',
  })
  @IsString()
  @MinLength(2, { message: 'Username must be at least 2 characters long' })
  @MaxLength(64, { message: 'Username must not exceed 64 characters' })
  username: string;

  @ApiProperty({
    description: 'User password (minimum 8 characters)',
    example: 'StrongP@ss1',
    minLength: 8,
    maxLength: 64,
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(64, { message: 'Password must not exceed 64 characters' })
  password: string;

  @ApiProperty({
    description: 'User display name',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;
}
