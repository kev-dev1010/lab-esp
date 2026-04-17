import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import {
  createServer,
  type IncomingMessage,
  type ServerResponse
} from "node:http";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const ROOT_CONTEXT_FILES = [
  "README.md",
  "AGENTS.md",
  "CONVENTIONS.md",
  "POLICY_AI.md",
  "docs/context/core.md",
  "docs/context/loading-rules.md",
  "docs/context/task-map.md",
  "docs/session/current-state.md"
] as const;

export const TASK_TYPE_TO_SECTION = {
  bootstrap: "Nova sessao (bootstrap)",
  feature: "Implementar feature",
  bugfix: "Corrigir bug",
  review: "Revisar mudanca",
  security: "Revisar seguranca",
  hardware: "Trabalhar com ESP32, serial ou sensores",
  release: "Fazer release, deploy ou rollback"
} as const;

const SCENARIO_TO_TASK_TYPE = {
  "nova sessao (bootstrap)": "bootstrap",
  "criacao de feature": "feature",
  "correcao de bug": "bugfix",
  "revisao de pr": "review",
  "trabalho com hardware/esp32": "hardware"
} as const;

export type TaskType = keyof typeof TASK_TYPE_TO_SECTION;
type ScenarioName = keyof typeof SCENARIO_TO_TASK_TYPE;
export const SUPPORTED_TASK_TYPES = Object.keys(
  TASK_TYPE_TO_SECTION
) as TaskType[];

export type ValidationIssue = {
  type: "contexto" | "estrutura" | "docs" | "fluxo" | "codigo" | "verificacao";
  impact: "baixo" | "medio" | "alto";
  cause: string;
  suggestion: string;
  details: string;
};

export type ScenarioCheck = {
  scenario: ScenarioName;
  status: "ok" | "warning";
  loadedFiles: string[];
  issues: string[];
};

type RouteResponse = {
  statusCode: number;
  body: unknown;
};

function readProjectFile(rootDir: string, relativePath: string): string {
  return readFileSync(path.join(rootDir, relativePath), "utf8");
}

function listMarkdownFiles(rootDir: string, relativeDir: string): string[] {
  const absoluteDir = path.join(rootDir, relativeDir);

  return readdirSync(absoluteDir)
    .filter((entry) => statSync(path.join(absoluteDir, entry)).isFile())
    .filter((entry) => entry.endsWith(".md"))
    .sort()
    .map((entry) => path.posix.join(relativeDir, entry));
}

function stripMarkdown(value: string): string {
  return value
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^#+\s+/gm, "")
    .trim();
}

function getLevelTwoSections(markdown: string): Map<string, string> {
  const lines = markdown.split("\n");
  const sections = new Map<string, string>();
  let currentHeading: string | null = null;
  let buffer: string[] = [];

  for (const line of lines) {
    const headingMatch = /^##\s+(.+)$/.exec(line.trim());

    if (headingMatch) {
      if (currentHeading !== null) {
        sections.set(currentHeading, buffer.join("\n").trim());
      }

      currentHeading = headingMatch[1];
      buffer = [];
      continue;
    }

    if (currentHeading !== null) {
      buffer.push(line);
    }
  }

  if (currentHeading !== null) {
    sections.set(currentHeading, buffer.join("\n").trim());
  }

  return sections;
}

function extractLinks(
  markdown: string
): Array<{ label: string; target: string }> {
  const matches = markdown.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g);

  return Array.from(matches, (match) => ({
    label: match[1],
    target: match[2]
  }));
}

function extractTaskLoadLinks(
  sectionContent: string
): Array<{ label: string; target: string }> {
  const lines = sectionContent.split("\n");
  const loadBlock: string[] = [];
  let insideLoadBlock = false;

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!insideLoadBlock) {
      if (trimmedLine === "Carregar:") {
        insideLoadBlock = true;
      }

      continue;
    }

    if (trimmedLine.startsWith("- ")) {
      loadBlock.push(trimmedLine);
      continue;
    }

    if (trimmedLine === "") {
      continue;
    }

    break;
  }

  return extractLinks(loadBlock.join("\n"));
}

function normalizeRelativePath(relativePath: string): string {
  return relativePath.split(path.sep).join(path.posix.sep);
}

function resolveLinkTarget(sourceFile: string, target: string): string | null {
  if (target.startsWith("http://") || target.startsWith("https://")) {
    return null;
  }

  const [pathWithoutAnchor] = target.split("#");

  if (!pathWithoutAnchor || pathWithoutAnchor === "") {
    return null;
  }

  return normalizeRelativePath(
    path.relative(
      ".",
      path.resolve(path.dirname(sourceFile), pathWithoutAnchor)
    )
  );
}

