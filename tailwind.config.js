/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#7CFC00", // Uranium Green
        accent: "#A8FF60", // Soft Neon Green
        glow: "#39FF14", // Accent Glow Green
        background: "#F7FDF9", // Main Background
        card: "#F1F9F4", // Card Background (Slightly tinted)
        text: {
          primary: "#1A1A1A",
          secondary: "#555555",
          muted: "#888888",
        },
        status: {
          safe: "#22C55E",
          medium: "#FACC15",
          high: "#EF4444",
        }
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(to bottom right, #F7FDF9, #E6FBEF)',
      },
      boxShadow: {
        'glass': '0 8px 30px rgba(0, 0, 0, 0.04)',
        'neon-glow': '0 0 20px rgba(124, 252, 0, 0.3)',
        'btn-glow': '0 0 15px rgba(57, 255, 20, 0.6)',
      }
    },
  },
  plugins: [],
}
