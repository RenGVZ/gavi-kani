import { Card, Subject, SubjectType, CharacterImage } from "./wanikaniTypes"

// Re-export SubjectType for use in other files
export type { SubjectType }

/**
 * Fetches all subjects from WaniKani API with pagination support
 */
export async function fetchAllSubjects(
  apiKey: string,
  levels: number[],
  types: SubjectType[] = ["radical", "kanji", "vocabulary"]
): Promise<Card[]> {
  const baseUrl = "https://api.wanikani.com/v2/subjects"
  const params = new URLSearchParams({
    levels: levels.join(","),
    types: types.join(","),
  })

  let allSubjects: Subject[] = []
  let nextUrl: string | null = `${baseUrl}?${params}`

  while (nextUrl) {
    const response = await fetchWithRetry(nextUrl, apiKey)
    const data: { data: Subject[]; pages?: { next_url: string | null } } =
      await response.json()

    allSubjects = allSubjects.concat(data.data)
    nextUrl = data.pages?.next_url || null
  }

  return transformSubjectsToCards(allSubjects)
}

/**
 * Transforms WaniKani subjects into our internal Card format
 */
export function transformSubjectsToCards(subjects: Subject[]): Card[] {
  return subjects.map((subject) => {
    const { data } = subject

    // Extract meanings (prioritize primary meanings)
    const meanings = data.meanings
      .filter((m) => m.accepted_answer)
      .sort((a, b) => (b.primary ? 1 : 0) - (a.primary ? 1 : 0))
      .map((m) => m.meaning)

    // Extract readings (for kanji and vocabulary)
    const readings =
      data.readings
        ?.sort((a, b) => (b.primary ? 1 : 0) - (a.primary ? 1 : 0))
        .map((r) => r.reading) || []

    // Extract examples from context sentences (for vocabulary)
    const examples =
      data.context_sentences?.map((sentence) => ({
        word: sentence.ja,
        meaning: sentence.en,
      })) || []

    // Handle character display for different types
    let character: string
    let characterImages: CharacterImage[] | undefined

    if (subject.object === "radical") {
      if (data.characters) {
        // Text-based radical
        character = data.characters
      } else if (data.character_images && data.character_images.length > 0) {
        // Image-based radical
        character = "[Image]" // Placeholder for image-based radicals
        characterImages = data.character_images
      } else {
        character = "[Radical]" // Fallback
      }
    } else {
      // Kanji, vocabulary, kana_vocabulary
      character = data.characters || "[Character]"
    }

    return {
      id: subject.id.toString(),
      character,
      type: subject.object,
      meanings,
      readings,
      examples,
      characterImages,
      level: data.level,
      visually_similar_subject_ids: data.visually_similar_subject_ids,
    }
  })
}

/**
 * Fetches with retry logic for rate limiting
 */
async function fetchWithRetry(
  url: string,
  apiKey: string,
  maxRetries: number = 3
): Promise<Response> {
  let lastError: Error

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Wanikani-Revision": "20170710",
        },
      })

      if (response.status === 429) {
        // Rate limited - wait with exponential backoff
        const waitTime = Math.pow(2, attempt) * 1000 // 1s, 2s, 4s, 8s
        await new Promise((resolve) => setTimeout(resolve, waitTime))
        continue
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return response
    } catch (error) {
      lastError = error as Error

      if (attempt < maxRetries) {
        const waitTime = Math.pow(2, attempt) * 1000
        await new Promise((resolve) => setTimeout(resolve, waitTime))
      }
    }
  }

  throw new Error(
    `Failed after ${maxRetries + 1} attempts: ${lastError!.message}`
  )
}
