/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        loginImg:
          'url("../public/5c34ad169532125.Y3JvcCwyOTQ0LDIzMDMsNjE5LDIyMzc.webp")',
      },
      colors: {
        darkTheme: "#36393F",
      },
    },
  },
  plugins: [],
};
