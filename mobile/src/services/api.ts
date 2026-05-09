import { API_BASE_URL } from '../utils/constants';

export interface ApiRequestOptions extends RequestInit {
  token?: string;
}

export async function apiFetch<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string> | undefined) ?? {}),
  };

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const message = payload?.message ?? 'Request failed';
    throw new Error(Array.isArray(message) ? message.join(', ') : message);
  }

  const data = await response.json();
  return (data.data ?? data) as T;
}
