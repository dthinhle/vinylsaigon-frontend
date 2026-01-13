import { Manrope, Montserrat } from 'next/font/google'

const montserrat = Montserrat({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
  variable: '--font-montserrat',
})

const base = Manrope({
  weight: ['500', '600', '700'],
  subsets: ['vietnamese'],
  display: 'swap',
  variable: '--font-base',
})

export { base, montserrat }
