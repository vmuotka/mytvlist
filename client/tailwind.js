const colors = require("tailwindcss/colors");

module.exports = {
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                pink: {
                    100: '#fff5f7',
                    150: '#ffe6ed',
                    200: '#fed7e2',
                    300: '#fbb6ce',
                    400: '#f687b3',
                    500: '#ed64a6',
                    600: '#d53f8c',
                    700: '#b83280',
                    800: '#97266d',
                    900: '#702459',
                },

            }
        },
    },
    variants: {
        extend: {
            opacity: ['disabled'],
            borderWidth: ['focus'],
            backgroundColor: ['focus', 'odd'],
            borderRadius: ['first', 'last']
        },
    },
    plugins: [],
}
