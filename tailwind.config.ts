import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))", // slate-200
        input: "hsl(var(--input))", // slate-300
        ring: "hsl(var(--ring))", // slate-400
        background: "hsl(var(--background))", // white
        foreground: "hsl(var(--foreground))", // slate-900
        primary: {
          DEFAULT: "#0B8A3D", // Main Green
          foreground: "#FFFFFF", // White for text on primary
          dark: "#084D2A", // Darker Green
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))", // slate-100
          foreground: "hsl(var(--secondary-foreground))", // slate-800
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))", // slate-100
          foreground: "hsl(var(--muted-foreground))", // slate-500
        },
        accent: {
          DEFAULT: "hsl(var(--accent))", // slate-100
          foreground: "hsl(var(--accent-foreground))", // slate-800
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))", // white
          foreground: "hsl(var(--card-foreground))", // slate-900
        },
        lightgray: "#f7fafc", // A very light gray
      },
      borderRadius: {
        lg: "0.75rem", // Slightly larger radius
        md: "0.5rem",
        sm: "0.25rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          '"Noto Sans"',
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