function bulletLines(sectionContent: string): string[] {
  return sectionContent
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => stripMarkdown(line.slice(2)));
}

function uniquePaths(paths: string[]): string[] {
  return Array.from(new Set(paths));
}

export function getCoreSummary(rootDir: string) {
  const coreContent = readProjectFile(rootDir, "docs/context/core.md");
  const sections = getLevelTwoSections(coreContent);

  return {
    title: stripMarkdown(coreContent.split("\n")[0] ?? "Contexto Central"),
    summary: stripMarkdown(sections.get("O que este projeto e") ?? ""),
    alwaysClear: bulletLines(
      sections.get("O que sempre precisa estar claro") ?? ""
    ),
    stack: bulletLines(sections.get("Stack atual") ?? ""),
    limits: bulletLines(sections.get("Limites desta fase") ?? ""),
    priorities: bulletLines(sections.get("Areas tecnicas prioritarias") ?? ""),
    minimumSessionContext: bulletLines(
      sections.get("Contexto minimo para novas sessoes") ?? ""
    )
  };
}

export function getCurrentState(rootDir: string) {
  const stateContent = readProjectFile(
    rootDir,
    "docs/session/current-state.md"
  );
  const sections = getLevelTwoSections(stateContent);

  return {
    objective: stripMarkdown(sections.get("Objetivo atual") ?? ""),
    activeBranch: bulletLines(sections.get("Branch ativa") ?? "")[0] ?? "",
    whereWeAre: bulletLines(sections.get("Onde estamos agora") ?? ""),
    nextSessionLoad: bulletLines(
      sections.get("O que carregar na proxima sessao") ?? ""
    ),
    notDefault: bulletLines(
      sections.get("O que nao carregar por padrao") ?? ""
    ),
    nextSteps: bulletLines(sections.get("Proximos passos provaveis") ?? ""),
    raw: stateContent
  };
}

export function getTaskContext(rootDir: string, taskType: string) {
  if (!(taskType in TASK_TYPE_TO_SECTION)) {
    return null;
  }

  const typedTask = taskType as TaskType;
  const taskMap = readProjectFile(rootDir, "docs/context/task-map.md");
  const sections = getLevelTwoSections(taskMap);
  const sectionTitle = TASK_TYPE_TO_SECTION[typedTask];
  const sectionContent = sections.get(sectionTitle);

  if (!sectionContent) {
    return null;
  }

  const links = extractTaskLoadLinks(sectionContent);
  const loadFiles = links.map((link) =>
    resolveLinkTarget("docs/context/task-map.md", link.target)
  );

  return {
    taskType: typedTask,
    sectionTitle,
    prompt: loadFiles.find((entry) => entry?.startsWith("prompts/")) ?? null,
    filesToLoad: loadFiles.filter((entry): entry is string => Boolean(entry)),
    rawLinks: links
  };
}

function validateLinks(rootDir: string, filePath: string): ValidationIssue[] {
  const content = readProjectFile(rootDir, filePath);
  const issues: ValidationIssue[] = [];

  for (const link of extractLinks(content)) {
    const resolved = resolveLinkTarget(filePath, link.target);

    if (!resolved) {
      continue;
    }

    if (!existsSync(path.join(rootDir, resolved))) {
      issues.push({
        type: "estrutura",
        impact: "alto",
        cause: "link quebrado em markdown",
        suggestion:
          "Corrigir o caminho referenciado ou criar o arquivo esperado.",
        details: `${filePath} -> ${link.target} resolve para ${resolved}, mas o arquivo nao existe.`
      });
    }
  }

  return issues;
}

function validateRequiredTaskCoverage(rootDir: string): ValidationIssue[] {
  const taskMap = readProjectFile(rootDir, "docs/context/task-map.md");
  const issues: ValidationIssue[] = [];

  for (const sectionTitle of Object.values(TASK_TYPE_TO_SECTION)) {
    if (!taskMap.includes(`## ${sectionTitle}`)) {
      issues.push({
        type: "fluxo",
        impact: "alto",
        cause: "cenario principal sem secao no task-map",
        suggestion: "Adicionar a secao faltante no task-map.md.",
        details: `Falta a secao '${sectionTitle}' em docs/context/task-map.md.`
      });
    }
  }

  return issues;
}

