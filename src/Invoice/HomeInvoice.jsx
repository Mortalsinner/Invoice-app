
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

function HomeInvoice() {
  useEffect(() => {
    testSupabaseConnection();
  }, []);
  
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
        </Routes>
      </div>
    </div>
  );
}

export default HomeInvoice;

     
       
    