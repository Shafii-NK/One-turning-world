# One Turning World

An interactive study of light, distance, and place.

One Turning World is a full-screen WebGL experience that follows the sun across five cities: Tokyo, Cairo, Paris, New York, and Ushuaia. As the world turns, each location appears in a different season and hour, connected by a single solar journey.

## Experience

- Explore a real-time 3D globe rendered with Three.js.
- Move through the journey with the mouse wheel or keyboard.
- Select a city from the solar navigation stepper.
- Use `Arrow Up`, `Arrow Down`, `Page Up`, `Page Down`, or `Space` to navigate without a mouse.
- Respects the system `prefers-reduced-motion` setting.

## Built With

- React and TypeScript
- Vite
- Three.js with React Three Fiber
- GSAP and Motion
- Tailwind CSS

## Getting Started

Requirements: Node.js 18 or newer.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite in your browser.

## Scripts

```bash
npm run dev       # Start the development server
npm run build     # Type-check and create a production build
npm run preview   # Preview the production build locally
npm run lint      # Run Oxlint
```

## Project Structure

```text
src/
├── components/   Globe canvas, city information, and navigation
├── hooks/        Scroll state, globe setup, and choreography
├── constants.ts  City data and motion configuration
└── types.ts      Shared TypeScript types
```

## License

No license has been specified yet.
