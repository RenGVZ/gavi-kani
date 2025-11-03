# Gavi-Kani

A React (Next.js) app that uses the WaniKani API to generate Anki-style flashcards by kanji level. Study radicals, kanji, and vocabulary with keyboard-friendly navigation and export functionality.

## Features

- **Level-based Study**: Browse and study WaniKani levels 1-60
- **Multiple Subject Types**: Study radicals, kanji, and vocabulary separately or together
- **Keyboard Navigation**: Full keyboard support for efficient studying
- **Export Functionality**: Export decks as CSV or JSON for Anki import
- **Offline Capable**: Once loaded, study without internet connection
- **Modern UI**: Clean, responsive design with dark mode support

## Setup

### Prerequisites

- Node.js 18+
- WaniKani API key

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create environment file:

   ```bash
   cp .env.example .env.local
   ```

4. Add your WaniKani API key to `.env.local`:

   ```
   WANIKANI_API_KEY=your_api_key_here
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Dashboard

- Select any level (1-60) to start studying
- Each level contains radicals, kanji, and vocabulary for that level

### Studying

- **Space**: Flip the current card
- **Arrow Keys**: Navigate between cards
- **E**: Export current deck
- **Esc**: Return to dashboard

### Filtering

- Use the filter buttons to study specific subject types:
  - **All**: Show all subjects for the level
  - **Radicals**: Only radical flashcards
  - **Kanji**: Only kanji flashcards
  - **Vocabulary**: Only vocabulary flashcards

### Export

- Press **E** or click "Export Deck" to download your cards
- Choose CSV format for Anki import
- Choose JSON format for data backup

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Testing**: Vitest + React Testing Library
- **API**: WaniKani API v2

## Architecture

### Key Components

- **Dashboard** (`app/page.tsx`): Level selection grid
- **Level Page** (`app/level/[n]/page.tsx`): Card study interface
- **Card Component** (`components/Card.tsx`): Flip animation and display
- **Deck Controls** (`components/DeckControls.tsx`): Navigation and export
- **API Proxy** (`app/api/wanikani/route.ts`): Server-side WaniKani integration

### Data Flow

1. User selects a level from dashboard
2. Level page fetches all subjects for that level via API proxy
3. Subjects are transformed into internal Card format
4. Cards are cached in component state for offline use
5. User can filter, navigate, and export cards

### API Integration

- **Server-side proxy**: Protects API key from client exposure
- **Pagination handling**: Automatically fetches all pages
- **Rate limiting**: Implements exponential backoff for 429 responses
- **Error handling**: Graceful fallbacks for API failures

## Development

### Running Tests

```bash
npm run test
```

### Building for Production

```bash
npm run build
npm start
```

## Environment Variables

| Variable               | Description                | Required            |
| ---------------------- | -------------------------- | ------------------- |
| `WANIKANI_API_KEY`     | Your WaniKani API v2 token | Yes                 |
| `NEXT_PUBLIC_API_BASE` | WaniKani API base URL      | No (defaults to v2) |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- [WaniKani](https://www.wanikani.com/) for the excellent Japanese learning platform
- [WaniKani API](https://docs.api.wanikani.com/) for providing the data
- [Anki](https://apps.ankiweb.net/) for the flashcard format inspiration
