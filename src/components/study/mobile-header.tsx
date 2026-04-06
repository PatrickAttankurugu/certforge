'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, BookOpen, LogOut } from 'lucide-react'
import {
  LayoutDashboard,
  RotateCcw,
  Layers,
  ClipboardCheck,
  MessageSquare,
  BarChart3,
  Bookmark,
  Settings,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import type { Profile } from '@/types/study'

const navItems = [
  { href: '/study', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/practice', label: 'Practice', icon: BookOpen },
  { href: '/review', label: 'Review', icon: RotateCcw },
  { href: '/domains', label: 'Domains', icon: Layers },
  { href: '/mock-exam', label: 'Mock Exam', icon: ClipboardCheck },
  { href: '/tutor', label: 'AI Tutor', icon: MessageSquare },
  { href: '/progress', label: 'Progress', icon: BarChart3 },
  { href: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
  { href: '/settings', label: 'Settings', icon: Settings },
]

interface MobileHeaderProps {
  user: Profile
}

export function MobileHeader({ user }: MobileHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const initials = user.full_name
    ? user.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email[0].toUpperCase()

  const currentPage = navItems.find(
    (item) => pathname === item.href || pathname.startsWith(item.href + '/')
  )

  return (
    <header className="flex md:hidden h-14 items-center justify-between border-b border-border bg-card px-4">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Open navigation menu" />}>
          <Menu className="h-5 w-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0" showCloseButton={false}>
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          {/* Logo */}
          <div className="flex h-14 items-center gap-2 border-b border-border px-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary shadow-sm shadow-primary/40">
              <span className="text-xs font-bold text-primary-foreground">CF</span>
            </div>
            <span className="font-semibold text-foreground">CertForge</span>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-0.5 p-3" aria-label="Main navigation">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || pathname.startsWith(href + '/')
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-accent text-accent-foreground font-medium'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Bottom */}
          <div className="border-t border-border p-3 space-y-0.5">
            <ConfirmDialog
              trigger={
                <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              }
              title="Sign out?"
              description="You'll need to sign in again to continue studying."
              confirmLabel="Sign Out"
              onConfirm={handleSignOut}
            />
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
        </SheetContent>
      </Sheet>

      <span className="text-sm font-semibold">{currentPage?.label ?? 'CertForge'}</span>
      <div className="w-8" /> {/* Spacer for centering */}
    </header>
  )
}
