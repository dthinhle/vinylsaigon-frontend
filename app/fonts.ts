import { Barlow, Judson } from 'next/font/google'

const stylized = Judson({
  weight: ['400', '700'],
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
