import { describe, expect, it } from "vitest";

import { columnMap, serviceListLayoutClasses } from "./columns";

describe("utils/layout/columns", () => {
  it("maps column counts to responsive grid classes", () => {
    expect(columnMap).toHaveLength(9);
    expect(columnMap[1]).toContain("grid-cols-1");
    expect(columnMap[2]).toContain("md:grid-cols-2");
    expect(columnMap[8]).toContain("lg:grid-cols-8");
  });

  it("uses a grid for row groups and a column container when masonry is set", () => {
    expect(serviceListLayoutClasses({ style: "row", columns: 4 })).toBe(`grid ${columnMap[4]} gap-x-2`);
    expect(serviceListLayoutClasses({ style: "row", columns: 4, masonry: true })).toContain("lg:columns-4");
    expect(serviceListLayoutClasses({ masonry: true })).toBe("flex flex-col");
  });
});
