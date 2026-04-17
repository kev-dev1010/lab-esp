import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync
} from "node:fs";
import path from "node:path";

import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it
} from "vitest";

import {
  bootstrapAutomation,
  getAutomationStatus,
  getFlowStatePath,
  planAutomationTask
} from "../src/ai-flow.js";

const rootDir = process.cwd();
const flowStatePath = getFlowStatePath(rootDir);
let originalFlowState: string | null = null;

function cleanupFlowState() {
  rmSync(path.join(rootDir, ".ai"), { recursive: true, force: true });
}

function restoreOriginalFlowState() {
  cleanupFlowState();

  if (originalFlowState === null) {
    return;
  }

  mkdirSync(path.dirname(flowStatePath), { recursive: true });
  writeFileSync(flowStatePath, originalFlowState);
}

describe("ai flow enforcement", () => {
  beforeAll(() => {
    originalFlowState = existsSync(flowStatePath)
      ? readFileSync(flowStatePath, "utf8")
      : null;
  });

  beforeEach(() => {
    cleanupFlowState();
  });

  afterEach(() => {
    cleanupFlowState();
  });

  afterAll(() => {
    restoreOriginalFlowState();
  });

  it("exige bootstrap antes de selecionar uma tarefa", () => {
    expect(() =>
      planAutomationTask(rootDir, "feature", "test-context-validation")
    ).toThrow(/Sessao nao bootstrapada/);
  });

  it("persiste bootstrap e roteia a tarefa oficial pelo task-map", () => {
    const bootstrap = bootstrapAutomation(rootDir, "test-context-validation");
    const task = planAutomationTask(
      rootDir,
      "feature",
      "test-context-validation"
    );

    expect(bootstrap.filesToLoad).toContain("docs/session/current-state.md");
    expect(task.prompt).toBe("prompts/feature.md");
    expect(task.filesToLoad).toContain("docs/tasks/feature-workflow.md");
    expect(task.filesToLoad).not.toContain("docs/tasks/hardware-workflow.md");
    expect(existsSync(getFlowStatePath(rootDir))).toBe(true);

    const status = getAutomationStatus(rootDir, "test-context-validation");

    expect(status).toMatchObject({
      status: "task-selected",
      activeTask: "feature"
    });
  });

  it("bloqueia reuso de bootstrap em branch diferente", () => {
    bootstrapAutomation(rootDir, "test-context-validation");

    expect(() =>
      planAutomationTask(rootDir, "feature", "outra-branch")
    ).toThrow(/Rode \.\/scripts\/ai-run bootstrap novamente/);
  });

  it("mantem comandos internos fora da interface publica do entrypoint", () => {
    const aiRun = readFileSync(path.join(rootDir, "scripts/ai-run"), "utf8");
    const aiFlow = readFileSync(path.join(rootDir, "src/ai-flow.ts"), "utf8");

    expect(aiRun).not.toContain(
      "bootstrap|task|dry-run|status|check|assert-ci"
    );
    expect(aiRun).toContain('LAB_ESP_INTERNAL=1 LAB_ESP_BRANCH="$branch"');
    expect(aiFlow).toContain("Comando interno bloqueado");
  });

  it("mantem a esteira tecnica interna protegida pelo gatekeeper", () => {
    const ciCore = readFileSync(path.join(rootDir, "scripts/_ci-core"), "utf8");

    expect(ciCore).toContain('LAB_ESP_GATEKEEPER:-}" = "ai-run-gates"');
    expect(ciCore).toContain(
      'fail "scripts/_ci-core e interno. Use ./scripts/ai-run gates."'
    );
  });
});
