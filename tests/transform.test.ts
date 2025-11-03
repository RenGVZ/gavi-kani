import { describe, it, expect } from "vitest"
import { transformSubjectsToCards } from "@/lib/wanikaniClient"
import { Subject } from "@/lib/wanikaniTypes"

describe("transformSubjectsToCards", () => {
  it("transforms kanji subjects correctly", () => {
    const kanjiSubject: Subject = {
      id: 1,
      object: "kanji",
      url: "https://api.wanikani.com/v2/subjects/1",
      data_updated_at: "2023-01-01T00:00:00.000000Z",
      data: {
        created_at: "2023-01-01T00:00:00.000000Z",
        level: 1,
        slug: "一",
        hidden_at: null,
        document_url: "https://www.wanikani.com/kanji/一",
        characters: "一",
        meanings: [
          { meaning: "one", primary: true, accepted_answer: true },
          { meaning: "1", primary: false, accepted_answer: true },
        ],
        auxiliary_meanings: [],
        readings: [
          {
            reading: "いち",
            primary: true,
            accepted_answer: true,
            type: "onyomi",
          },
          {
            reading: "ひと",
            primary: false,
            accepted_answer: false,
            type: "kunyomi",
          },
        ],
        component_subject_ids: [],
        amalgamation_subject_ids: [],
        visually_similar_subject_ids: [],
      },
    }

    const result = transformSubjectsToCards([kanjiSubject])

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      id: "1",
      character: "一",
      type: "kanji",
      meanings: ["one", "1"],
      readings: ["いち", "ひと"],
      examples: [],
      level: 1,
    })
  })

  it("transforms vocabulary subjects correctly", () => {
    const vocabSubject: Subject = {
      id: 2,
      object: "vocabulary",
      url: "https://api.wanikani.com/v2/subjects/2",
      data_updated_at: "2023-01-01T00:00:00.000000Z",
      data: {
        created_at: "2023-01-01T00:00:00.000000Z",
        level: 1,
        slug: "一人",
        hidden_at: null,
        document_url: "https://www.wanikani.com/vocabulary/一人",
        characters: "一人",
        meanings: [
          { meaning: "one person", primary: true, accepted_answer: true },
        ],
        auxiliary_meanings: [],
        readings: [
          {
            reading: "ひとり",
            primary: true,
            accepted_answer: true,
            type: "kunyomi",
          },
        ],
        component_subject_ids: [1],
        amalgamation_subject_ids: [],
        visually_similar_subject_ids: [],
        context_sentences: [{ en: "I am alone.", ja: "私は一人です。" }],
        parts_of_speech: ["noun"],
      },
    }

    const result = transformSubjectsToCards([vocabSubject])

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      id: "2",
      character: "一人",
      type: "vocabulary",
      meanings: ["one person"],
      readings: ["ひとり"],
      examples: [{ word: "私は一人です。", meaning: "I am alone." }],
      level: 1,
    })
  })

  it("transforms radical subjects correctly", () => {
    const radicalSubject: Subject = {
      id: 3,
      object: "radical",
      url: "https://api.wanikani.com/v2/subjects/3",
      data_updated_at: "2023-01-01T00:00:00.000000Z",
      data: {
        created_at: "2023-01-01T00:00:00.000000Z",
        level: 1,
        slug: "ground",
        hidden_at: null,
        document_url: "https://www.wanikani.com/radicals/ground",
        characters: "一",
        meanings: [{ meaning: "ground", primary: true, accepted_answer: true }],
        auxiliary_meanings: [],
        component_subject_ids: [],
        amalgamation_subject_ids: [],
        visually_similar_subject_ids: [],
      },
    }

    const result = transformSubjectsToCards([radicalSubject])

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      id: "3",
      character: "一",
      type: "radical",
      meanings: ["ground"],
      readings: [],
      examples: [],
      level: 1,
    })
  })

  it("handles image-based radicals", () => {
    const imageRadicalSubject: Subject = {
      id: 4,
      object: "radical",
      url: "https://api.wanikani.com/v2/subjects/4",
      data_updated_at: "2023-01-01T00:00:00.000000Z",
      data: {
        created_at: "2023-01-01T00:00:00.000000Z",
        level: 1,
        slug: "ground",
        hidden_at: null,
        document_url: "https://www.wanikani.com/radicals/ground",
        character_images: [
          {
            url: "https://example.com/image.png",
            metadata: {
              inline_styles: false,
              color_inversion: false,
              dimensions: "512x512",
              style_name: "original",
            },
            content_type: "image/png",
          },
        ],
        meanings: [{ meaning: "ground", primary: true, accepted_answer: true }],
        auxiliary_meanings: [],
        component_subject_ids: [],
        amalgamation_subject_ids: [],
        visually_similar_subject_ids: [],
      },
    }

    const result = transformSubjectsToCards([imageRadicalSubject])

    expect(result).toHaveLength(1)
    expect(result[0].character).toBe("[Image]")
    expect(result[0].characterImages).toBeDefined()
  })
})
