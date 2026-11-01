import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f4f8",
          100: "#d9e2ec",
          200: "#bcccdc",
          300: "#9fb3c8",
          400: "#829ab1",
          500: "#627d98",
          600: "#486581",
          700: "#334e68",
          800: "#243b53",
          900: "#102a43",
          950: "#0b1528",
        },
        bna: {
          saffron: "#ea580c",
          saffronDark: "#c2410c",
          saffronLight: "#ffedd5",
          green: "#15803d",
          greenDark: "#166534",
          greenLight: "#dcfce7",
          navy: "#0b2545",
          navyDark: "#07162c",
          navyLight: "#1e3a8a",
        },
        editorial: {
          navy: "#0a1128",
          dark: "#0f172a",
          red: "#dc2626",
          darkRed: "#991b1b",
          lightRed: "#fee2e2",
          gray: "#64748b",
          lightGray: "#f8fafc",
          border: "#e2e8f0",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "sans-serif",
        ],
        serif: ["Merriweather", "Georgia", "Cambria", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
