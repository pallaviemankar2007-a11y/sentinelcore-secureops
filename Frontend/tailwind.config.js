/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Same palette as the CSS variables in src/index.css — use these
        // in new Tailwind-based components so colors stay consistent with
        // the existing inline-style components.
        ink: '#0B1220',
        panel: '#0F1830',
        'panel-raised': '#141F3D',
        healthy: '#2DD4BF',
        warning: '#F5A623',
        critical: '#F0455D',
        accent: '#6C8CFF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
