const appointmentsContainer = document.querySelector("#appointments");
const feedback = document.querySelector("#admin-feedback");

async function requestJson(url, options) {
  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Falha inesperada.");
  }

  return data;
}

function appointmentCard(appointment) {
  return `
    <article class="appointment-card">
      <header class="appointment-header">
        <div>
          <h3>${appointment.name}</h3>
          <p>${appointment.contact}</p>
        </div>
        <span class="status ${appointment.status}">${appointment.status}</span>
      </header>
      <dl class="meta-grid">
        <div><dt>Serviço</dt><dd>${appointment.serviceName}</dd></div>
        <div><dt>Valor</dt><dd>${appointment.priceLabel}</dd></div>
        <div><dt>Data</dt><dd>${appointment.date}</dd></div>
        <div><dt>Horário</dt><dd>${appointment.time}</dd></div>
      </dl>
      <div class="message-box">
        <strong>Cliente</strong>
        <p>${appointment.customerMessage || "Sem observações."}</p>
      </div>
      <div class="message-box">
        <strong>Resposta</strong>
        <p>${appointment.adminReply || "Nenhuma resposta enviada."}</p>
      </div>
      <textarea data-reply="${appointment.id}" rows="3" placeholder="Responder cliente"></textarea>
      <div class="card-actions">
        <button data-action="confirmar" data-id="${appointment.id}" class="mini-button">Confirmar</button>
        <button data-action="desmarcar" data-id="${appointment.id}" class="mini-button danger">Desmarcar</button>
        <button data-action="responder" data-id="${appointment.id}" class="mini-button secondary">Responder</button>
      </div>
    </article>
  `;
}

async function loadAppointments() {
  const data = await requestJson("/api/appointments");

  appointmentsContainer.innerHTML = data.appointments
    .map(appointmentCard)
    .join("");

  appointmentsContainer
    .querySelectorAll("button[data-action]")
    .forEach((button) => {
      button.addEventListener("click", async () => {
        const action = button.dataset.action;
        const id = button.dataset.id;
        const replyField = document.querySelector(
          `textarea[data-reply="${id}"]`
        );

        try {
          await requestJson(`/api/appointments/${id}`, {
            method: "PATCH",
            headers: {
              "content-type": "application/json"
            },
            body: JSON.stringify({
              action,
              message: replyField?.value ?? ""
            })
          });

          feedback.textContent = "Painel atualizado com sucesso.";
          await loadAppointments();
        } catch (error) {
          feedback.textContent = error.message;
        }
      });
    });
}

await loadAppointments();
setInterval(loadAppointments, 15000);
