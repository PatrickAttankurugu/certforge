'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { STOCK_IMAGES } from '@/lib/animations'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.push('/study')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side - image (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src={STOCK_IMAGES.authBackground}
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-md space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-2xl">CertForge</span>
            </div>
            <h2 className="text-3xl font-bold leading-tight">
              Welcome back, future{' '}
              <span className="text-primary">AWS Architect</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Continue your journey to AWS certification. Your personalized study plan is waiting.
            </p>
            <div className="flex items-center gap-3 pt-4">
              <div className="flex -space-x-2">
                {[STOCK_IMAGES.avatar1, STOCK_IMAGES.avatar2, STOCK_IMAGES.avatar3].map((src, i) => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-background overflow-hidden">
                    <Image src={src} alt="" width={32} height={32} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">10,247</strong> engineers passed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <Card className="w-full max-w-sm border-border/50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-xl">Sign in to CertForge</CardTitle>
            <p className="text-sm text-muted-foreground">
              AWS SAA-C03 Study Assistant
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400">
                  {error}
                </div>
              )}
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block font-medium">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full h-10 shadow-lg shadow-primary/20" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm space-y-2">
              <Link href="/forgot-password" className="text-muted-foreground hover:text-foreground block transition-colors">
                Forgot password?
              </Link>
              <p className="text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="text-primary hover:underline font-medium">Sign up</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
