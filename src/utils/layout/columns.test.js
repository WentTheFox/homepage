import { describe, expect, it } from "vitest";

import { columnMap, masonryContainerClasses, masonryGroupClasses } from "./columns";

describe("utils/layout/columns", () => {
  it("maps column counts to responsive grid classes", () => {
    expect(columnMap).toHaveLength(9);
    expect(columnMap[1]).toContain("grid-cols-1");
    expect(columnMap[2]).toContain("md:grid-cols-2");
    expect(columnMap[8]).toContain("lg:grid-cols-8");
  });

  it("uses the default breakpoints for services", () => {
    expect(masonryContainerClasses("services")).toBe("columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-0");
  });

  it("adds a 3xl column count only above the default maximum", () => {
    expect(masonryContainerClasses("services", 4)).not.toContain("3xl:");
    expect(masonryContainerClasses("services", 5)).toContain("3xl:columns-5");
    expect(masonryContainerClasses("services", 12)).toContain("3xl:columns-8");
    expect(masonryContainerClasses("bookmarks", 6)).not.toContain("3xl:");
    expect(masonryContainerClasses("bookmarks", "7")).toContain("3xl:columns-7");
  });

  it("makes row groups span all columns and keeps other groups unbroken", () => {
    expect(masonryGroupClasses({ style: "row" })).toBe("[column-span:all]");
    expect(masonryGroupClasses(undefined)).toBe("break-inside-avoid");
  });
});
