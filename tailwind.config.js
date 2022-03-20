module.exports = {
  mode: 'jit',
  purge: [
    './public/**/*.{html}',
    './src/**/*.{vue,js,ts,html}'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'main-color': '#AA8473',
        'secondary-color': '#FFD6C9',
        'third-color': '#DDD2CD',
        'enough-color': '#00A29A',
        'little-color': '#D6505B',
        gray: {
          'title': '#333',
          'inline': '#555',
          'tips': '#888',
          'deco': '#CCC',
          'decolight': '#EEE',
        },
      },
      boxShadow: {
        DEFAULT: '0 0 10px 0 rgba(0, 0, 0, 0.25)',
        pc: '0 0 10px 0 rgba(0, 0, 0, 0.4)',
      }
    },
  },
  plugins: [],
}
