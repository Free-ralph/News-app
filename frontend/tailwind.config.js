/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      display: ['Newsreader', 'serif'],
      body: ['Newsreader', 'serif'],
    },
    extend: {
      colors: {
        'primary' : '#f4e6d9',
        'secondary' : '#191814',
        'muted' : '#e8eaec'
      },
      backgroundColor: {
        'primary' : '#f4e6d9',
        'secondary' : '#191814',
        'muted' : '#e8eaec'

      },
      borderWidth: {
        1: '1px',
      },
      borderColor: {
        'primary' : '#f4e6d9',
        'secondary' : '#191814',
        'muted' : '#e8eaec'
      },
      placeholderColor: {
        'primary' : '#f4e6d9',
        'secondary' : '#191814',
        'muted' : '#e8eaec'
      }
    },
  },
  plugins: [],
}