function validateWorkflowContracts(rootDir: string): ValidationIssue[] {
  const workflowFiles = listMarkdownFiles(rootDir, "docs/tasks");
  const issues: ValidationIssue[] = [];

  for (const workflowFile of workflowFiles) {
    const workflowContent = readProjectFile(rootDir, workflowFile);

    if (!workflowContent.includes("../session/current-state.md")) {
      issues.push({
        type: "contexto",
        impact: "alto",
        cause: "workflow sem referencia ao estado atual",
        suggestion:
          "Adicionar docs/session/current-state.md ao carregamento minimo do fluxo.",
        details: `${workflowFile} nao referencia ../session/current-state.md.`
      });
    }

    issues.push(...validateLinks(rootDir, workflowFile));
  }

  const loadingRules = readProjectFile(
    rootDir,
    "docs/context/loading-rules.md"
  );
  if (
    !loadingRules.includes("../../README.md") &&
    !loadingRules.includes("../README.md")
  ) {
    issues.push({
      type: "contexto",
      impact: "medio",
      cause: "regras de carregamento nao incluem README.md no conjunto base",
      suggestion:
        "Decidir explicitamente se README.md faz parte do bootstrap minimo e refletir isso em loading-rules.md.",
      details:
        "README.md e exigido no bootstrap manual atual, mas nao aparece em docs/context/loading-rules.md."
    });
  }

  return issues;
}

function validateCurrentState(
  rootDir: string,
  currentBranch?: string
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const state = getCurrentState(rootDir);

  if (state.whereWeAre.length === 0 || state.nextSteps.length === 0) {
    issues.push({
      type: "docs",
      impact: "medio",
      cause: "estado atual pouco preenchido",
      suggestion:
        "Preencher current-state.md com andamento, pendencias e proximo passo concreto.",
      details:
        "docs/session/current-state.md nao tem informacao suficiente para orientar a proxima sessao."
    });
  }

  if (
    currentBranch &&
    state.activeBranch &&
    state.activeBranch !== currentBranch
  ) {
    issues.push({
      type: "docs",
      impact: "medio",
      cause: "branch registrada no estado atual diverge da branch real",
      suggestion:
        "Atualizar current-state.md quando a branch de trabalho mudar de forma relevante.",
      details: `current-state.md registra '${state.activeBranch}', mas a branch atual e '${currentBranch}'.`
    });
  }

  return issues;
}

