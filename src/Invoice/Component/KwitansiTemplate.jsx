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
        .select("Kode_Termin, Termin, StatusTermin") // tambahkan StatusTermin
        .eq("Kode_Sekolah", Kode_Sekolah);
      if (error) throw error;
      // Filter hanya yang sudah lunas
      const lunasTermin = (data || []).filter(item => item.StatusTermin === "Lunas");
      setTerminList(lunasTermin);
      if (lunasTermin.length > 0) {
        setSelectedTermin(lunasTermin[0].Kode_Termin);
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
  const nomorKwitansi = `RECEIPT #${sekolah?.Kode_Sekolah || ""}`;

  if (loading) return <div>Loading...</div>;

  return (
    <div id="invoice-print-area" className="bg-gray-100 min-h-screen py-8 print:bg-white">
      <div className="max-w-5xl ml-auto bg-white p-0 rounded-xl shadow-lg border border-gray-200 flex print:shadow-none print:border-none">
        {/* Sidebar */}
        <div className="bg-[#232323] text-white flex flex-col justify-between p-8 w-1/4 min-w-[220px] print:w-1/4">
          <div>
            <img src="/logo.png" alt="Logo" className="w-20 mb-6" />
            <div className="font-bold uppercase text-sm mb-2">PARAMA HOUSE<br />BY PT. PARAMA KREATIF SUKSES</div>
            <div className="text-xs mb-4">
              Rawa Buntu Utara Blok H2<br />No.7 Tangerang Selatan<br />Phone: +6281294203835<br />Info.paramahouse@gmail.com
            </div>
            <div className="text-xs mb-4">
              {nomorKwitansi}<br />Date: {tanggal}
            </div>
          </div>
          <div className="mt-8 text-lg font-bold text-center">
            THANK YOU<br />FOR YOUR<br />BUSINESS!
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1 p-10">
          <div className="mb-6">
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
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="text-3xl font-bold text-gray-700 mb-2">PAYMENT RECEIPT</div>
              <div className="text-sm text-gray-700">
                <div className="font-semibold">{sekolah?.namaSekolah}</div>
                <div>{sekolah?.Alamat || "Tangerang, Banten"}</div>
                <div>Customer ID: {sekolah?.Kode_Sekolah}</div>
              </div>
            </div>
          </div>
          {/* Paid To Table */}
          <table className="w-full mb-6 border border-gray-300">
            <thead>
              <tr className="bg-gray-700 text-white text-sm">
                <th className="py-2 px-4 w-1/2">PAID TO</th>
                <th className="py-2 px-4 w-1/2">DATE</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white text-sm">
                <td className="py-2 px-4">
                  BCA<br />883-1088-028<br />a/n Parama Kreatif Sukses PT.
                </td>
                <td className="py-2 px-4 align-top">{tanggal}</td>
              </tr>
            </tbody>
          </table>
          {/* Description Table */}
          <table className="w-full mb-6 border border-gray-300">
            <thead>
              <tr className="bg-gray-700 text-white text-sm">
                <th className="py-2 px-4 w-2/3">DESCRIPTION</th>
                <th className="py-2 px-4 w-1/3">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white text-sm">
                <td className="py-2 px-4">
                  {detailTermin ? (
                    <>
                      Termin {detailTermin.Termin} Pembuatan Buku Tahunan {sekolah?.namaSekolah} {new Date().getFullYear()}
                    </>
                  ) : "-"}
                </td>
                <td className="py-2 px-4 font-bold">
                  Rp {Number(detailTermin?.HargaTer || 0).toLocaleString("id-ID")},-
                </td>
              </tr>
              <tr className="bg-white text-sm">
                <td className="py-2 px-4 text-right font-semibold">DISCOUNT</td>
                <td className="py-2 px-4">Rp 0,-</td>
              </tr>
              <tr className="bg-white text-sm">
                <td className="py-2 px-4 text-right font-semibold">SALES TAX</td>
                <td className="py-2 px-4">Rp 0,-</td>
              </tr>
              <tr className="bg-gray-100 text-sm">
                <td className="py-2 px-4 text-right font-bold">TOTAL</td>
                <td className="py-2 px-4 font-bold">Rp {Number(detailTermin?.HargaTer || 0).toLocaleString("id-ID")},-</td>
              </tr>
            </tbody>
          </table>
          <div className="flex justify-end items-end mt-12">
            <div className="text-right">
              <img src="/paraf.png" alt="Signature" className="h-16 mb-1 inline-block" />
              <div className="text-xs text-gray-700">Nama</div>
            </div>
          </div>
        </div>
      </div>
      {/* Print Button */}
      <div className="max-w-4xl ml-auto flex justify-end gap-2 mt-4 print:hidden">
        <button
          onClick={() => window.print()}
          className="bg-[#10365B] text-white px-4 py-2 rounded-lg shadow hover:bg-[#205080] transition"
        >
          Print Receipt
        </button>
      </div>
    </div>
  );
};

export default KwitansiTemplate;