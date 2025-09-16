export async function fetchRecipeStats({ groupBy = "YEAR", startDate, endDate }) {
  const token = localStorage.getItem("token");
  const queryParams = new URLSearchParams();

  queryParams.append("groupBy", groupBy.toUpperCase());
  if (startDate) queryParams.append("startDate", startDate);
  if (endDate) queryParams.append("endDate", endDate);

  const url = `http://localhost:8080/api/admin/dashboard/recipes?${queryParams.toString()}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!res.ok) {
      if (res.status === 401) throw new Error("Unauthorized: Token invalid or expired");
      if (res.status === 403) throw new Error("Forbidden: You do not have permission");
      throw new Error(`Server error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    if (!data.success) throw new Error(data.message || "Failed to fetch stats");

    return data.data; // mảng StaticResponse { timeUnit, count }
  } catch (error) {
    throw new Error(error.message || "An unexpected error occurred");
  }
}

export function getChartData(stats, label) {
  if (!stats || stats.length === 0) {
    return { labels: [], datasets: [] };
  }
  return {
    labels: stats.map((item) => item.timeUnit),
    datasets: [
      {
        label,
        data: stats.map((item) => item.count),
        backgroundColor: "#a50034",
        borderColor: "#a50034",
        borderWidth: 1,
      },
    ],
  };
}

export async function fetchUserStats({ groupBy = "YEAR", startDate, endDate }) {
  const token = localStorage.getItem("token");
  const queryParams = new URLSearchParams();

  queryParams.append("groupBy", groupBy.toUpperCase());
  if (startDate) queryParams.append("startDate", startDate);
  if (endDate) queryParams.append("endDate", endDate);

  const url = `http://localhost:8080/api/admin/dashboard/users?${queryParams.toString()}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!res.ok) {
      if (res.status === 401) throw new Error("Unauthorized: Token invalid or expired");
      if (res.status === 403) throw new Error("Forbidden: You do not have permission");
      throw new Error(`Server error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    if (!data.success) throw new Error(data.message || "Failed to fetch stats");

    return data.data; // mảng StaticResponse { timeUnit, count }
  } catch (error) {
    throw new Error(error.message || "An unexpected error occurred");
  }
}

export async function fetchUserActivityStats({ groupBy = "YEAR", startDate, endDate }) {
  const token = localStorage.getItem("token");
  const queryParams = new URLSearchParams();

  queryParams.append("groupBy", groupBy.toUpperCase());
  if (startDate) queryParams.append("startDate", startDate);
  if (endDate) queryParams.append("endDate", endDate);

  const url = `http://localhost:8080/api/admin/dashboard/activity?${queryParams.toString()}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!res.ok) {
      if (res.status === 401) throw new Error("Unauthorized: Token invalid or expired");
      if (res.status === 403) throw new Error("Forbidden: You do not have permission");
      throw new Error(`Server error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    if (!data.success) throw new Error(data.message || "Failed to fetch stats");

    return data.data; // mảng StaticResponse { timeUnit, count }
  } catch (error) {
    throw new Error(error.message || "An unexpected error occurred");
  }
}
