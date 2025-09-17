"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

// กำหนด interface ของข้อมูล
interface Data {
  temperature: number;
  humidity: number;
  timestamp: string;
}

export default function Home() {
  const [latest, setLatest] = useState<Data | null>(null);
  const [history, setHistory] = useState<Data[]>([]);

  // ใช้ environment variable สำหรับ API URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  // ดึงข้อมูล realtime (latest)
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch(`${API_URL}/api/data/latest`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const json = await res.json();
        setLatest(json);
      } catch (err) {
        console.error("Error fetching latest data:", err);
      }
    };
    fetchLatest();
    const interval = setInterval(fetchLatest, 5000);
    return () => clearInterval(interval);
  }, [API_URL]);

  // ดึงข้อมูลย้อนหลัง (history)
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_URL}/api/data/history`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const json = await res.json();
        setHistory(json);
      } catch (err) {
        console.error("Error fetching history data:", err);
      }
    };
    fetchHistory();
  }, [API_URL]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 font-sans p-4">
      <h1 className="text-4xl font-extrabold text-blue-900 mb-8">
        ESP32 Sensor Dashboard
      </h1>

      {/* Latest Data */}
      {latest ? (
        <div className="p-8 bg-white rounded-2xl shadow-xl text-center w-80 md:w-96 mb-8">
          <div className="mb-4">
            <p className="text-xl text-gray-600 mb-1">🌡️ อุณหภูมิ</p>
            <p className="text-3xl font-bold text-red-500">{latest.temperature} °C</p>
          </div>
          <div className="mb-4">
            <p className="text-xl text-gray-600 mb-1">💧 ความชื้น</p>
            <p className="text-3xl font-bold text-blue-500">{latest.humidity} %</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">⏱️ เวลา</p>
            <p className="text-gray-700">{new Date(latest.timestamp).toLocaleString()}</p>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-gray-600 animate-pulse">Loading latest data...</p>
      )}

      {/* History Chart */}
      <h2 className="text-2xl font-bold text-blue-900 mb-4">📈 ประวัติย้อนหลัง</h2>
      {history.length > 0 ? (
        <LineChart width={700} height={300} data={history}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" tickFormatter={(ts) => new Date(ts).toLocaleTimeString()} />
          <YAxis />
          <Tooltip labelFormatter={(ts) => new Date(ts).toLocaleString()} />
          <Line type="monotone" dataKey="temperature" stroke="#ff0000" />
          <Line type="monotone" dataKey="humidity" stroke="#0000ff" />
        </LineChart>
      ) : (
        <p className="text-gray-600 animate-pulse">Loading history...</p>
      )}
    </div>
  );
}
