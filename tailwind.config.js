/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                slate: {
                    850: '#1e293b',
                    950: '#0f172a',
                },
            },
        },
    },
    plugins: [],
}
