import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const Home = ({ plan = [], completed = [], sessions = 0 }) => {
  const [chartData, setChartData] = useState([]);

  // 📊 Calculate stats
  const totalTasks = plan.length;
  const doneTasks = completed.length;
  const progress = totalTasks
    ? Math.round((doneTasks / totalTasks) * 100)
    : 0;

  const studyTime = sessions * 25; // minutes

  // 📅 Generate last 7 days data
  useEffect(() => {
    const today = new Date();
    let data = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);

      const dateStr = d.toLocaleDateString();

      // Get stored progress
      const saved = JSON.parse(localStorage.getItem("daily_progress")) || {};

      data.push({
        date: dateStr,
        value: saved[dateStr] || 0
      });
    }

    setChartData(data);
  }, [plan, completed]);

  // 💾 Save today's progress
  useEffect(() => {
    const today = new Date().toLocaleDateString();

    const saved = JSON.parse(localStorage.getItem("daily_progress")) || {};

    saved[today] = completed.length;

    localStorage.setItem("daily_progress", JSON.stringify(saved));
  }, [completed]);

  return (
    <div className="space-y-6">

      {/* 🔥 HEADER */}
      <div className="p-6 rounded-xl text-white bg-gradient-to-r from-blue-500 to-purple-600">
        <h1 className="text-3xl font-bold">Welcome Back 👋</h1>
        <p>Stay consistent and achieve your goals 🚀</p>
      </div>

      {/* 📊 STATS */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">

        <Stat title="Tasks" value={totalTasks} />
        <Stat title="Done" value={doneTasks} />
        <Stat title="Progress" value={`${progress}%`} />
        <Stat title="Streak" value={sessions} />
        <Stat title="Time" value={`${studyTime} min`} />
        <Stat title="Top" value={plan[0] || "None"} />

      </div>

      {/* 📈 GRAPH */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-bold mb-4">📈 Progress Over Time</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// 🔹 Small reusable card
const Stat = ({ title, value }) => (
  <div className="bg-white p-4 rounded-xl shadow">
    <p className="text-gray-500">{title}</p>
    <h2 className="text-xl font-bold">{value}</h2>
  </div>
);

export default Home;