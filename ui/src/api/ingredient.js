// API cho Ingredient
export async function fetchIngredients() {
  const res = await fetch('http://localhost:8080/api/ingredients', {
    headers: {
      'accept': '*/*'
    }
  });
  let data;
  try {
    data = await res.json();
  } catch {
    throw { message: 'Lỗi không xác định từ máy chủ.' };
  }
  if (!res.ok) {
    throw { message: data?.message || 'Lấy nguyên liệu thất bại.' };
  }
  return data.data;
} 