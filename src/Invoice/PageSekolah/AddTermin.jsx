import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import config from "../../supabase-config";
import Swal from "sweetalert2";

const AddTermin = () => {
  const { Kode_Sekolah } = useParams();
  const [terminList, setTerminList] = useState([
    { Termin: "", HargaTer: "" }
  ]);
  const [Deadline, setDeadline] = useState("");
  const [qty, setQty] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTerminChange = (index, field, value) => {
    const newList = [...terminList];
    newList[index][field] = value;
    setTerminList(newList);
  };

  const handleAddTermin = () => {
    setTerminList([...terminList, { Termin: "", HargaTer: "" }]);
  };

  const handleRemoveTermin = (index) => {
    if (terminList.length === 1) return;
    setTerminList(terminList.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const insertData = terminList.map(item => ({
        Kode_Sekolah,
        Termin: item.Termin,
        HargaTer: Number(item.HargaTer),
        Deadline,
        qty: Number(qty),
        StatusTermin: "Belum Lunas"
      }));
      const { error } = await config
        .from("Table_Termin")
        .insert(insertData);
      if (error) throw error;
      await Swal.fire({
        title: "Sukses",
        text: "Data termin berhasil ditambahkan!",
        icon: "success",
        customClass: {
          confirmButton: 'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700',
        },
        buttonsStyling: false
      });
      setTerminList([{ Termin: "", HargaTer: "" }]);
      setDeadline("");
      setQty("");
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
      <h2 className="text-2xl font-bold mb-6 text-[#10365B]">Tambah Termin</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {terminList.map((item, idx) => (
          <div key={idx} className="flex gap-2 items-end">
            <div className="w-full">
              <label className="block mb-1 font-semibold text-gray-700">Termin</label>
              <input
                type="text"
                value={item.Termin}
                onChange={(e) => handleTerminChange(idx, "Termin", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10365B]"
                required
              />
            </div>
            <div className="w-full">
              <label className="block mb-1 font-semibold text-gray-700">Harga Termin</label>
              <input
                type="number"
                value={item.HargaTer}
                onChange={(e) => handleTerminChange(idx, "HargaTer", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10365B]"
                required
                min={0}
              />
            </div>
            {terminList.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveTermin(idx)}
                className="mb-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                title="Hapus termin"
              >-</button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddTermin}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Tambah Termin
        </button>
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Deadline</label>
          <input
            type="date"
            value={Deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10365B]"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Qty</label>
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10365B]"
            required
            min={1}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg bg-[#10365B] text-white font-semibold hover:bg-[#17467a] transition disabled:bg-gray-300 disabled:text-gray-500"
        >
          {loading ? "Menyimpan..." : "Tambah Termin"}
        </button>
      </form>
    </div>
  );
};

export default AddTermin;