import React, { useEffect, useState } from "react";
import { Card, Select, Spin, Alert, DatePicker } from "antd";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
const chartTypes = [
  { value: "bar", label: "Cột (Bar)" },
  { value: "line", label: "Đường (Line)" },
  { value: "pie", label: "Tròn (Pie)" },
  { value: "doughnut", label: "Doughnut" },
];

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
import { fetchRecipeStats, getChartData } from "../../api/dashboard";

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

const { YearPicker, MonthPicker, RangePicker } = DatePicker;

const DashBoard = () => {
  const [recipeStats, setRecipeStats] = useState([]);
  const [userStats, setUserStats] = useState([]);
  const [type, setType] = useState("year");
  const [chartType, setChartType] = useState("bar");
  const currentYear = dayjs();
  const [year, setYear] = useState(currentYear);
  const currentMonth = dayjs();
  const [month, setMonth] = useState(currentMonth);
  const today = dayjs();
  const startOfMonth = dayjs().startOf("month");

  const [dateRange, setDateRange] = useState([startOfMonth, today]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (type === "year") {
          params.year = year.year();
        } else if (type === "month") {
          params.year = year.year();
          params.month = month.month() + 1;
        } else if (type === "day") {
          params.startDate = dateRange[0]?.format("YYYY-MM-DD");
          params.endDate = dateRange[1]?.format("YYYY-MM-DD");
        }

        const recipeData = await fetchRecipeStats(type, params);
        setRecipeStats(recipeData);

        // const userData = await fetchUserStats(type, params);
        // setUserStats(userData);
      } catch (err) {
        setError(err.message || "An error occurred");
        console.log(err);
        
      } finally {
        setLoading(false);
      }
    };

    // Chỉ gọi API nếu các tham số hợp lệ
    if (
      (type === "year" && year) ||
      (type === "month" && year && month) ||
      (type === "day" && dateRange[0] && dateRange[1])
    ) {
      loadStats();
    }
  }, [type, year, month, dateRange]);

  return (
    <div style={{ padding: 32 }}>
      <h2
        style={{
          color: "#a50034",
          fontWeight: 700,
          fontSize: 32,
          marginBottom: 24,
        }}
      >
        Dashboard Quản trị
      </h2>
      <div
        style={{
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <span style={{ fontWeight: 600 }}>Thống kê theo:</span>
        <Select
          value={type}
          onChange={(value) => {
            setType(value);
            setError(null);
          }}
          style={{ width: 120 }}
          options={[
            { value: "year", label: "Năm" },
            { value: "month", label: "Tháng" },
            { value: "day", label: "Ngày" },
          ]}
        />
        <span style={{ fontWeight: 600 }}>Biểu đồ:</span>
        <Select
          value={chartType}
          onChange={(value) => {
            setChartType(value);
          }}
          style={{ width: 140 }}
          options={chartTypes}
        />
        {type === "year" && (
          <DatePicker
            picker="year"
            value={year}
            onChange={(date) => {
              if (date && dayjs.isDayjs(date) && date.isValid()) {
                setYear(date);
              }
            }}
            allowClear={false}
            style={{ width: 150, borderRadius: 8 }}
            placeholder="Chọn năm"
          />
        )}
        {type === "month" && (
          <>
            <YearPicker
              value={year}
              onChange={(date) => {
                setYear(date && dayjs.isDayjs(date) && date.isValid() ? date : currentYear);
                setError(null);
              }}
              placeholder="Chọn năm"
              allowClear={false}
              style={{ width: 120 }}
            />
            <MonthPicker
              value={month}
              onChange={(date) => {
                setMonth(date && dayjs.isDayjs(date) && date.isValid() ? date : currentMonth);
                setError(null);
              }}
              placeholder="Chọn tháng"
              allowClear={false}
              style={{ width: 150, borderRadius: 8 }}
            />
          </>
        )}
        {type === "day" && (
          <RangePicker
            value={dateRange[0] && dateRange[1] ? [dateRange[0], dateRange[1]] : null}
            onChange={(dates) => {
              if (dates && dates[0] && dates[1]) {
                setDateRange([dates[0], dates[1]]);
              } else {
                setDateRange([startOfMonth, today]);
              }
              setError(null);
            }}
            format="YYYY-MM-DD"
            allowClear={false}
            style={{ width: 280, borderRadius: 8 }}
          />
        )}
      </div>
      {error && toast.error(error)}
      {loading ? (
        <Spin size="large" />
      ) : (
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          <Card title="Công thức mới" style={{ flex: 1, minWidth: 350 }}>
            <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
              Tổng công thức:{" "}
              {recipeStats.length > 0
                ? recipeStats.reduce((sum, r) => sum + r.count, 0)
                : 0}
            </div>
            {chartType === "bar" && (
              <Bar
                data={getChartData(recipeStats, "Công thức")}
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
            {chartType === "line" && (
              <Line
                data={getChartData(recipeStats, "Công thức")}
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
            {chartType === "pie" && (
              <Pie
                data={getChartData(recipeStats, "Công thức")}
                options={{
                  responsive: true,
                  plugins: { legend: { display: true, position: "bottom" } },
                }}
              />
            )}
            {chartType === "doughnut" && (
              <Doughnut
                data={getChartData(recipeStats, "Công thức")}
                options={{
                  responsive: true,
                  plugins: { legend: { display: true, position: "bottom" } },
                }}
              />
            )}
          </Card>
          <Card title="Người dùng mới" style={{ flex: 1, minWidth: 350 }}>
            <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
              Tổng: {userStats.length > 0 ? userStats.reduce((sum, u) => sum + u.count, 0) : 0}
            </div>
            <Bar
              data={getChartData(userStats, "Người dùng")}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true, title: { display: true, text: "Số lượng" } },
                  x: { title: { display: true, text: "Thời gian" } },
                },
              }}
            />
          </Card>
        </div>
      )}
    </div>
  );
};

export default DashBoard;
