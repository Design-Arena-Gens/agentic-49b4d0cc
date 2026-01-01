import { NextRequest, NextResponse } from 'next/server'

const MOCK_MODE = true // Set to false when you have API keys

export async function POST(request: NextRequest) {
  try {
    const { topic, style } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    // In mock mode, return simulated data
    if (MOCK_MODE) {
      const mockScript = generateMockScript(topic, style)
      const mockAudioUrl = generateMockAudio()

      return NextResponse.json({
        script: mockScript,
        audioUrl: mockAudioUrl,
      })
    }

    // Real implementation with Claude and ElevenLabs
    const script = await generateScriptWithClaude(topic, style)
    const audioUrl = await generateAudioWithElevenLabs(script)

    return NextResponse.json({
      script,
      audioUrl,
    })
  } catch (error) {
    console.error('Error in generate API:', error)
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    )
  }
}

function generateMockScript(topic: string, style: string): string {
  const scripts: Record<string, string> = {
    professional: `Hey there! Let me share something important with you today.

${topic}

This is a game-changer in our industry. Here's what you need to know:

First, understand the fundamentals. Second, apply them consistently. Third, measure your results.

Remember: Success comes from taking action. Start implementing these strategies today and watch your results transform.

Follow for more insights!`,
    casual: `Yo! What's up everyone!

${topic}

Listen, this is gonna blow your mind! 🤯

Here's the deal - it's actually super simple once you get it. Just follow these steps and you'll be golden.

Trust me, I've been there. And now I'm sharing this with YOU!

Smash that follow button for more content like this!`,
    educational: `Welcome to today's lesson!

Today we're exploring: ${topic}

Let me break this down into simple steps:

Step 1: Understanding the core concept
Step 2: Real-world applications
Step 3: Common mistakes to avoid

By applying this knowledge, you'll gain a deeper understanding and practical skills you can use immediately.

Subscribe for more educational content!`,
    motivational: `You know what? Today is YOUR day!

${topic}

Let me tell you something - you have unlimited potential inside you!

Every champion was once a beginner. Every expert was once a student. The only difference? They took action!

So here's my challenge to you: Start NOW. Not tomorrow. Not next week. NOW!

Your future self will thank you. Let's go!`,
    storytelling: `Let me tell you a story...

${topic}

It all started when I realized something profound. And it changed everything.

You see, the journey taught me that it's not about being perfect. It's about being persistent.

And that's exactly what happened next - transformation through dedication.

The moral of the story? Your story is still being written. Make it count.`,
  }

  return scripts[style] || scripts.professional
}

function generateMockAudio(): string {
  // Return a data URL for a silent audio file
  // In production, this would be replaced with actual audio from ElevenLabs
  const silentAudio = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADhAC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAA4T0mHXsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADhAC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAA'

  return silentAudio
}

async function generateScriptWithClaude(topic: string, style: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not configured')
  }

  const stylePrompts: Record<string, string> = {
    professional: 'Write in a professional, authoritative tone suitable for business audiences.',
    casual: 'Write in a casual, fun, and relatable tone with personality and energy.',
    educational: 'Write in a clear, educational tone that teaches and explains concepts.',
    motivational: 'Write in an inspiring, motivational tone that energizes and empowers.',
    storytelling: 'Write in a narrative, storytelling tone that engages through story.',
  }

  const prompt = `Create a 30-second script for an Instagram Reel about: ${topic}

Style: ${stylePrompts[style] || stylePrompts.professional}

Requirements:
- Must be exactly 30 seconds when spoken (approximately 75-80 words)
- Hook viewers in the first 2 seconds
- Include a clear message or value
- End with a call-to-action
- Format for easy reading
- No hashtags or emojis in the script itself

Write only the script, nothing else.`

  try {
    const Anthropic = require('@anthropic-ai/sdk')
    const client = new Anthropic({ apiKey })

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    return response.content[0].text
  } catch (error) {
    console.error('Claude API error:', error)
    throw error
  }
}

async function generateAudioWithElevenLabs(script: string): Promise<string> {
  const apiKey = process.env.ELEVENLABS_API_KEY

  if (!apiKey) {
    throw new Error('ELEVENLABS_API_KEY not configured')
  }

  try {
    const response = await fetch(
      'https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM',
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text: script,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      }
    )

    if (!response.ok) {
      throw new Error('ElevenLabs API error')
    }

    const audioBuffer = await response.arrayBuffer()
    const base64Audio = Buffer.from(audioBuffer).toString('base64')
    return `data:audio/mpeg;base64,${base64Audio}`
  } catch (error) {
    console.error('ElevenLabs API error:', error)
    throw error
  }
}
