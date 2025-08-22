// API cho Ingredient
export async function fetchIngredients() {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:8080/api/ingredients', {
    headers: {
      'accept': '*/*',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });
  let data;
  try {
    data = await res.json();
  } catch {
    throw { message: 'Lỗi không xác định từ máy chủ.' };
  }
  if (!data.success) {
    throw { message: data?.message || 'Lấy nguyên liệu thất bại.' };
  }
  return data;
} 

export async function filterIngredients({ page, size, sort, search, unitIds }) {
  const token = localStorage.getItem('token');
  const res = await fetch(`http://localhost:8080/api/ingredients/filter?page=${page}&size=${size}&sort=${sort}`, {
    method: 'POST',
    headers: {
      'accept': '*/*',
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify({
      search: search || undefined,
      unitIds: unitIds || undefined
    }),
  });
  let data;
  try {
    data = await res.json();
  } catch {
    throw { message: 'Lỗi không xác định từ máy chủ.' };
  }
  if (!data.success) {
    throw { message: data?.message || 'Lấy nguyên liệu thất bại.' };
  }
  return data;
} 

export async function detailIngredient(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(`http://localhost:8080/api/ingredients/${id}`, {
    headers: {
      'accept': '*/*',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });
  let data;
  try {
    data = await res.json();
  } catch {
    throw { message: 'Lỗi không xác định từ máy chủ.' };
  }
  if (!data.success) {
    throw { message: data?.message || 'Lấy chi tiết nguyên liệu thất bại.' };
  }
  return data;
}

export async function updateIngredient({ ingredient, imageFile }) {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('jsonRequest', JSON.stringify(ingredient));
  if (imageFile) {
    formData.append('img', imageFile);
  }
  const res = await fetch(`http://localhost:8080/api/ingredients`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  let data;
  
  try {
    data = await res.json();
  } catch {
    throw new Error('Lỗi không xác định từ máy chủ.');
  }
  if (!data.success) {
    throw new Error(data?.message || 'Lỗi khi cập nhật nguyên liệu');
    
  }
  return data;
}