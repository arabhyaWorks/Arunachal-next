"use client";

import { useState } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Users,
  FileText,
  Video,
  Music,
  TrendingUp,
  UserPlus,
  Calendar,
  Flag,
  AlertTriangle,
  CheckCircle,
  X,
  ThumbsUp,
  MessageSquare,
  Share2,
  Clock,
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Mock data for charts
const userActivityData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Daily Active Users",
      data: [1200, 1350, 1250, 1420, 1550, 1350, 1400],
      borderColor: "rgb(59, 130, 246)",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      fill: true,
      tension: 0.4,
    },
    {
      label: "New Users",
      data: [150, 120, 140, 180, 220, 160, 190],
      borderColor: "rgb(16, 185, 129)",
      backgroundColor: "rgba(16, 185, 129, 0.1)",
      fill: true,
      tension: 0.4,
    },
  ],
};

const contentModerationData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Reported Posts",
      data: [25, 18, 30, 22, 28, 15, 20],
      backgroundColor: "rgba(239, 68, 68, 0.8)",
    },
    {
      label: "Removed Posts",
      data: [15, 10, 20, 12, 18, 8, 12],
      backgroundColor: "rgba(245, 158, 11, 0.8)",
    },
  ],
};

const pageInsightsData = {
  labels: ["Likes", "Followers", "Views"],
  datasets: [
    {
      data: [4500, 3800, 8200],
      backgroundColor: [
        "rgba(59, 130, 246, 0.8)",
        "rgba(16, 185, 129, 0.8)",
        "rgba(139, 92, 246, 0.8)",
      ],
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

export default function AdminStats() {
  const [timeRange, setTimeRange] = useState("7d");

  const stats = [
    {
      title: "Total Users",
      value: "2,543",
      change: "+12.5%",
      icon: Users,
      color: "from-blue-600 to-blue-700",
      trend: "up",
    },
    {
      title: "Active Members",
      value: "1,875",
      change: "+8.2%",
      icon: UserPlus,
      color: "from-green-600 to-green-700",
      trend: "up",
    },
    {
      title: "Total Content",
      value: "12,432",
      change: "+15.3%",
      icon: FileText,
      color: "from-purple-600 to-purple-700",
      trend: "up",
    },
    {
      title: "Total Events",
      value: "245",
      change: "+5.7%",
      icon: Calendar,
      color: "from-yellow-600 to-yellow-700",
      trend: "up",
    },
  ];

  const moderationStats = [
    {
      title: "Reported Posts",
      value: "158",
      change: "+12.3%",
      icon: AlertTriangle,
      color: "from-red-600 to-red-700",
      trend: "up",
    },
    {
      title: "Removed Posts",
      value: "95",
      change: "-8.5%",
      icon: X,
      color: "from-orange-600 to-orange-700",
      trend: "down",
    },
    {
      title: "Approved Posts",
      value: "1,245",
      change: "+15.2%",
      icon: CheckCircle,
      color: "from-green-600 to-green-700",
      trend: "up",
    },
    {
      title: "Pending Review",
      value: "63",
      change: "-2.8%",
      icon: Clock,
      color: "from-yellow-600 to-yellow-700",
      trend: "down",
    },
  ];

  const engagementStats = [
    {
      title: "Total Likes",
      value: "45.2K",
      icon: ThumbsUp,
      color: "from-pink-600 to-rose-600",
    },
    {
      title: "Comments",
      value: "12.8K",
      icon: MessageSquare,
      color: "from-violet-600 to-purple-600",
    },
    {
      title: "Shares",
      value: "8.5K",
      icon: Share2,
      color: "from-cyan-600 to-blue-600",
    },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Time Range Filter */}
      <div className="flex justify-end mb-6">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <span
                className={`text-sm font-medium px-2 py-1 rounded-full ${
                  stat.trend === "up"
                    ? "text-green-600 bg-green-50 dark:bg-green-900/20"
                    : "text-red-600 bg-red-50 dark:bg-red-900/20"
                }`}
              >
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {stat.title}
            </p>
          </div>
        ))}
      </div>

      {/* User Activity Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            User Activity
          </h3>
          <Line data={userActivityData} options={chartOptions} />
        </div>

        {/* Content Moderation Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Content Moderation
          </h3>
          <Bar data={contentModerationData} options={chartOptions} />
        </div>
      </div>

      {/* Moderation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {moderationStats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <span
                className={`text-sm font-medium px-2 py-1 rounded-full ${
                  stat.trend === "up"
                    ? "text-green-600 bg-green-50 dark:bg-green-900/20"
                    : "text-red-600 bg-red-50 dark:bg-red-900/20"
                }`}
              >
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {stat.title}
            </p>
          </div>
        ))}
      </div>

      {/* Page Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Page Performance
          </h3>
          <Line
            data={{
              labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              datasets: [
                {
                  label: "Page Views",
                  data: [3200, 3500, 3800, 3600, 4000, 3800, 4200],
                  borderColor: "rgb(139, 92, 246)",
                  backgroundColor: "rgba(139, 92, 246, 0.1)",
                  fill: true,
                  tension: 0.4,
                },
              ],
            }}
            options={chartOptions}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Engagement Distribution
          </h3>
          <Doughnut data={pageInsightsData} />
        </div>
      </div>

      {/* Engagement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {engagementStats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.title}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h2>
          <TrendingUp className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {[
            {
              action: "New user registered",
              user: "John Doe",
              time: "2 minutes ago",
              icon: UserPlus,
              color: "text-green-600 bg-green-100 dark:bg-green-900/20",
            },
            {
              action: "New content uploaded",
              user: "Sarah Smith",
              time: "15 minutes ago",
              icon: FileText,
              color: "text-blue-600 bg-blue-100 dark:bg-blue-900/20",
            },
            {
              action: "User role updated",
              user: "Mike Johnson",
              time: "1 hour ago",
              icon: Users,
              color: "text-purple-600 bg-purple-100 dark:bg-purple-900/20",
            },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className={`p-2 rounded-lg ${activity.color}`}>
                <activity.icon className="h-5 w-5" />
              </div>
              <div className="flex-grow">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.action}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  by {activity.user}
                </p>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}