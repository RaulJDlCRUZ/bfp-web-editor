export const content = ["client/index.html", "client/src/**/*.{js,jsx,ts,tsx}"];
export const theme = {
  extend: {
    fontFamily: {
      sans: [
        "Inter",
        "system-ui",
        "Avenir",
        "Helvetica",
        "Arial",
        "sans-serif",
      ],
    },
    colors: {
      light: "#ffffff",
      dark: "#242424",
      primary: "#646cff",
      hover: "#535bf2",
    },
  },
};
export const variants = {
  // all the following default to ['responsive']
  imageRendering: ["responsive"],
};
export const plugins = [
  require("tailwindcss-image-rendering")(), // no options to configure
];
