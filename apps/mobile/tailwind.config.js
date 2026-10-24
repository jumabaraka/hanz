/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0E4F4C',
          dark: '#0A3D3B',
          soft: '#E3EFEE',
          muted: '#86A9A6',
        },
        accent: {
          DEFAULT: '#F26B1D',
          soft: '#FDEBDD',
        },
        // Text and icons placed on the teal primary background.
        'on-primary': {
          DEFAULT: '#CFE3E1',
          muted: '#9BBDBA',
        },
        canvas: '#F3F4F4', // screen background
        card: '#FFFFFF', // cards, sheets, bars
        ink: '#1A1D1E', // main text
        muted: '#6B7272', // secondary text, placeholders
        line: '#E4E6E6', // dividers and borders
        chip: '#EEF0F0', // unselected chips
        disabled: '#9AA5A4',
        backdrop: '#D9DEDD', // around the phone-width app on a wide browser window
        success: {
          DEFAULT: '#1E8E5A',
          soft: '#E1F4EA',
        },
        danger: {
          DEFAULT: '#D93B3B',
          soft: '#FBE5E5',
        },
        star: '#F5B301',
      },
      borderRadius: {
        card: '16px',
        sheet: '28px',
      },
    },
  },
  plugins: [],
}