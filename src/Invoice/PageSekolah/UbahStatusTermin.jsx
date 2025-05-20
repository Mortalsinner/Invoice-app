import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import config from "../../supabase-config";
import Swal from "sweetalert2";

const UbahStatusTermin = () => {
  const { Kode_Sekolah } = useParams();
  const [terminList, setTerminList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTermin();
    // eslint-disable-next-line
  }, []);

  async function fetchTermin() {
    setLoading(true);
    try {
      const { data, error } = await config
        .from("Table_Termin")
        .select("*")
        .eq("Kode_Sekolah", Kode_Sekolah);
      if (error) throw error;
      setTerminList(data || []);
    } catch (err) {
      Swal.fire("Gagal", err.message, "error");
    }
    setLoading(false);
  }

  const handleStatusChange = async (id, newStatus) => {
    setLoading(true);
    try {
      const { error } = await config
        .from("Table_Termin")
        .update({ StatusTermin: newStatus })
        .eq("id", id);
      if (error) throw error;
      Swal.fire("Sukses", "Status termin berhasil diubah!", "success");
      fetchTermin();
    } catch (err) {
      Swal.fire("Gagal", err.message, "error");
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-[#10365B]">Ubah Status Termin</h2>
      {loading ? (
        <div>Loading...</div>
      ) : terminList.length === 0 ? (
        <div>Tidak ada data termin untuk sekolah ini.</div>
      ) : (
        <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-x-auto">
          <thead>
            <tr className="bg-[#10365B] text-white">
              <th className="py-3 px-4">Termin</th>
              <th className="py-3 px-4">Harga Termin</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {terminList.map((item) => (
              <tr key={item.id}>
                <td className="py-3 px-4">{item.Termin}</td>
                <td className="py-3 px-4">Rp {item.HargaTer?.toLocaleString("id-ID")}</td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${item.StatusTermin === "Lunas" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {item.StatusTermin || "Belum Lunas"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <select
                    value={item.StatusTermin || "Belum Lunas"}
                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="Lunas">Lunas</option>
                    <option value="Belum Lunas">Belum Lunas</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button
        onClick={() => navigate("/ListSekolah")}
        className="mt-6 px-4 py-2 rounded-lg bg-[#10365B] text-white font-semibold hover:bg-[#17467a] transition"
      >
        Kembali ke List Sekolah
      </button>
    </div>
  );
};

export default UbahStatusTermin;