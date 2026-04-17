import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "public");
const dataFile = path.join(__dirname, "data", "db.json");

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

export async function readDatabase() {
  const raw = await readFile(dataFile, "utf8");
  return JSON.parse(raw);
}

export async function writeDatabase(database) {
  await writeFile(dataFile, `${JSON.stringify(database, null, 2)}\n`, "utf8");
}

export async function loadSeedDatabase() {
  return structuredClone(await readDatabase());
}

export function getMonthWindow(monthValue) {
  const base = monthValue ? new Date(`${monthValue}-01T00:00:00`) : new Date();

  if (Number.isNaN(base.getTime())) {
    throw new Error("Mes invalido. Use YYYY-MM.");
  }

  const year = base.getFullYear();
  const month = base.getMonth();
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);

  return {
    start,
    end,
    key: `${year}-${String(month + 1).padStart(2, "0")}`
  };
}

export function listServices(database) {
  return database.services.map((service) => ({
    ...service,
    priceLabel: formatCurrency(service.price)
  }));
}

export function formatCurrency(price) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(price);
}

export function getWorkingSlotsForDate(database, dateValue) {
  const currentDate = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(currentDate.getTime())) {
    throw new Error("Data invalida. Use YYYY-MM-DD.");
  }

  if (!database.workingDays.includes(currentDate.getDay())) {
    return [];
  }

  const slots = [];

  for (
    let hour = database.businessHours.startHour;
    hour < database.businessHours.endHour;
    hour += 1
  ) {
    for (
      let minute = 0;
      minute < 60;
      minute += database.businessHours.slotMinutes
    ) {
      const slotLabel = `${String(hour).padStart(2, "0")}:${String(
        minute
      ).padStart(2, "0")}`;

      slots.push(slotLabel);
    }
  }

  return slots;
}

export function isSlotTaken(database, dateValue, timeValue) {
  return database.appointments.some(
    (appointment) =>
      appointment.date === dateValue &&
      appointment.time === timeValue &&
      appointment.status !== "cancelado"
  );
}

export function getAvailabilityForDate(database, dateValue) {
  return getWorkingSlotsForDate(database, dateValue).map((time) => ({
    time,
    available: !isSlotTaken(database, dateValue, time)
  }));
}

