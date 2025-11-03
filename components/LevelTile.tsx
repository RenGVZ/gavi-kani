import Link from "next/link"

interface LevelTileProps {
  level: number
}

export default function LevelTile({ level }: LevelTileProps) {
  return (
    <Link
      href={`/level/${level}`}
      className="group relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <div className="text-center">
        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {level}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Level {level}
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
    </Link>
  )
}
