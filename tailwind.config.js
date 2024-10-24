'use strict'

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Permite usar el modo oscuro con una clase
  theme: {
    extend: {
      colors: {
        'editor-border-light': '#e2e8f0', // Color de borde en modo claro
        'editor-border-dark': '#2d3748' // Color de borde en modo oscuro
      }
    }
  },
  variants: {
    extend: {
      borderColor: ['dark']
    }
  },
  plugins: [],
  content: ['./src/**/*.{js,ts,jsx,tsx,css}'],
  corePlugins: {
    preflight: false
  },
  important: '#__next',
  plugins: [require('tailwindcss-logical'), require('./src/@core/tailwind/plugin')],
  theme: {
    extend: {}
  }
}
