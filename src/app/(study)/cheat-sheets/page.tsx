import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Search } from 'lucide-react'
import { CHEAT_SHEETS } from '@/lib/study/cheat-sheet-data'
import type { CheatSheet } from '@/lib/study/cheat-sheet-data'

export const metadata = { title: 'Cheat Sheets | CertForge' }

function CheatSheetCard({ sheet }: { sheet: CheatSheet }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">{sheet.title}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">{sheet.description}</p>
          </div>
          <div className="flex gap-1 flex-wrap justify-end">
            {sheet.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px]">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/50 border-y">
                <th className="text-left px-4 py-2 font-medium text-muted-foreground w-[140px]">Feature</th>
                {sheet.services.map((svc) => (
                  <th key={svc} className="text-left px-4 py-2 font-semibold">
                    {svc}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sheet.rows.map((row, i) => (
                <tr key={row.feature} className={i % 2 === 0 ? '' : 'bg-muted/30'}>
                  <td className="px-4 py-2 font-medium text-muted-foreground whitespace-nowrap">
                    {row.feature}
                  </td>
                  {row.values.map((val, j) => (
                    <td key={j} className="px-4 py-2 leading-relaxed">
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

export default function CheatSheetsPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          <h1 className="text-2xl font-bold">AWS Cheat Sheets</h1>
        </div>
        <p className="text-muted-foreground text-sm mt-1">
          Quick reference comparison tables for key AWS services tested on the SAA-C03 exam.
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
        <Search className="h-4 w-4 shrink-0" />
        <span>
          {CHEAT_SHEETS.length} comparison sheets covering {CHEAT_SHEETS.reduce((acc, s) => acc + s.services.length, 0)} AWS services.
          Bookmark this page for quick reference during study sessions.
        </span>
      </div>

      <div className="space-y-6">
        {CHEAT_SHEETS.map((sheet) => (
          <CheatSheetCard key={sheet.id} sheet={sheet} />
        ))}
      </div>
    </div>
  )
}
