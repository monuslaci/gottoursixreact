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
          navy: "rgb(var(--heroui-colors-primary-500) / <alpha-value>)",
          steel: "rgb(var(--heroui-colors-secondary-500) / <alpha-value>)",
          bronze: "rgb(var(--heroui-colors-warning) / <alpha-value>)",
          forest: "rgb(var(--heroui-colors-success) / <alpha-value>)",
          charcoal: "rgb(var(--foreground) / <alpha-value>)",
          light: "rgb(var(--background) / <alpha-value>)",
          white: "rgb(255 255 255 / <alpha-value>)",
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
            background: "rgb(var(--background) / <alpha-value>)",
            foreground: "rgb(var(--foreground) / <alpha-value>)",
            content1: "rgb(var(--content1) / <alpha-value>)",
            content2: "rgb(var(--content2) / <alpha-value>)",
            divider: "rgb(var(--divider) / <alpha-value>)",
            default: {
              100: "rgb(var(--default-100) / <alpha-value>)",
              200: "rgb(var(--default-200) / <alpha-value>)",
              300: "rgb(var(--default-300) / <alpha-value>)",
              400: "rgb(var(--default-400) / <alpha-value>)",
              500: "rgb(var(--default-500) / <alpha-value>)",
              600: "rgb(var(--default-600) / <alpha-value>)",
              700: "rgb(var(--default-700) / <alpha-value>)",
              800: "rgb(var(--default-800) / <alpha-value>)",
              900: "rgb(var(--default-900) / <alpha-value>)",
              foreground: "rgb(var(--foreground) / <alpha-value>)",
            },
            primary: {
              50: "rgb(var(--heroui-colors-primary-50) / <alpha-value>)",
              100: "rgb(var(--heroui-colors-primary-100) / <alpha-value>)",
              200: "rgb(var(--heroui-colors-primary-200) / <alpha-value>)",
              300: "rgb(var(--heroui-colors-primary-300) / <alpha-value>)",
              400: "rgb(var(--heroui-colors-primary-400) / <alpha-value>)",
              500: "rgb(var(--heroui-colors-primary-500) / <alpha-value>)",
              600: "rgb(var(--heroui-colors-primary-600) / <alpha-value>)",
              700: "rgb(var(--heroui-colors-primary-700) / <alpha-value>)",
              800: "rgb(var(--heroui-colors-primary-800) / <alpha-value>)",
              900: "rgb(var(--heroui-colors-primary-900) / <alpha-value>)",
              DEFAULT: "rgb(var(--heroui-colors-primary-500) / <alpha-value>)",
              foreground: "rgb(255 255 255 / <alpha-value>)",
            },
            secondary: {
              50: "rgb(var(--heroui-colors-secondary-50) / <alpha-value>)",
              100: "rgb(var(--heroui-colors-secondary-100) / <alpha-value>)",
              200: "rgb(var(--heroui-colors-secondary-200) / <alpha-value>)",
              300: "rgb(var(--heroui-colors-secondary-300) / <alpha-value>)",
              400: "rgb(var(--heroui-colors-secondary-400) / <alpha-value>)",
              500: "rgb(var(--heroui-colors-secondary-500) / <alpha-value>)",
              600: "rgb(var(--heroui-colors-secondary-600) / <alpha-value>)",
              700: "rgb(var(--heroui-colors-secondary-700) / <alpha-value>)",
              800: "rgb(var(--heroui-colors-secondary-800) / <alpha-value>)",
              900: "rgb(var(--heroui-colors-secondary-900) / <alpha-value>)",
              DEFAULT: "rgb(var(--heroui-colors-secondary-500) / <alpha-value>)",
              foreground: "rgb(255 255 255 / <alpha-value>)",
            },
            success: {
              DEFAULT: "rgb(var(--heroui-colors-success) / <alpha-value>)",
              foreground: "rgb(255 255 255 / <alpha-value>)",
            },
            warning: {
              DEFAULT: "rgb(var(--heroui-colors-warning) / <alpha-value>)",
              foreground: "rgb(255 255 255 / <alpha-value>)",
            },
          },
        },
        dark: {
          colors: {
            background: "rgb(var(--background) / <alpha-value>)",
            foreground: "rgb(var(--foreground) / <alpha-value>)",
            content1: "rgb(var(--content1) / <alpha-value>)",
            content2: "rgb(var(--content2) / <alpha-value>)",
            divider: "rgb(var(--divider) / <alpha-value>)",
            default: {
              100: "rgb(var(--default-100) / <alpha-value>)",
              200: "rgb(var(--default-200) / <alpha-value>)",
              300: "rgb(var(--default-300) / <alpha-value>)",
              400: "rgb(var(--default-400) / <alpha-value>)",
              500: "rgb(var(--default-500) / <alpha-value>)",
              600: "rgb(var(--default-600) / <alpha-value>)",
              700: "rgb(var(--default-700) / <alpha-value>)",
              800: "rgb(var(--default-800) / <alpha-value>)",
              900: "rgb(var(--default-900) / <alpha-value>)",
              foreground: "rgb(var(--foreground) / <alpha-value>)",
            },
            primary: {
              50: "rgb(var(--heroui-colors-primary-50) / <alpha-value>)",
              100: "rgb(var(--heroui-colors-primary-100) / <alpha-value>)",
              200: "rgb(var(--heroui-colors-primary-200) / <alpha-value>)",
              300: "rgb(var(--heroui-colors-primary-300) / <alpha-value>)",
              400: "rgb(var(--heroui-colors-primary-400) / <alpha-value>)",
              500: "rgb(var(--heroui-colors-primary-500) / <alpha-value>)",
              600: "rgb(var(--heroui-colors-primary-600) / <alpha-value>)",
              700: "rgb(var(--heroui-colors-primary-700) / <alpha-value>)",
              800: "rgb(var(--heroui-colors-primary-800) / <alpha-value>)",
              900: "rgb(var(--heroui-colors-primary-900) / <alpha-value>)",
              DEFAULT: "rgb(var(--heroui-colors-primary-500) / <alpha-value>)",
              foreground: "rgb(255 255 255 / <alpha-value>)",
            },
            secondary: {
              50: "rgb(var(--heroui-colors-secondary-50) / <alpha-value>)",
              100: "rgb(var(--heroui-colors-secondary-100) / <alpha-value>)",
              200: "rgb(var(--heroui-colors-secondary-200) / <alpha-value>)",
              300: "rgb(var(--heroui-colors-secondary-300) / <alpha-value>)",
              400: "rgb(var(--heroui-colors-secondary-400) / <alpha-value>)",
              500: "rgb(var(--heroui-colors-secondary-500) / <alpha-value>)",
              600: "rgb(var(--heroui-colors-secondary-600) / <alpha-value>)",
              700: "rgb(var(--heroui-colors-secondary-700) / <alpha-value>)",
              800: "rgb(var(--heroui-colors-secondary-800) / <alpha-value>)",
              900: "rgb(var(--heroui-colors-secondary-900) / <alpha-value>)",
              DEFAULT: "rgb(var(--heroui-colors-secondary-500) / <alpha-value>)",
              foreground: "rgb(255 255 255 / <alpha-value>)",
            },
            success: {
              DEFAULT: "rgb(var(--heroui-colors-success) / <alpha-value>)",
              foreground: "rgb(255 255 255 / <alpha-value>)",
            },
            warning: {
              DEFAULT: "rgb(var(--heroui-colors-warning) / <alpha-value>)",
              foreground: "rgb(255 255 255 / <alpha-value>)",
            },
          },
        },
      },
    }),
  ],
};

export default config;
