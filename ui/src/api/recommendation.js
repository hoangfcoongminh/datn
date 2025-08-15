export async function recommendForUser() {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:8080/api/recommendation/user", {
    headers: {
      accept: "*/*",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  let data;
  try {
    data = await res.json();
  } catch {
    throw { message: "Lỗi không xác định từ máy chủ." };
  }
  if (!data.success) {
    throw { message: data?.message || "Lấy đơn vị tính thất bại." };
  }
  return data.data;
}

export async function recommendForRecipe(recipeId) {
  const token = localStorage.getItem("token");
  const url = new URL("http://localhost:8080/api/recommendation/recipe");
  if (recipeId) url.searchParams.append("recipeId", recipeId);
  const res = await fetch(url, {
    headers: {
      accept: "*/*",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  let data;
  try {
    data = await res.json();
  } catch {
    throw { message: "Lỗi không xác định từ máy chủ." };
  }
  if (!data.success) {
    throw { message: data?.message || "Lấy đơn vị tính thất bại." };
  }
  return data.data;
}
