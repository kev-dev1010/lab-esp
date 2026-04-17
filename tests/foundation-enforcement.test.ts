import {
  cpSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync
} from "node:fs";
import os from "node:os";
import path from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";

import { afterEach, describe, expect, it } from "vitest";

import {
  assertReadyForCi,
  bootstrapAutomation,
  getAutomationStatus,
  markCiPassed,
  planAutomationTask
} from "../src/ai-flow.js";
import {
  createRouteHandler,
  getTaskContext,
  routeRequest,
  runContextValidation
} from "../src/context-docs.js";

const sourceRoot = process.cwd();
const fixturePaths = [
  "README.md",
  "AGENTS.md",
  "CONVENTIONS.md",
  "POLICY_AI.md",
  "SECURITY.md",
  "docs",
  "prompts",
  "scripts"
] as const;
const fixtureDirs: string[] = [];

function createFixture(): string {
  const fixtureRoot = mkdtempSync(
    path.join(os.tmpdir(), "lab-esp-foundation-")
  );
  fixtureDirs.push(fixtureRoot);

  for (const relativePath of fixturePaths) {
    cpSync(
      path.join(sourceRoot, relativePath),
      path.join(fixtureRoot, relativePath),
      {
        recursive: true
      }
    );
  }

  return fixtureRoot;
}

function readFixture(rootDir: string, relativePath: string): string {
  return readFileSync(path.join(rootDir, relativePath), "utf8");
}

function writeFixture(rootDir: string, relativePath: string, content: string) {
  writeFileSync(path.join(rootDir, relativePath), content);
}

afterEach(() => {
  while (fixtureDirs.length > 0) {
    const fixtureDir = fixtureDirs.pop();

    if (fixtureDir) {
      rmSync(fixtureDir, { recursive: true, force: true });
    }
  }
});

describe("foundation enforcement validation", () => {
  it("detecta links quebrados sem confundir links externos ou ancora", () => {
    const fixtureRoot = createFixture();
    const docsIndex = readFixture(fixtureRoot, "docs/index.md");

    writeFixture(
      fixtureRoot,
      "docs/index.md",
      `${docsIndex}\n- [Externo](https://example.com)\n- [Ancora](#topo)\n- [Quebrado](./nao-existe.md)\n`
    );

    const validation = runContextValidation(
      fixtureRoot,
      "test-context-validation"
    );
    const details = validation.issues.map((issue) => issue.details).join("\n");

    expect(validation.ok).toBe(false);
    expect(details).toContain("nao-existe.md");
    expect(details).not.toContain("https://example.com");
  });

  it("detecta bootstrap ausente e workflows sem current-state", () => {
    const fixtureRoot = createFixture();
    const taskMap = readFixture(fixtureRoot, "docs/context/task-map.md");
    const bootstrapSection =
      "# Mapa por Tipo de Tarefa\n\nVoltar para o [indice mestre](../index.md).\n\n## Nova sessao (bootstrap)\n\nCarregar:\n\n- [README.md](../../README.md)\n- [core.md](./core.md)\n- [loading-rules.md](./loading-rules.md)\n- [current-state.md](../session/current-state.md)\n- [session-bootstrap-workflow.md](../tasks/session-bootstrap-workflow.md)\n- [prompt de bootstrap](../../prompts/bootstrap.md)\n\n";
    const bootstrapWorkflow = readFixture(
      fixtureRoot,
      "docs/tasks/session-bootstrap-workflow.md"
    );
    const loadingRules = readFixture(
      fixtureRoot,
      "docs/context/loading-rules.md"
    );

    writeFixture(
      fixtureRoot,
      "docs/context/task-map.md",
      taskMap.replace(
        bootstrapSection,
        "# Mapa por Tipo de Tarefa\n\nVoltar para o [indice mestre](../index.md).\n\n"
      )
    );
    writeFixture(
      fixtureRoot,
      "docs/tasks/session-bootstrap-workflow.md",
      bootstrapWorkflow.replace(
        "- [current-state.md](../session/current-state.md)\n",
        ""
      )
    );
    writeFixture(
      fixtureRoot,
      "docs/context/loading-rules.md",
      loadingRules.replace("- [README.md](../../README.md)\n", "")
    );

    const validation = runContextValidation(
      fixtureRoot,
      "test-context-validation"
    );
    const details = validation.issues.map((issue) => issue.details).join("\n");

    expect(validation.ok).toBe(false);
    expect(getTaskContext(fixtureRoot, "bootstrap")).toBeNull();
    expect(details).toContain("Nova sessao (bootstrap)");
    expect(details).toContain("session-bootstrap-workflow.md nao referencia");
    expect(details).toContain("README.md e exigido no bootstrap manual atual");
  });

  it("detecta regressao para placeholders na camada de enforcement", () => {
    const fixtureRoot = createFixture();

    writeFixture(
      fixtureRoot,
      "docs/knowledge/commands.md",
      "# Comandos\n\n- `./scripts/ci`\n"
    );
    writeFixture(
      fixtureRoot,
      "POLICY_AI.md",
      "# Politica\n\n- modo atual: `assistido`\n"
    );
    writeFixture(
      fixtureRoot,
      "scripts/ai-run",
      '#!/usr/bin/env bash\nplaceholder "todo"\n'
    );
    writeFixture(
      fixtureRoot,
      "scripts/ai-dry-run",
      '#!/usr/bin/env bash\nplaceholder "todo"\n'
    );
    writeFixture(
      fixtureRoot,
      "scripts/ai-jail-enable",
      '#!/usr/bin/env bash\nplaceholder "todo"\n'
    );
    writeFixture(
      fixtureRoot,
      "scripts/ci",
      "#!/usr/bin/env bash\nset -euo pipefail\n./scripts/test\n"
    );

    const validation = runContextValidation(
      fixtureRoot,
      "test-context-validation"
    );
    const causes = validation.issues.map((issue) => issue.cause);

    expect(validation.ok).toBe(false);
    expect(causes).toContain(
      "entrypoint oficial de bootstrap nao esta documentado"
    );
    expect(causes).toContain(
      "roteamento oficial por tipo de tarefa nao esta documentado"
    );
    expect(causes).toContain("gate local de contexto nao esta documentado");
    expect(causes).toContain(
      "politica de IA nao obriga o entrypoint unico de automacao"
    );
    expect(causes).toContain(
      "entrypoint oficial de automacao ainda esta placeholder"
    );
    expect(causes).toContain(
      "dry-run oficial de automacao ainda esta placeholder"
    );
    expect(causes).toContain("habilitacao de sandbox ainda esta placeholder");
    expect(causes).toContain(
      "CI local nao passa pelo entrypoint oficial de gates"
    );
  });

  it("detecta current-state vazio e branch divergente", () => {
    const fixtureRoot = createFixture();

    writeFixture(
      fixtureRoot,
      "docs/session/current-state.md",
      `# Estado Atual da Sessao

## Objetivo atual

Objetivo minimo.

## Branch ativa

- \`outra-branch\`

## Onde estamos agora

## O que carregar na proxima sessao

- [README.md](../../README.md)

## O que nao carregar por padrao

- [logbook/](../logbook/README.md)

## Proximos passos provaveis
`
    );

    const validation = runContextValidation(
      fixtureRoot,
      "test-context-validation"
    );
    const causes = validation.issues.map((issue) => issue.cause);

    expect(validation.ok).toBe(false);
    expect(causes).toContain("estado atual pouco preenchido");
    expect(causes).toContain(
      "branch registrada no estado atual diverge da branch real"
    );
  });
});

