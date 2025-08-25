import { toast } from "react-toastify";

export async function addFavorite(recipeId) {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `http://localhost:8080/api/user/favorite/${recipeId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );
    let data = await res.json();
    if (!data.success) {
      toast.error(data.message);
    }
    return data;
  } catch (err) {
    toast.error(err.message);
    throw err;
  }
}

// Fetch public user profile by username
export async function getUserPublicProfile(username) {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:8080/api/user/${username}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    let data = await res.json();
    if (!data.success) {
      toast.error(data.message);
    }
    return data;
  } catch (err) {
    toast.error(err.message);
  }
}

export async function getPopularUsers(type) {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:8080/api/user/popular-by/${type}`,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );
    let data = await res.json();
    if (!data.success) {
      toast.error(data.message);
    }
    return data;
  } catch (err) {
    toast.error(err.message);
  }
}

export async function getUserProfile() {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:8080/api/user/profile`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    let data = await res.json();
    if (!data.success) {
      toast.error(data.message);
    }
    return data;
  } catch (err) {
    toast.error(err.message);
  }
}

export async function updateUserProfile(user, imageFile) {
  try {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("jsonRequest", JSON.stringify(user));
    if (imageFile) {
      formData.append("img", imageFile);
    }

    const res = await fetch(`http://localhost:8080/api/user/update`, {
      method: "PUT",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    let data = await res.json();
    if (!data.success) {
      toast.error(data.message);
    }
    return data;
  } catch (err) {
    toast.error(err.message);
  }
}
