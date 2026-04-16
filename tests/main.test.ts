import { describe, expect, it } from "vitest";

import { bootstrap } from "../src/main.js";

describe("bootstrap", () => {
  it("retorna mensagem inicial do projeto", () => {
    expect(bootstrap()).toContain("lab-esp");
  });
});
