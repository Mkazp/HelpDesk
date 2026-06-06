interface RequestJsonOptions extends RequestInit {
  params?: object;
}

function buildUrl(path: string, params?: RequestJsonOptions['params']) {
  const url = new URL(path, window.location.origin);

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    url.searchParams.set(key, String(value));
  });

  return url.toString();
}

export async function requestJson<T>(path: string, options: RequestJsonOptions = {}): Promise<T> {
  const response = await fetch(buildUrl(path, options.params), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
