module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
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