export async function fetchNewsFeed() {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch("http://localhost:8080/api/newsfeed", {
        method: 'GET',
        headers: {
            'accept': '*/*',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
    });
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    console.error("Failed to fetch news feed:", error);
    throw error;
  }
}