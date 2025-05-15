import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Fungsi untuk test koneksi
export async function testSupabaseConnection() {
  try {
    // Ganti 'nama_tabel_anda' dengan nama tabel yang ada di Supabase Anda
    const { data, error } = await supabase.from('Table_Sekolah').select('*').limit(1);
    if (error) {
      console.error('Koneksi ke Supabase gagal:', error.message);
      return false;
    }
    console.log('Koneksi ke Supabase berhasil! Data:', data);
    return true;
  } catch (err) {
    console.error('Error:', err);
    return false;
  }
}

export default supabase;
