import { toast } from "react-toastify";

export async function fetchUsers({ userRequest, page, size, sort }) {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:8080/api/admin/users?page=${page}&size=${size}&sort=${encodeURIComponent(sort)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(userRequest || {}),
      }
    );
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch users");
    }
    return data;
  } catch (err) {
    toast.error(err.message);
    throw err;
  }
}

export async function fetchRecipes({ recipeRequest, page, size, sort }) {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:8080/api/admin/recipes?page=${page}&size=${size}&sort=${encodeURIComponent(sort)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(recipeRequest || {}),
      }
    );
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch recipes");
    }
    return data;
  } catch (err) {
    toast.error(err.message);
    throw err;
  }
}

export async function fetchCategories({ categoriesRequest, page, size, sort }) {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:8080/api/admin/categories?page=${page}&size=${size}&sort=${encodeURIComponent(sort)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(categoriesRequest || {}),
      }
    );
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch categories");
    }
    return data;
  } catch (err) {
    toast.error(err.message);
    throw err;
  }
}

export async function fetchIngredients({ ingredientsRequest, page, size, sort }) {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:8080/api/admin/ingredients?page=${page}&size=${size}&sort=${encodeURIComponent(sort)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(ingredientsRequest || {}),
      }
    );
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch ingredients");
    }
    return data;
  } catch (err) {
    toast.error(err.message);
    throw err;
  }
}

export async function fetchUnits({ unitsRequest, page, size, sort }) {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:8080/api/admin/units?page=${page}&size=${size}&sort=${encodeURIComponent(sort)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(unitsRequest || {}),
      }
    );
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch units");
    }
    return data;
  } catch (err) {
    toast.error(err.message);
    throw err;
  }
}
