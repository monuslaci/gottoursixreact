import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./config/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        brotherhood: {
          navy: "#1E3A5F",
          steel: "#4F6D8A",
          bronze: "#C28B40",
          forest: "#3D7A57",
          charcoal: "#1F2937",
          light: "#F5F7FA",
          white: "#FFFFFF",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              50: "#eef3f8",
              100: "#d8e3ef",
              200: "#b3c7df",
              300: "#8eaacf",
              400: "#698ebf",
              500: "#1E3A5F",
              600: "#19314f",
              700: "#14283f",
              800: "#0f1f2f",
              900: "#0a161f",
              DEFAULT: "#1E3A5F",
              foreground: "#ffffff",
            },
            secondary: {
              50: "#f2f5f8",
              100: "#e2e8ef",
              200: "#c5d1df",
              300: "#a8bacf",
              400: "#8ba3bf",
              500: "#4F6D8A",
              600: "#425c74",
              700: "#354b5e",
              800: "#283a48",
              900: "#1b2932",
              DEFAULT: "#4F6D8A",
              foreground: "#ffffff",
            },
            success: {
              DEFAULT: "#3D7A57",
              foreground: "#ffffff",
            },
            warning: {
              DEFAULT: "#C28B40",
              foreground: "#ffffff",
            },
          },
        },
        dark: {
          colors: {
            primary: {
              50: "#0a161f",
              100: "#0f1f2f",
              200: "#14283f",
              300: "#19314f",
              400: "#1E3A5F",
              500: "#35567d",
              600: "#54759d",
              700: "#809bc0",
              800: "#b3c7df",
              900: "#eef3f8",
              DEFAULT: "#35567d",
              foreground: "#ffffff",
            },
            secondary: {
              50: "#1b2932",
              100: "#283a48",
              200: "#354b5e",
              300: "#425c74",
              400: "#4F6D8A",
              500: "#6987a4",
              600: "#8ba3bf",
              700: "#a8bacf",
              800: "#c5d1df",
              900: "#f2f5f8",
              DEFAULT: "#6987a4",
              foreground: "#ffffff",
            },
            success: {
              DEFAULT: "#4B946A",
              foreground: "#ffffff",
            },
            warning: {
              DEFAULT: "#D4A056",
              foreground: "#ffffff",
            },
          },
        },
      },
    }),
  ],
};

export default config;

