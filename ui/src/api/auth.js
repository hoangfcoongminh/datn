// Chỉ giữ lại các hàm liên quan xác thực
// Xử lý API xác thực
export async function login(username, password) {
  const res = await fetch('http://localhost:8080/api/authentic/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  let data;
  try {
    data = await res.json();
  } catch {
    throw { message: 'Lỗi không xác định từ máy chủ.' };
  }
  if (!res.ok || !data.success) {
    let err = { message: 'Đăng nhập thất bại.' };
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

export async function signup({ username, password, confirmPassword, fullName, email }) {
  const res = await fetch('http://localhost:8080/api/authentic/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, confirmPassword, fullName, email })
  });
  let data;
  try {
    data = await res.json();
  } catch {
    throw { message: 'Lỗi không xác định từ máy chủ.' };
  }
  if (!res.ok || !data.success) {
    let err = { message: 'Đăng ký thất bại.' };
    if (Array.isArray(data.message)) {
      err = { message: data.message };
    } else if (data.message) {
      err = { message: data.message };
    } else if (data.error) {
      err = { message: data.error };
    }
    throw err;
  }
  if (data.data && data.data.token) {
    localStorage.setItem('token', data.data.token);
  }
  return data.data;
}

export async function logout(token) {
  const res = await fetch('http://localhost:8080/api/authentic/logout', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  let data;
  try {
    data = await res.json();
  } catch {
    throw { message: 'Lỗi không xác định từ máy chủ.' };
  }
  if (!res.ok || !data.success) {
    let err = { message: 'Đăng xuất thất bại.' };
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