export function getAvailabilityForMonth(database, monthValue) {
  const { end, key, start } = getMonthWindow(monthValue);
  const days = [];

  for (
    let cursor = new Date(start);
    cursor <= end;
    cursor.setDate(cursor.getDate() + 1)
  ) {
    const dateValue = `${cursor.getFullYear()}-${String(
      cursor.getMonth() + 1
    ).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
    const slots = getAvailabilityForDate(database, dateValue);
    const availableSlots = slots.filter((slot) => slot.available).length;

    days.push({
      date: dateValue,
      weekday: cursor.getDay(),
      totalSlots: slots.length,
      availableSlots,
      fullyBooked: slots.length > 0 && availableSlots === 0,
      hasAvailability: availableSlots > 0
    });
  }

  return {
    month: key,
    days
  };
}

export function listAppointments(database) {
  return database.appointments
    .map((appointment) => {
      const service = database.services.find(
        (currentService) => currentService.id === appointment.serviceId
      );

      return {
        ...appointment,
        serviceName: service?.name ?? appointment.serviceId,
        price: service?.price ?? 0,
        priceLabel: formatCurrency(service?.price ?? 0)
      };
    })
    .sort((left, right) =>
      `${left.date}${left.time}`.localeCompare(`${right.date}${right.time}`)
    );
}

export function createAppointment(database, payload) {
  const service = database.services.find(
    (currentService) => currentService.id === payload.serviceId
  );

  if (!service) {
    throw new Error("Servico invalido.");
  }

  if (!payload.name?.trim() || !payload.contact?.trim()) {
    throw new Error("Nome e contato sao obrigatorios.");
  }

  const availableSlot = getAvailabilityForDate(database, payload.date).find(
    (slot) => slot.time === payload.time && slot.available
  );

  if (!availableSlot) {
    throw new Error("Horario indisponivel.");
  }

  const appointment = {
    id: `apt-${Date.now()}`,
    name: payload.name.trim(),
    contact: payload.contact.trim(),
    serviceId: service.id,
    date: payload.date,
    time: payload.time,
    status: "pendente",
    customerMessage: payload.customerMessage?.trim() ?? "",
    adminReply: "",
    createdAt: new Date().toISOString()
  };

  database.appointments.push(appointment);

  return appointment;
}

export function updateAppointment(database, appointmentId, payload) {
  const appointment = database.appointments.find(
    (currentAppointment) => currentAppointment.id === appointmentId
  );

  if (!appointment) {
    throw new Error("Agendamento nao encontrado.");
  }

  if (payload.action === "confirmar") {
    appointment.status = "confirmado";
  } else if (payload.action === "desmarcar") {
    appointment.status = "cancelado";
  } else if (payload.action === "responder") {
    if (!payload.message?.trim()) {
      throw new Error("Mensagem obrigatoria para responder.");
    }

    appointment.adminReply = payload.message.trim();
  } else {
    throw new Error("Acao invalida.");
  }

  appointment.updatedAt = new Date().toISOString();

  return appointment;
}

async function parseBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

async function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8"
  });
  response.end(`${JSON.stringify(body, null, 2)}\n`);
}

async function serveStatic(response, pathname) {
  const filePath =
    pathname === "/"
      ? path.join(publicDir, "index.html")
      : path.join(publicDir, pathname.replace(/^\//, ""));

  try {
    const contents = await readFile(filePath);
    const extension = path.extname(filePath);

    response.writeHead(200, {
      "content-type":
        contentTypes[extension] ?? "application/octet-stream; charset=utf-8"
    });
    response.end(contents);
  } catch {
    await sendJson(response, 404, { error: "not_found" });
  }
}

export function createApp() {
  return createServer(async (request, response) => {
    const requestUrl = new URL(request.url ?? "/", "http://localhost");
    const pathname = requestUrl.pathname;

    try {
      if (request.method === "GET" && pathname === "/api/services") {
        return sendJson(response, 200, {
          services: listServices(await readDatabase())
        });
      }

      if (request.method === "GET" && pathname === "/api/availability") {
        const database = await readDatabase();
        const month = requestUrl.searchParams.get("month") ?? undefined;
        const date = requestUrl.searchParams.get("date");

        return sendJson(response, 200, {
          month: getAvailabilityForMonth(database, month),
          slots: date ? getAvailabilityForDate(database, date) : null
        });
      }

      if (request.method === "GET" && pathname === "/api/appointments") {
        return sendJson(response, 200, {
          appointments: listAppointments(await readDatabase())
        });
      }

      if (request.method === "POST" && pathname === "/api/appointments") {
        const database = await readDatabase();
        const body = await parseBody(request);
        const appointment = createAppointment(database, body);

        await writeDatabase(database);

        return sendJson(response, 201, { appointment });
      }

      if (
        request.method === "PATCH" &&
        pathname.startsWith("/api/appointments/")
      ) {
        const database = await readDatabase();
        const appointmentId = pathname.split("/").pop();
        const body = await parseBody(request);
        const appointment = updateAppointment(database, appointmentId, body);

        await writeDatabase(database);

        return sendJson(response, 200, { appointment });
      }

      return serveStatic(response, pathname);
    } catch (error) {
      return sendJson(response, 400, {
        error: error instanceof Error ? error.message : "unknown_error"
      });
    }
  });
}

export function startServer(port = 4321) {
  const app = createApp();

  app.listen(port, () => {
    process.stdout.write(
      `test-agendamento disponivel em http://localhost:${port}\n`
    );
  });

  return app;
}

const isMainModule =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  startServer(Number(process.env.PORT ?? "4321"));
}
