'use client'

import { type ReactNode } from 'react'
import Image from 'next/image'
import { type LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  image?: string
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ icon: Icon, image, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {image ? (
        <div className="relative w-48 h-48 mb-6 opacity-80">
          <Image
            src={image}
            alt=""
            fill
            className="object-contain rounded-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent rounded-2xl" />
        </div>
      ) : Icon ? (
        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
          <Icon className="h-8 w-8 text-primary/60" />
        </div>
      ) : null}
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>
      {action}
    </div>
  )
}
