'use client'

import { useEffect, useState } from 'react'
import { HOMEPAGE_CAMERA_MOVES } from './cameraMoves/cameraMoveData'

const MOVE_COMPONENTS = Object.fromEntries(HOMEPAGE_CAMERA_MOVES.map((move) => [move.name, move.MoveComponent]))

export default function HomeCameraMovesPreview({ title }) {
  const [isPlaying, setIsPlaying] = useState(true)
  const Component = MOVE_COMPONENTS[title]

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setIsPlaying(false)
      window.setTimeout(() => setIsPlaying(true), 120)
    }, 5200)

    return () => window.clearInterval(intervalId)
  }, [])

  if (!Component) {
    return <div className="move-home-thumb" />
  }

  return (
    <div className="move-home-thumb animated-move-home-thumb">
      <div className="move-home-chip">Preview</div>
      <Component key={isPlaying ? 'playing' : 'idle'} isHovered={isPlaying} />
    </div>
  )
}
