import { Card } from "./wanikaniTypes"

/**
 * Exports cards to CSV format for Anki import
 */
export function exportToCSV(cards: Card[]): void {
  if (cards.length === 0) {
    alert("No cards to export")
    return
  }

  const headers = ["Front", "Back", "Type", "Level"]
  const rows = cards.map((card) => {
    const front = card.character
    const back = formatCardBack(card)
    return [front, back, card.type, card.level.toString()]
  })

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((field) => `"${field.replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n")

  downloadFile(csvContent, "wanikani-cards.csv", "text/csv")
}

/**
 * Exports cards to JSON format
 */
export function exportToJSON(cards: Card[]): void {
  if (cards.length === 0) {
    alert("No cards to export")
    return
  }

  const jsonContent = JSON.stringify(cards, null, 2)
  downloadFile(jsonContent, "wanikani-cards.json", "application/json")
}

/**
 * Formats the back of a card for export
 */
function formatCardBack(card: Card): string {
  const parts: string[] = []

  // Add meanings
  if (card.meanings.length > 0) {
    parts.push(`Meanings: ${card.meanings.join(", ")}`)
  }

  // Add readings
  if (card.readings.length > 0) {
    parts.push(`Readings: ${card.readings.join(", ")}`)
  }

  // Add examples
  if (card.examples.length > 0) {
    const examples = card.examples
      .map((ex) => `${ex.word} - ${ex.meaning}`)
      .join("; ")
    parts.push(`Examples: ${examples}`)
  }

  return parts.join("\n")
}

/**
 * Triggers a file download
 */
function downloadFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}
