module.exports =
{
  darkMode: 'class',
  // Note: config only includes the used styles & variables of your selection
  content: ["./src/**/*.{html,vue,svelte,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'sfpro': ['SF Pro Display', 'sans-serif'],
        'satoshi': ['Satoshi Variable', 'sans-serif'],
        'Neue': ['PP Neue Montreal', 'sans-serif'],
        'sfmono': ['SF Mono', 'monospace'],
      },
      fontSize: {

      },
      fontWeight: {

      },
      lineHeight: {

      },
      letterSpacing: {

      },
      borderRadius: {

      },
      colors: {
        'ui-colors-blue': '#0071e3',
        'black-gray': '#1C1C1C',
      },
      spacing: {

      },
      width: {

      },
      minWidth: {

      },
      maxWidth: {

      },
      height: {

      },
      minHeight: {

      },
      maxHeight: {

      },
      keyframes: {
        glow: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.5)', opacity: '1' },
        },
        ripple: {
          '0%': { transform: 'scale(1)', opacity: '0.7' },
          '70%': { transform: 'scale(1.5)', opacity: '0.3' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        dotwave: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.7' },
          '50%': { transform: 'scale(1.6)', opacity: '0.3' },
        },
        rippleOnce: {
          '0%': { transform: 'scale(1)', opacity: '0.7' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        'rotate-toggle': {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(180deg) scale(1.2)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        },
        'move-right': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(40px)' },
        },
        'move-left': {
          '0%': { transform: 'translateX(0px)' },
          '100%': { transform: 'translateX(-40px)' },
        },
      },
      animation: {
        glow: 'glow 2s ease-in-out infinite',
        ripple: 'ripple 2s cubic-bezier(0.4,0,0.2,1) infinite',
        dotwave: 'dotwave 2s ease-in-out infinite',
        rippleOnce: 'rippleOnce 2s cubic-bezier(0.4,0,0.2,1) 1',
        'rotate-toggle': 'rotate-toggle 0.5s cubic-bezier(0.4,0,0.2,1)',
        'move-right': 'move-right 0.3s cubic-bezier(0.4,0,0.2,1)',
        'move-left': 'move-left 0.3s cubic-bezier(0.4,0,0.2,1)',
      },
    }
  }
}

