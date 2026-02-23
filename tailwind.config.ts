
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'inter': ['Inter', 'sans-serif'],
				'sans': ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
				'serif': ['Playfair Display', 'Georgia', 'serif'],
				'display': ['DM Serif Display', 'Playfair Display', 'Georgia', 'serif'],
				'royal': ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
				'headline': ['Lora', 'Georgia', 'serif'],
				'marck': ['"Marck Script"', 'cursive'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#0f172a', // Deep Navy/Charcoal
					foreground: '#f8fafc',
				},
				secondary: {
					DEFAULT: '#b45309', // Gold accent
					foreground: '#ffffff'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				gold: {
					50: '#fbf8f2',
					100: '#f5efe0',
					200: '#eadbc3',
					300: '#dfc29d',
					400: '#d4a773',
					500: '#c68e4b', // Muted metallic gold
					600: '#a87339',
					700: '#8c5d2e',
					800: '#734b26',
					900: '#5e3d20',
					DEFAULT: '#D4AF37' // Standard Metallic Gold
				},
				navy: {
					50: '#f0f7ff',
					100: '#e0effe',
					200: '#bae0fd',
					300: '#7ccafd',
					400: '#36b3f9',
					500: '#0c9aeb',
					600: '#007ac9',
					700: '#0061a3', // Royal Blue
					800: '#065386',
					900: '#0a1628', // Deep Royal Background
					950: '#050a14'
				},
				royal: {
					DEFAULT: '#002366',
					light: '#1a3c8a',
					dark: '#001233'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'hero-pattern': "url('/hero-bg.jpg')", // Ensure this asset exists or execute a replacement strategy
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'fade-in-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'card-enter': {
					'0%': {
						opacity: '0',
						transform: 'translateY(24px) scale(0.98)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0) scale(1)'
					}
				},
				'card-shine': {
					'0%': { transform: 'translateX(-100%) skewX(-15deg)' },
					'100%': { transform: 'translateX(200%) skewX(-15deg)' }
				},
				'float-subtle': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-6px)' }
				},
				'gradient-shift': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.85' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'card-enter': 'card-enter 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
				'float-subtle': 'float-subtle 5s ease-in-out infinite'
			},
			boxShadow: {
				'finance': '0 4px 24px -4px rgba(10, 22, 40, 0.12), 0 2px 8px -2px rgba(10, 22, 40, 0.06)',
				'finance-lg': '0 12px 40px -8px rgba(10, 22, 40, 0.18), 0 4px 16px -4px rgba(10, 22, 40, 0.08)',
				'card-hover': '0 24px 48px -12px rgba(10, 22, 40, 0.2), 0 0 0 1px rgba(212, 175, 55, 0.08)',
				'gold-glow': '0 0 32px -4px rgba(198, 142, 75, 0.35)'
			}
		}
	},
	plugins: [import("tailwindcss-animate")],
} satisfies Config;
