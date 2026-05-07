"use client"

import { useState, useEffect } from "react"
import { Card as CardType } from "@/lib/wanikaniTypes"

interface CardProps {
  card: CardType
}

export default function Card({ card }: CardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [showSimilarModal, setShowSimilarModal] = useState(false)
  const [similarKanji, setSimilarKanji] = useState<CardType[]>([])
  const [loadingSimilar, setLoadingSimilar] = useState(false)

  // Reset flip state and similar kanji when card changes
  useEffect(() => {
    setIsFlipped(false)
    setShowSimilarModal(false)
    setSimilarKanji([])
  }, [card.id])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === " " && !showSimilarModal) {
        event.preventDefault()
        setIsFlipped((prev) => !prev)
      }
      if (event.key === "Escape" && showSimilarModal) {
        event.preventDefault()
        setShowSimilarModal(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showSimilarModal])

  const handleClick = () => {
    setIsFlipped((prev) => !prev)
  }

  const handleShowSimilarKanji = async () => {
    if (!card.visually_similar_subject_ids || card.visually_similar_subject_ids.length === 0) {
      return
    }

    // If we already have the data, just show the modal
    if (similarKanji.length > 0) {
      setShowSimilarModal(true)
      return
    }

    // Fetch similar kanji then show modal
    try {
      setLoadingSimilar(true)
      const response = await fetch(
        `/api/wanikani/subjects?ids=${card.visually_similar_subject_ids.join(",")}`
      )
      const data = await response.json()

      if (data.success) {
        setSimilarKanji(data.data)
        setShowSimilarModal(true)
      }
    } catch (error) {
      console.error("Failed to fetch similar kanji:", error)
    } finally {
      setLoadingSimilar(false)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "radical":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "kanji":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
      case "vocabulary":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    }
  }

  const getTypeBorderColor = (type: string) => {
    switch (type) {
      case "radical":
        return "border-t-blue-500"
      case "kanji":
        return "border-t-pink-500"
      case "vocabulary":
        return "border-t-purple-500"
      default:
        return "border-t-gray-500"
    }
  }

  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div
        className="relative w-full h-96 cursor-pointer perspective-1000"
        onClick={handleClick}
      >
        {/* Card container with flip animation */}
        <div
          className={`relative w-full h-full transform-style-preserve-3d transition-transform duration-700 ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* Front of card */}
          <div className="absolute inset-0 w-full h-full backface-hidden">
            <div
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 border-t-4 ${getTypeBorderColor(
                card.type
              )} h-full flex flex-col items-center justify-center p-8`}
            >
              {/* Type badge */}
              <div
                className={`absolute top-4 left-4 px-2 py-1 rounded text-xs font-medium ${getTypeColor(
                  card.type
                )}`}
              >
                {card.type.charAt(0).toUpperCase() + card.type.slice(1)}
              </div>

              {/* Character */}
              <div className="text-8xl font-bold text-gray-900 dark:text-white mb-4">
                {card.character}
              </div>

              {/* Level */}
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Level {card.level}
              </div>

              {/* Click to flip hint */}
              <div className="absolute bottom-4 text-sm text-gray-400 dark:text-gray-500">
                Click or press Space to flip
              </div>
            </div>
          </div>

          {/* Back of card */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
            <div
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 border-t-4 ${getTypeBorderColor(
                card.type
              )} h-full p-8 overflow-y-auto`}
            >
              {/* Type badge */}
              <div
                className={`absolute top-4 left-4 px-2 py-1 rounded text-xs font-medium ${getTypeColor(
                  card.type
                )}`}
              >
                {card.type.charAt(0).toUpperCase() + card.type.slice(1)}
              </div>

              {/* Character (smaller on back) */}
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                {card.character}
              </div>

              {/* Meanings */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Meanings
                </h3>
                <div className="flex flex-wrap gap-2">
                  {card.meanings.map((meaning, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                    >
                      {meaning}
                    </span>
                  ))}
                </div>
              </div>

              {/* Readings (for kanji and vocabulary) */}
              {card.readings.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Readings
                  </h3>

                  {/* Primary reading (onyomi) - Large and prominent */}
                  {card.readings.length > 0 && (
                    <div className="mb-3">
                      <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-1">
                        {card.readings[0]}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Primary reading
                      </div>
                    </div>
                  )}

                  {/* Alternative readings - Normal size */}
                  {card.readings.length > 1 && (
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        Alternative readings:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {card.readings.slice(1).map((reading, index) => (
                          <span
                            key={index + 1}
                            className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm"
                          >
                            {reading}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Examples (for vocabulary) */}
              {card.examples.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Examples
                  </h3>
                  <div className="space-y-2">
                    {card.examples.map((example, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 dark:bg-gray-700 p-3 rounded"
                      >
                        <div className="text-gray-900 dark:text-white font-medium">
                          {example.word}
                        </div>
                        <div className="text-gray-600 dark:text-gray-300 text-sm">
                          {example.meaning}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Similar Kanji Button (for kanji only) */}
              {card.type === "kanji" &&
                card.visually_similar_subject_ids &&
                card.visually_similar_subject_ids.length > 0 && (
                  <div className="mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleShowSimilarKanji()
                      }}
                      disabled={loadingSimilar}
                      className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {loadingSimilar ? (
                        <>
                          <svg
                            className="animate-spin h-3 w-3 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Loading similar kanji...
                        </>
                      ) : (
                        `View ${card.visually_similar_subject_ids.length} visually similar kanji`
                      )}
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Similar Kanji Modal */}
      {showSimilarModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowSimilarModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Visually Similar Kanji
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Similar to: <span className="text-2xl font-bold">{card.character}</span>
                </p>
              </div>
              <button
                onClick={() => setShowSimilarModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {similarKanji.map((similar) => (
                  <div
                    key={similar.id}
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                  >
                    <div className="text-5xl font-bold text-gray-900 dark:text-white mb-3 text-center">
                      {similar.character}
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {similar.meanings.slice(0, 3).join(", ")}
                      </div>
                      {similar.readings.length > 0 && (
                        <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                          {similar.readings[0]}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Level {similar.level}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
