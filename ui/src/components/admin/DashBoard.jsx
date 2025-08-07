// components/dashboard.jsx
import React, { useEffect, useState } from "react";
import { Card, Select, Spin, Alert, DatePicker } from "antd";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import moment from "moment";
import { fetchRecipeStats, fetchUserStats, getChartData } from "../../api/dashboard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const { YearPicker, MonthPicker, RangePicker } = DatePicker;

const DashBoard = () => {
  const [recipeStats, setRecipeStats] = useState([]);
  const [userStats, setUserStats] = useState([]);
  const [type, setType] = useState("year");
  const [year, setYear] = useState(moment().year()); // Mặc định là năm hiện tại
  const [month, setMonth] = useState(moment().month() + 1); // Mặc định là tháng hiện tại
  const [dateRange, setDateRange] = useState([
    moment().startOf("month"),
    moment(),
  ]); // Mặc định là từ đầu tháng đến hiện tại
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (type === "year") {
          params.year = year;
        } else if (type === "month") {
          params.year = year;
          params.month = month;
        } else if (type === "day") {
          params.startDate = dateRange[0]?.format("YYYY-MM-DD");
          params.endDate = dateRange[1]?.format("YYYY-MM-DD");
        }

        const recipeData = await fetchRecipeStats(type, params);
        setRecipeStats(recipeData);

        const userData = await fetchUserStats(type, params);
        setUserStats(userData);
      } catch (err) {
        setError(err.message || "An error occurred");
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
      <div style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 16 }}>
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
        {type === "year" && (
          <YearPicker
            value={year ? moment(year, "YYYY") : null}
            onChange={(date) => {
              setYear(date ? date.year() : null);
              setError(null);
            }}
            placeholder="Chọn năm"
            style={{ width: 120 }}
          />
        )}
        {type === "month" && (
          <>
            <YearPicker
              value={year ? moment(year, "YYYY") : null}
              onChange={(date) => {
                setYear(date ? date.year() : null);
                setError(null);
              }}
              placeholder="Chọn năm"
              style={{ width: 120 }}
            />
            <MonthPicker
              value={year && month ? moment(`${year}-${month}`, "YYYY-MM") : null}
              onChange={(date) => {
                setMonth(date ? date.month() + 1 : null); // month() trả về 0-11, cần +1
                setError(null);
              }}
              placeholder="Chọn tháng"
              style={{ width: 120 }}
            />
          </>
        )}
        {type === "day" && (
          <RangePicker
            value={dateRange}
            onChange={(dates) => {
              setDateRange(dates);
              setError(null);
            }}
            format="YYYY-MM-DD"
            style={{ width: 240 }}
          />
        )}
      </div>
      {error && (
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}
      {loading ? (
        <Spin size="large" />
      ) : (
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          <Card title="Công thức mới" style={{ flex: 1, minWidth: 350 }}>
            <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
              Tổng công thức: {recipeStats.length > 0 ? recipeStats.reduce((sum, r) => sum + r.count, 0) : 0}
            </div>
            <Bar
              data={getChartData(recipeStats, "Công thức")}
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