import React, { useState } from "react";
import config from "../../supabase-config";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AddSekolah = () => {
  const [namaSekolah, setNamaSekolah] = useState("");
  // Hapus state Harga
  const [StatusPembayaran, setStatusPembayaran] = useState("Belum Lunas");
  const [ContactPerson, setContactPerson] = useState("");
  const [Deskripsi, setDeskripsi] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await config
        .from("Table_Sekolah")
        .insert([{ namaSekolah, StatusPembayaran, ContactPerson, Deskripsi }]);
      if (error) throw error;
      await Swal.fire({
        title: "Sukses",
        text: "Data sekolah berhasil ditambahkan!",
        icon: "success",
        customClass: { 
          confirmButton: 'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700',
        },
        buttonsStyling: false
      });
      setNamaSekolah("");
      setStatusPembayaran("Belum Lunas");
      setContactPerson("");
      setDeskripsi("");
      navigate("/ListSekolah");
    } catch (err) {
      await Swal.fire({
        title: "Gagal",
        text: err.message,
        icon: "error",
        customClass: { 
          confirmButton: 'bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700',
        },
        buttonsStyling: false
      });
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
          <label className="block mb-1 font-semibold text-gray-700">Contact Person</label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">+62</span>
            <input
              type="tel"
              value={ContactPerson}
              onChange={e => setContactPerson(e.target.value.replace(/^0+/, ""))}
              className="w-full px-4 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-[#10365B]"
              required
              placeholder="81234567890"
            />
          </div>
        </div>
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Deskripsi</label>
          <textarea
            value={Deskripsi}
            onChange={e => setDeskripsi(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10365B]"
            rows={3}
            placeholder="Deskripsi sekolah (opsional)"
          />
        </div>
        {/* Hapus input Harga */}
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