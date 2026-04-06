import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sparkles, ArrowRight } from 'lucide-react'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <nav className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm shadow-primary/30">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">CertForge</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/guarantee" className="hover:text-foreground transition-colors">Pass Guarantee</Link>
            <Link href="/teams" className="hover:text-foreground transition-colors">Teams</Link>
            <Link href="/certifications" className="hover:text-foreground transition-colors">Certifications</Link>
            <Link href="/lifetime" className="hover:text-foreground transition-colors">Lifetime Access</Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="gap-1 shadow-lg shadow-primary/20">
                Start Free <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div>
            <p className="font-semibold mb-3">Product</p>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/#features" className="hover:text-foreground transition-colors">Features</Link></li>
              <li><Link href="/#pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link href="/lifetime" className="hover:text-foreground transition-colors">Lifetime Access</Link></li>
              <li><Link href="/teams" className="hover:text-foreground transition-colors">Teams</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-3">Resources</p>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/practice-questions" className="hover:text-foreground transition-colors">Free Practice Questions</Link></li>
              <li><Link href="/certifications" className="hover:text-foreground transition-colors">Certifications</Link></li>
              <li><Link href="/guarantee" className="hover:text-foreground transition-colors">Pass Guarantee</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-3">Company</p>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/affiliates" className="hover:text-foreground transition-colors">Affiliates</Link></li>
              <li><Link href="/gift" className="hover:text-foreground transition-colors">Gift Cards</Link></li>
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
                <Sparkles className="h-3 w-3 text-primary-foreground" />
              </div>
              <span className="font-semibold">CertForge</span>
            </div>
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} CertForge. Not affiliated with Amazon Web Services.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
