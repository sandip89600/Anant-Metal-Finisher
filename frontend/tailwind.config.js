/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0b192c',
          navyLight: '#1e3e62',
          primary: '#1e3a8a', // Deep industrial navy
          primaryHover: '#172554',
          accent: '#0284c7', // Industrial precision blue
          accentOrange: '#ea580c', // Industrial alert/CTA orange
          metallic: '#94a3b8',
          metallicLight: '#f1f5f9',
          surface: '#ffffff',
          surfaceMuted: '#f8fafc',
          border: '#e2e8f0',
          darkBorder: '#334155'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace']
      }
    },
  },
  plugins: [],
}
