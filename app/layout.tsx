import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cloud AI Art - 2D Game Sprite Generator',
  description: 'Generate beautiful 2D game sprites for kids games using AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}