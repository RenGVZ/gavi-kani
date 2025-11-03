import { describe, it, expect, vi } from "vitest"
import { exportToCSV, exportToJSON } from "@/lib/ankiExport"
import { Card } from "@/lib/wanikaniTypes"

// Mock DOM methods
Object.defineProperty(window, "URL", {
  value: {
    createObjectURL: vi.fn(() => "mock-url"),
    revokeObjectURL: vi.fn(),
  },
})

Object.defineProperty(document, "createElement", {
  value: vi.fn(() => ({
    href: "",
    download: "",
    click: vi.fn(),
  })),
})

Object.defineProperty(document.body, "appendChild", {
  value: vi.fn(),
})

Object.defineProperty(document.body, "removeChild", {
  value: vi.fn(),
})

describe("Export Functions", () => {
  const mockCards: Card[] = [
    {
      id: "1",
      character: "一",
      type: "kanji",
      meanings: ["one", "1"],
      readings: ["いち", "ひと"],
      examples: [],
      level: 1,
    },
    {
      id: "2",
      character: "一人",
      type: "vocabulary",
      meanings: ["one person"],
      readings: ["ひとり"],
      examples: [{ word: "私は一人です。", meaning: "I am alone." }],
      level: 1,
    },
  ]

  it("exports CSV format correctly", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {})

    exportToCSV(mockCards)

    expect(document.createElement).toHaveBeenCalledWith("a")
    expect(consoleSpy).not.toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it("exports JSON format correctly", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {})

    exportToJSON(mockCards)

    expect(document.createElement).toHaveBeenCalledWith("a")
    expect(consoleSpy).not.toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it("handles empty cards array", () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {})

    exportToCSV([])
    exportToJSON([])

    expect(alertSpy).toHaveBeenCalledTimes(2)
    expect(alertSpy).toHaveBeenCalledWith("No cards to export")

    alertSpy.mockRestore()
  })
})
