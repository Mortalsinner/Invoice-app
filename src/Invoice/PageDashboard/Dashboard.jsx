import React, { useEffect, useState } from "react";
import config from "../../supabase-config";

const Dashboard = () => {
  const [totalSekolah, setTotalSekolah] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTotalSekolah();
  }, []);

  async function fetchTotalSekolah() {
    setLoading(true);
    try {
      const { count, error } = await config
        .from("Table_Sekolah")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      setTotalSekolah(count || 0);
    } catch (err) {
      setTotalSekolah(0);
    }
    setLoading(false);
  }

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-[#10365B]">Dashboard</h2>
      <div className="flex flex-col items-center">
        <div className="text-lg font-semibold mb-2 text-gray-700">Total Sekolah</div>
        <div className="text-5xl font-bold text-[#10365B] mb-4">
          {loading ? "Loading..." : totalSekolah}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;