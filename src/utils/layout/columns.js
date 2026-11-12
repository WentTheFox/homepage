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
const masonryWideColumns = {
  5: "3xl:columns-5",
  6: "3xl:columns-6",
  7: "3xl:columns-7",
  8: "3xl:columns-8",
};

const masonryBaseColumns = {
  services: "columns-1 md:columns-2 lg:columns-3 xl:columns-4",
  bookmarks: "columns-1 md:columns-4 lg:columns-5 xl:columns-6",
};

// CSS multi-column container classes for the masonry layout. Mirrors the breakpoints
// of the flex-basis classes used by the regular layout.
export function masonryContainerClasses(kind, maxGroupColumns) {
  const max = parseInt(maxGroupColumns, 10);
  const minimum = kind === "bookmarks" ? 7 : 5;
  const wide = max >= minimum ? (masonryWideColumns[Math.min(max, 8)] ?? "") : "";
  return `${masonryBaseColumns[kind]} ${wide} gap-0`.replace(/\s+/g, " ").trim();
}

// Row-style groups span every column, splitting the masonry container into segments.
export function masonryGroupClasses(layout) {
  return layout?.style === "row" ? "[column-span:all]" : "break-inside-avoid";
}
