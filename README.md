# PHANTOM — Beyond the Unknown

> "Every shadow has a story."

A community-driven paranormal storytelling platform built for the **Hacktoberfest Open-Source AI Challenge — Week 4: Ghost in the Machine**. Users can share personal experiences or fictional stories, discover a featured Story of the Week, and transform ordinary text into atmospheric horror using an **open-weight AI model running locally in the browser**.

---

## Features

- **Home — Enter the Unknown**: cinematic hero with a haunted mansion, fog, moonlight, and ghost silhouettes. Browse featured stories, categories, and recent submissions.
- **Paranormal Story Wall**: browse stories across six categories (Real-Life Experiences, Ghost Encounters, Haunted Places, Unexplained Events, Horror Fiction, Psychological Horror). Personal accounts are clearly distinguished from fiction and never presented as verified fact.
- **Share Your Experience**: submit a story with title, content, category, display name / anonymous, and fiction / personal-experience selection. Stories persist in `localStorage` (browser-specific demo — see limitations below).
- **AI Story Forge**: transform ordinary text into horror fiction using the open-weight **Gemma 3 1B** model running entirely in the browser via Transformers.js. Five transformation styles: Ghost Story, Mysterious, Psychological Horror, Unexpected Ending, Atmospheric Horror.
- **Story of the Week**: an editorial feature with selection criteria. Initial content is labeled as demonstration content.
- **Discover**: search by title/content, filter by category, sort by recent or popular.
- **Ghostly Atmosphere**: toggle ambient sound, fog, particles, candlelight, and reduced-motion. Settings persist across sessions.

---

## Open-Weight AI: Gemma 3 1B

This project uses a **genuine open-weight AI model** — not a mock, not a hardcoded response, and not a paid API.

### Model

