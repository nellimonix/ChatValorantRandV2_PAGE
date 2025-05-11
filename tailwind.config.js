module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                valorant: {
                    red: "#FD4556",
                    black: "#111111",
                    darkGray: "#292929",
                    gray: "#383838",
                    lightGray: "#EFEFEF"
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                valorant: ['VALORANT', 'sans-serif']
            }
        },
    },
    plugins: [],
}