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
        primary: {
          DEFAULT: "#7C5CFF",
          soft: "#5b3bc4",
        },
        surface: {
          card: "#151224",
          base: "#0c0a13",
        },
      },
    },
  },
  plugins: [],
};
