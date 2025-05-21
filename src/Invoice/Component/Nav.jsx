import React from 'react';
import logo from '../../Asset/logo.png';
import { useNavigate } from 'react-router-dom';

const menuItems = [
  {
    label: 'Dashboard',
    path: '/',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8v-10h-8v10zm0-18v6h8V3h-8z" />
      </svg>
    ),
  },
  {
    label: 'Sekolah',
    path: '/ListSekolah',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 3L2 9l10 6 10-6-10-6zm0 13v5m-6-5v5m12-5v5" />
      </svg>
    ),
  },
  {
    label: 'Invoice',
    path: '/ListInvoice',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M8 2v4M16 2v4M4 10h16" />
      </svg>
    ),
  },
];

function Nav() {
  const navigate = useNavigate();

  return (
    <nav className="h-screen w-56 bg-[#10365B] text-white flex flex-col shadow-lg fixed left-0 top-0 z-50">
      <div className="py-8 px-6 flex items-center gap-3 border-b border-[#0d2946]">
        <img src={logo} alt="Logo" className="w-10 h-10 rounded" />
        <span className="text-2xl font-bold tracking-wide">InvoiceApp</span>
      </div>
      <ul className="flex-1 py-4">
        {menuItems.map((item, idx) => (
          <li
            key={idx}
            className="flex items-center gap-4 px-6 py-3 cursor-pointer hover:bg-[#17467a] transition-colors duration-200 rounded-lg"
            onClick={() => navigate(item.path)}
          >
            <span>{item.icon}</span>
            <span className="text-base">{item.label}</span>
          </li>
        ))}
      </ul>
      <div className="px-6 py-4 border-t border-[#0d2946] text-sm text-blue-200">
        &copy; 2024 InvoiceApp
      </div>
    </nav>
  );
}

export default Nav;