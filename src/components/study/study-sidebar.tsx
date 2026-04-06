'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  RotateCcw,
  Layers,
  ClipboardCheck,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Profile } from '@/types/study'

const navItems = [
  { href: '/study', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/practice', label: 'Practice', icon: BookOpen },
  { href: '/review', label: 'Review', icon: RotateCcw },
  { href: '/domains', label: 'Domains', icon: Layers },
  { href: '/mock-exam', label: 'Mock Exam', icon: ClipboardCheck },
  { href: '/tutor', label: 'AI Tutor', icon: MessageSquare },
  { href: '/progress', label: 'Progress', icon: BarChart3 },
]

const bottomItems = [
  { href: '/settings', label: 'Settings', icon: Settings },
]

interface StudySidebarProps {
  user: Profile
}

export function StudySidebar({ user }: StudySidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const initials = user.full_name
    ? user.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email[0].toUpperCase()

  return (
    <aside className="flex w-60 flex-col border-r border-border bg-card">
      {/* Logo */}
      <Link href="/study" className="flex h-14 items-center gap-2 border-b border-border px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary shadow-sm shadow-primary/40">
          <span className="text-xs font-bold text-primary-foreground">CF</span>
        </div>
        <span className="font-semibold text-foreground">CertForge</span>
      </Link>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 p-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-accent text-accent-foreground font-medium'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-border p-3 space-y-0.5">
        {bottomItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-accent text-accent-foreground font-medium'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          )
        })}
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>

        {/* User */}
        <div className="flex items-center gap-3 px-3 py-2 mt-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-medium">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user.full_name || 'Student'}</p>
            <p className="truncate text-xs text-muted-foreground capitalize">{user.plan} plan</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
