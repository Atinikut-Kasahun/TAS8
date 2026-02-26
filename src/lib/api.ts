const API_URL = "http://127.0.0.1:8000/api";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Something went wrong");
    }

    return response.json();
}

export const auth = {
    login: (credentials: any) => apiFetch("/login", {
        method: "POST",
        body: JSON.stringify(credentials),
    }),
    logout: () => apiFetch("/logout", { method: "POST" }),
    me: () => apiFetch("/user"),
};
