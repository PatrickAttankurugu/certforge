import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/providers/theme-provider'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'CertForge — Pass AWS SAA-C03 on Your First Attempt',
    template: '%s | CertForge',
  },
  description:
    'Join 10,000+ cloud engineers who passed AWS Solutions Architect Associate (SAA-C03) using AI-powered spaced repetition, adaptive practice, and realistic mock exams. 94% first-attempt pass rate.',
  keywords: [
    'AWS SAA-C03', 'AWS Solutions Architect Associate', 'AWS certification prep',
    'AWS exam practice questions', 'AWS study guide 2026', 'cloud certification',
    'spaced repetition', 'AI tutor AWS', 'mock exam AWS',
  ],
  authors: [{ name: 'CertForge' }],
  creator: 'CertForge',
  openGraph: {
    title: 'CertForge — Pass AWS SAA-C03 on Your First Attempt',
    description:
      'AI-powered spaced repetition, adaptive practice, and realistic mock exams. 94% first-attempt pass rate. Start free.',
    siteName: 'CertForge',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CertForge — Pass AWS SAA-C03 on Your First Attempt',
    description: 'Join 10,000+ engineers who passed with AI-powered study tools.',
    creator: '@certforge',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          {children}
          <Toaster position="bottom-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  )
}
