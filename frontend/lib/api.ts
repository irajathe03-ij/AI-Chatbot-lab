
const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not configured.");
}

async function request(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}

// Authentication APIs
export const signupUser = (userData: {
  name: string;
  email: string;
  password: string;
}) => {
  return request("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const loginUser = (credentials: {
  email: string;
  password: string;
}) => {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

// User profile API
export const getUserProfile = (token: string) => {
  return request("/api/users/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Chat APIs
export const createChat = (token: string) => {
  return request("/api/chats", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getChats = (token: string) => {
  return request("/api/chats", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getChatById = (token: string, chatId: string) => {
  return request(`/api/chats/${chatId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Delete a conversation
export const deleteChat = (token: string, chatId: string) => {
  return request(`/api/chats/${chatId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Message APIs
export const sendMessage = (
  token: string,
  chatId: string,
  content: string
) => {
  return request(`/api/messages/${chatId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
};

export const getMessages = (token: string, chatId: string) => {
  return request(`/api/messages/${chatId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
