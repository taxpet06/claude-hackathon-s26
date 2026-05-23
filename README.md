# Sound Globe 🌍
### 2nd Place @ Dartmouth College Claude Hackathon 2026

An interactive music discovery app that lets you explore global music on a world map, create AI-powered audio mashups using real stem separation, and share your creations with the community.



## Features

- **Interactive World Map** — Mapbox GL JS dark-style globe with 30+ region pins. Click any pin to browse top songs from that country (powered by the iTunes Charts API).
- **Music Search** — Type a region, country, or city name to fly the map there and load local music.
- **AI Stem Creator** — Search any song, separate its audio into drums / bass / vocals / other using Replicate + Demucs, then mix stems from multiple tracks into a new mashup.
- **Claude Descriptions** — Claude (claude-sonnet-4-6) writes a 2–3 sentence description for your mashup before you publish it.
- **Community Feed** — Browse and play mashups shared by other users. Backed by PostgreSQL.

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Map | Mapbox GL JS 3.x |
| Styling | Tailwind CSS |
| Music | iTunes Search / Charts API (free, no key) |
| Stem separation | Replicate — `ryan5453/demucs` (htdemucs) |
| AI descriptions | Anthropic Claude API (claude-sonnet-4-6) |
| Database | PostgreSQL 16 (Docker) |
| Audio mixing | Web Audio API + MediaRecorder |
| State | Zustand + TanStack Query v5 |

## Setup

### 1. Prerequisites

- Node.js 18+
- Docker Desktop
- [mkcert](https://github.com/FiloSottile/mkcert) (for local HTTPS)

### 2. Clone & install

```bash
git clone <repo-url>
cd claude-hackathon-team-tushar/hackathon-project
npm install
```

### 3. Environment variables

Copy `.env.example` to `.env.local` and fill in your keys:

```bash
cp .env.example .env.local
```

Required keys:

```bash
REPLICATE_API_TOKEN=      # replicate.com/account/api-tokens
ANTHROPIC_API_KEY=        # console.anthropic.com
NEXT_PUBLIC_MAPBOX_TOKEN= # account.mapbox.com
DATABASE_URL=postgresql://soundglobe:soundglobe@localhost:5432/soundglobe
```

### 4. Local HTTPS (required for audio features)

```bash
mkcert -install
mkdir -p certs
mkcert -key-file certs/localhost-key.pem -cert-file certs/localhost.pem localhost
```

### 5. Start PostgreSQL

```bash
docker compose up -d
```

The schema is applied automatically on first boot.

### 6. Run the app

```bash
npm run dev
```

Open [https://localhost:3000](https://localhost:3000).

## Project Structure

```
hackathon-project/
├── app/                    # Next.js App Router pages + API routes
│   ├── discover/           # Map page
│   ├── creator/            # Stem creator workspace
│   ├── community/          # Community feed
│   └── api/                # Backend API routes
├── components/             # React components
│   ├── map/                # Mapbox map, pins, popups
│   ├── tracks/             # Track cards, audio preview
│   ├── creator/            # Stem workspace, mixer, publish modal
│   └── community/          # Feed, song cards, player
├── lib/                    # Server-side helpers (iTunes, Replicate, Claude, DB)
├── hooks/                  # TanStack Query / Zustand hooks
└── types/                  # TypeScript types
```

## How Stem Separation Works

1. Select a song and a stem type (drums / bass / vocals / other).
2. The server fetches the iTunes 30-second preview and uploads it directly to Replicate (iTunes URLs are geo-blocked from Replicate's servers).
3. Replicate runs `htdemucs` to separate the audio — takes ~60–90 seconds.
4. The browser loads each separated stem into a Web Audio `AudioContext` with individual gain controls.
5. Hit **Mix** to play all selected stems together, then **Publish** to share.
