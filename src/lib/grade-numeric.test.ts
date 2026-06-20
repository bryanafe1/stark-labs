import { describe, it, expect } from "vitest";
import {
  gradeNumeric,
  parseNumber,
  normalizeUnit,
  unitsMatch,
  DEFAULT_REL_TOL,
} from "./grade-numeric";

describe("parseNumber", () => {
  it("parses plain decimals and integers", () => {
    expect(parseNumber("42")).toBe(42);
    expect(parseNumber("-3.5")).toBe(-3.5);
    expect(parseNumber(7)).toBe(7);
  });

  it("parses scientific notation", () => {
    expect(parseNumber("1.2e-3")).toBeCloseTo(0.0012, 12);
    expect(parseNumber("6.022E23")).toBeCloseTo(6.022e23, -10);
  });

  it("parses a × 10^b style input", () => {
    expect(parseNumber("1.2 x 10^-3")).toBeCloseTo(0.0012, 12);
    expect(parseNumber("3*10^8")).toBe(3e8);
    expect(parseNumber("9.81·10^0")).toBeCloseTo(9.81, 12);
  });

  it("strips thousands separators", () => {
    expect(parseNumber("1,000")).toBe(1000);
    expect(parseNumber("1,234,567.5")).toBe(1234567.5);
  });

  it("returns null for non-numbers", () => {
    expect(parseNumber("abc")).toBeNull();
    expect(parseNumber("")).toBeNull();
    expect(parseNumber("   ")).toBeNull();
  });
});

describe("normalizeUnit / unitsMatch", () => {
  it("normalises whitespace and multiplication dots", () => {
    expect(normalizeUnit("N · m")).toBe("N·m");
    expect(normalizeUnit("N*m")).toBe("N·m");
    expect(normalizeUnit("  m/s ")).toBe("m/s");
  });

  it("maps common synonyms", () => {
    expect(normalizeUnit("ohm")).toBe("Ω");
    expect(normalizeUnit("deg")).toBe("°");
  });

  it("matches when the user supplies no unit", () => {
    expect(unitsMatch("m/s", null)).toBe(true);
    expect(unitsMatch("m/s", "")).toBe(true);
  });

  it("matches equivalent units and rejects mismatches", () => {
    expect(unitsMatch("N·m", "N*m")).toBe(true);
    expect(unitsMatch("m/s", "km/s")).toBe(false);
    expect(unitsMatch("Pa", "kPa")).toBe(false);
  });
});

describe("gradeNumeric — tolerance", () => {
  it("uses 1% relative tolerance by default", () => {
    expect(DEFAULT_REL_TOL).toBe(1e-2);
    expect(gradeNumeric({ submitted: 100.5, expected: 100 }).correct).toBe(true); // within 1%
    expect(gradeNumeric({ submitted: 102, expected: 100 }).correct).toBe(false); // outside 1%
  });

  it("scales the band with the magnitude of expected", () => {
    // expected 1e6, default 1% band = 1e4
    expect(gradeNumeric({ submitted: 1.005e6, expected: 1e6 }).correct).toBe(true);
    expect(gradeNumeric({ submitted: 1.02e6, expected: 1e6 }).correct).toBe(false);
  });

  it("honours an explicit absolute tolerance (important near zero)", () => {
    // expected 0 → relative band is 0, so abs must carry it
    expect(gradeNumeric({ submitted: 0.005, expected: 0, tolerance: { abs: 0.01 } }).correct).toBe(true);
    expect(gradeNumeric({ submitted: 0.02, expected: 0, tolerance: { abs: 0.01 } }).correct).toBe(false);
  });

  it("honours a tighter relative tolerance override", () => {
    expect(gradeNumeric({ submitted: 100.5, expected: 100, tolerance: { rel: 1e-3 } }).correct).toBe(false);
  });

  it("reports the band that was applied", () => {
    const r = gradeNumeric({ submitted: 50, expected: 100, tolerance: { rel: 0.05 } });
    expect(r.allowed).toBeCloseTo(5, 9);
    expect(r.delta).toBe(50);
    expect(r.correct).toBe(false);
  });
});

describe("gradeNumeric — scientific notation input", () => {
  it("grades sci-notation strings against numeric expected", () => {
    expect(gradeNumeric({ submitted: "1.005e6", expected: 1e6 }).correct).toBe(true);
    expect(gradeNumeric({ submitted: "1.2 x 10^-3", expected: 0.0012 }).correct).toBe(true);
  });

  it("fails gracefully on unparseable input", () => {
    const r = gradeNumeric({ submitted: "not a number", expected: 5 });
    expect(r.correct).toBe(false);
    expect(Number.isNaN(r.delta)).toBe(true);
    expect(r.reason).toMatch(/could not read a number/i);
  });
});

describe("gradeNumeric — units", () => {
  it("passes when magnitude is right and no unit supplied", () => {
    expect(gradeNumeric({ submitted: 9.81, expected: 9.81, expectedUnit: "m/s²" }).correct).toBe(true);
  });

  it("passes when magnitude and supplied unit both match", () => {
    expect(
      gradeNumeric({ submitted: 9.81, expected: 9.81, expectedUnit: "m/s²", submittedUnit: "m/s²" }).correct,
    ).toBe(true);
  });

  it("fails when the supplied unit is wrong even if magnitude is right", () => {
    const r = gradeNumeric({ submitted: 9.81, expected: 9.81, expectedUnit: "m/s²", submittedUnit: "km/s²" });
    expect(r.correct).toBe(false);
    expect(r.unitMatch).toBe(false);
    expect(r.reason).toMatch(/unit/i);
  });

  it("handles negatives", () => {
    expect(gradeNumeric({ submitted: -40, expected: -40 }).correct).toBe(true);
    expect(gradeNumeric({ submitted: -40, expected: 40 }).correct).toBe(false);
  });
});
