
// import '../output.css';
import { Routes, Route } from "react-router-dom";
import { useEffect } from 'react';

// Import File
import { supabase, testSupabaseConnection } from '../../supabase-config.js';
import Nav from '../Component/Nav.jsx';
import TableInvoice from "../Component/TableInvoice.jsx";

function ListInvoice() {
  useEffect(() => {
    testSupabaseConnection();
  }, []);
  
  return (
    <div className="flex h-screen bg-gray-100">
      <Nav />
      <div className="flex-1 p-8 overflow-auto ml-56">
        <Routes>
          <Route path="/" element={<TableInvoice />} />
        </Routes>
      </div>
    </div>
  );
}

export default ListInvoice;

     
       
    