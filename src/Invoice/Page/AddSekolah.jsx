import React, { useState } from "react";
import config from "../../supabase-config";
import Swal from "sweetalert2";

const AddSekolah = () => {
  const [namaSekolah, setNamaSekolah] = useState("");
  const [Harga, setHarga] = useState("");
  const [StatusPembayaran, setStatusPembayaran] = useState("Lunas");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await config
        .from("Table_Sekolah")
        .insert([{ namaSekolah, Harga: Number(Harga), StatusPembayaran }]);
      if (error) throw error;
      Swal.fire("Sukses", "Data sekolah berhasil ditambahkan!", "success");
      setNamaSekolah("");
      setHarga("");
      setStatusPembayaran("Belum Lunas");
    } catch (err) {
      Swal.fire("Gagal", err.message, "error");
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-[#10365B]">Tambah Sekolah</h2>
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
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Harga</label>
          <input
            type="number"
            value={Harga}
            onChange={(e) => setHarga(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10365B]"
            required
            min={0}
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Status Pembayaran</label>
          <select
            value={StatusPembayaran}
            onChange={(e) => setStatusPembayaran(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10365B]"
            required
          >
            <option value="Lunas">Lunas</option>
            <option value="Belum Lunas">Belum Lunas</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg bg-[#10365B] text-white font-semibold hover:bg-[#17467a] transition disabled:bg-gray-300 disabled:text-gray-500"
        >
          {loading ? "Menyimpan..." : "Tambah Sekolah"}
        </button>
      </form>
    </div>
  );
};

export default AddSekolah;