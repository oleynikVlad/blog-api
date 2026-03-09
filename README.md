# Blog API

A production-ready RESTful API for a blog platform built with NestJS, TypeScript, PostgreSQL, TypeORM, and JWT authentication.

## Features

- User registration and authentication with JWT
- Full CRUD operations for blog posts
- Authorization: only post authors can update/delete their posts
- Input validation with class-validator
- Swagger API documentation
- TypeORM migrations
- Modular NestJS architecture

## Project Structure

```
src/
  modules/
    auth/           # Authentication (register, login, JWT strategy)
    users/          # User entity and service
    posts/          # Blog posts CRUD
  common/
    guards/         # JWT auth guard
    decorators/     # Custom decorators (CurrentUser)
  database/         # TypeORM config, migrations
```

## Prerequisites

- Node.js >= 18
- PostgreSQL >= 14
- npm

## Getting Started

### 1. Clone and install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=blog_api
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=1d
PORT=3000
```

### 3. Create the database

```bash
createdb blog_api
```

### 4. Run migrations

```bash
npm run migration:run
```

### 5. Start the application

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

### 6. Access Swagger documentation

Open [http://localhost:3000/api/docs](http://localhost:3000/api/docs) in your browser.

## API Endpoints

### Auth

| Method | Endpoint         | Description          | Auth Required |
|--------|------------------|----------------------|---------------|
| POST   | /auth/register   | Register a new user  | No            |
| POST   | /auth/login      | Login                | No            |

### Posts

| Method | Endpoint              | Description              | Auth Required |
|--------|-----------------------|--------------------------|---------------|
| GET    | /posts                | Get all posts            | No            |
| GET    | /posts/:id            | Get a post by ID         | No            |
| GET    | /posts/author/:authorId | Get posts by author    | No            |
| POST   | /posts                | Create a new post        | Yes           |
| PATCH  | /posts/:id            | Update a post (author)   | Yes           |
| DELETE | /posts/:id            | Delete a post (author)   | Yes           |

## Example Requests

### Register

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "StrongP@ss1"}'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "StrongP@ss1"}'
```

### Create a Post

```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{"title": "My First Post", "content": "Hello world!"}'
```

### Get All Posts

```bash
curl http://localhost:3000/posts
```

### Update a Post

```bash
curl -X PATCH http://localhost:3000/posts/<post-id> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{"title": "Updated Title"}'
```

### Delete a Post

```bash
curl -X DELETE http://localhost:3000/posts/<post-id> \
  -H "Authorization: Bearer <your-jwt-token>"
```

## Scripts

| Script               | Description                       |
|----------------------|-----------------------------------|
| `npm run start:dev`  | Start in development mode (watch) |
| `npm run build`      | Build for production              |
| `npm run start:prod` | Start production build            |
| `npm run lint`       | Run ESLint                        |
| `npm run test`       | Run unit tests                    |
| `npm run migration:run`    | Run pending migrations      |
| `npm run migration:revert` | Revert last migration       |

## License

MIT
