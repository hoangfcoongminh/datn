import { toast } from "react-toastify";

// API lấy review phân trang cho 1 công thức
export async function fetchReviews(recipeId, page = 1, size = 10) {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `http://localhost:8080/api/review/recipe/${recipeId}?page=${page - 1}&size=${size}`,
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
    return { content: [], totalElements: 0 };
  }
}

// API gửi review mới
export async function postReview(comment) {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:8080/api/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(comment),
    });
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

export async function updateReview(comment) {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:8080/api/review`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(comment),
    });
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