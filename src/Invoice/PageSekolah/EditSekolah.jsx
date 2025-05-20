import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import config from "../../supabase-config";
import Swal from "sweetalert2";

const EditSekolah = () => {
  const { Kode_Sekolah } = useParams();
  const navigate = useNavigate();
  const [namaSekolah, setNamaSekolah] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSekolah();
    // eslint-disable-next-line
  }, []);

  async function fetchSekolah() {
    setLoading(true);
    try {
      const { data, error } = await config
        .from("Table_Sekolah")
        .select("namaSekolah")
        .eq("Kode_Sekolah", Kode_Sekolah)
        .single();
      if (error) throw error;
      setNamaSekolah(data.namaSekolah || "");
    } catch (err) {
      Swal.fire("Gagal", err.message, "error");
    }
    setLoading(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await config
        .from("Table_Sekolah")
        .update({
          namaSekolah
        })
        .eq("Kode_Sekolah", Kode_Sekolah);
      if (error) throw error;
      Swal.fire("Sukses", "Data sekolah berhasil diupdate!", "success");
      navigate("/ListSekolah");
    } catch (err) {
      Swal.fire("Gagal", err.message, "error");
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-[#10365B]">Edit Sekolah</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Nama Sekolah</label>
          <input
            type="text"
            value={namaSekolah}
            onChange={(e) => setNamaSekolah(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10365B]"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg bg-[#10365B] text-white font-semibold hover:bg-[#17467a] transition disabled:bg-gray-300 disabled:text-gray-500"
        >
          {loading ? "Menyimpan..." : "Update Sekolah"}
        </button>
      </form>
    </div>
  );
};

export default EditSekolah;