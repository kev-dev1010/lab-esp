import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import {
  ROOT_CONTEXT_FILES,
  SUPPORTED_TASK_TYPES,
  getCurrentState,
  getTaskContext,
  runContextValidation,
  type TaskType,
  type ValidationIssue
} from "./context-docs.js";

const FLOW_STATE_FILE = ".ai/session-lock.json";

type FlowStateStatus = "bootstrapped" | "task-selected" | "validated";

export type FlowState = {
  branch: string;
  bootstrappedAt: string;
  objective: string;
  status: FlowStateStatus;
  activeTask: Exclude<TaskType, "bootstrap"> | null;
  selectedAt: string | null;
  validatedAt: string | null;
  requiredFiles: string[];
};

type TaskSelectionOptions = {
  persist: boolean;
};

function uniquePaths(paths: string[]): string[] {
  return Array.from(new Set(paths));
}

function resolveCurrentBranch(
  rootDir: string,
  explicitBranch?: string
): string {
  if (explicitBranch) {
    return explicitBranch;
  }

  const envBranch = process.env.LAB_ESP_BRANCH?.trim();

  if (envBranch) {
    return envBranch;
  }

  return execFileSync("git", ["branch", "--show-current"], {
    cwd: rootDir,
    encoding: "utf8"
  }).trim();
}

export function getFlowStatePath(rootDir: string): string {
  return path.join(rootDir, FLOW_STATE_FILE);
}

export function readFlowState(rootDir: string): FlowState | null {
  const flowStatePath = getFlowStatePath(rootDir);

  if (!existsSync(flowStatePath)) {
    return null;
  }

  return JSON.parse(readFileSync(flowStatePath, "utf8")) as FlowState;
}

function writeFlowState(rootDir: string, flowState: FlowState) {
  const flowStatePath = getFlowStatePath(rootDir);

  mkdirSync(path.dirname(flowStatePath), { recursive: true });
  writeFileSync(flowStatePath, JSON.stringify(flowState, null, 2));
}

function formatIssues(issues: ValidationIssue[]): string {
  return issues
    .map(
      (issue) =>
        `- [${issue.impact}] ${issue.cause}: ${issue.details} Sugestao: ${issue.suggestion}`
    )
    .join("\n");
}

function failIfValidationFails(rootDir: string, branch: string) {
  const validation = runContextValidation(rootDir, branch);

  if (!validation.ok) {
    throw new Error(
      `Fluxo bloqueado por inconsistencias de fundacao:\n${formatIssues(validation.issues)}`
    );
  }
}

function requireTaskContext(rootDir: string, taskType: TaskType) {
  const taskContext = getTaskContext(rootDir, taskType);

  if (!taskContext) {
    throw new Error(`Task-map nao roteia o tipo de tarefa '${taskType}'.`);
  }

  return taskContext;
}

function requireBootstrappedState(rootDir: string, branch: string): FlowState {
  const flowState = readFlowState(rootDir);

  if (!flowState) {
    throw new Error(
      "Sessao nao bootstrapada. Rode ./scripts/ai-run bootstrap antes de selecionar uma tarefa."
    );
  }

  if (flowState.branch !== branch) {
    throw new Error(
      `Sessao bootstrapada para a branch '${flowState.branch}', mas a branch atual e '${branch}'. Rode ./scripts/ai-run bootstrap novamente.`
    );
  }

  return flowState;
}

export function bootstrapAutomation(rootDir: string, explicitBranch?: string) {
  const branch = resolveCurrentBranch(rootDir, explicitBranch);

  failIfValidationFails(rootDir, branch);

  const currentState = getCurrentState(rootDir);
  const bootstrapContext = requireTaskContext(rootDir, "bootstrap");
  const requiredFiles = uniquePaths([
    ...ROOT_CONTEXT_FILES,
    ...bootstrapContext.filesToLoad
  ]);
  const flowState: FlowState = {
    branch,
    bootstrappedAt: new Date().toISOString(),
    objective: currentState.objective,
    status: "bootstrapped",
    activeTask: null,
    selectedAt: null,
    validatedAt: null,
    requiredFiles
  };

  writeFlowState(rootDir, flowState);

  return {
    branch,
    objective: currentState.objective,
    filesToLoad: requiredFiles,
    nextStep:
      "Use ./scripts/ai-run task <tipo> para obrigar o roteamento via task-map."
  };
}

