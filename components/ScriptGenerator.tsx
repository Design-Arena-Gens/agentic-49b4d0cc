'use client'

import { useState } from 'react'

interface ScriptGeneratorProps {
  onGenerate: (topic: string, style: string) => void
  isGenerating: boolean
  onReset: () => void
}

export default function ScriptGenerator({ onGenerate, isGenerating, onReset }: ScriptGeneratorProps) {
  const [topic, setTopic] = useState('')
  const [style, setStyle] = useState('professional')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (topic.trim()) {
      onGenerate(topic, style)
    }
  }

  const styles = [
    { value: 'professional', label: 'Professional', emoji: '💼' },
    { value: 'casual', label: 'Casual & Fun', emoji: '😎' },
    { value: 'educational', label: 'Educational', emoji: '🎓' },
    { value: 'motivational', label: 'Motivational', emoji: '🚀' },
    { value: 'storytelling', label: 'Storytelling', emoji: '📖' },
  ]

  const exampleTopics = [
    '5 productivity tips for entrepreneurs',
    'Why morning routines matter',
    'The future of AI technology',
    'How to stay motivated',
    'Secret to successful habits',
  ]

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
      <h2 className="text-2xl font-semibold text-white mb-4">Create Your Reel</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Topic or Script
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter your topic or full script (e.g., '5 productivity tips for entrepreneurs')"
            className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            rows={4}
            disabled={isGenerating}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Style
          </label>
          <div className="grid grid-cols-2 gap-2">
            {styles.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setStyle(s.value)}
                className={`px-4 py-3 rounded-lg border-2 transition-all ${
                  style === s.value
                    ? 'bg-purple-600 border-purple-400 text-white'
                    : 'bg-black/30 border-white/20 text-gray-300 hover:border-white/40'
                }`}
                disabled={isGenerating}
              >
                <span className="mr-2">{s.emoji}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isGenerating || !topic.trim()}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              'Generate Reel'
            )}
          </button>
          {topic && (
            <button
              type="button"
              onClick={onReset}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all"
              disabled={isGenerating}
            >
              Reset
            </button>
          )}
        </div>
      </form>

      <div className="mt-6">
        <p className="text-sm text-gray-300 mb-2">Example topics:</p>
        <div className="flex flex-wrap gap-2">
          {exampleTopics.map((example, i) => (
            <button
              key={i}
              onClick={() => setTopic(example)}
              className="text-xs bg-black/30 hover:bg-black/50 text-gray-300 px-3 py-1 rounded-full border border-white/10 transition-all"
              disabled={isGenerating}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