function validateFoundationEnforcement(rootDir: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const commands = readProjectFile(rootDir, "docs/knowledge/commands.md");
  const policy = readProjectFile(rootDir, "POLICY_AI.md");
  const aiRun = readProjectFile(rootDir, "scripts/ai-run");
  const aiDryRun = readProjectFile(rootDir, "scripts/ai-dry-run");
  const aiJailEnable = readProjectFile(rootDir, "scripts/ai-jail-enable");
  const ci = readProjectFile(rootDir, "scripts/ci");
  const ciCore = readProjectFile(rootDir, "scripts/_ci-core");
  const aiModes = readProjectFile(
    rootDir,
    "docs/knowledge/ai-operation-modes.md"
  );
  const localMachine = readProjectFile(
    rootDir,
    "docs/knowledge/local-machine-contract.md"
  );

  if (!commands.includes("./scripts/ai-run bootstrap")) {
    issues.push({
      type: "docs",
      impact: "alto",
      cause: "entrypoint oficial de bootstrap nao esta documentado",
      suggestion:
        "Registrar ./scripts/ai-run bootstrap em docs/knowledge/commands.md.",
      details:
        "A fundacao pede bootstrap explicito, mas o comando oficial nao aparece em docs/knowledge/commands.md."
    });
  }

  if (!commands.includes("./scripts/ai-run task <tipo>")) {
    issues.push({
      type: "docs",
      impact: "alto",
      cause: "roteamento oficial por tipo de tarefa nao esta documentado",
      suggestion:
        "Registrar ./scripts/ai-run task <tipo> como comando oficial do fluxo.",
      details:
        "A base precisa obrigar o uso de task-map, mas docs/knowledge/commands.md ainda nao explicita esse comando."
    });
  }

  if (!commands.includes("npm run context:check")) {
    issues.push({
      type: "docs",
      impact: "alto",
      cause: "gate local de contexto nao esta documentado",
      suggestion:
        "Registrar npm run context:check como parte do fluxo oficial.",
      details:
        "A fundacao exige contexto validado localmente, mas docs/knowledge/commands.md nao expõe esse gate."
    });
  }

  if (!policy.includes("`./scripts/ai-run`")) {
    issues.push({
      type: "contexto",
      impact: "alto",
      cause: "politica de IA nao obriga o entrypoint unico de automacao",
      suggestion:
        "Declarar em POLICY_AI.md que a automacao deve passar por ./scripts/ai-run.",
      details:
        "POLICY_AI.md ainda nao trata ./scripts/ai-run como gatekeeper oficial."
    });
  }

  if (aiRun.includes('placeholder "')) {
    issues.push({
      type: "fluxo",
      impact: "alto",
      cause: "entrypoint oficial de automacao ainda esta placeholder",
      suggestion:
        "Implementar scripts/ai-run como comando real de bootstrap, selecao de tarefa e gates.",
      details:
        "scripts/ai-run ainda contem placeholders e nao consegue forcar o fluxo."
    });
  }

  if (aiDryRun.includes('placeholder "')) {
    issues.push({
      type: "fluxo",
      impact: "medio",
      cause: "dry-run oficial de automacao ainda esta placeholder",
      suggestion:
        "Fazer scripts/ai-dry-run reutilizar o mesmo fluxo de enforcement de scripts/ai-run.",
      details: "scripts/ai-dry-run ainda contem placeholders."
    });
  }

  if (aiJailEnable.includes('placeholder "')) {
    issues.push({
      type: "fluxo",
      impact: "medio",
      cause: "habilitacao de sandbox ainda esta placeholder",
      suggestion:
        "Implementar scripts/ai-jail-enable com validacoes minimas de configuracao.",
      details: "scripts/ai-jail-enable ainda contem placeholders."
    });
  }

  if (aiRun.includes("assert-ci|mark-ci-passed")) {
    issues.push({
      type: "fluxo",
      impact: "alto",
      cause: "entrypoint oficial expõe comandos internos de gate",
      suggestion:
        "Remover assert-ci e mark-ci-passed da interface publica de scripts/ai-run.",
      details:
        "scripts/ai-run ainda torna comandos internos acessiveis diretamente, abrindo bypass do gate oficial."
    });
  }

  if (!ci.includes('"$(dirname "$0")/ai-run" gates')) {
    issues.push({
      type: "verificacao",
      impact: "alto",
      cause: "CI local nao passa pelo entrypoint oficial de gates",
      suggestion:
        "Fazer scripts/ci delegar para ./scripts/ai-run gates em vez de executar a esteira diretamente.",
      details:
        "scripts/ci precisa obrigar a passagem pelo gate oficial de automacao antes da validacao final."
    });
  }

  if (!ciCore.includes("context:check")) {
    issues.push({
      type: "verificacao",
      impact: "alto",
      cause:
        "esteira local interna nao valida contexto antes dos gates de codigo",
      suggestion:
        "Executar npm run context:check dentro de scripts/_ci-core antes das outras etapas.",
      details:
        "scripts/_ci-core ainda nao falha cedo quando o fluxo de contexto esta incoerente."
    });
  }

  if (!ciCore.includes('LAB_ESP_GATEKEEPER:-}" = "ai-run-gates"')) {
    issues.push({
      type: "verificacao",
      impact: "alto",
      cause:
        "esteira local interna ainda pode ser chamada fora do gate oficial",
      suggestion:
        "Fazer scripts/_ci-core falhar quando nao for chamado por ./scripts/ai-run gates.",
      details:
        "scripts/_ci-core ainda permite bypass do gate oficial se for executado diretamente."
    });
  }

  if (!aiModes.includes("Docker nao e obrigatorio por padrao")) {
    issues.push({
      type: "docs",
      impact: "medio",
      cause:
        "documentacao ainda nao explicita o papel opcional de Docker e sandbox",
      suggestion:
        "Registrar de forma direta que Docker e sandbox sao opcionais e dependem da necessidade do projeto.",
      details:
        "docs/knowledge/ai-operation-modes.md ainda nao deixa claro que o modo assistido nao exige Docker ou sandbox por padrao."
    });
  }

  if (!localMachine.includes("Uma maquina esta no contrato")) {
    issues.push({
      type: "docs",
      impact: "medio",
      cause:
        "contrato da maquina local ainda nao esta explicitado em documento proprio",
      suggestion:
        "Documentar claramente o que significa estar com a maquina no contrato do projeto.",
      details:
        "docs/knowledge/local-machine-contract.md ainda nao define o contrato operacional da maquina local."
    });
  }

  return issues;
}

