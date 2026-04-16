import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const rootDir = process.cwd();

function readProjectFile(relativePath: string): string {
  return readFileSync(path.join(rootDir, relativePath), "utf8");
}

function listMarkdownFiles(relativeDir: string): string[] {
  const absoluteDir = path.join(rootDir, relativeDir);
  const entries = readdirSync(absoluteDir);

  return entries
    .filter((entry) => statSync(path.join(absoluteDir, entry)).isFile())
    .filter((entry) => entry.endsWith(".md"))
    .sort();
}

describe("documentacao de contexto", () => {
  it("inclui todos os prompts markdown no indice mestre", () => {
    const indexContent = readProjectFile("docs/index.md");
    const promptFiles = listMarkdownFiles("prompts");

    for (const promptFile of promptFiles) {
      expect(indexContent).toContain(`../prompts/${promptFile}`);
    }
  });

  it("mantem todos os cenarios principais roteados no task-map", () => {
    const taskMap = readProjectFile("docs/context/task-map.md");

    expect(taskMap).toContain("## Implementar feature");
    expect(taskMap).toContain("## Corrigir bug");
    expect(taskMap).toContain("## Revisar mudanca");
    expect(taskMap).toContain("## Revisar seguranca");
    expect(taskMap).toContain("## Trabalhar com ESP32, serial ou sensores");
    expect(taskMap).toContain("## Fazer release, deploy ou rollback");

    expect(taskMap).toContain("../tasks/feature-workflow.md");
    expect(taskMap).toContain("../tasks/bugfix-workflow.md");
    expect(taskMap).toContain("../tasks/review-workflow.md");
    expect(taskMap).toContain("../tasks/security-workflow.md");
    expect(taskMap).toContain("../tasks/hardware-workflow.md");
    expect(taskMap).toContain("../tasks/release-workflow.md");
  });

  it("separa explicitamente estado vivo da sessao de historico puro", () => {
    const loadingRules = readProjectFile("docs/context/loading-rules.md");
    const sessionReadme = readProjectFile("docs/session/README.md");
    const currentState = readProjectFile("docs/session/current-state.md");
    const logbookReadme = readProjectFile("docs/logbook/README.md");

    expect(loadingRules).toContain("../session/current-state.md");
    expect(loadingRules).toContain("../logbook/README.md");
    expect(loadingRules).toContain("Nao carregar por padrao");

    expect(sessionReadme).toContain("sessao atual: onde estamos agora");
    expect(sessionReadme).toContain("logbook: tudo que aconteceu no passado");

    expect(currentState).toContain("## Onde estamos agora");
    expect(currentState).toContain("## O que carregar na proxima sessao");
    expect(currentState).toContain("## O que nao carregar por padrao");

    expect(logbookReadme).toContain("nao deve ser carregado por padrao");
  });

  it("liga cada workflow ao contexto da sessao atual e ao prompt correto quando aplicavel", () => {
    const featureWorkflow = readProjectFile("docs/tasks/feature-workflow.md");
    const bugfixWorkflow = readProjectFile("docs/tasks/bugfix-workflow.md");
    const reviewWorkflow = readProjectFile("docs/tasks/review-workflow.md");
    const securityWorkflow = readProjectFile("docs/tasks/security-workflow.md");
    const releaseWorkflow = readProjectFile("docs/tasks/release-workflow.md");
    const hardwareWorkflow = readProjectFile("docs/tasks/hardware-workflow.md");

    expect(featureWorkflow).toContain("../session/current-state.md");
    expect(featureWorkflow).toContain("../../prompts/feature.md");

    expect(bugfixWorkflow).toContain("../session/current-state.md");
    expect(bugfixWorkflow).toContain("../../prompts/bugfix.md");

    expect(reviewWorkflow).toContain("../session/current-state.md");
    expect(reviewWorkflow).toContain("../../prompts/pr_review.md");

    expect(securityWorkflow).toContain("../session/current-state.md");
    expect(securityWorkflow).toContain("../../prompts/security_review.md");

    expect(releaseWorkflow).toContain("../session/current-state.md");
    expect(releaseWorkflow).toContain("../../prompts/release_notes.md");

    expect(hardwareWorkflow).toContain("../session/current-state.md");
    expect(hardwareWorkflow).toContain("../knowledge/serial-and-ports.md");
  });

  it("expõe os pontos de entrada corretos para novas sessoes", () => {
    const rootReadme = readProjectFile("README.md");
    const agents = readProjectFile("AGENTS.md");
    const docsReadme = readProjectFile("docs/README.md");
    const docsIndex = readProjectFile("docs/index.md");

    expect(rootReadme).toContain("docs/index.md");

    expect(agents).toContain("docs/context/core.md");
    expect(agents).toContain("docs/context/loading-rules.md");
    expect(agents).toContain("docs/context/task-map.md");
    expect(agents).toContain("docs/session/current-state.md");

    expect(docsReadme).toContain("index.md");
    expect(docsReadme).toContain("guia-nao-tecnico.md");
    expect(docsReadme).toContain("o-que-a-base-ja-faz.md");
    expect(docsIndex).toContain("./guia-nao-tecnico.md");
    expect(docsIndex).toContain("./o-que-a-base-ja-faz.md");
    expect(docsIndex).toContain("./session/current-state.md");
    expect(docsIndex).toContain("./logbook/README.md");
  });
});
