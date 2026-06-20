import { describe, expect, it } from "vitest";
import { generateLabReport, runScenario, SCENARIOS, simulateAttack } from "./scenarios";

describe("prompt-injection-lab", () => {
  it("has 5 scenarios", () => expect(SCENARIOS).toHaveLength(5));
  it("runs email scenario", () => expect(runScenario("email-crm")?.succeeded).toBe(true));
  it("runs mcp poisoning", () => expect(runScenario("mcp-poison")?.vector).toBe("mcp_tool"));
  it("simulates attack trace", () => {
    const r = simulateAttack(SCENARIOS[0]);
    expect(r.trace.length).toBeGreaterThan(3);
  });
  it("generates lab report", () => {
    const md = generateLabReport(SCENARIOS[0]);
    expect(md).toContain("Root Causes");
    expect(md).toContain("Mitigations");
  });
  it("all scenarios have mitigations", () => {
    expect(SCENARIOS.every((s) => s.mitigations.length > 0)).toBe(true);
  });
  it("github scenario has shell vector", () => {
    expect(runScenario("github-shell")?.tools).toContain("run_terminal");
  });
  it("memory scenario lists audit trail cause", () => {
    expect(runScenario("memory-poison")?.rootCauses.some((c) => c.includes("audit"))).toBe(true);
  });
});