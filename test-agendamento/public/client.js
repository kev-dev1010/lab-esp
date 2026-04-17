const state = {
  month: new Date().toISOString().slice(0, 7),
  selectedDate: "",
  selectedTime: ""
};

const calendar = document.querySelector("#calendar");
const calendarTitle = document.querySelector("#calendar-title");
const selectedDateLabel = document.querySelector("#selected-date-label");
const slotsContainer = document.querySelector("#slots");
const serviceSelect = document.querySelector("#service");
const feedback = document.querySelector("#client-feedback");
const dateField = document.querySelector("#date");
const timeField = document.querySelector("#time");
const bookingForm = document.querySelector("#booking-form");

function formatMonthTitle(monthValue) {
  const date = new Date(`${monthValue}-01T00:00:00`);

  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric"
  }).format(date);
}

async function requestJson(url, options) {
  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Falha inesperada.");
  }

  return data;
}

async function loadServices() {
  const data = await requestJson("/api/services");

  serviceSelect.innerHTML = data.services
    .map(
      (service) =>
        `<option value="${service.id}">${service.name} • ${service.priceLabel}</option>`
    )
    .join("");
}

function setSelection(dateValue, timeValue) {
  state.selectedDate = dateValue;
  state.selectedTime = timeValue;
  dateField.value = dateValue;
  timeField.value = timeValue;
  selectedDateLabel.textContent = `Horários de ${dateValue}`;
}

async function loadSlots(dateValue) {
  const data = await requestJson(
    `/api/availability?month=${state.month}&date=${dateValue}`
  );

  setSelection(dateValue, state.selectedTime);
  slotsContainer.innerHTML = data.slots
    .map(
      (slot) => `
        <button
          class="slot ${slot.available ? "" : "disabled"} ${
            slot.time === state.selectedTime ? "selected" : ""
          }"
          data-time="${slot.time}"
          ${slot.available ? "" : "disabled"}
        >
          ${slot.time}
        </button>
      `
    )
    .join("");

  slotsContainer.querySelectorAll("button[data-time]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedTime = button.dataset.time;
      timeField.value = state.selectedTime;
      loadSlots(dateValue);
    });
  });
}

async function loadCalendar() {
  const data = await requestJson(`/api/availability?month=${state.month}`);

  calendarTitle.textContent = formatMonthTitle(data.month.month);
  calendar.innerHTML = data.month.days
    .map((day) => {
      const classes = ["day-card"];

      if (day.date === state.selectedDate) {
        classes.push("selected");
      }

      if (!day.hasAvailability) {
        classes.push("inactive");
      }

      return `
        <button
          class="${classes.join(" ")}"
          data-date="${day.date}"
          ${day.totalSlots === 0 ? "disabled" : ""}
        >
          <span>${day.date.slice(-2)}</span>
          <strong>${day.availableSlots} livres</strong>
        </button>
      `;
    })
    .join("");

  calendar.querySelectorAll("button[data-date]").forEach((button) => {
    button.addEventListener("click", async () => {
      state.selectedDate = button.dataset.date;
      state.selectedTime = "";
      await loadCalendar();
      await loadSlots(state.selectedDate);
    });
  });
}

async function submitBooking(event) {
  event.preventDefault();
  feedback.textContent = "";

  try {
    await requestJson("/api/appointments", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        serviceId: serviceSelect.value,
        name: document.querySelector("#name").value,
        contact: document.querySelector("#contact").value,
        date: dateField.value,
        time: timeField.value,
        customerMessage: document.querySelector("#customer-message").value
      })
    });

    feedback.textContent = "Agendamento registrado com sucesso.";
    bookingForm.reset();
    dateField.value = state.selectedDate;
    timeField.value = "";
    state.selectedTime = "";
    await loadCalendar();

    if (state.selectedDate) {
      await loadSlots(state.selectedDate);
    }
  } catch (error) {
    feedback.textContent = error.message;
  }
}

document.querySelector("#prev-month").addEventListener("click", async () => {
  const current = new Date(`${state.month}-01T00:00:00`);
  current.setMonth(current.getMonth() - 1);
  state.month = current.toISOString().slice(0, 7);
  state.selectedDate = "";
  state.selectedTime = "";
  await loadCalendar();
  slotsContainer.innerHTML = "";
  selectedDateLabel.textContent = "Selecione um dia";
});

document.querySelector("#next-month").addEventListener("click", async () => {
  const current = new Date(`${state.month}-01T00:00:00`);
  current.setMonth(current.getMonth() + 1);
  state.month = current.toISOString().slice(0, 7);
  state.selectedDate = "";
  state.selectedTime = "";
  await loadCalendar();
  slotsContainer.innerHTML = "";
  selectedDateLabel.textContent = "Selecione um dia";
});

bookingForm.addEventListener("submit", submitBooking);

await loadServices();
await loadCalendar();
setInterval(loadCalendar, 15000);
