import React, { useEffect, useState } from "react";
import config from "../../supabase-config";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = () => {
  const [totalSekolah, setTotalSekolah] = useState(0);
  const [lunasCount, setLunasCount] = useState(0);
  const [belumLunasCount, setBelumLunasCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTotalSekolah();
  }, []);

  async function fetchTotalSekolah() {
    setLoading(true);
    try {
      const { data, error } = await config
        .from("Table_Sekolah")
        .select("StatusPembayaran");
      if (error) throw error;
      setTotalSekolah(data.length || 0);
      const lunas = data.filter(item => item.StatusPembayaran === "Lunas").length;
      const belumLunas = data.filter(item => item.StatusPembayaran !== "Lunas").length;
      setLunasCount(lunas);
      setBelumLunasCount(belumLunas);
    } catch (err) {
      setTotalSekolah(0);
      setLunasCount(0);
      setBelumLunasCount(0);
    }
    setLoading(false);
  }

  const chartData = {
    labels: ["Lunas", "Belum Lunas"],
    datasets: [
      {
        label: "Jumlah Sekolah",
        data: [lunasCount, belumLunasCount],
        backgroundColor: ["#22c55e", "#ef4444"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      y: {
        beginAtZero: true,
        precision: 0
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 mr-8">
      {/* Card Total Sekolah */}
      <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        <div className="text-lg font-semibold mb-2 text-gray-700">Total Sekolah</div>
        <div className="text-5xl font-bold text-[#10365B] mb-2">
          {loading ? "Loading..." : totalSekolah}
        </div>
      </div>
      {/* Card Lunas */}
      <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        <div className="text-lg font-semibold mb-2 text-gray-700">Sekolah Lunas</div>
        <div className="text-5xl font-bold text-green-600 mb-2">
          {loading ? "Loading..." : lunasCount}
        </div>
      </div>
      {/* Card Belum Lunas */}
      <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        <div className="text-lg font-semibold mb-2 text-gray-700">Sekolah Belum Lunas</div>
        <div className="text-5xl font-bold text-red-600 mb-2">
          {loading ? "Loading..." : belumLunasCount}
        </div>
      </div>
      {/* Card Chart */}
      <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center md:col-span-3">
        <div className="w-full md:w-1/2 h-64 mx-auto">
          <Bar data={chartData} options={chartOptions} />
        </div>
        <div className="flex justify-center gap-8 mt-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
            <span>Lunas: {lunasCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
            <span>Belum Lunas: {belumLunasCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;