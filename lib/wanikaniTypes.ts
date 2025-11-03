// WaniKani API Response Types
export interface PaginatedResponse<T> {
  object: "collection"
  url: string
  pages: {
    per_page: number
    next_url: string | null
    previous_url: string | null
  }
  total_count: number
  data_updated_at: string | null
  data: T[]
}

export interface Subject {
  id: number
  object: "radical" | "kanji" | "vocabulary" | "kana_vocabulary"
  url: string
  data_updated_at: string
  data: SubjectData
}

export interface SubjectData {
  created_at: string
  level: number
  slug: string
  hidden_at: string | null
  document_url: string
  characters?: string
  character_images?: CharacterImage[]
  meanings: Meaning[]
  auxiliary_meanings: AuxiliaryMeaning[]
  readings?: Reading[]
  component_subject_ids?: number[]
  amalgamation_subject_ids?: number[]
  visually_similar_subject_ids?: number[]
  context_sentences?: ContextSentence[]
  parts_of_speech?: string[]
  pronunciation_audios?: PronunciationAudio[]
}

export interface CharacterImage {
  url: string
  metadata: {
    inline_styles: boolean
    color_inversion: boolean
    dimensions: string
    style_name: string
  }
  content_type: string
}

export interface Meaning {
  meaning: string
  primary: boolean
  accepted_answer: boolean
}

export interface AuxiliaryMeaning {
  type: "whitelist" | "blacklist"
  meaning: string
}

export interface Reading {
  reading: string
  primary: boolean
  accepted_answer: boolean
  type: "kunyomi" | "onyomi" | "nanori"
}

export interface ContextSentence {
  en: string
  ja: string
}

export interface PronunciationAudio {
  url: string
  metadata: {
    gender: string
    source_id: number
    pronunciation: string
    voice_actor_id: number
    voice_actor_name: string
    voice_description: string
  }
  content_type: string
}

// Internal Card Type for the App
export interface Card {
  id: string
  character: string
  type: "radical" | "kanji" | "vocabulary" | "kana_vocabulary"
  meanings: string[]
  readings: string[]
  examples: {
    word: string
    meaning: string
  }[]
  characterImages?: CharacterImage[]
  level: number
}

// Subject Type Enum
export type SubjectType = "radical" | "kanji" | "vocabulary" | "kana_vocabulary"
