import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { StudySidebar } from '@/components/study/study-sidebar'
import { MobileHeader } from '@/components/study/mobile-header'
import { QueryProvider } from '@/components/providers/query-provider'
import { StudyTimerProvider } from '@/components/providers/study-timer-provider'
import type { Profile } from '@/types/study'

export default async function StudyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')

  // Ensure study profile exists
  await supabase
    .from('user_study_profiles')
    .upsert({ user_id: user.id }, { onConflict: 'user_id' })

  const sidebarUser: Profile = {
    id: profile.id,
    email: profile.email,
    full_name: profile.full_name,
    plan: profile.plan,
    stripe_customer_id: profile.stripe_customer_id,
    created_at: profile.created_at,
  }

  return (
    <QueryProvider>
      <StudyTimerProvider>
        <div className="flex h-screen overflow-hidden">
          <div className="hidden md:flex">
            <StudySidebar user={sidebarUser} />
          </div>
          <div className="flex flex-1 flex-col overflow-hidden">
            <MobileHeader user={sidebarUser} />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>
      </StudyTimerProvider>
    </QueryProvider>
  )
}
