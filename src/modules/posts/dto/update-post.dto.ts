import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, IsArray } from 'class-validator';

export class UpdatePostDto {
  @ApiPropertyOptional({
    description: 'Title of the blog post',
    example: 'Updated Blog Post Title',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Title must not exceed 255 characters' })
  title?: string;

  @ApiPropertyOptional({
    description: 'Content of the blog post',
    example: 'This is the updated content of the blog post...',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    description: 'Short description of the blog post',
    example: 'Updated description...',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'URL of the cover image',
    example: 'https://example.com/image.jpg',
  })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional({
    description: 'Tags for the blog post',
    example: ['technology', 'web-development'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Category of the blog post',
    example: 'Technology',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;
}
