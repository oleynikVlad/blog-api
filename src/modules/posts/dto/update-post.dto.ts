import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength } from 'class-validator';

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
}
