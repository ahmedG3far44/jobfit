export const WRITING_STYLES = [
  { key: 'professional', label: 'Professional', description: 'Formal, polished business tone' },
  { key: 'confident', label: 'Confident', description: 'Strong, assertive language' },
  { key: 'enthusiastic', label: 'Enthusiastic', description: 'Energetic and excited tone' },
  { key: 'direct', label: 'Direct', description: 'Straight to the point, no fluff' },
  { key: 'storytelling', label: 'Storytelling', description: 'Narrative, career journey focused' },
  { key: 'warm', label: 'Warm', description: 'Friendly and personable' },
] as const

export type WritingStyle = (typeof WRITING_STYLES)[number]['key']
