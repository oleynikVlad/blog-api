// dto/get-posts-query.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetPostsQueryDto {
  @ApiPropertyOptional({
    description: 'Search by title or content keywords',
    example: 'nestjs',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by exact URL slug',
    example: 'how-to-setup-swagger',
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({
    description: 'Filter posts by a specific tag name',
    example: 'backend',
  })
  @IsOptional()
  @IsString()
  tagName?: string;

  @ApiPropertyOptional({
    default: 1,
    description: 'The page number for pagination',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    default: 10,
    description: 'Number of posts per page',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;
}
