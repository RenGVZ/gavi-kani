"use client"

import { useEffect, useCallback } from "react"
import { Card } from "@/lib/wanikaniTypes"
import { exportToCSV, exportToJSON } from "@/lib/ankiExport"

interface DeckControlsProps {
  cards: Card[]
  currentIndex: number
  onNavigate: (index: number) => void
}

export default function DeckControls({
  cards,
  currentIndex,
  onNavigate,
}: DeckControlsProps) {
  const totalCards = cards.length
  const currentCard = cards[currentIndex]

  const handleExport = useCallback(() => {
    if (cards.length === 0) return

    // Show export options
    const format = window.confirm("Export as CSV? (Cancel for JSON)")
    if (format) {
      exportToCSV(cards)
    } else {
      exportToJSON(cards)
    }
  }, [cards])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault()
          onNavigate(currentIndex > 0 ? currentIndex - 1 : totalCards - 1)
          break
        case "ArrowRight":
          event.preventDefault()
          onNavigate(currentIndex < totalCards - 1 ? currentIndex + 1 : 0)
          break
        case "e":
        case "E":
          event.preventDefault()
          handleExport()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentIndex, totalCards, onNavigate, handleExport])

  const goToPrevious = () => {
    onNavigate(currentIndex > 0 ? currentIndex - 1 : totalCards - 1)
  }

  const goToNext = () => {
    onNavigate(currentIndex < totalCards - 1 ? currentIndex + 1 : 0)
  }

  if (totalCards === 0) {
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Card {currentIndex + 1} of {totalCards}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {currentCard?.type.charAt(0).toUpperCase() +
            currentCard?.type.slice(1)}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
        />
      </div>

      {/* Navigation controls */}
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={goToPrevious}
          className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Previous
        </button>

        <div className="flex space-x-2">
          <button
            onClick={() => onNavigate(0)}
            className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            First
          </button>
          <button
            onClick={() => onNavigate(totalCards - 1)}
            className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Last
          </button>
        </div>

        <button
          onClick={goToNext}
          className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Next
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Export button */}
      <div className="mt-6 text-center">
        <button
          onClick={handleExport}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Export Deck (E)
        </button>
      </div>

      {/* Keyboard shortcuts help */}
      <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
        <p>
          Keyboard shortcuts: ← → Navigate | Space Flip | E Export | Esc Back
        </p>
      </div>
    </div>
  )
}
