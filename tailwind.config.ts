import type { Config } from "tailwindcss";

// In Tailwind v4, theme is defined in CSS via @theme {}
// This config just sets the content paths for class scanning
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
} satisfies Config;
