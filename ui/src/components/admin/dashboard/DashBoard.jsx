import React, { useEffect, useState } from "react";
import { Card, Select, Spin, DatePicker } from "antd";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { fetchRecipeStats, fetchUserStats, fetchUserActivityStats } from "../../../api/dashboard";
import ChatLauncher from "../../common/chatbot/ChatLauncher";
import AdminSidebar from "./../common/AdminSidebar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const { RangePicker } = DatePicker;

const Dashboard = () => {
  const [recipeStats, setRecipeStats] = useState([]);
  const [userStats, setUserStats] = useState([]);
  const [userActivityStats, setUserActivityStats] = useState([]); // Thêm state mới để lưu dữ liệu hoạt động người dùng
  const [groupBy, setGroupBy] = useState("year"); // year | month | day
  const [chartType, setChartType] = useState("bar"); // bar | line
  const [dateRange, setDateRange] = useState([]);
  const [loading, setLoading] = useState(false);

  const today = dayjs();

  const applyDefaultRange = (type) => {
    if (type === "year") {
      const start = today.subtract(2, "year").startOf("year");
      const end = today;
      setDateRange([start, end]);
    } else if (type === "month") {
      const start = today.startOf("year");
      const end = today;
      setDateRange([start, end]);
    } else {
      const start = today.startOf("month");
      const end = today;
      setDateRange([start, end]);
    }
  };

  useEffect(() => {
    applyDefaultRange(groupBy);
  }, [groupBy]);

  useEffect(() => {
    const loadStats = async () => {
      if (!dateRange[0] || !dateRange[1]) return;
      setLoading(true);
      try {
        const start = dateRange[0].format("YYYY-MM-DD");
        const end = dateRange[1].format("YYYY-MM-DD");

        const [recipes, users, activities] = await Promise.all([
          fetchRecipeStats({
            groupBy: groupBy.toUpperCase(),
            startDate: start,
            endDate: end,
          }),
          fetchUserStats({
            groupBy: groupBy.toUpperCase(),
            startDate: start,
            endDate: end,
          }),
          fetchUserActivityStats({
            groupBy: groupBy.toUpperCase(),
            startDate: start,
            endDate: end,
          }),
        ]);

        setRecipeStats(recipes);
        setUserStats(users);
        setUserActivityStats(activities);
      } catch (e) {
        toast.error(e.message || "Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [groupBy, dateRange]);

  const buildChartData = (stats, label) => ({
    labels: stats.map((item) => item.timeUnit),
    datasets: [
      {
        label,
        data: stats.map((item) => item.count),
        backgroundColor: label === "Người dùng" ? "#a50034" : "#007bff",
        borderColor: label === "Người dùng" ? "#a50034" : "#007bff",
        borderWidth: 1,
      },
    ],
  });

  // Pie chart data: tổng số Users vs Activities
  const pieData = {
    labels: ["Người dùng", "Hoạt động"],
    datasets: [
      {
        data: [
          userStats.length ? userStats.reduce((s, r) => s + r.count, 0) : 0,
          userActivityStats.length ? userActivityStats.reduce((s, r) => s + r.count, 0) : 0,
        ],
        backgroundColor: ["#a50034", "#007bff"],
        borderColor: ["#a50034", "#007bff"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: 32, minWidth: "300px" }}>
        <h2
          style={{
            color: "#a50034",
            fontWeight: 700,
            fontSize: "2rem",
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          Dashboard Quản trị
        </h2>

        {/* Filter chung */}
        <div
          style={{
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <span style={{ fontWeight: 600 }}>Thống kê theo:</span>
          <Select
            value={groupBy}
            onChange={setGroupBy}
            style={{ width: 140 }}
            options={[
              { value: "year", label: "Năm" },
              { value: "month", label: "Tháng" },
              { value: "day", label: "Ngày" },
            ]}
          />

          <span style={{ fontWeight: 600 }}>Biểu đồ:</span>
          <Select
            value={chartType}
            onChange={setChartType}
            style={{ width: 140 }}
            options={[
              { value: "bar", label: "Cột (Bar)" },
              { value: "line", label: "Đường (Line)" },
            ]}
          />

          <RangePicker
            value={dateRange}
            onChange={(dates) => {
              if (dates && dates[0] && dates[1]) setDateRange(dates);
            }}
            format="YYYY-MM-DD"
            allowClear={false}
            style={{ minWidth: 280, borderRadius: 8 }}
          />
        </div>

        {loading ? (
          <Spin size="large" />
        ) : (
          <>
            <div
              style={{
                display: "flex",
                gap: 32,
                flexWrap: "wrap",
                justifyContent: "center",
                marginBottom: 32,
              }}
            >
              {/* Users bên trái */}
              <Card title="Người dùng mới" style={{ flex: 1, minWidth: 300 }}>
                <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
                  Tổng người dùng:{" "}
                  {userStats.length
                    ? userStats.reduce((s, r) => s + r.count, 0)
                    : 0}
                </div>
                {chartType === "bar" ? (
                  <Bar
                    data={buildChartData(userStats, "Người dùng")}
                    options={{
                      responsive: true,
                      plugins: { legend: { display: false } },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: { display: true, text: "Số lượng" },
                        },
                        x: { title: { display: true, text: "Thời gian" } },
                      },
                    }}
                  />
                ) : (
                  <Line
                    data={buildChartData(userStats, "Người dùng")}
                    options={{
                      responsive: true,
                      plugins: { legend: { display: false } },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: { display: true, text: "Số lượng" },
                        },
                        x: { title: { display: true, text: "Thời gian" } },
                      },
                    }}
                  />
                )}
              </Card>

              {/* Recipes bên phải */}
              <Card title="Công thức mới" style={{ flex: 1, minWidth: 300 }}>
                <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
                  Tổng công thức:{" "}
                  {recipeStats.length
                    ? recipeStats.reduce((s, r) => s + r.count, 0)
                    : 0}
                </div>
                {chartType === "bar" ? (
                  <Bar
                    data={buildChartData(recipeStats, "Công thức")}
                    options={{
                      responsive: true,
                      plugins: { legend: { display: false } },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: { display: true, text: "Số lượng" },
                        },
                        x: { title: { display: true, text: "Thời gian" } },
                      },
                    }}
                  />
                ) : (
                  <Line
                    data={buildChartData(recipeStats, "Công thức")}
                    options={{
                      responsive: true,
                      plugins: { legend: { display: false } },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: { display: true, text: "Số lượng" },
                        },
                        x: { title: { display: true, text: "Thời gian" } },
                      },
                    }}
                  />
                )}
              </Card>
            </div>

            {/* Pie chart tổng hợp */}
            <Card
              title="Tỷ lệ hoạt động của người dùng"
              style={{ maxWidth: 700, margin: "0 auto" }}
            >
              <Pie
                data={pieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false, // giữ tỉ lệ chart ổn định
                  plugins: {
                    legend: { position: "bottom" },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          const dataset = context.dataset;
                          const total = dataset.data.reduce(
                            (sum, val) => sum + val,
                            0
                          );
                          const value = context.raw;
                          const percent = total
                            ? ((value / total) * 100).toFixed(1)
                            : 0;
                          return `${context.label}: ${value} (${percent}%)`;
                        },
                      },
                    },
                  },
                  animation: false, // tắt hoàn toàn animation để tránh scale bé dần
                  hoverOffset: 20, // vẫn giữ hover nổi nhẹ
                }}
                height={300}
              />
            </Card>
          </>
        )}

        <ChatLauncher />
      </div>
    </div>
  );
};

export default Dashboard;
