/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // allow background utilities generated dynamically in components
    { pattern: /^bg-(?:white|gray-100|gray-200|gray-300|gray-400|red-500|green-500|blue-500|yellow-500|purple-500)$/ },
    // grid-cols-<number> is generated at runtime based on state count
    { pattern: /^grid-cols-\d+$/ },
  ],
  plugins: [],
}
