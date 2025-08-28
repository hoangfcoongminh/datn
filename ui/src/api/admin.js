import { toast } from "react-toastify";

export async function fetchUsers({ userRequest, page, size, sort }) {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:8080/api/admin/users?page=${page}&size=${size}&sort=${encodeURIComponent(sort)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(userRequest)
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

export async function fetchRecipes({ recipeRequest, page, size, sort }) {
    try {
        const token = localStorage.getItem("token");
    
        const res = await fetch(`http://localhost:8080/api/admin/recipes?page=${page}&size=${size}&sort=${encodeURIComponent(sort)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(recipeRequest)
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

export async function fetchCategories({ categoriesRequest, page, size, sort }) {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:8080/api/admin/categories?page=${page}&size=${size}&sort=${encodeURIComponent(sort)}`, {
      method: "POST",
        headers: {
          "Content-Type": "application/json",

            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(categoriesRequest)
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

export async function fetchIngredients({ ingredientsRequest, page, size, sort }) {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:8080/api/admin/ingredients?page=${page}&size=${size}&sort=${encodeURIComponent(sort)}`, {
      method: "POST",
        headers: {
          "Content-Type": "application/json",

            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(ingredientsRequest)
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

export async function fetchUnits({ unitsRequest, page, size, sort }) {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:8080/api/admin/units?page=${page}&size=${size}&sort=${encodeURIComponent(sort)}`, {
      method: "POST",
        headers: {
          "Content-Type": "application/json",

            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(unitsRequest)
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
