
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
        </Routes>
      </div>
    </div>
  );
}

export default HomeInvoice;

     
       
    