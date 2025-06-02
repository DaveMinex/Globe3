module.exports = 
   {
      // Note: config only includes the used styles & variables of your selection
      content: ["./src/**/*.{html,vue,svelte,js,ts,jsx,tsx}"],
      theme: {
        extend: {
          fontFamily: {
            
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
          },
          animation: {
            glow: 'glow 2s ease-in-out infinite',
            ripple: 'ripple 2s cubic-bezier(0.4,0,0.2,1) infinite',
            dotwave: 'dotwave 2s ease-in-out infinite',
            rippleOnce: 'rippleOnce 2s cubic-bezier(0.4,0,0.2,1) 1',
          },
        }
      }
    }

            