export function runContextValidation(rootDir: string, currentBranch?: string) {
  const issues = [
    ...validateLinks(rootDir, "docs/index.md"),
    ...validateLinks(rootDir, "docs/context/task-map.md"),
    ...validateLinks(rootDir, "docs/context/loading-rules.md"),
    ...validateRequiredTaskCoverage(rootDir),
    ...validateWorkflowContracts(rootDir),
    ...validateCurrentState(rootDir, currentBranch),
    ...validateFoundationEnforcement(rootDir)
  ];

  return {
    ok: issues.length === 0,
    issues
  };
}

export function simulateScenarios(rootDir: string): ScenarioCheck[] {
  const scenarios: ScenarioCheck[] = [];

  for (const [scenario, taskType] of Object.entries(SCENARIO_TO_TASK_TYPE)) {
    const taskContext = getTaskContext(rootDir, taskType);

    scenarios.push({
      scenario: scenario as keyof typeof SCENARIO_TO_TASK_TYPE,
      status: taskContext ? "ok" : "warning",
      loadedFiles: taskContext?.filesToLoad ?? [],
      issues: taskContext
        ? []
        : [`Task-map nao roteia o cenario '${scenario}'.`]
    });
  }

  const loadingRules = readProjectFile(
    rootDir,
    "docs/context/loading-rules.md"
  );
  const loadingRuleTargets = extractLinks(loadingRules)
    .map((link) =>
      resolveLinkTarget("docs/context/loading-rules.md", link.target)
    )
    .filter((target): target is string => Boolean(target));
  const bootstrapScenario = scenarios.find(
    (scenario) => scenario.scenario === "nova sessao (bootstrap)"
  );
  const bootstrapIssues = ROOT_CONTEXT_FILES.filter(
    (filePath) =>
      filePath !== "docs/context/loading-rules.md" &&
      !loadingRuleTargets.includes(filePath)
  );

  if (bootstrapScenario) {
    bootstrapScenario.loadedFiles = uniquePaths([
      ...bootstrapScenario.loadedFiles,
      ...ROOT_CONTEXT_FILES
    ]);
    bootstrapScenario.issues.push(
      ...bootstrapIssues.map(
        (filePath) =>
          `Bootstrap de nova sessao depende de ${filePath}, mas docs/context/loading-rules.md nao o referencia explicitamente.`
      )
    );
    bootstrapScenario.status =
      bootstrapScenario.issues.length === 0 ? "ok" : "warning";
  }

  return scenarios;
}

export function createRouteHandler(rootDir: string, currentBranch?: string) {
  return (req: IncomingMessage, res: ServerResponse) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    const routeResponse = routeRequest(rootDir, url.pathname, currentBranch);

    res.statusCode = routeResponse.statusCode;
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.end(JSON.stringify(routeResponse.body, null, 2));
  };
}

export function routeRequest(
  rootDir: string,
  pathname: string,
  currentBranch?: string
): RouteResponse {
  if (pathname === "/health") {
    return {
      statusCode: 200,
      body: {
        status: "ok",
        branch: currentBranch ?? null
      }
    };
  }

  if (pathname === "/context") {
    return {
      statusCode: 200,
      body: getCoreSummary(rootDir)
    };
  }

  if (pathname === "/state") {
    return {
      statusCode: 200,
      body: getCurrentState(rootDir)
    };
  }

  if (pathname.startsWith("/task/")) {
    const taskType = pathname.replace("/task/", "");
    const taskContext = getTaskContext(rootDir, taskType);

    if (!taskContext) {
      return {
        statusCode: 404,
        body: {
          error: "task_not_found",
          taskType,
          supportedTaskTypes: Object.keys(TASK_TYPE_TO_SECTION)
        }
      };
    }

    return {
      statusCode: 200,
      body: taskContext
    };
  }

  if (pathname === "/validate") {
    return {
      statusCode: 200,
      body: {
        validation: runContextValidation(rootDir, currentBranch),
        scenarios: simulateScenarios(rootDir)
      }
    };
  }

  return {
    statusCode: 404,
    body: {
      error: "not_found"
    }
  };
}

/* c8 ignore start */
export function startContextServer(options?: {
  port?: number;
  rootDir?: string;
  currentBranch?: string;
}) {
  const port = options?.port ?? 3000;
  const rootDir = options?.rootDir ?? process.cwd();
  const server = createServer(
    createRouteHandler(rootDir, options?.currentBranch)
  );

  server.listen(port);

  return server;
}

const isMainModule =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  const server = startContextServer({
    port: Number(process.env.PORT ?? "3000"),
    rootDir: process.cwd()
  });

  server.on("listening", () => {
    process.stdout.write(
      `context server listening on http://localhost:${process.env.PORT ?? "3000"}\n`
    );
  });
}
/* c8 ignore stop */
