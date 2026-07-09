/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0F172A",       // near-black slate for primary text
        canvas: "#F7F7F5",    // warm paper background
        panel: "#FFFFFF",
        line: "#E4E2DC",
        muted: "#6B7280",
        brand: {
          DEFAULT: "#1F6F5C", // deep pine green — engineering-notebook accent
          light: "#E7F1EC",
          dark: "#164F41",
        },
        amber: {
          DEFAULT: "#B8863A",
        },
      },
      fontFamily: {
        display: ["'Inter'", "system-ui", "-apple-system", "sans-serif"],
        body: ["'Inter'", "system-ui", "-apple-system", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 6px rgba(15, 23, 42, 0.04)",
      },
    },
  },
  plugins: [],
};
