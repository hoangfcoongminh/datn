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

export async function addUnit({ addingUnit, imageFile }) {
  const token = localStorage.getItem('token');
  const formData = new FormData();

  // Properly serialize the JSON request
  formData.append('jsonRequest', JSON.stringify(addingUnit));

  if (imageFile) {
    formData.append('img', imageFile);
  }

  const res = await fetch('http://localhost:8080/api/units', {
    method: 'POST',
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: formData,
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

export async function updateUnit({ unit, imageFile }) {
  const token = localStorage.getItem('token');
  const formData = new FormData();

  // Properly serialize the JSON request
  formData.append('jsonRequest', JSON.stringify(unit));

  if (imageFile) {
    formData.append('img', imageFile);
  }

  const res = await fetch('http://localhost:8080/api/units', {
    method: 'PUT',
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: formData,
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