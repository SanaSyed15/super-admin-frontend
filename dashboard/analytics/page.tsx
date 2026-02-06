"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

/* ---------------- TYPES ---------------- */

type Stats = {
  totalRestaurants: number;
  activeRestaurants: number;
  inactiveRestaurants: number;
  totalOwners: number;
};

type TopRestaurant = {
  id: string;
  name: string;
  city: string;
  orders: number;
};

const API_BASE = "http://localhost:5000/api";

/* ---------------- PAGE ---------------- */

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [topRestaurants, setTopRestaurants] = useState<TopRestaurant[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH ANALYTICS ---------------- */

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("superadmin_token");
        if (!token) throw new Error("No auth token found");

        const res = await fetch(`${API_BASE}/super-admin/analytics`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load analytics");

        setStats(data.stats);
        setTopRestaurants(data.topRestaurants || []);
      } catch (err: any) {
        console.error("Analytics fetch failed:", err.message);
        setStats(null);
        setTopRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  /* ---------------- STATES ---------------- */

  if (loading) {
    return <p className="text-sm text-[#7B1F1F]">Loading analytics…</p>;
  }

  if (!stats) {
    return <p className="text-sm text-[#7B1F1F]">Failed to load analytics</p>;
  }

  /* ---------------- CHART DATA ---------------- */

  const chartData = {
    labels: ["Active", "Inactive"],
    datasets: [
      {
        data: [
          stats.activeRestaurants,
          stats.inactiveRestaurants,
        ],
        backgroundColor: ["#7B1F1F", "rgba(200,169,81,0.35)"],
        borderWidth: 0,
      },
    ],
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1
          className="text-xl font-semibold"
          style={{ color: "#3B0A0D", fontFamily: "var(--font-heading)" }}
        >
          Analytics
        </h1>
        <p className="text-sm text-[#7B1F1F]">
          Platform-wide insights and performance overview
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Restaurants" value={stats.totalRestaurants} />
        <StatCard title="Active Restaurants" value={stats.activeRestaurants} />
        <StatCard title="Inactive Restaurants" value={stats.inactiveRestaurants} />
        <StatCard title="Total Owners" value={stats.totalOwners} />
      </div>

      {/* CHART + TOP RESTAURANTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* STATUS CHART */}
        <div
          className="bg-white rounded-xl p-6 border"
          style={{
            borderColor: "#C8A951",
            boxShadow: "0 0 18px rgba(200,169,81,0.4)",
          }}
        >
          <h2 className="text-sm font-semibold text-[#3B0A0D] mb-4">
            Restaurant Status
          </h2>

          <div className="h-64 flex items-center justify-center">
            <Doughnut data={chartData} />
          </div>

          <p className="text-xs text-[#7B1F1F] mt-4 text-center">
            Majority of restaurants on the platform are active
          </p>
        </div>

        {/* TOP RESTAURANTS */}
        <div
          className="bg-white rounded-xl p-6 border"
          style={{
            borderColor: "#C8A951",
            boxShadow: "0 0 18px rgba(200,169,81,0.4)",
          }}
        >
          <h2 className="text-sm font-semibold text-[#3B0A0D] mb-4">
            Top Restaurants
          </h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left font-semibold text-[#7B1F1F]">
                <th className="pb-3">Restaurant</th>
                <th className="pb-3">City</th>
                <th className="pb-3 text-right">Orders</th>
              </tr>
            </thead>

            <tbody className="divide-y" style={{ borderColor: "#C8A951" }}>
              {topRestaurants.map((r) => (
                <tr key={r.id} className="hover:bg-[#FBF6EE]">
                  <td className="py-3 font-medium text-[#3B0A0D]">
                    {r.name}
                  </td>
                  <td className="py-3 text-[#7B1F1F]">
                    {r.city}
                  </td>
                  <td className="py-3 text-right font-semibold text-[#3B0A0D]">
                    {r.orders}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {topRestaurants.length === 0 && (
            <p className="text-xs text-[#7B1F1F] mt-4">
              No restaurant data available yet.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div
      className="bg-white rounded-xl p-5 border"
      style={{
        borderColor: "#C8A951",
        boxShadow: "0 0 16px rgba(200,169,81,0.4)",
      }}
    >
      <p className="text-sm text-[#7B1F1F] mb-1">
        {title}
      </p>
      <p className="text-2xl font-semibold text-[#3B0A0D]">
        {value}
      </p>
    </div>
  );
}
