const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include", // ✅ always include cookies for auth
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  return res.json();
}
