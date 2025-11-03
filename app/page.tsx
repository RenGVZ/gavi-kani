import LevelTile from "@/components/LevelTile"

export default function Home() {
  const levels = Array.from({ length: 60 }, (_, i) => i + 1)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Gavi-Kani
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            WaniKani flashcard generator. Select a level to study radicals,
            kanji, and vocabulary.
          </p>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 max-w-6xl mx-auto">
          {levels.map((level) => (
            <LevelTile key={level} level={level} />
          ))}
        </div>

        <footer className="mt-16 text-center text-gray-500 dark:text-gray-400">
          <p>
            Keyboard shortcuts: Space to flip, Arrow keys to navigate, E to
            export
          </p>
        </footer>
      </div>
    </div>
  )
}
