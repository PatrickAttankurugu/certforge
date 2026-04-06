'use client'

import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

interface LottieAnimationProps {
  url: string
  className?: string
  loop?: boolean
  autoplay?: boolean
  style?: React.CSSProperties
}

export function LottieAnimation({
  url,
  className,
  loop = true,
  autoplay = true,
  style,
}: LottieAnimationProps) {
  const [animationData, setAnimationData] = useState<object | null>(null)
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true

    fetch(url)
      .then((res) => res.json())
      .then(setAnimationData)
      .catch(() => {})
  }, [url])

  if (!animationData) {
    return <div className={className} style={style} />
  }

  return (
    <Lottie
      animationData={animationData}
      loop={loop}
      autoPlay={autoplay}
      className={className}
      style={style}
    />
  )
}
