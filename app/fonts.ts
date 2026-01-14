import { Barlow, Aleo } from 'next/font/google'

const stylized = Aleo({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
  variable: '--font-stylized',
})

const base = Barlow({
  weight: ['500', '600', '700'],
  subsets: ['vietnamese'],
  display: 'swap',
  variable: '--font-base',
})

export { base, stylized }
