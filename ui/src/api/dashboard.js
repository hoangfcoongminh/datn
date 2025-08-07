export async function fetchRecipeStats(type = "day", params = {}) {
  const token = localStorage.getItem("token");
  const queryParams = new URLSearchParams();
  queryParams.append("groupBy", type.toUpperCase());

  switch (type) {
    case "year":
      if (params.year) queryParams.append("year", params.year);
      break;
    case "month":
      if (params.year) queryParams.append("year", params.year);
      if (params.month) queryParams.append("month", params.month);
      break;
    case "day":
      if (params.startDate) queryParams.append("startDate", params.startDate);
      if (params.endDate) queryParams.append("endDate", params.endDate);
      break;
    default:
      throw new Error("Invalid type parameter");
  }

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
      if (res.status === 401) {
        throw new Error("Unauthorized: Token invalid or expired");
      } else if (res.status === 403) {
        throw new Error("Forbidden: You do not have permission to access this resource");
      }
      throw new Error(`Server error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch dashboard data");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching recipe stats:", error);
    throw new Error(error.message || "An unexpected error occurred");
  }
}

// export async function fetchUserStats(type, params) {
//   const queryParams = new URLSearchParams({ groupBy: type.toUpperCase() });
//   if (params.year) queryParams.append("year", params.year);
//   if (params.month) queryParams.append("month", params.month);
//   if (params.startDate) queryParams.append("startDate", params.startDate);
//   if (params.endDate) queryParams.append("endDate", params.endDate);

//   const url = `http://localhost:8080/api/admin/dashboard/users?${queryParams.toString()}`;
//   const token = localStorage.getItem("token");

//   try {
//     const res = await fetch(url, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       },
//     });

//     if (!res.ok) {
//       if (res.status === 401) throw new Error("Unauthorized: Token invalid or expired");
//       if (res.status === 403) throw new Error("Forbidden: You do not have permission");
//       throw new Error(`Server error: ${res.status} ${res.statusText}`);
//     }

//     const data = await res.json();
//     if (!data.success) throw new Error(data.message || "Failed to fetch user stats");
//     return data.data;
//   } catch (error) {
//     console.error("Error fetching user stats:", error);
//     throw new Error(error.message || "An unexpected error occurred");
//   }
// }

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
