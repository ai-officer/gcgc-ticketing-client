export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function handleResponse<T>(res: Response): Promise<T> {
  if (res.ok) return res.json() as Promise<T>;

  if (res.status === 401) {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
    throw new ApiError(401, 'Session expired. Please log in again.');
  }

  let message = `Request failed (${res.status})`;
  try {
    const body = await res.json();
    message = body?.detail ?? message;
  } catch {
    // ignore parse error
  }
  throw new ApiError(res.status, message);
}
