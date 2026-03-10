import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsOptional()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'StrongP@ss1',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Username',
    example: 'user2000',
  })
  @IsString()
  @MinLength(2, { message: 'Username must be at least 2 characters long' })
  @MaxLength(64, { message: 'Username must not exceed 64 characters' })
  username: string;
}
