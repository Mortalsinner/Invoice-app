
// import '../output.css';
import { Routes, Route } from "react-router-dom";
import { useEffect } from 'react';

// Import File
import { supabase, testSupabaseConnection } from '../../supabase-config.js';
import Nav from '../Component/Nav.jsx';
import Table from '../Component/Table.jsx';

function ListSekolah() {
  useEffect(() => {
    testSupabaseConnection();
  }, []);
  
  return (
    <div className="flex h-screen bg-gray-100">
      <Nav />
      <div className="flex-1 p-8 overflow-auto ml-56">
        <Routes>
          <Route path="/" element={<Table />} />
        </Routes>
      </div>
    </div>
  );
}

export default ListSekolah;

     
       
    