| Field | Value |
|---|---|
| **Model** | Gemma 3 1B (instruction-tuned) |
| **Source** | [onnx-community/gemma-3-1b-it-ONNX](https://huggingface.co/onnx-community/gemma-3-1b-it-ONNX) on Hugging Face |
| **Original model** | [google/gemma-3-1b-it](https://huggingface.co/google/gemma-3-1b-it) by Google DeepMind |
| **License** | Gemma Terms of Use (model weights) + Apache 2.0 (ONNX export) |
| **Parameters** | ~1 billion |
| **Quantization** | `q4f16` (WebGPU) or `q4` (WASM) |
| **Runtime** | [Transformers.js v4](https://huggingface.co/docs/transformers.js) + ONNX Runtime Web |
| **Inference location** | **Entirely in the browser** — text is never sent to a server |

### How inference works

1. When the user clicks **Transform** in the Story Forge, a Web Worker loads Transformers.js dynamically.
2. The worker calls `pipeline('text-generation', 'onnx-community/gemma-3-1b-it-ONNX', { device, dtype })`.
3. On first use, the model weights (~0.8–1.2 GB depending on backend) are downloaded from the Hugging Face Hub and cached by the browser's Cache API. Subsequent visits load from cache.
4. If **WebGPU** is available (Chrome/Edge 113+), the model runs on GPU (`q4f16`, faster). Otherwise it falls back to **WASM** (`q4`, slower but works without GPU).
5. Generation streams tokens to the UI in real time via a `TextStreamer`, so the user sees the story appear as it is generated.
6. The generated text is displayed with a clear note that it is AI-produced fiction.

### What the open-weight approach enables

- **Local processing**: inference runs on the user's device. The input text never leaves the browser.
- **No API keys, no paid services**: the model is downloaded once and cached; no server bills, no rate limits.
- **Full control**: the model, runtime, and inference parameters are fully visible in the source code.
- **Reproducibility**: anyone can inspect the exact model ID and configuration.

### Limitations (honest)

- **First-load download is large**: the model is ~0.8 GB (WebGPU) or ~0.5 GB (WASM). On a slow connection this can take several minutes. Progress is shown.
- **WASM is slow**: without WebGPU, a 1B model on CPU can take 30 seconds to several minutes per generation, depending on the machine. WebGPU is strongly recommended.
- **Browser requirements**: WebGPU requires Chrome or Edge 113+ (or a recent Firefox/Safari with WebGPU enabled). WASM works in most modern browsers but is slower.
- **Model quality**: Gemma 3 1B is a small model. Output may be repetitive, off-topic, or lower quality than larger models. It is fiction and should be read as such.
- **Not offline-first**: the model must be downloaded at least once with an internet connection. After caching, subsequent generations work offline (untested — do not assume full offline functionality without testing after cache).
- **No server-side generation**: there is no fallback API. If the browser cannot load the model (out of memory, unsupported runtime, blocked network), the UI shows a clear "AI generation unavailable" error with Retry and Cancel options. We never substitute hardcoded text labelled as AI.

---

## Ambient Audio

The background ambience is **synthesized entirely in-browser** using the Web Audio API — no copyrighted audio files are used. The soundscape layers:

- A deep low drone (two detuned sawtooth oscillators through a lowpass filter).
- A slow sub-bass swell (LFO-modulated sine at A0).
- Filtered brown-noise wind with a moving lowpass cutoff.
- Randomly-timed "whisper" bursts (short bandpass-filtered noise pings, panned).

Audio starts only after the user presses the play control (browsers block autoplay). The default volume is 70% (clearly audible but not harsh). Volume and mute state persist via `localStorage`. Controls are visible on every page in the navbar.

---

## Visual Assets

- **Haunted mansion photograph**: ["Nighttime photograph of an eerie, abandoned mansion in Wales"](https://www.pexels.com/photo/775667/) by Jack Gittoes on Pexels (Pexels License — free to use, no attribution required, but credited here in good faith).
- All other visual effects (fog, moon, ghost silhouettes, particles, candlelight) are rendered with CSS/SVG.

---

## Tech Stack

- React 18 + TypeScript + Vite 7
- Tailwind CSS 3 (custom cinematic theme)
- Lucide React (icons)
- Transformers.js v4 (`@huggingface/transformers`) for on-device AI
- Web Audio API (synthesized ambient audio)
- `localStorage` for demo story persistence

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

### Testing the AI Story Forge

1. Navigate to **Story Forge** from the navbar.
2. Paste a passage of ordinary text (at least 20 characters).
3. Choose a transformation style.
4. Click **Transform**.
5. On first use, the model downloads — watch the progress bar. This can take several minutes on a slow connection.
6. Once loaded, generation streams token-by-token to the screen.
7. If generation fails, a persistent error message appears with **Retry** and **Cancel** options.

**For best results**: use the latest Chrome or Edge on a desktop with WebGPU. The WASM fallback works but is much slower.

---

## Architecture

```
src/
├── components/
│   ├── AtmosphereBackground.tsx   # Cinematic layered background (mansion, fog, moon, ghosts)
│   ├── AudioControl.tsx            # Volume slider + mute toggle
│   ├── Footer.tsx
│   ├── Navbar.tsx                  # Navigation + audio control + settings link
│   ├── StoryBadges.tsx             # Category, fiction, and reaction UI
│   └── StoryCard.tsx               # Case-file styled story card
├── context/
│   └── AtmosphereContext.tsx       # Global state: settings, stories, reactions
├── data.ts                         # Categories, transform options, seed stories
├── hooks/
│   └── useAmbientAudio.ts          # Web Audio API ambient soundscape
├── lib/
│   ├── format.ts                   # Date helpers
│   ├── router.ts                    # Hash-based router
│   ├── storage.ts                   # localStorage persistence
│   └── storyForge.ts               # AI adapter (worker management, cancel, streaming)
├── pages/
│   ├── AtmospherePage.tsx
│   ├── DiscoverPage.tsx
│   ├── ForgePage.tsx                # AI Story Forge UI
│   ├── HomePage.tsx
│   ├── SharePage.tsx
│   ├── StoryPage.tsx
│   ├── WallPage.tsx
│   └── WeekPage.tsx
├── types.ts
├── workers/
│   └── storyForge.worker.ts        # Web Worker: loads Gemma, runs generation, streams tokens
└── App.tsx
```

---

## Privacy Notes

- **AI text**: input text for the Story Forge is processed **entirely in the browser**. It is never sent to any server. The model is downloaded from the Hugging Face Hub but your story text is not.
- **Stories**: submitted stories are stored in `localStorage` — your browser only. They are not uploaded to a shared database. Other visitors cannot see your stories. This is a demo MVP; the README states this clearly so no one assumes anonymity or multi-user community storage.
- **No tracking, no analytics, no third-party scripts** beyond the Hugging Face model download.

---

## Known Limitations

- `localStorage` persistence is browser-specific and does not sync across devices or users.
- The AI model requires a one-time large download; it cannot run on very old browsers or devices with insufficient memory.
- WebGPU is not available in all browsers (notably older Safari/Firefox without flags).
- The model is small (1B parameters) and may produce lower-quality output than larger models.
- The ambient audio is synthesized and may sound thin on low-quality speakers; use headphones for the best atmosphere.

---

## License

This project is built for the Hacktoberfest Open-Source AI Challenge. The code is open-source. The AI model (Gemma 3 1B) is licensed under the [Gemma Terms of Use](https://ai.google.dev/gemma/terms). The ONNX export is Apache 2.0. The mansion photograph is from Pexels under the Pexels License.
