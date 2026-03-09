import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new blog post' })
  @ApiResponse({
    status: 201,
    description: 'Post successfully created',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async create(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.postsService.create(createPostDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all blog posts' })
  @ApiResponse({
    status: 200,
    description: 'Returns all blog posts',
  })
  async findAll() {
    return this.postsService.findAll();
  }

  @Get('author/:authorId')
  @ApiOperation({ summary: 'Get all posts by a specific author' })
  @ApiParam({
    name: 'authorId',
    description: 'UUID of the author',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all posts by the specified author',
  })
  async findByAuthor(@Param('authorId', ParseUUIDPipe) authorId: string) {
    return this.postsService.findByAuthor(authorId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a blog post by ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the blog post',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the blog post',
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.postsService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a blog post (author only)' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the blog post',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Post successfully updated',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - not the post author',
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.postsService.update(id, updatePostDto, userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a blog post (author only)' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the blog post',
    type: 'string',
  })
  @ApiResponse({
    status: 204,
    description: 'Post successfully deleted',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - not the post author',
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.postsService.remove(id, userId);
  }
}
