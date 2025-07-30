// API cho Category
export async function fetchCategories({ page = 0, size = 5, search = '', sort = 'name,asc' } = {}) {
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
  if (!res.ok) {
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
  if (!res.ok) {
    throw { message: data?.message || 'Lấy danh mục thất bại.' };
  }
  // Chuẩn hóa trả về: nếu có .data thì lấy .data, nếu không thì lấy luôn data
  return data.data || data;
}