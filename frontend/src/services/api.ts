import type {
  Post,
  CreatePostData,
  UpdatePostData,
  AuthResponse,
  ApiError,
} from '../types/post';

const API_BASE = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let error: ApiError;
    try {
      error = await res.json();
    } catch {
      error = {
        message: `Request failed with status ${res.status}`,
        statusCode: res.status,
      };
    }
    throw error;
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

function authHeaders(token: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function getPosts(): Promise<Post[]> {
  const res = await fetch(`${API_BASE}/posts`);
  return handleResponse<Post[]>(res);
}

export async function getPostById(id: string): Promise<Post> {
  const res = await fetch(`${API_BASE}/posts/${id}`);
  return handleResponse<Post>(res);
}

export async function createPost(
  data: CreatePostData,
  token: string,
): Promise<Post> {
  const res = await fetch(`${API_BASE}/posts`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse<Post>(res);
}

export async function updatePost(
  id: string,
  data: UpdatePostData,
  token: string,
): Promise<Post> {
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse<Post>(res);
}

export async function deletePost(id: string, token: string): Promise<void> {
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  return handleResponse<void>(res);
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<AuthResponse>(res);
}

export async function register(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<AuthResponse>(res);
}
