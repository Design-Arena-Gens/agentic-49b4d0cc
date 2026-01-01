'use client'

import { useEffect, useRef, useState } from 'react'

interface AvatarCanvasProps {
  script: string
  audioUrl: string
  isGenerating: boolean
}

export default function AvatarCanvas({ script, audioUrl, isGenerating }: AvatarCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size to Instagram Reel dimensions
    canvas.width = 1080
    canvas.height = 1920

    drawAvatar(ctx, isSpeaking)
  }, [isSpeaking])

  const drawAvatar = (ctx: CanvasRenderingContext2D, speaking: boolean) => {
    const width = ctx.canvas.width
    const height = ctx.canvas.height

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, '#667eea')
    gradient.addColorStop(0.5, '#764ba2')
    gradient.addColorStop(1, '#f093fb')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Draw avatar
    const centerX = width / 2
    const centerY = height / 2.5

    // Head
    const headRadius = speaking ? 220 : 200
    ctx.beginPath()
    ctx.arc(centerX, centerY, headRadius, 0, Math.PI * 2)
    ctx.fillStyle = '#ffd6a5'
    ctx.fill()
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 8
    ctx.stroke()

    // Eyes
    const eyeY = centerY - 40
    const eyeSpacing = 70

    // Left eye
    ctx.beginPath()
    ctx.arc(centerX - eyeSpacing, eyeY, 20, 0, Math.PI * 2)
    ctx.fillStyle = '#333'
    ctx.fill()

    // Right eye
    ctx.beginPath()
    ctx.arc(centerX + eyeSpacing, eyeY, 20, 0, Math.PI * 2)
    ctx.fillStyle = '#333'
    ctx.fill()

    // Mouth
    ctx.beginPath()
    if (speaking) {
      // Open mouth (circle)
      ctx.arc(centerX, centerY + 50, 30, 0, Math.PI * 2)
      ctx.fillStyle = '#333'
      ctx.fill()
    } else {
      // Closed mouth (smile)
      ctx.arc(centerX, centerY + 30, 60, 0.2 * Math.PI, 0.8 * Math.PI)
      ctx.strokeStyle = '#333'
      ctx.lineWidth = 8
      ctx.stroke()
    }

    // Body (simplified)
    ctx.beginPath()
    ctx.moveTo(centerX - 150, centerY + 200)
    ctx.lineTo(centerX + 150, centerY + 200)
    ctx.lineTo(centerX + 100, centerY + 500)
    ctx.lineTo(centerX - 100, centerY + 500)
    ctx.closePath()
    ctx.fillStyle = '#4299e1'
    ctx.fill()
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 8
    ctx.stroke()

    // Add text if script exists
    if (script) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(40, height - 400, width - 80, 350)

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 40px Arial'
      ctx.textAlign = 'center'

      const words = script.split(' ')
      let line = ''
      let y = height - 340
      const maxWidth = width - 120
      const lineHeight = 50

      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' '
        const metrics = ctx.measureText(testLine)
        if (metrics.width > maxWidth && i > 0) {
          ctx.fillText(line, centerX, y)
          line = words[i] + ' '
          y += lineHeight
          if (y > height - 100) break
        } else {
          line = testLine
        }
      }
      ctx.fillText(line, centerX, y)
    }

    // Status indicator
    if (isPlaying) {
      ctx.fillStyle = '#48bb78'
      ctx.beginPath()
      ctx.arc(width - 100, 100, 30, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 24px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('LIVE', width - 100, 110)
    }
  }

  const handlePlay = () => {
    if (audioRef.current && audioUrl) {
      audioRef.current.play()
      setIsPlaying(true)
      animateSpeaking()
    }
  }

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
      setIsSpeaking(false)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }

  const animateSpeaking = () => {
    setIsSpeaking(prev => !prev)
    animationRef.current = requestAnimationFrame(() => {
      setTimeout(() => {
        if (audioRef.current && !audioRef.current.paused) {
          animateSpeaking()
        }
      }, 200)
    })
  }

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement('a')
      link.download = 'ai-avatar-reel.png'
      link.href = canvasRef.current.toDataURL()
      link.click()
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
      <h3 className="text-xl font-semibold text-white mb-4">Preview</h3>

      <div className="reel-container bg-black rounded-lg overflow-hidden shadow-2xl">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ display: 'block' }}
        />
      </div>

      {audioUrl && (
        <>
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => {
              setIsPlaying(false)
              setIsSpeaking(false)
            }}
          />

          <div className="mt-4 flex gap-2">
            {!isPlaying ? (
              <button
                onClick={handlePlay}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                Play
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.5 3.5A1.5 1.5 0 017 5v10a1.5 1.5 0 01-3 0V5a1.5 1.5 0 011.5-1.5zM13 3.5A1.5 1.5 0 0114.5 5v10a1.5 1.5 0 01-3 0V5a1.5 1.5 0 011.5-1.5z" />
                </svg>
                Pause
              </button>
            )}

            <button
              onClick={handleDownload}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all"
              title="Download Frame"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </>
      )}

      {isGenerating && (
        <div className="mt-4 text-center">
          <div className="inline-block animate-pulse-slow">
            <div className="text-purple-400 font-semibold">Generating your reel...</div>
          </div>
        </div>
      )}

      {!script && !isGenerating && (
        <div className="mt-4 text-center text-gray-400">
          <p>Enter a topic to generate your AI avatar reel</p>
        </div>
      )}
    </div>
  )
}
