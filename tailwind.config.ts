import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface-container-lowest": "#ffffff",
        primary: "#044328",
        "secondary-fixed-dim": "#f5bd58",
        tertiary: "#003b6b",
        "on-error-container": "#93000a",
        "inverse-primary": "#99d3af",
        "on-primary": "#ffffff",
        "surface-variant": "#dee3e7",
        background: "#f5fafe",
        "outline-variant": "#c0c9c0",
        "surface-dim": "#d5dbde",
        "tertiary-fixed-dim": "#a1c9ff",
        "on-secondary-container": "#755100",
        "surface-container-high": "#e3e9ec",
        "tertiary-fixed": "#d2e4ff",
        "surface-container-highest": "#dee3e7",
        "on-primary-fixed": "#002111",
        "primary-fixed": "#b4f0ca",
        "error-container": "#ffdad6",
        "inverse-surface": "#2b3134",
        "on-surface-variant": "#404942",
        "inverse-on-surface": "#ecf1f5",
        "surface-bright": "#f5fafe",
        "primary-fixed-dim": "#99d3af",
        "on-secondary": "#ffffff",
        "surface-tint": "#32694b",
        "secondary-fixed": "#ffdea9",
        secondary: "#7d5800",
        "on-tertiary-fixed": "#001c38",
        "on-background": "#171c1f",
        "surface-container-low": "#eff4f8",
        "on-primary-container": "#97d1ac",
        "surface-container": "#e9eff2",
        "secondary-container": "#fec65f",
        error: "#ba1a1a",
        "tertiary-container": "#0c538f",
        "on-tertiary-fixed-variant": "#004880",
        "primary-container": "#235b3e",
        "on-secondary-fixed": "#271900",
        outline: "#717972",
        "on-tertiary-container": "#9dc7ff",
        "on-tertiary": "#ffffff",
        "on-error": "#ffffff",
        "on-secondary-fixed-variant": "#5f4100",
        surface: "#f5fafe",
        "on-primary-fixed-variant": "#175034",
        "on-surface": "#171c1f"
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem"
      },
      spacing: {
        "stack-md": "16px",
        "stack-lg": "32px",
        "margin-mobile": "16px",
        "container-max": "1280px",
        "stack-sm": "8px",
        gutter: "24px"
      },
      fontFamily: {
        "headline-lg-mobile": ["Inter"],
        "headline-md": ["Inter"],
        "label-sm": ["Inter"],
        "body-md": ["Inter"],
        "body-lg": ["Inter"],
        "headline-xl": ["Inter"],
        "headline-lg": ["Inter"],
        "label-lg": ["Inter"]
      },
      fontSize: {
        "headline-lg-mobile": ["24px", {"lineHeight": "1.3", "fontWeight": "700"}],
        "headline-md": ["24px", {"lineHeight": "1.4", "fontWeight": "600"}],
        "label-sm": ["12px", {"lineHeight": "1.2", "fontWeight": "500"}],
        "body-md": ["16px", {"lineHeight": "1.5", "fontWeight": "400"}],
        "body-lg": ["18px", {"lineHeight": "1.6", "fontWeight": "400"}],
        "headline-xl": ["40px", {"lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "700"}],
        "headline-lg": ["32px", {"lineHeight": "1.2", "fontWeight": "700"}],
        "label-lg": ["14px", {"lineHeight": "1.2", "fontWeight": "600"}]
      }
    },
  },
  plugins: [],
};
export default config;
