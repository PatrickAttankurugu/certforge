export type Locale = 'en' | 'es' | 'pt' | 'ja'

export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  es: 'Espanol',
  pt: 'Portugues',
  ja: 'Japanese',
}

// All translations fall back to English for non-en locales for now.
// As translations are added, replace the English strings in each locale object.
const translations = {
  en: {
    // Nav & Layout
    'nav.dashboard': 'Dashboard',
    'nav.practice': 'Practice',
    'nav.review': 'Review',
    'nav.domains': 'Domains',
    'nav.mockExam': 'Mock Exam',
    'nav.aiTutor': 'AI Tutor',
    'nav.progress': 'Progress',
    'nav.bookmarks': 'Bookmarks',
    'nav.settings': 'Settings',
    'nav.labs': 'Hands-on Labs',
    'nav.signOut': 'Sign out',

    // Common actions
    'action.startFree': 'Start Studying Free',
    'action.signIn': 'Sign in',
    'action.signUp': 'Sign up',
    'action.save': 'Save Settings',
    'action.cancel': 'Cancel',
    'action.next': 'Next',
    'action.previous': 'Previous',
    'action.submit': 'Submit',
    'action.tryAgain': 'Try Again',

    // Study
    'study.questionsToday': 'Questions Today',
    'study.streak': 'Day Streak',
    'study.accuracy': 'Accuracy',
    'study.dueCards': 'Cards Due',
    'study.predictedScore': 'Predicted Score',
    'study.studyTime': 'Study Time',
    'study.correct': 'Correct',
    'study.incorrect': 'Incorrect',

    // Settings
    'settings.title': 'Settings',
    'settings.profile': 'Profile',
    'settings.appearance': 'Appearance',
    'settings.studySettings': 'Study Settings',
    'settings.language': 'Language',
    'settings.examDate': 'Target Exam Date',
    'settings.dailyGoal': 'Daily Question Goal',

    // Plans
    'plan.free': 'Free',
    'plan.standard': 'Standard',
    'plan.premium': 'Premium',

    // Domains
    'domain.secure': 'Design Secure Architectures',
    'domain.resilient': 'Design Resilient Architectures',
    'domain.performant': 'Design High-Performing Architectures',
    'domain.cost': 'Design Cost-Optimized Architectures',

    // Landing
    'landing.hero.title': 'Pass the AWS Solutions Architect exam on your first attempt',
    'landing.hero.subtitle': 'AI-powered spaced repetition that gets you exam-ready in half the time.',
    'landing.pricing.title': 'Invest in your career. Not another exam retake.',
    'landing.cta': 'Start Studying Free',
  },
} as const

export type TranslationKey = keyof (typeof translations)['en']

// For now all locales return English. Replace with actual translations as they become available.
export function getTranslations(locale: Locale): Record<TranslationKey, string> {
  return translations.en
}
