import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
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
  title: 'CertForge | AI-Powered AWS Certification Prep',
  description:
    'Pass the AWS Solutions Architect Associate exam with adaptive AI tutoring, spaced repetition, and exam-accurate practice questions.',
  openGraph: {
    title: 'CertForge | AI-Powered AWS Certification Prep',
    description:
      'Adaptive practice questions, spaced repetition, and AI tutoring for the AWS SAA-C03 exam.',
    siteName: 'CertForge',
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
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Toaster theme="dark" position="bottom-right" richColors closeButton />
      </body>
    </html>
  )
}
