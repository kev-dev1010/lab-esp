import { describe, expect, it } from "vitest";

import {
  getCurrentState,
  getTaskContext,
  routeRequest,
  runContextValidation,
  simulateScenarios
} from "../src/context-docs.js";

const rootDir = process.cwd();
const activeBranch = getCurrentState(rootDir).activeBranch;

describe("context server routes", () => {
  it("retorna saude com a branch informada", () => {
    const response = routeRequest(rootDir, "/health", activeBranch);

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      status: "ok",
      branch: activeBranch
    });
  });

  it("resume o contexto central", () => {
    const response = routeRequest(rootDir, "/context");

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      title: "Contexto Central"
    });
    expect(response.body).toHaveProperty("priorities");
  });

  it("resolve arquivos para o fluxo de feature via task-map", () => {
    const response = routeRequest(rootDir, "/task/feature");

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      taskType: "feature",
      prompt: "prompts/feature.md"
    });
    expect(response.body).toHaveProperty("filesToLoad");
  });

  it("resolve arquivos para o fluxo de bootstrap via task-map", () => {
    const response = routeRequest(rootDir, "/task/bootstrap");

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      taskType: "bootstrap",
      prompt: "prompts/bootstrap.md"
    });
  });

  it("expõe estado atual da sessao", () => {
    const response = routeRequest(rootDir, "/state");
    const state = getCurrentState(rootDir);

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      objective: state.objective,
      activeBranch
    });
  });

  it("retorna validacao com os cenarios simulados", () => {
    const response = routeRequest(rootDir, "/validate", activeBranch);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("validation");
    expect(response.body).toHaveProperty("scenarios");
  });
});

describe("context validation", () => {
  it("mantem cobertura para cenarios operacionais principais", () => {
    expect(getTaskContext(rootDir, "bootstrap")?.filesToLoad).toContain(
      "docs/tasks/session-bootstrap-workflow.md"
    );
    expect(getTaskContext(rootDir, "feature")?.filesToLoad).toContain(
      "prompts/feature.md"
    );
    expect(getTaskContext(rootDir, "bugfix")?.filesToLoad).toContain(
      "prompts/bugfix.md"
    );
    expect(getTaskContext(rootDir, "review")?.filesToLoad).toContain(
      "prompts/pr_review.md"
    );
    expect(getTaskContext(rootDir, "hardware")?.filesToLoad).toContain(
      "docs/knowledge/serial-and-ports.md"
    );
  });

  it("trata bootstrap de nova sessao como fluxo navegavel", () => {
    const scenarios = simulateScenarios(rootDir);
    const bootstrapScenario = scenarios.find(
      (scenario) => scenario.scenario === "nova sessao (bootstrap)"
    );

    expect(bootstrapScenario).toBeDefined();
    expect(bootstrapScenario?.status).toBe("ok");
    expect(bootstrapScenario?.issues).toEqual([]);
  });

  it("mantem a fundacao validada sem lacunas de enforcement conhecidas", () => {
    const validation = runContextValidation(rootDir, activeBranch);

    expect(validation.ok).toBe(true);
    expect(validation.issues).toEqual([]);
  });
});
