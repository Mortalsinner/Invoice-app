import React, { useEffect, useState } from "react";
import config from "../../supabase-config";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

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
        data: [lunasCount, belumLunasCount],
        backgroundColor: ["#22c55e", "#ef4444"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-[#10365B]">Dashboard</h2>
      <div className="flex flex-col items-center">
        <div className="text-lg font-semibold mb-2 text-gray-700">Total Sekolah</div>
        <div className="text-5xl font-bold text-[#10365B] mb-4">
          {loading ? "Loading..." : totalSekolah}
        </div>
        <div className="w-64 h-64 mt-6">
          <Pie data={chartData} />
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