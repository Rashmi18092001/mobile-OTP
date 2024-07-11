// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Add your file paths here
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-bg': "url('/src/images/bg.avif')",
      },
    },
  },
  plugins: [],
};
