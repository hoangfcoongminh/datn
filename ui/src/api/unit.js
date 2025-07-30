// API cho Unit (đơn vị tính)
export async function fetchUnits() {
  const res = await fetch('http://localhost:8080/api/units', {
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
    throw { message: data?.message || 'Lấy đơn vị tính thất bại.' };
  }
  return data.data;
} 