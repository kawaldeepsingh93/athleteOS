export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function appUrl(path: string) {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${clean}`;
}

export async function sendJson<T>(path: string, body: unknown, method = "POST"): Promise<T | null> {
  try {
    const res = await fetch(appUrl(path), {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export function postJson<T>(path: string, body: unknown) {
  return sendJson<T>(path, body, "POST");
}

export async function getJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(appUrl(path));
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
