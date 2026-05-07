import { NextRequest, NextResponse } from "next/server"
import { Subject, Card } from "@/lib/wanikaniTypes"
import { transformSubjectsToCards } from "@/lib/wanikaniClient"

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.WANIKANI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "WANIKANI_API_KEY not configured" },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const idsParam = searchParams.get("ids")

    if (!idsParam) {
      return NextResponse.json(
        { error: "ids parameter is required" },
        { status: 400 }
      )
    }

    // Parse IDs
    const ids = idsParam.split(",").map((id) => {
      const num = parseInt(id.trim())
      if (isNaN(num)) {
        throw new Error(`Invalid ID: ${id}`)
      }
      return num
    })

    if (ids.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
      })
    }

    // Fetch subjects from WaniKani API
    const subjects = await fetchSubjectsByIds(apiKey, ids)
    const cards = transformSubjectsToCards(subjects)

    return NextResponse.json({
      success: true,
      data: cards,
    })
  } catch (error) {
    console.error("WaniKani API error:", error)

    return NextResponse.json(
      {
        error: "Failed to fetch subjects from WaniKani API",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

/**
 * Fetches specific subjects by their IDs from WaniKani API
 */
async function fetchSubjectsByIds(
  apiKey: string,
  ids: number[]
): Promise<Subject[]> {
  const baseUrl = "https://api.wanikani.com/v2/subjects"
  const params = new URLSearchParams({
    ids: ids.join(","),
  })

  const response = await fetch(`${baseUrl}?${params}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Wanikani-Revision": "20170710",
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  const data: { data: Subject[] } = await response.json()
  return data.data
}
