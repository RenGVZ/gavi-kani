import { NextRequest, NextResponse } from "next/server"
import { fetchAllSubjects, SubjectType } from "@/lib/wanikaniClient"

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
    const levelsParam = searchParams.get("levels")
    const typesParam = searchParams.get("types")

    if (!levelsParam) {
      return NextResponse.json(
        { error: "levels parameter is required" },
        { status: 400 }
      )
    }

    // Parse levels
    const levels = levelsParam.split(",").map((level) => {
      const num = parseInt(level.trim())
      if (isNaN(num) || num < 1 || num > 60) {
        throw new Error(`Invalid level: ${level}`)
      }
      return num
    })

    // Parse types (default to all if not specified)
    let types: SubjectType[] = ["radical", "kanji", "vocabulary"]
    if (typesParam) {
      const requestedTypes = typesParam
        .split(",")
        .map((t) => t.trim()) as SubjectType[]
      const validTypes: SubjectType[] = [
        "radical",
        "kanji",
        "vocabulary",
        "kana_vocabulary",
      ]
      const invalidTypes = requestedTypes.filter((t) => !validTypes.includes(t))

      if (invalidTypes.length > 0) {
        return NextResponse.json(
          { error: `Invalid types: ${invalidTypes.join(", ")}` },
          { status: 400 }
        )
      }

      types = requestedTypes
    }

    // Fetch subjects from WaniKani API
    const cards = await fetchAllSubjects(apiKey, levels, types)

    return NextResponse.json({
      success: true,
      data: cards,
      meta: {
        levels,
        types,
        count: cards.length,
      },
    })
  } catch (error) {
    console.error("WaniKani API error:", error)

    return NextResponse.json(
      {
        error: "Failed to fetch data from WaniKani API",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
