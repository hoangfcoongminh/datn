// API cho Recipe
export async function filterRecipes({ keyword, categoryIds, ingredientIds, authorIds, page, size, sort }) {
  const token = localStorage.getItem('token');
  const res = await fetch(`http://localhost:8080/api/recipes/filter?page=${page}&size=${size}&sort=${encodeURIComponent(sort)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': '*/*',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ keyword, categoryIds, ingredientIds, authorIds })
  });
  let data;
  try {
    data = await res.json();
  } catch {
    throw { message: 'Lỗi không xác định từ máy chủ.' };
  }
  if (!data.success) {
    let err = { message: 'Lấy danh sách công thức thất bại.' };
    if (Array.isArray(data.message)) {
      err = { message: data.message };
    } else if (data.message) {
      err = { message: data.message };
    } else if (data.error) {
      err = { message: data.error };
    }
    throw err;
  }
  return data.data;
}

export async function createRecipe(recipe, imageFile) {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('jsonRequest', JSON.stringify(recipe));
  if (imageFile) {
    formData.append('img', imageFile);
  }
  const res = await fetch('http://localhost:8080/api/recipes', {
    method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      // KHÔNG set Content-Type, để browser tự set boundary cho multipart
    },
    body: formData
  });
  let data;
  try {
    data = await res.json();
  } catch {
    throw { message: 'Lỗi không xác định từ máy chủ.' };
  }
  if (!data.success) {
    let err = { message: 'Tạo công thức thất bại.' };
    if (Array.isArray(data.message)) {
      err = { message: data.message };
    } else if (data.message) {
      err = { message: data.message };
    } else if (data.error) {
      err = { message: data.error }; 
    }
    throw err;
  }
  return data.data;
}

export async function getRecipeDetail(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(`http://localhost:8080/api/recipes/${id}`, {
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
    let err = { message: 'Lấy chi tiết công thức thất bại.' };
    if (Array.isArray(data.message)) {
      err = { message: data.message };
    } else if (data.message) {
      err = { message: data.message };
    } else if (data.error) {
      err = { message: data.error };
    }
    throw err;
  }
  return data.data;
}

export async function updateRecipe(recipe, imageFile) {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('jsonRequest', JSON.stringify(recipe));
  if (imageFile) {
    formData.append('img', imageFile);
  }
  const res = await fetch('http://localhost:8080/api/recipes', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
      // KHÔNG set Content-Type, để browser tự set boundary cho multipart
    },
    body: formData
  });
  let data;
  try {
    data = await res.json();
  } catch {
    throw { message: 'Lỗi không xác định từ máy chủ.' };
  }
  if (!data.success) {
    let err = { message: 'Cập nhật công thức thất bại.' };
    if (Array.isArray(data.message)) {
      err = { message: data.message };
    } else if (data.message) {
      err = { message: data.message };
    } else if (data.error) {
      err = { message: data.error };
    }
    throw err;
  }
  return data.data;
} 