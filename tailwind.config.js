/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      screens: {
        xxs: "320px",
        xs: "375px",
        // keep Tailwind defaults: sm, md, lg, xl, 2xl
        "3xl": "1920px",
      },
      colors: {
        brand: {
          DEFAULT: "#4F2BD4",
          vivid: "#7C5CFF",
          hover: "#5B35E8",
          lavender: "#9F8CFF",
          night: "#090912",
          card: "#0F0F18",
          footer: "#030308",
        },
        primary: {
          DEFAULT: "#7C5CFF",
          soft: "#5b3bc4",
        },
        surface: {
          card: "#151224",
          base: "#0c0a13",
        },
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
      },
    },
  },
  plugins: [],
};
