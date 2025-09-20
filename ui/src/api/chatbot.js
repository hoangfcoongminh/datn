export async function askChatbot(message) {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch('http://localhost:8080/api/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      throw new Error('Lỗi khi gọi API chatbot');
    }

    const data = await response.json();
    return data.data || 'Chatbot không có phản hồi.';
  } catch (error) {
    return 'Đã xảy ra lỗi khi gọi chatbot.';
  }
}

export async function fetchChatHistory() {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch('http://localhost:8080/api/chatbot/history', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Lỗi khi gọi API lịch sử chatbot');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}