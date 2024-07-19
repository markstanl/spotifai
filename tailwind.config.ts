import type {Config} from "tailwindcss";

const config: Config = {
    content: [
        "./src/spotifai/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            colors: {
                'dark-text': '#f8fdd8',
                'dark-bg': '#0d0e01',
                'dark-primary': '#ebf782',
                'dark-secondary': '#1b990a',
                'dark-accent': '#14f047',
                'dark-accent-hover': '#12C63C',
                'text': '#222702',
                'bg': '#fdfef1',
                'primary': '#717d08',
                'secondary': '#76f566',
                'accent': '#0feb42',
                'accent-hover': '#4EF374',
            },
            fontFamily: {
                'inter': ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
export default config;
