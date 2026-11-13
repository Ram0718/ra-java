/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Apple-inspired Color Tokens
        apple: {
          canvas: "#FBFBFD",       // Apple warm off-white canvas
          surface: "#FFFFFF",      // Pure white card / panel surface
          subtle: "#F5F5F7",       // Subtle secondary surface / inset background
          grouped: "#F2F2F7",      // iOS/macOS grouped table background
          border: "#E5E5EA",       // Delicate 1px hairline border
          borderStrong: "#D2D2D7", // Input & strong border
          text: {
            primary: "#1D1D1F",    // Deep charcoal headline & primary text
            secondary: "#6E6E73",  // Clear readable secondary text
            tertiary: "#86868B",   // Caption, metadata, timestamp
            quaternary: "#A1A1A6", // Disabled / placeholder text
          },
          blue: {
            DEFAULT: "#0071E3",    // Apple system blue
            hover: "#0077ED",
            light: "#E8F2FD",
          },
          green: {
            DEFAULT: "#34C759",    // Apple system green
            hover: "#2FB34F",
            light: "#EBF9EE",
          },
          orange: {
            DEFAULT: "#FF9500",    // Apple system orange
            light: "#FFF5E5",
          },
          red: {
            DEFAULT: "#FF3B30",    // Apple system red
            light: "#FFEBEA",
          },
          gray: {
            50: "#FBFBFD",
            100: "#F5F5F7",
            200: "#E5E5EA",
            300: "#D2D2D7",
            400: "#AEAEB2",
            500: "#86868B",
            600: "#6E6E73",
            700: "#424245",
            800: "#2D2D2F",
            900: "#1D1D1F",
          }
        },
        // Backward compatibility mappings
        canvas: "#FBFBFD",
        surface: "#FFFFFF",
        elevated: "#FFFFFF",
        subtle: "#F5F5F7",
        dim: "#E5E5EA",
        primary: "#1D1D1F",
        secondary: "#6E6E73",
        tertiary: "#86868B",
      },
      fontFamily: {
        sans: [
          'SF Pro Display',
          '-apple-system',
          'BlinkMacSystemFont',
          'Inter',
          'Segoe UI',
          'Roboto',
          'sans-serif'
        ],
        mono: [
          '"SF Mono"',
          '"JetBrains Mono"',
          'Menlo',
          'Consolas',
          'monospace'
        ],
        display: [
          'SF Pro Display',
          '-apple-system',
          'BlinkMacSystemFont',
          'Inter',
          'sans-serif'
        ],
      },
      boxShadow: {
        'apple-sm': '0 1px 2px rgba(0, 0, 0, 0.04)',
        'apple-card': '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        'apple-float': '0 12px 32px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
        'apple-modal': '0 24px 64px rgba(0, 0, 0, 0.16), 0 4px 16px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        'apple-sm': '6px',
        'apple': '10px',
        'apple-card': '14px',
        'apple-modal': '18px',
        'apple-pill': '9999px',
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
        normal: '0em',
        wide: '0.025em',
      },
    },
  },
  plugins: [],
}
