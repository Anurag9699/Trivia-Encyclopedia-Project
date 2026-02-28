# 🎬 Trivia Encyclopedia

A **3D interactive movie trivia web application** built with Next.js, React Three Fiber, and AI-powered trivia generation. Explore 300+ movie posters floating in a WebGL sphere, click any poster to zoom in, and discover AI-generated trivia facts.

![Trivia Encyclopedia - 3D Sphere](https://img.shields.io/badge/Movies-300%2B-purple?style=for-the-badge) ![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js) ![Three.js](https://img.shields.io/badge/Three.js-WebGL-blue?style=for-the-badge&logo=three.js) ![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript)

---

## ✨ Features

### 🌐 3D WebGL Poster Sphere
- 300+ movie posters arranged in a **Fibonacci sphere** distribution
- Smooth **orbit controls** — drag to explore, scroll to zoom
- **Auto-rotation** with parallax mouse drift
- **Star field** background with floating dust particles

### 🎬 Cinematic Post-Processing
- **Bloom** glow effect on hovered posters
- **Vignette** dark edges for cinematic framing
- **Fog** depth effect to hide distant posters

### 🏷️ Genre Filtering
- Filter movies by genre (Action, Comedy, Drama, Horror, Sci-Fi, etc.)
- Non-matching posters **dim** instead of disappearing (keeps sphere intact)
- Animated pill buttons with spring physics

### 🔍 Real-Time Search
- Glassmorphism search bar
- Instant filtering as you type

### 🎭 Interactive Movie Modal
- Click any poster → camera **zooms in** → cinematic modal opens
- **Blurred poster backdrop** for immersive feel
- Movie details: title, year, rating (animated counter), overview
- **Genre tags** with purple accent styling
- **5 AI-generated trivia facts** with staggered reveal animation

### 🤖 AI Trivia Generation
- Powered by **OpenAI GPT-3.5-turbo**
- In-memory caching to avoid redundant API calls
- Graceful fallback trivia when API is unavailable

### 🚀 Loading Experience
- Animated spinning rings with gradient orb
- **Real progress indicator** tracking movie count
- Movie title ticker during load
- Zoom-out exit animation

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 14** (App Router) | Framework, SSR, API routes |
| **TypeScript** | Type safety |
| **React Three Fiber** | React renderer for Three.js |
| **Drei** | R3F helpers (Billboard, OrbitControls, Stars) |
| **Three.js** | WebGL 3D rendering |
| **@react-three/postprocessing** | Bloom, Vignette effects |
| **Framer Motion** | UI animations, modal transitions |
| **Tailwind CSS** | Utility-first styling |
| **TMDB API** | Movie data (popular, top rated, now playing) |
| **OpenAI API** | AI-generated trivia facts |

---

## 📁 Project Structure

```
app/
├── api/
│   ├── movies/route.ts      # TMDB data endpoint (3 sources)
│   └── trivia/route.ts      # OpenAI trivia endpoint
├── globals.css               # Dark cinematic theme
├── layout.tsx                # Root layout + SEO metadata
└── page.tsx                  # Main page (state management)

components/
├── SphereLayout.tsx          # R3F Canvas + Fibonacci sphere + post-processing
├── Poster.tsx                # 3D poster with glow, breathing, dimming
├── Particles.tsx             # Instanced floating dust particles
├── MovieModal.tsx            # Cinematic modal with blurred backdrop
├── GenreFilter.tsx           # Genre pill buttons
├── SearchBar.tsx             # Glassmorphism search input
└── LoadingScreen.tsx         # Animated loading with progress

lib/
├── tmdb.ts                   # TMDB API client (3 endpoints)
├── openai.ts                 # OpenAI client (lazy init + cache)
└── types.ts                  # TypeScript interfaces + genre mapping
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ 
- **TMDB API Key** — [Get one free](https://www.themoviedb.org/settings/api)
- **OpenAI API Key** (optional) — [Get one](https://platform.openai.com/api-keys)

### Installation

```bash
# Clone the repository
git clone https://github.com/Anurag9699/Trivia-Encyclopedia-Project.git
cd Trivia-Encyclopedia-Project

# Install dependencies
npm install --legacy-peer-deps

# Set up environment variables
cp .env.example .env.local
```

Edit `.env.local` with your API keys:
```env
TMDB_API_KEY=your_tmdb_api_key_here
OPENAI_API_KEY=your_openai_api_key_here  # Optional
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **Import Project**
3. Select your GitHub repository
4. Add environment variables:
   - `TMDB_API_KEY`
   - `OPENAI_API_KEY` (optional)
5. Click **Deploy**

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `TMDB_API_KEY` | ✅ Yes | Fetches movie data from TMDB |
| `OPENAI_API_KEY` | ❌ Optional | Enables AI trivia (falls back to generic facts) |

---

## 🎮 Usage

| Action | How |
|---|---|
| **Orbit** | Click + drag to rotate around the sphere |
| **Zoom** | Scroll wheel to zoom in/out |
| **Filter** | Click genre pills (Action, Comedy, etc.) |
| **Search** | Type in the search bar |
| **View Details** | Click any poster → modal with trivia |
| **Close Modal** | Press `ESC` or click outside |

---

## 📄 License

MIT License — feel free to use and modify.

---

Built with ❤️ using Next.js, Three.js, and AI
