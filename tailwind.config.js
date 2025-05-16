/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"], // pastikan ini sesuai struktur proyekmu
    theme: {
      extend: {},
    },
    plugins: [require('daisyui')],
  }
  