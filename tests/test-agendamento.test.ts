import { describe, expect, it } from "vitest";

import {
  createAppointment,
  getAvailabilityForDate,
  loadSeedDatabase,
  updateAppointment
} from "../test-agendamento/server.js";

describe("test-agendamento", () => {
  it("bloqueia horario ja ocupado e libera apos desmarcar", async () => {
    const database = await loadSeedDatabase();

    expect(
      getAvailabilityForDate(database, "2026-04-20").find(
        (slot) => slot.time === "10:00"
      )
    ).toMatchObject({ available: false });

    updateAppointment(database, "apt-seed-1", { action: "desmarcar" });

    expect(
      getAvailabilityForDate(database, "2026-04-20").find(
        (slot) => slot.time === "10:00"
      )
    ).toMatchObject({ available: true });
  });

  it("cria um novo agendamento pendente", async () => {
    const database = await loadSeedDatabase();
    const appointment = createAppointment(database, {
      serviceId: "blindagem",
      name: "Mariana Lima",
      contact: "(11) 97777-3030",
      date: "2026-04-22",
      time: "11:00",
      customerMessage: "Prefiro acabamento delicado."
    });

    expect(appointment).toMatchObject({
      name: "Mariana Lima",
      status: "pendente",
      serviceId: "blindagem",
      date: "2026-04-22",
      time: "11:00"
    });
  });
});
