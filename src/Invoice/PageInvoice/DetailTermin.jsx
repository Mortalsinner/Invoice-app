import React, { useEffect, useState } from "react";
import config from "../../supabase-config";
import { useParams } from "react-router-dom";

const DetailTermin = () => {
  const { Kode_Sekolah } = useParams();
  const [terminList, setTerminList] = useState([]);
  const [selectedTermin, setSelectedTermin] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTerminList();
    // eslint-disable-next-line
  }, []);

  async function fetchTerminList() {
    setLoading(true);
    try {
      const { data, error } = await config
        .from("Table_Termin")
        .select("*")
        .eq("Kode_Sekolah", Kode_Sekolah);
      if (error) throw error;
      setTerminList(data || []);
      if (data && data.length > 0) {
        setSelectedTermin(data[0].id); // pilih termin pertama secara default
        setDetail(data[0]);
      }
    } catch (err) {
      setTerminList([]);
      setDetail(null);
    }
    setLoading(false);
  }

  const handleChange = (e) => {
    const id = e.target.value;
    setSelectedTermin(id);
    const found = terminList.find((t) => String(t.id) === String(id));
    setDetail(found);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-[#10365B]">Invoice Termin</h2>
      {loading ? (
        <div>Loading...</div>
      ) : terminList.length === 0 ? (
        <div>Tidak ada termin untuk sekolah ini.</div>
      ) : (
        <>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-700">Pilih Termin</label>
            <select
              value={selectedTermin}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10365B]"
            >
              {terminList.map((termin) => (
                <option key={termin.id} value={termin.id}>
                  Termin {termin.NamaTermin || termin.id}
                </option>
              ))}
            </select>
          </div>
          {detail && (
            <div className="border rounded-lg p-6 bg-gray-50 shadow invoice-format">
              <div className="flex justify-between mb-4">
                <div>
                  <div className="font-bold text-lg text-[#10365B]">INVOICE</div>
                  <div className="text-sm text-gray-600">No. Termin: {detail.Kode_Termin}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">Tanggal Jatuh Tempo:</div>
                  <div>{detail.Deadline}</div>
                </div>
              </div>
              <hr className="mb-4" />
              <div className="mb-2">
                <span className="font-semibold">Nama Termin:</span> {detail.NamaTermin}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Status:</span> {detail.StatusTermin}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Kode Sekolah:</span> {detail.Kode_Sekolah}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Harga:</span> <span className="text-[#10365B] font-bold">Rp {Number(detail.HargaTer).toLocaleString("id-ID")}</span>
              </div>
              {/* Tambahkan field lain sesuai kebutuhan */}
              <hr className="my-4" />
              <div className="text-right font-semibold text-[#10365B]">
                Total: Rp {Number(detail.HargaTer).toLocaleString("id-ID")}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DetailTermin;