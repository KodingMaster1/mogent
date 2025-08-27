import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navigation from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MOGENT TANZANIA LIMITED - Business Management System',
  description: 'Complete business management system for MOGENT TANZANIA LIMITED',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen">
          <Navigation />
          <div className="flex-1 overflow-auto">
            <Toaster position="top-right" />
            {children}
          </div>
        </div>
      </body>
    </html>
  )
} 