import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description: 'Title of the blog post',
    example: 'My First Blog Post',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(255, { message: 'Title must not exceed 255 characters' })
  title: string;

  @ApiProperty({
    description: 'Content of the blog post',
    example: 'This is the content of my first blog post. It covers...',
  })
  @IsString()
  @IsNotEmpty({ message: 'Content is required' })
  content: string;
}
