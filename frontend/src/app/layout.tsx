import type { Metadata } from 'next'
import { Outfit, JetBrains_Mono } from 'next/font/google'
import { QueryProvider } from '@/providers/query-provider'
import './globals.css'

const outfit = Outfit({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'Kobe Vault',
  description: 'Gnosis Safe vault dashboard',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${outfit.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <div className="noise-overlay" />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
