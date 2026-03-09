import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto, UpdatePostDto } from './dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, authorId: string): Promise<Post> {
    const post = this.postsRepository.create({
      ...createPostDto,
      authorId,
    });

    return this.postsRepository.save(post);
  }

  async findAll(): Promise<Post[]> {
    return this.postsRepository.find({
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }

    return post;
  }

  async findByAuthor(authorId: string): Promise<Post[]> {
    return this.postsRepository.find({
      where: { authorId },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    userId: string,
  ): Promise<Post> {
    const post = await this.findById(id);

    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    Object.assign(post, updatePostDto);

    return this.postsRepository.save(post);
  }

  async remove(id: string, userId: string): Promise<void> {
    const post = await this.findById(id);

    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.postsRepository.remove(post);
  }
}
