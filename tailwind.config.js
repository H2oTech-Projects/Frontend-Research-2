/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  darkMode: ["class"],
  theme: {
  	extend: {
  		animation: {
  			fadeIn: 'fadeIn 0.3s ease-in-out',
  			slideIn: 'slideIn 0.3s ease-in-out'
  		},
  		keyframes: {
  			fadeIn: {
  				'0%': {
  					opacity: 0,
  					transform: 'translateY(-10px)'
  				},
  				'100%': {
  					opacity: 1,
  					transform: 'translateY(0)'
  				}
  			},
  			slideIn: {
  				'0%': {
  					opacity: 0,
  					transform: 'translateX(-100%)'
  				},
  				'100%': {
  					opacity: 1,
  					transform: 'translateX(0)'
  				}
  			}
  		},
  		colors: {
  			slateLight: {
  				'50': '#f8fafc',
  				'100': '#f1f5f9',
  				'200': '#e2e8f0',
  				'300': '#cbd5e1',
  				'400': '#94a3b8',
  				'500': '#64748b',
  				'600': '#475569',
  				'700': '#334155',
  				'800': '#1e293b',
  				'900': '#0f172a',
  				'950': '#020617'
  			},
  			slateDark: {
  				'50': '#0f172a',
  				'100': '#1e293b',
  				'200': '#334155',
  				'300': '#475569',
  				'400': '#64748b',
  				'500': '#94a3b8',
  				'600': '#cbd5e1',
  				'700': '#e2e8f0',
  				'800': '#f1f5f9',
  				'900': '#f8fafc'
  			},
  			blue: {
  				'50': '#eff6ff',
  				'100': '#dbeafe',
  				'200': '#bfdbfe',
  				'300': '#93c5fd',
  				'400': '#60a5fa',
  				'500': '#3b82f6',
  				'600': '#2563eb',
  				'700': '#1e40af',
  				'800': '#1e3a8a',
  				'950': '#172554'
  			},
  			royalBlue: {
  				DEFAULT: '#16599A'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};