describe("foundation enforcement runtime", () => {
  it("retorna status de sessao nao bootstrapada e usa branch do ambiente", () => {
    const fixtureRoot = createFixture();
    process.env.LAB_ESP_BRANCH = "branch-do-ambiente";

    const status = getAutomationStatus(fixtureRoot);

    expect(status).toMatchObject({
      branch: "branch-do-ambiente",
      status: "not_bootstrapped",
      nextStep: "./scripts/ai-run bootstrap"
    });

    delete process.env.LAB_ESP_BRANCH;
  });

  it("exige tarefa selecionada antes dos gates finais e registra validacao depois", () => {
    const fixtureRoot = createFixture();

    bootstrapAutomation(fixtureRoot, "test-context-validation");

    expect(() =>
      assertReadyForCi(fixtureRoot, "test-context-validation")
    ).toThrow(/Nenhuma tarefa foi selecionada/);
    expect(() => markCiPassed(fixtureRoot, "test-context-validation")).toThrow(
      /Nao ha tarefa ativa/
    );

    planAutomationTask(fixtureRoot, "feature", "test-context-validation");

    expect(
      assertReadyForCi(fixtureRoot, "test-context-validation")
    ).toMatchObject({
      activeTask: "feature",
      gateCommand: "./scripts/ai-run gates"
    });
    expect(markCiPassed(fixtureRoot, "test-context-validation")).toMatchObject({
      status: "validated",
      activeTask: "feature"
    });
  });

  it("falha para tipo de tarefa invalido e para bootstrap com contexto quebrado", () => {
    const fixtureRoot = createFixture();
    const brokenTaskMap = readFixture(
      fixtureRoot,
      "docs/context/task-map.md"
    ).replace("## Nova sessao (bootstrap)", "## Bootstrap removido");

    bootstrapAutomation(fixtureRoot, "test-context-validation");

    expect(() =>
      planAutomationTask(
        fixtureRoot,
        "tarefa-invalida" as Exclude<
          Parameters<typeof planAutomationTask>[1],
          never
        >,
        "test-context-validation"
      )
    ).toThrow(/Task-map nao roteia o tipo de tarefa/);

    writeFixture(fixtureRoot, "docs/context/task-map.md", brokenTaskMap);

    expect(() =>
      bootstrapAutomation(fixtureRoot, "test-context-validation")
    ).toThrow(/Fluxo bloqueado por inconsistencias de fundacao/);
  });

  it("responde 404 para task desconhecida e serializa JSON pelo route handler", () => {
    const fixtureRoot = createFixture();
    const handler = createRouteHandler(fixtureRoot, "test-context-validation");
    const headers = new Map<string, string>();
    let body = "";
    const response = routeRequest(
      fixtureRoot,
      "/task/tarefa-inexistente",
      "test-context-validation"
    );
    const notFound = routeRequest(
      fixtureRoot,
      "/nao-existe",
      "test-context-validation"
    );
    const req = { url: "/health" } as IncomingMessage;
    const res = {
      statusCode: 0,
      setHeader(name: string, value: string) {
        headers.set(name, value);
      },
      end(value: string) {
        body = value;
      }
    } as unknown as ServerResponse;

    handler(req, res);

    expect(response.statusCode).toBe(404);
    expect(response.body).toMatchObject({
      error: "task_not_found",
      taskType: "tarefa-inexistente"
    });
    expect(notFound).toMatchObject({
      statusCode: 404,
      body: {
        error: "not_found"
      }
    });
    expect(headers.get("content-type")).toBe("application/json; charset=utf-8");
    expect(JSON.parse(body)).toMatchObject({
      status: "ok",
      branch: "test-context-validation"
    });
  });
});
