import { useState, useEffect } from "react"
import { Card } from "@/lib/wanikaniTypes"

interface UseFetchLevelResult {
  cards: Card[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useFetchLevel(level: number): UseFetchLevelResult {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLevel = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/wanikani?levels=${level}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch level data")
      }

      setCards(data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setCards([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLevel()
  }, [level])

  return {
    cards,
    loading,
    error,
    refetch: fetchLevel,
  }
}
