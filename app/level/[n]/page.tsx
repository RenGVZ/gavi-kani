"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useFetchLevel } from "@/hooks/useFetchLevel"
import Card from "@/components/Card"
import DeckControls from "@/components/DeckControls"
import Link from "next/link"

export default function LevelPage() {
  const params = useParams()
  const level = parseInt(params.n as string)
  const { cards, loading, error } = useFetchLevel(level)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [filter, setFilter] = useState<
    "all" | "radical" | "kanji" | "vocabulary"
  >("kanji")

  const handleFilterChange = (
    newFilter: "all" | "radical" | "kanji" | "vocabulary"
  ) => {
    setFilter(newFilter)
  }

  // Filter cards based on selected type
  const filteredCards = cards.filter(
    (card) => filter === "all" || card.type === filter
  )

  // Reset to first card when filter changes
  useEffect(() => {
    setCurrentIndex(0)
  }, [filter])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (filteredCards.length === 0) return

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault()
          setCurrentIndex((prev) =>
            prev > 0 ? prev - 1 : filteredCards.length - 1
          )
          break
        case "ArrowRight":
          event.preventDefault()
          setCurrentIndex((prev) =>
            prev < filteredCards.length - 1 ? prev + 1 : 0
          )
          break
        case "Escape":
          event.preventDefault()
          window.location.href = "/"
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [filteredCards.length])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Loading level {level}...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-300 mb-4">
            No cards found for level {level}
          </h2>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const currentCard = filteredCards[currentIndex]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Level {level}
              </h1>
            </div>

            {/* Filter buttons */}
            <div className="flex space-x-2">
              {[
                { key: "all", label: "All", count: cards.length },
                {
                  key: "radical",
                  label: "Radicals",
                  count: cards.filter((c) => c.type === "radical").length,
                },
                {
                  key: "kanji",
                  label: "Kanji",
                  count: cards.filter((c) => c.type === "kanji").length,
                },
                {
                  key: "vocabulary",
                  label: "Vocabulary",
                  count: cards.filter((c) => c.type === "vocabulary").length,
                },
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() =>
                    handleFilterChange(
                      key as "all" | "radical" | "kanji" | "vocabulary"
                    )
                  }
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    filter === key
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {label} ({count})
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {currentCard && <Card card={currentCard} />}

          <DeckControls
            cards={filteredCards}
            currentIndex={currentIndex}
            onNavigate={setCurrentIndex}
          />
        </div>
      </main>
    </div>
  )
}
