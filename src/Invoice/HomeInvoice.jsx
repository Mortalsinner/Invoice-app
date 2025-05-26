
// import '../output.css';
import { Routes, Route } from "react-router-dom";
import { useEffect } from 'react';

// Import File
import { supabase, testSupabaseConnection } from '../supabase-config.js';
import Nav from './Component/Nav';
import Table from './Component/Table';
import Sekolah from './PageSekolah/ListSekolah.jsx';
import AddSekolah from './PageSekolah/AddSekolah.jsx';
import Dashboard from './PageDashboard/Dashboard.jsx';
import EditSekolah from './PageSekolah/EditSekolah.jsx';
import AddTermin from "./PageSekolah/AddTermin.jsx";
import UbahStatusTermin from "./PageSekolah/UbahStatusTermin.jsx";
import ListInvoice from "./PageInvoice/ListInvoice.jsx";
import DetailTermin from "./PageInvoice/DetailTermin.jsx";
import InvoiceTemplate from "./Component/InvoiceTemplate.jsx";
import KwitansiTemplate from "./Component/KwitansiTemplate.jsx";
import { useAuth } from './Login/AuthContext.jsx';


function HomeInvoice() {
  useEffect(() => {
    testSupabaseConnection();
  }, []);
  const { user } = useAuth();

  if (!user) {
    // Optionally, you can show a loading spinner or redirect here
    return <div>Please login first.</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Nav />
      <div className="flex-1 p-8 overflow-auto ">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ListSekolah" element={<Sekolah />} />
          <Route path="/AddSekolah" element={<AddSekolah />} />
          <Route path="/EditSekolah/:Kode_Sekolah" element={<EditSekolah />} />
          <Route path="/AddTermin/:Kode_Sekolah" element={<AddTermin />} />
          <Route path="/UbahStatusTermin/:Kode_Sekolah" element={<UbahStatusTermin />} />
          <Route path="/ListInvoice" element={<ListInvoice />} />
          <Route path="/InvoiceTemplate/:Kode_Sekolah" element={<InvoiceTemplate />} />
          <Route path="/KwitansiTemplate/:Kode_Sekolah" element={<KwitansiTemplate />} />
          <Route path="/DetailTermin/:Kode_Sekolah" element={<DetailTermin />} />
        </Routes>
      </div>
    </div>
  );
}


export default HomeInvoice;

     
       
    