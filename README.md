# 🎬 Trivia Encyclopedia

A cinematic 3D interactive movie trivia web application. Explore hundreds of movies arranged in a stunning WebGL sphere, click any poster to discover AI-generated trivia facts.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=flat-square&logo=three.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square&logo=tailwindcss)

## ✨ Features

- **3D Poster Sphere** — 200 movie posters arranged in a Fibonacci sphere with orbit controls
- **Cinematic UI** — Dark theme with glassmorphism, smooth animations, and backdrop blur
- **AI Trivia** — 5 engaging trivia facts generated per movie via OpenAI
- **Search** — Real-time search with debounced input
- **Interactive** — Hover scaling, camera zoom on click, ESC to close
- **Performance** — Lazy-loaded textures, dynamic imports, in-memory trivia cache

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm
- [TMDB API Key](https://www.themoviedb.org/settings/api)
- [OpenAI API Key](https://platform.openai.com/api-keys) *(optional — fallback trivia is provided)*

### Setup

```bash
# Install dependencies
npm install --legacy-peer-deps

# Copy environment variables
cp .env.example .env.local

# Add your API keys to .env.local
# TMDB_API_KEY=your_key_here
# OPENAI_API_KEY=your_key_here

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── movies/route.ts     # TMDB movie data endpoint
│   │   └── trivia/route.ts     # AI trivia generation endpoint
│   ├── globals.css             # Dark cinematic styles
│   ├── layout.tsx              # Root layout with SEO metadata
│   └── page.tsx                # Main application page
├── components/
│   ├── LoadingScreen.tsx       # Cinematic loading animation
│   ├── MovieModal.tsx          # Movie details + trivia modal
│   ├── Poster.tsx              # Individual 3D poster billboard
│   ├── SearchBar.tsx           # Glassmorphism search input
│   └── SphereLayout.tsx        # R3F Canvas with sphere layout
├── lib/
│   ├── openai.ts               # OpenAI trivia generation
│   ├── tmdb.ts                 # TMDB data fetching
│   └── types.ts                # TypeScript interfaces
├── .env.example
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 14 | App Router, API routes, SSR |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| React Three Fiber | 3D rendering |
| Drei | R3F helpers (Billboard, OrbitControls) |
| Framer Motion | Animations |
| OpenAI API | Trivia generation |
| TMDB API | Movie data |

## 📄 License

MIT
