import { toast } from "react-toastify";

export async function addFavorite(recipeId) {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:8080/api/user/favorite/${recipeId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      }
    });
    let data = await res.json();
    if (!data.success) {
      toast.error(data.message);
    }
    return data.data;
  } catch (err) {
    toast.error(err.message);
    throw err;
  }
}

// Fetch public user profile by username
export async function getUserPublicProfile(username) {
  const token = localStorage.getItem("token");

  const tryEndpoint = async (path) => {
    const res = await fetch(`http://localhost:8080${path}`, {
      headers: {
        accept: "*/*",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    let data;
    try {
      data = await res.json();
    } catch {
      return null;
    }
    if (data && data.success) return data.data;
    return null;
  };

  // Try common patterns; backend may expose one of these
  const paths = [
    `/api/users/${encodeURIComponent(username)}`,
    `/api/user/${encodeURIComponent(username)}`,
  ];

  for (const p of paths) {
    const result = await tryEndpoint(p);
    if (result) return result;
  }

  throw { message: "Lấy thông tin người dùng thất bại." };
}