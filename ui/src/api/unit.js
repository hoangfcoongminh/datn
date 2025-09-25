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
  if (!data.success) {
    throw { message: data?.message || 'Lấy đơn vị tính thất bại.' };
  }
  return data;
}

export async function addUnit({ addingUnit }) {
  const token = localStorage.getItem('token');

  const res = await fetch('http://localhost:8080/api/units', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // Đảm bảo định dạng JSON
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(addingUnit), // Chuyển đổi thành chuỗi JSON
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error('Lỗi không xác định từ máy chủ.');
  }

  if (!data.success) {
    throw new Error(data?.message || 'Lỗi khi thêm nguyên liệu');
  }

  return data;
}

export async function updateUnit({ unit }) {
  const token = localStorage.getItem('token');

  const res = await fetch('http://localhost:8080/api/units', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json', // Đảm bảo định dạng JSON
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(unit), // Chuyển đổi thành chuỗi JSON
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