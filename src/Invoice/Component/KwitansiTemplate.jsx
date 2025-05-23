import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import config from "../../supabase-config";

const KwitansiTemplate = () => {
  const { Kode_Sekolah } = useParams();
  const [sekolah, setSekolah] = useState(null);
  const [terminList, setTerminList] = useState([]);
  const [selectedTermin, setSelectedTermin] = useState(null);
  const [detailTermin, setDetailTermin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSekolah();
    fetchTerminList();
  }, []);

  useEffect(() => {
    if (selectedTermin) {
      fetchDetailTermin(selectedTermin);
    }
  }, [selectedTermin]);

  async function fetchSekolah() {
    try {
      const { data, error } = await config
        .from("Table_Sekolah")
        .select("*")
        .eq("Kode_Sekolah", Kode_Sekolah)
        .single();
      if (error) throw error;
      setSekolah(data);
    } catch (err) {
      setSekolah(null);
    }
  }

  async function fetchTerminList() {
    setLoading(true);
    try {
      const { data, error } = await config
        .from("Table_Termin")
        .select("Kode_Termin, Termin")
        .eq("Kode_Sekolah", Kode_Sekolah);
      if (error) throw error;
      setTerminList(data || []);
      if (data && data.length > 0) {
        setSelectedTermin(data[0].Kode_Termin);
      }
    } catch (err) {
      setTerminList([]);
    }
    setLoading(false);
  }

  async function fetchDetailTermin(kodeTermin) {
    setLoading(true);
    try {
      const { data, error } = await config
        .from("Table_Termin")
        .select("*")
        .eq("Kode_Termin", kodeTermin)
        .single();
      if (error) throw error;
      setDetailTermin(data);
    } catch (err) {
      setDetailTermin(null);
    }
    setLoading(false);
  }

  const tanggal = new Date().toLocaleDateString("id-ID");
  const nomorKwitansi = `KWITANSI-${Kode_Sekolah}-${selectedTermin || ""}`;

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {/* Tombol Print */}
      <div className="max-w-4xl mx-auto flex justify-end gap-2 mb-4 mr-10">
        <button
          onClick={() => window.print()}
          className="bg-[#10365B] text-white px-4 py-2 rounded-lg shadow hover:bg-[#205080] transition"
        >
          Print Kwitansi
        </button>
      </div>
      {/* Dropdown Termin di luar card */}
      <div className="max-w-4xl mx-auto mb-6 mr-10">
        <label className="block mb-1 font-semibold text-gray-700">Pilih Termin</label>
        <select
          value={selectedTermin || ""}
          onChange={e => setSelectedTermin(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10365B]"
        >
          {terminList.map((termin) => (
            <option key={termin.Kode_Termin} value={termin.Kode_Termin}>
              Termin {termin.Termin}
            </option>
          ))}
        </select>
      </div>
      {/* Card Kwitansi */}
      <div id="invoice-print-area" className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200 mr-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#10365B]">KWITANSI</h1>
            <p className="text-sm text-gray-500">No: {nomorKwitansi}</p>
          </div>
          <div className="text-right">
            <img src="/logo.png" alt="Logo" className="w-16 h-16 mb-2" />
            <p className="text-xs text-gray-500">Tanggal: {tanggal}</p>
          </div>
        </div>
        <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-start gap-8">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-[#10365B]">Sudah terima dari:</h2>
            <p className="text-base">{sekolah?.namaSekolah}</p>
            <p className="text-sm text-gray-500">
              Untuk pembayaran termin {detailTermin?.Termin} Project Yearbook P.O #{sekolah?.Kode_Sekolah}
            </p>
          </div>
          <div className="flex-1 md:text-right text-sm text-gray-700 whitespace-pre-line">
            Rawa Buntu Utara Blok H2 No.7{"\n"}
            Serpong – Tangerang Selatan{"\n"}
            Phone +62 822 9800 8994
          </div>
        </div>
        {detailTermin && (
          <table className="w-full mb-6 border border-gray-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-[#10365B] text-white">
                <th className="py-2 px-4 text-left">Termin</th>
                <th className="py-2 px-4 text-left">Deskripsi</th>
                <th className="py-2 px-4 text-left">Jumlah (Rp)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-50">
                <td className="py-2 px-4">{detailTermin.Termin}</td>
                <td className="py-2 px-4">
                  Termin {detailTermin.Termin} Pembuatan Buku Tahunan {sekolah?.namaSekolah} Tahun {new Date().getFullYear()}
                </td>
                <td className="py-2 px-4 font-bold">Rp {Number(detailTermin.HargaTer || 0).toLocaleString("id-ID")}</td>
              </tr>
            </tbody>
          </table>
        )}
        <div className="text-sm text-gray-500 mt-8">
          <p>Pembayaran diterima oleh:</p>
          <div className="border border-gray-300 rounded-lg p-4 my-2 bg-gray-50">
            <div className="flex items-center gap-2 mb-1">
              <img src="/bca.png" alt="BCA" className="w-15 h-6" />
            </div>
            <div className="ml-2">
              <div className="font-bold text-lg text-[#10365B]">CV. Parama Kreatif</div>
              <div>Gading serpong, Tangerang</div>
            </div>
          </div>
        </div>
        <div className="mt-8 text-right">
          <p className="text-xs text-gray-400">*Kwitansi ini dicetak secara otomatis oleh sistem.</p>
        </div>
      </div>
    </div>
  );
};

export default KwitansiTemplate;