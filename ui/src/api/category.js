// Cập nhật category
export async function updateCategory({ updatingCategory, imageFile }) {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('jsonRequest', JSON.stringify(updatingCategory));
  if (imageFile) {
    formData.append('img', imageFile);
  }
  const res = await fetch('http://localhost:8080/api/categories', {
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
    throw new Error(data?.message || 'Lỗi khi cập nhật danh mục');
  }
  return data;
}
// Thêm mới category
export async function addCategory({ addingCategory, imageFile }) {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('jsonRequest', JSON.stringify(addingCategory));
  if (imageFile) {
    formData.append('img', imageFile);
  }
  // if (!token) throw new Error('Bạn phải đăng nhập để thêm danh mục!');
  const res = await fetch('http://localhost:8080/api/categories', {
    method: 'POST',
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
    throw new Error(data?.message || 'Lỗi khi thêm danh mục');
  }
  return data;
}

// API cho Category
export async function fetchCategories({ page, size, search, sort } = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(`http://localhost:8080/api/categories/filter?page=${page}&size=${size}&sort=${encodeURIComponent(sort)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ search })
    }
  );
  let data;
  try {
    data = await res.json();
  } catch {
    throw { message: 'Lỗi không xác định từ máy chủ.' };
  }
  if (!data.success) {
    throw { message: data?.message || 'Lấy danh mục thất bại.' };
  }
  // Chuẩn hóa trả về: nếu có .data thì lấy .data, nếu không thì lấy luôn data
  return data.data || data;
}

export async function fetchAllCategories() {
  const token = localStorage.getItem('token');
  const res = await fetch(`http://localhost:8080/api/categories`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    }
  );
  let data;
  try {
    data = await res.json();
  } catch {
    throw { message: 'Lỗi không xác định từ máy chủ.' };
  }
  if (!data.success) {
    throw { message: data?.message || 'Lấy danh mục thất bại.' };
  }
  // Chuẩn hóa trả về: nếu có .data thì lấy .data, nếu không thì lấy luôn data
  return data.data || data;
}