import './globals.css'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'Manimator',
  description: 'Pipeline tool',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="h-screen">{children}</body>
    </html>
  )
}
