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