/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e6f1fe",
          100: "#cce3fd",
          200: "#99c7fb",
          300: "#66abf9",
          400: "#338ff7",
          500: "#0073f5",
          600: "#005cc4",
          700: "#004593",
          800: "#002e62",
          900: "#001731",
        },
        neon: {
          blue: "#00f3ff",
          purple: "#8b5cf6",
          pink: "#ec4899",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "cyber-grid":
          "linear-gradient(transparent 0%, rgba(0,73,255,0.2) 2%, transparent 3%), linear-gradient(90deg, transparent 0%, rgba(0,73,255,0.2) 2%, transparent 3%)",
      },
      animation: {
        glow: "glow 2s ease-in-out infinite alternate",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        glow: {
          "0%": {
            "box-shadow":
              "0 0 10px rgba(0,115,245,0.5), 0 0 20px rgba(0,115,245,0.3)",
          },
          "100%": {
            "box-shadow":
              "0 0 20px rgba(0,115,245,0.8), 0 0 40px rgba(0,115,245,0.5)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
