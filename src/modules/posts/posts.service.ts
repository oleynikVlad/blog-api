import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, IsNull, Not, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto, UpdatePostDto } from './dto';
import slugify from 'slugify';
import { GetPostsQueryDto } from 'src/modules/posts/dto/get-posts-query.dto';
import { Tag } from 'src/modules/posts/entities/tag.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ) {}

  async create(createPostDto: CreatePostDto, authorId: string): Promise<Post> {
    const slug = slugify(createPostDto.title, {
      replacement: '-',
      remove: /[*+~.()'"!:@]/g,
      lower: true,
      strict: true,
      locale: 'uk',
      trim: true,
    });
    const postBySlug = await this.postsRepository.findOne({
      where: { slug },
    });

    if (postBySlug) {
      throw new ConflictException('slug already exists');
    }
    let tags = await this.findOrCreate(createPostDto.tags);

    const post = this.postsRepository.create({
      ...createPostDto,
      authorId,
      slug,
      tags,
    });

    return this.postsRepository.save(post);
  }

  async findAll(query: GetPostsQueryDto) {
    const skip = (query.page - 1) * query.limit;

    let where: any;

    if (query.search) {
      where = [
        { title: ILike(`%${query.search}%`), publishedAt: Not(IsNull()) },
        { content: ILike(`%${query.search}%`), publishedAt: Not(IsNull()) },
      ];
    } else {
      where = { publishedAt: Not(IsNull()) };
    }

    const [items, total] = await this.postsRepository.findAndCount({
      where,
      order: { publishedAt: 'DESC' },
      take: query.limit,
      skip: skip,
      relations: ['author'],
    });
    console.log(`Found ${total} posts for search query: ${query.search}`);
    return {
      items,
      total,
      page: query.page,
      lastPage: Math.ceil(total / query.limit),
    };
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

  async findOrCreate(tagNames: string[] | undefined): Promise<Tag[]> {
    if (!tagNames) {
      return [];
    }
    const existingTags = await this.tagsRepository.findBy({
      name: In(tagNames),
    });
    const existingTagNames = existingTags.map((tag) => tag.name);

    const newTagNames = tagNames.filter(
      (name) => !existingTagNames.includes(name),
    );

    const newTags = newTagNames.map((name) =>
      this.tagsRepository.create({ name }),
    );
    await this.tagsRepository.save(newTags);

    return [...existingTags, ...newTags];
  }
}
