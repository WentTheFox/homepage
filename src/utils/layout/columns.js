export const columnMap = [
  "grid-cols-1 md:grid-cols-1 lg:grid-cols-1",
  "grid-cols-1 md:grid-cols-1 lg:grid-cols-1",
  "grid-cols-1 md:grid-cols-2 lg:grid-cols-2",
  "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  "grid-cols-1 md:grid-cols-2 lg:grid-cols-5",
  "grid-cols-1 md:grid-cols-2 lg:grid-cols-6",
  "grid-cols-1 md:grid-cols-2 lg:grid-cols-7",
  "grid-cols-1 md:grid-cols-2 lg:grid-cols-8",
];

// Literal class names so Tailwind can detect them (no dynamic interpolation).
export const masonryColumnMap = [
  "columns-1 md:columns-1 lg:columns-1",
  "columns-1 md:columns-1 lg:columns-1",
  "columns-1 md:columns-2 lg:columns-2",
  "columns-1 md:columns-2 lg:columns-3",
  "columns-1 md:columns-2 lg:columns-4",
  "columns-1 md:columns-2 lg:columns-5",
  "columns-1 md:columns-2 lg:columns-6",
  "columns-1 md:columns-2 lg:columns-7",
  "columns-1 md:columns-2 lg:columns-8",
];

// Container classes for the service list inside one group. Masonry (per-group `masonry: true`)
// only applies to row-style groups, which are the ones that use columns.
export function serviceListLayoutClasses(layout) {
  if (layout?.style !== "row") return "flex flex-col";
  return layout.masonry ? `${masonryColumnMap[layout.columns]} gap-x-2` : `grid ${columnMap[layout.columns]} gap-x-2`;
}
