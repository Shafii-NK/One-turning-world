# Landmark sprite assets

Place the generated transparent WebP cutouts in this directory using these exact names:

- `cairo-giza-pyramids.webp`
- `cairo-great-sphinx.webp`
- `paris-eiffel-tower.webp`
- `paris-pont-alexandre-iii.webp`
- `new-york-empire-state-building.webp`
- `new-york-statue-of-liberty.webp`
- `new-york-brooklyn-bridge.webp`
- `ushuaia-les-eclaireurs.webp`
- `ushuaia-end-of-world-train.webp`

Each file should be an isolated, complete silhouette on a transparent background, with no people, text, logos, ground plane, water plane, skyline, or unrelated scenery. Export as WebP with alpha, ideally at 1024px on the longest edge. The scene loader preserves each image's aspect ratio and keeps a missing asset invisible.