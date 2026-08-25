import { describe, expect, it } from "vitest";

import { isGlobMatch } from "./glob-match.mjs";

describe("isGlobMatch – exact matches", () => {
  it("matches identical paths", () => {
    expect(isGlobMatch("a/b/c", "a/b/c")).toBe(true);
  });

  it("fails on different literal paths", () => {
    expect(isGlobMatch("a/b/c", "a/b/d")).toBe(false);
  });

  it("fails if matcher is shorter", () => {
    expect(isGlobMatch("a/b/c", "a/b")).toBe(false);
  });

  it("fails if matcher is longer", () => {
    expect(isGlobMatch("a/b", "a/b/c")).toBe(false);
  });
});

describe("isGlobMatch – single wildcard (*)", () => {
  it("matches exactly one segment", () => {
    expect(isGlobMatch("a/b/c", "a/*/c")).toBe(true);
  });

  it("does not match zero segments", () => {
    expect(isGlobMatch("a/c", "a/*/c")).toBe(false);
  });

  it("does not match multiple segments", () => {
    expect(isGlobMatch("a/b/x/c", "a/*/c")).toBe(false);
  });

  it("matches any segment value", () => {
    expect(isGlobMatch("a/123/c", "a/*/c")).toBe(true);
  });
});

describe("isGlobMatch – multi wildcard (**)", () => {
  it("matches zero segments", () => {
    expect(isGlobMatch("a/b", "a/**/b")).toBe(true);
  });

  it("matches one segment", () => {
    expect(isGlobMatch("a/x/b", "a/**/b")).toBe(true);
  });

  it("matches multiple segments", () => {
    expect(isGlobMatch("a/x/y/z/b", "a/**/b")).toBe(true);
  });

  it("matches everything when used alone", () => {
    expect(isGlobMatch("a/b/c", "**")).toBe(true);
  });

  it("matches prefix with trailing **", () => {
    expect(isGlobMatch("a/b/c/d", "a/b/**")).toBe(true);
  });

  it("fails if suffix cannot be satisfied", () => {
    expect(isGlobMatch("a/b/c", "a/**/d")).toBe(false);
  });
});

describe("isGlobMatch – mixed wildcards", () => {
  it("handles * after **", () => {
    expect(isGlobMatch("a/b/c", "**/*/c")).toBe(true);
  });

  it("handles * before **", () => {
    expect(isGlobMatch("a/b/c/d", "a/*/**/d")).toBe(true);
  });

  it("fails when * cannot be satisfied even with **", () => {
    expect(isGlobMatch("a/b", "a/*/**/c")).toBe(false);
  });

  it("allows ** to backtrack correctly", () => {
    expect(isGlobMatch("a/b/c/d/e", "a/**/d/*")).toBe(true);
  });
});

describe("isGlobMatch – normalization assumptions", () => {
  it("treats **/* as **", () => {
    expect(isGlobMatch("a/b/c", "**/*")).toBe(true);
  });

  it("treats */** as **", () => {
    expect(isGlobMatch("a/b/c", "*/**")).toBe(true);
  });

  it("treats **/** as **", () => {
    expect(isGlobMatch("a/b/c", "**/**")).toBe(true);
  });

  it("does not collapse */*", () => {
    expect(isGlobMatch("a/b", "*/*")).toBe(true);
    expect(isGlobMatch("a/b/c", "*/*")).toBe(false);
  });
});

describe("isGlobMatch – edge cases", () => {
  it("matches empty strings", () => {
    expect(isGlobMatch("", "")).toBe(true);
  });

  it("allows ** to match empty input", () => {
    expect(isGlobMatch("", "**")).toBe(true);
  });

  it("fails when input is empty but matcher requires segments", () => {
    expect(isGlobMatch("", "*")).toBe(false);
  });

  it("fails when matcher is empty but input is not", () => {
    expect(isGlobMatch("a", "")).toBe(false);
  });
});
