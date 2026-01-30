import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
        devanagari: ['Tiro Devanagari Hindi', 'serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        festival: {
          sunset: "hsl(var(--festival-sunset))",
          gold: "hsl(var(--festival-gold))",
          saffron: "hsl(var(--festival-saffron))",
          green: "hsl(var(--festival-green))",
          cream: "hsl(var(--festival-cream))",
          terracotta: "hsl(var(--festival-terracotta))",
          "deep-orange": "hsl(var(--festival-deep-orange))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 12px)",
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
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "scale-in": "scale-in 0.4s ease-out",
        "slide-in-right": "slide-in-right 0.5s ease-out",
      },
      backgroundImage: {
        "gradient-sunset": "linear-gradient(135deg, hsl(28 90% 55%), hsl(15 85% 60%), hsl(45 95% 55%))",
        "gradient-warm": "linear-gradient(180deg, hsl(40 60% 95%), hsl(35 45% 97%))",
        "gradient-hero": "linear-gradient(180deg, hsl(25 40% 20% / 0.7), hsl(25 40% 20% / 0.4), transparent)",
        "gradient-card": "linear-gradient(135deg, hsl(40 50% 98% / 0.9), hsl(40 50% 98% / 0.7))",
      },
      boxShadow: {
        "glass": "0 8px 32px hsl(25 30% 15% / 0.1), inset 0 1px 0 hsl(40 50% 100% / 0.2)",
        "glass-lg": "0 20px 40px hsl(25 30% 15% / 0.15), inset 0 1px 0 hsl(40 50% 100% / 0.3)",
        "festival": "0 4px 20px hsl(28 90% 55% / 0.3)",
        "festival-lg": "0 8px 30px hsl(28 90% 55% / 0.4)",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
