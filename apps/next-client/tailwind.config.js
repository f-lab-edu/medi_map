/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/styles/**/*.{css,scss}",
    "./src/stories/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "btn-color": "var(--btn-color)",
        "border-gray": "#ccc",
        "border-custom": "rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};