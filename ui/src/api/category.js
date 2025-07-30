// API cho Category
export async function fetchCategories() {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:8080/api/categories', {
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });
  let data;
  try {
    data = await res.json();
  } catch {
    throw { message: 'Lỗi không xác định từ máy chủ.' };
  }
  if (!res.ok) {
    throw { message: data?.message || 'Lấy danh mục thất bại.' };
  }
  return data.data;
} 