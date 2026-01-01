'use client'

import { useState } from 'react'
import AvatarCanvas from '@/components/AvatarCanvas'
import ScriptGenerator from '@/components/ScriptGenerator'

export default function Home() {
  const [script, setScript] = useState('')
  const [audioUrl, setAudioUrl] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async (topic: string, style: string) => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, style }),
      })

      const data = await response.json()

      if (data.error) {
        alert(data.error)
        return
      }

      setScript(data.script)
      setAudioUrl(data.audioUrl)
    } catch (error) {
      console.error('Error generating reel:', error)
      alert('Failed to generate reel. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleReset = () => {
    setScript('')
    setAudioUrl('')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-2">
          AI Avatar Reels Generator
        </h1>
        <p className="text-gray-300 text-center mb-8">
          Create engaging 30-second Instagram Reels with AI avatars
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Panel - Generator */}
          <div className="space-y-6">
            <ScriptGenerator
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              onReset={handleReset}
            />

            {script && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-3">Generated Script</h3>
                <div className="bg-black/30 rounded-lg p-4 max-h-60 overflow-y-auto">
                  <p className="text-gray-200 whitespace-pre-wrap">{script}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Avatar Preview */}
          <div className="flex justify-center items-start">
            <AvatarCanvas
              script={script}
              audioUrl={audioUrl}
              isGenerating={isGenerating}
            />
          </div>
        </div>

        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>Perfect for Instagram Reels • 9:16 Aspect Ratio • 30 Second Duration</p>
        </div>
      </div>
    </main>
  )
}
