// Family-safe content filter
const INAPPROPRIATE_WORDS = [
  // Explicit content
  'nude', 'naked', 'penis', 'vagina', 'boob', 'breast', 'nipple', 'sex', 'sexy', 'porn', 'xxx',
  'dick', 'cock', 'pussy', 'ass', 'butt', 'tits', 'fuck', 'shit', 'damn', 'hell',
  // Suggestive content
  'bikini', 'underwear', 'lingerie', 'topless', 'bottomless', 'revealing', 'cleavage',
  'seductive', 'erotic', 'sensual', 'provocative', 'suggestive', 'intimate',
  // Violence
  'blood', 'gore', 'violent', 'kill', 'murder', 'death', 'weapon', 'gun', 'knife', 'sword',
  'fight', 'war', 'battle', 'attack', 'destroy', 'hurt', 'pain', 'torture',
  // Inappropriate themes
  'drug', 'alcohol', 'beer', 'wine', 'drunk', 'smoking', 'cigarette', 'weed', 'marijuana'
]

const REPLACEMENT_SUGGESTIONS = {
  'nude': 'colorful character',
  'naked': 'simple character',
  'sexy': 'cool character',
  'hot': 'awesome character',
  'bikini': 'swimsuit',
  'underwear': 'clothes',
  'fight': 'play',
  'battle': 'adventure',
  'weapon': 'tool',
  'gun': 'toy',
  'blood': 'red paint',
  'kill': 'catch',
  'death': 'sleep'
}

export interface FilterResult {
  isAppropriate: boolean
  filteredText: string
  blockedWords: string[]
  suggestions: string[]
}

export function filterContent(text: string): FilterResult {
  const lowerText = text.toLowerCase()
  const words = lowerText.split(/\s+/)
  const blockedWords: string[] = []
  const suggestions: string[] = []
  
  // Check for inappropriate words
  for (const word of INAPPROPRIATE_WORDS) {
    if (lowerText.includes(word)) {
      blockedWords.push(word)
      if (REPLACEMENT_SUGGESTIONS[word]) {
        suggestions.push(`Try "${REPLACEMENT_SUGGESTIONS[word]}" instead of "${word}"`)
      }
    }
  }
  
  // Create filtered text
  let filteredText = text
  for (const word of blockedWords) {
    const replacement = REPLACEMENT_SUGGESTIONS[word] || '[FILTERED]'
    filteredText = filteredText.replace(new RegExp(word, 'gi'), replacement)
  }
  
  // Add family-friendly enhancement
  if (blockedWords.length === 0) {
    filteredText = enhanceForFamily(filteredText)
  }
  
  return {
    isAppropriate: blockedWords.length === 0,
    filteredText,
    blockedWords,
    suggestions
  }
}

function enhanceForFamily(text: string): string {
  // Add family-friendly descriptors
  const familyEnhancers = [
    'cute', 'friendly', 'colorful', 'happy', 'smiling', 'cheerful', 
    'cartoon style', 'kid-friendly', 'wholesome', 'innocent'
  ]
  
  // Don't over-enhance if already family-friendly words present
  const hasFamily = familyEnhancers.some(word => text.toLowerCase().includes(word))
  if (!hasFamily && text.length > 5) {
    return `cute ${text}, cartoon style, kid-friendly`
  }
  
  return text
}

export const FAMILY_PROMPTS = [
  "cute cartoon cat playing",
  "friendly dragon with rainbow wings",
  "happy robot helper",
  "magical fairy with sparkles",
  "smiling sun character",
  "colorful butterfly dancing",
  "brave knight with shield",
  "wise owl reading a book",
  "playful puppy with ball",
  "gentle unicorn in meadow"
]