export function planAutomationTask(
  rootDir: string,
  taskType: Exclude<TaskType, "bootstrap">,
  explicitBranch?: string,
  options: TaskSelectionOptions = { persist: true }
) {
  const branch = resolveCurrentBranch(rootDir, explicitBranch);
  const flowState = requireBootstrappedState(rootDir, branch);

  failIfValidationFails(rootDir, branch);

  const taskContext = requireTaskContext(rootDir, taskType);
  const filesToLoad = uniquePaths([
    ...ROOT_CONTEXT_FILES,
    ...taskContext.filesToLoad
  ]);

  if (options.persist) {
    writeFlowState(rootDir, {
      ...flowState,
      status: "task-selected",
      activeTask: taskType,
      selectedAt: new Date().toISOString(),
      validatedAt: null,
      requiredFiles: filesToLoad
    });
  }

  return {
    taskType,
    branch,
    prompt: taskContext.prompt,
    filesToLoad,
    gates: ["./scripts/ai-run gates"],
    humanReviewRequired: true
  };
}

export function getAutomationStatus(rootDir: string, explicitBranch?: string) {
  const branch = resolveCurrentBranch(rootDir, explicitBranch);
  const flowState = readFlowState(rootDir);

  if (!flowState) {
    return {
      branch,
      status: "not_bootstrapped",
      nextStep: "./scripts/ai-run bootstrap"
    };
  }

  return {
    branch,
    status: flowState.status,
    objective: flowState.objective,
    activeTask: flowState.activeTask,
    bootstrappedAt: flowState.bootstrappedAt,
    selectedAt: flowState.selectedAt,
    validatedAt: flowState.validatedAt,
    requiredFiles: flowState.requiredFiles
  };
}

export function assertReadyForCi(rootDir: string, explicitBranch?: string) {
  const branch = resolveCurrentBranch(rootDir, explicitBranch);
  const flowState = requireBootstrappedState(rootDir, branch);

  if (!flowState.activeTask) {
    throw new Error(
      "Nenhuma tarefa foi selecionada. Rode ./scripts/ai-run task <tipo> antes dos gates finais."
    );
  }

  failIfValidationFails(rootDir, branch);

  return {
    branch,
    activeTask: flowState.activeTask,
    gateCommand: "./scripts/ai-run gates"
  };
}

export function markCiPassed(rootDir: string, explicitBranch?: string) {
  const branch = resolveCurrentBranch(rootDir, explicitBranch);
  const flowState = requireBootstrappedState(rootDir, branch);

  if (!flowState.activeTask) {
    throw new Error("Nao ha tarefa ativa para registrar validacao.");
  }

  const nextState: FlowState = {
    ...flowState,
    status: "validated",
    validatedAt: new Date().toISOString()
  };

  writeFlowState(rootDir, nextState);

  return nextState;
}

/* c8 ignore start */
function printJson(value: unknown) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

function failWithUsage(message: string): never {
  throw new Error(
    `${message}\nUso:\n  tsx src/ai-flow.ts check\n  tsx src/ai-flow.ts bootstrap\n  tsx src/ai-flow.ts task <tipo>\n  tsx src/ai-flow.ts dry-run <tipo>\n  tsx src/ai-flow.ts status`
  );
}

function requireInternalCli(command: string) {
  if (process.env.LAB_ESP_INTERNAL === "1") {
    return;
  }

  throw new Error(
    `Comando interno bloqueado: '${command}'. Use ./scripts/ai-run gates.`
  );
}

function parseTaskType(
  value: string | undefined
): Exclude<TaskType, "bootstrap"> {
  if (!value) {
    failWithUsage("Tipo de tarefa ausente.");
  }

  if (
    value === "bootstrap" ||
    !SUPPORTED_TASK_TYPES.includes(value as TaskType)
  ) {
    failWithUsage(`Tipo de tarefa invalido: '${value}'.`);
  }

  return value as Exclude<TaskType, "bootstrap">;
}

const isMainModule =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  try {
    const rootDir = process.cwd();
    const [command, value] = process.argv.slice(2);

    switch (command) {
      case "check": {
        const branch = resolveCurrentBranch(rootDir);
        const validation = runContextValidation(rootDir, branch);

        if (!validation.ok) {
          throw new Error(
            `Validacao de contexto falhou para a branch '${branch}':\n${formatIssues(validation.issues)}`
          );
        }

        printJson({
          branch,
          ok: true,
          supportedTaskTypes: SUPPORTED_TASK_TYPES
        });
        break;
      }
      case "bootstrap":
        printJson(bootstrapAutomation(rootDir));
        break;
      case "task":
        printJson(planAutomationTask(rootDir, parseTaskType(value)));
        break;
      case "dry-run":
        printJson(
          planAutomationTask(rootDir, parseTaskType(value), undefined, {
            persist: false
          })
        );
        break;
      case "status":
        printJson(getAutomationStatus(rootDir));
        break;
      case "assert-ci":
        requireInternalCli("assert-ci");
        printJson(assertReadyForCi(rootDir));
        break;
      case "mark-ci-passed":
        requireInternalCli("mark-ci-passed");
        printJson(markCiPassed(rootDir));
        break;
      default:
        failWithUsage(`Comando invalido: '${command ?? ""}'.`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exitCode = 1;
  }
}
/* c8 ignore stop */
