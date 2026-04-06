import { nanoid } from 'nanoid'

/**
 * Generate a unique referral code.
 * Format: CF-XXXXXX (6 char alphanumeric)
 */
export function generateReferralCode(): string {
  return `CF-${nanoid(6).toUpperCase()}`
}

export function getReferralLink(code: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://certforge.dev'
  return `${base}/auth/signup?ref=${code}`
}

export function getShareText(code: string): string {
  const link = getReferralLink(code)
  return `I'm prepping for AWS SAA-C03 with CertForge - AI-powered study tools that actually work. Join me and get bonus XP!\n\n${link}`
}
