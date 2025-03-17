/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sf-pro': ['SF Pro Display', 'sans-serif'], // Add your custom font here
      },
      height: {
        'inputHeight': '40px', // Default Tailwind h-32 value
  
      },
      fontWeight: {
        customBold: 700,
        customBold2:600,
        customBold3:500,
        customBold4:400

         // Font weight of 600
      },
      screens: {
        'xs': '500px', 
        'xxs': '420px',
        'xxss': '360px',
        'xlx':'1400px',
        'xlss':'1500px',
        "xlxs": '1800px',
      },
      colors: {
        
        customGreen: '#022213', // Custom green color
        liteGreen: '#72A10F',   // Lite green color
        customGray:'#999999',
        semiLiteGreen:"#CCCC31",
        customeGray2:"#757575"
      },
      fontSize: {
        'main-heading': '44px', // Main heading size
        'main-heading2':'26px',
        'main-heading3':'22px',

        'sub-heading': '18px',  // Subheading size
        'sub-heading2': '16px',
        'auth-heading': '28px', // Subheading2 size
        'input-size':"36px",
        'smallHead':'12px'

      }
    },
  },
  plugins: [],
}
