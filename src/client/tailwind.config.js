module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}', // Escanea todos los archivos relevantes en src/
    '../../dist/**/*.{js,jsx,ts,tsx}', // Servir frontend desde el backend
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "Avenir", "Helvetica", "Arial", "sans-serif"],
      },
      colors: {
        light: "#ffffff",
        dark: "#242424",
        primary: "#646cff",
        hover: "#535bf2",
      },
    },
  },
  plugins: [],
};