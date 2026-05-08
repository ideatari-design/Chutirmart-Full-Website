/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        earth: {
          50: "#fcfaf8",
          100: "#f7f2ed",
          200: "#ede2d6",
          300: "#dec8b5",
          400: "#caaa8e",
          500: "#bc9475",
          600: "#ae8166",
          700: "#916955",
          800: "#76574a",
          900: "#60483f",
        },
      },
      fontFamily: {
        sans: ["Outfit", "Inter", "system-ui", "sans-serif"],
        bn: ["Inter", "system-ui", "sans-serif"], // Placeholder if specific BN font is needed
      },
    },
  },
  plugins: [],
};
