
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useState, useEffect } from "react";
// Update imports at the top
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import config from '../../supabase-config';



const Table = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sekolahData, setSekolahData] = useState([]);
  const Swal = require('sweetalert2');
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [hargaTotal, setHargaTotal] = useState({});

  useEffect(() => {
    fetchSekolah();
  }, []);

  async function fetchSekolah() {
    setLoading(true);
    try {
      const { data, error } = await config
        .from('Table_Sekolah')
        .select('Kode_Sekolah, namaSekolah, StatusPembayaran, ContactPerson, Deskripsi');
      if (error) throw error;

      // Ambil semua termin sekaligus
      const { data: terminData, error: terminError } = await config
        .from('Table_Termin')
        .select('Kode_Sekolah, HargaTer');
      if (terminError) throw terminError;

      // Hitung total harga per sekolah
      const hargaPerSekolah = {};
      terminData.forEach(item => {
        if (!hargaPerSekolah[item.Kode_Sekolah]) hargaPerSekolah[item.Kode_Sekolah] = 0;
        hargaPerSekolah[item.Kode_Sekolah] += Number(item.HargaTer || 0);
      });
      setHargaTotal(hargaPerSekolah);

      setSekolahData(data || []);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setSekolahData([]);
    }
    setLoading(false);
  }

  async function handleDelete(kodeSekolah) {
    const confirmDelete = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      customClass: {
        confirmButton: 'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700',
        cancelButton: 'bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-1',
      },
      buttonsStyling: false, // WAJIB false agar Tailwind bisa dipakai
    });
    if (!confirmDelete.isConfirmed) return;
    try {
      const { error } = await config
        .from('Table_Sekolah')
        .delete()
        .eq('Kode_Sekolah', kodeSekolah);
      if (error) throw error;
      Swal.fire({
        title: "Sukses",
        text: "Data sekolah berhasil dihapus!",
        icon: "success",
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
        },
        buttonsStyling: false
      });
      fetchSekolah();
    } catch (err) {
      Swal.fire("Gagal", err.message, "error");
    }
  }

  const filteredItems = sekolahData.filter(item =>
    String(item.namaSekolah || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(item.Kode_Sekolah || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const displayedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text('Laporan Data Sekolah', 14, 20);
      doc.setFontSize(12);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

      autoTable(doc, {
        head: [["Kode Sekolah", "Nama Sekolah", "Harga", "Status Pembayaran"]],
        body: filteredItems.map(item => [
          item.Kode_Sekolah,
          item.namaSekolah,
          `Rp ${hargaTotal[item.Kode_Sekolah]?.toLocaleString('id-ID') || 0}`,
          item.StatusPembayaran
        ]),
        startY: 40,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [16, 54, 91] }
      });

      doc.save('data-sekolah.pdf');
    } catch (error) {
      alert('Gagal generate PDF');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-5 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-[#10365B]">List Sekolah</h2>
      <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-6">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          className="w-full md:w-1/2 mb-3 md:mb-0 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10365B] transition"
        />
        <div className="flex gap-2 md:ml-auto">
          <button
            onClick={() => window.location.href = '/AddSekolah'}
            className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
          >
            Add Sekolah
          </button>
          <button
            onClick={generatePDF}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Print
          </button>
        </div>
      </div>
      <div className="">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-x-auto">
          <thead>
            <tr className="bg-[#10365B] text-white">
              {/* <th className="py-3 px-4 font-semibold text-sm uppercase">Kode Sekolah</th> */}
              <th className="py-3 px-4 font-semibold text-sm uppercase">Nama Sekolah</th>
              <th className="py-3 px-4 font-semibold text-sm uppercase">Deskripsi</th>
              <th className="py-3 px-4 font-semibold text-sm uppercase">Contact Person</th>
              <th className="py-3 px-4 font-semibold text-sm uppercase">Harga</th>
              <th className="py-3 px-4 font-semibold text-sm uppercase">Status Pembayaran</th>
              <th className="py-3 px-4 font-semibold text-sm uppercase">Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedItems.map((item, index) => (
              <tr key={item.Kode_Sekolah} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                {/* <td className="py-3 px-4">{item.Kode_Sekolah}</td> */}
                <td className="py-3 px-4">{item.namaSekolah}</td>
                <td className="py-3 px-4">{item.Deskripsi}</td>
                <td className="py-3 px-4">
                  {item.ContactPerson ? (
                    <a
                      href={`https://wa.me/62${String(item.ContactPerson).replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 underline hover:text-green-800"
                    >
                      {item.ContactPerson}
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="py-3 px-4">
                  Rp {hargaTotal[item.Kode_Sekolah]?.toLocaleString('id-ID') || 0}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${item.StatusPembayaran === 'Lunas' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {item.StatusPembayaran}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <div
                    className="relative flex justify-center"
                    onMouseEnter={() => setOpenDropdown(item.Kode_Sekolah)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      className="flex items-center gap-2 px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                      tabIndex={0}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v.01M12 12v.01M12 18v.01" />
                      </svg>
                      Menu
                      <svg className={`w-4 h-4 transform transition-transform duration-200 ${openDropdown === item.Kode_Sekolah ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openDropdown === item.Kode_Sekolah && (
                      <div className="absolute z-50 right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg animate-fade-in">
                        <Link to={`/EditSekolah/${item.Kode_Sekolah}`}>
                          <button
                            className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-yellow-100 text-yellow-700 transition-colors"
                            onClick={() => setOpenDropdown(null)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2h6" />
                            </svg>
                            Edit
                          </button>
                        </Link>
                        <Link to={`/AddTermin/${item.Kode_Sekolah}`}>
                          <button
                            className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-blue-100 text-blue-700 transition-colors"
                            onClick={() => setOpenDropdown(null)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            Add Termin
                          </button>
                        </Link>
                        <Link to={`/UbahStatusTermin/${item.Kode_Sekolah}`}>
                          <button
                            className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-green-100 text-green-700 transition-colors"
                            onClick={() => setOpenDropdown(null)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Cek Status termin
                          </button>
                        </Link>
                        <button
                          onClick={() => { handleDelete(item.Kode_Sekolah); setOpenDropdown(null); }}
                          className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-red-100 text-red-700 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-5 py-2 rounded-lg bg-[#10365B] text-white font-semibold hover:bg-[#17467a] transition disabled:bg-gray-300 disabled:text-gray-500"
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-5 py-2 rounded-lg bg-[#10365B] text-white font-semibold hover:bg-[#17467a] transition disabled:bg-gray-300 disabled:text-gray-500"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
);
};

export default Table;