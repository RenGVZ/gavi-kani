"use client"

import { useState, useEffect } from "react"
import { Card as CardType } from "@/lib/wanikaniTypes"

interface CardProps {
  card: CardType
}

export default function Card({ card }: CardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  // Reset flip state when card changes
  useEffect(() => {
    setIsFlipped(false)
  }, [card.id])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === " ") {
        event.preventDefault()
        setIsFlipped((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleClick = () => {
    setIsFlipped((prev) => !prev)
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
                <div>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
