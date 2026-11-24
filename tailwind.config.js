/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      screens: {
        xs: "375px",
        "3xl": "1920px",
      },
      colors: {
        // Fond et surfaces : du plus profond au plus élevé.
        ink: {
          DEFAULT: "#09090B",
          900: "#09090B",
          850: "#0E0E11",
          800: "#121216",
          750: "#17171C",
          700: "#1D1D23",
          600: "#26262E",
        },
        line: {
          DEFAULT: "rgba(255,255,255,0.08)",
          strong: "rgba(255,255,255,0.14)",
        },
        fg: {
          DEFAULT: "#FAFAFA",
          muted: "#A1A1AA",
          faint: "#71717A",
        },
        // Le violet du logo : ce qui joue, ce qui est choisi, ce qui est mis en avant.
        accent: {
          DEFAULT: "#7C5CFF",
          soft: "rgba(124,92,255,0.14)",
          deep: "#5B2CC9",
        },
        // Anciens noms (admin) gardés pour ne rien casser.
        brand: {
          DEFAULT: "#4F2BD4",
          vivid: "#7C5CFF",
          hover: "#5B35E8",
          lavender: "#9F8CFF",
          night: "#090912",
          card: "#0F0F18",
          footer: "#030308",
        },
        primary: { DEFAULT: "#7C5CFF", soft: "#5b3bc4" },
        surface: { card: "#151224", base: "#0c0a13" },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      maxWidth: {
        site: "1200px",
        prose: "68ch",
      },
      borderRadius: {
        card: "16px",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        bars: {
          "0%, 100%": { transform: "scaleY(0.35)" },
          "50%": { transform: "scaleY(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        rise: "rise 0.5s cubic-bezier(0.22,1,0.36,1) both",
        bars: "bars 0.9s ease-in-out infinite",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
};
