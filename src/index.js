"use strict";

//CSS
import "./styles/style.css";
const API_BASE = "http://localhost:3005";
const input = document.getElementById("client-id-input");
const btn = document.getElementById("search-btn");

btn.addEventListener("click", () => {
  const id = input.value.trim();
  if (!id) {
    alert("Informe um ID de cartão");
    return;
  }

  fetch(`${API_BASE}/clients/${id}`)
    .then((res) => {
      if (!res.ok) throw new Error("Cliente não encontrado");
      return res.json();
    })
    .then(renderClient)
    .catch((err) => alert(err.message));
});

// permite disparar busca também com Enter
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") btn.click();
});

function renderClient(client) {
  // 1) Nome e data
  document.getElementById("user-name").textContent = client.name;
  document.getElementById(
    "user-since"
  ).textContent = `Cliente desde ${client.clientSince}`;
  document.getElementById("loyalty-id-value").textContent = `Id: ${client.id}`;

  // 2) Histórico de atendimentos
  const historyList = document.getElementById("history-list");
  const historyCount = document.getElementById("history-count");
  historyList.innerHTML = "";
  client.appointmentHistory.forEach((entry) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="history-date">
        <span class="day">${entry.date}</span>
        <span class="time">${entry.time}</span>
      </div>
      <img src="src/assets/check.png" alt="Carimbado" class="icon-check"/>
    `;
    historyList.appendChild(li);
  });
  historyCount.textContent = `${client.appointmentHistory.length} cortes`;

  // 3) Cartão fidelidade (selos)
  const grid = document.getElementById("stamps-grid");
  const { totalCuts, cutsNeeded, cutsRemaining } = client.loyaltyCard;
  grid.innerHTML = "";

  for (let i = 1; i <= cutsNeeded; i++) {
    const cell = document.createElement("div");
    if (i <= totalCuts) {
      cell.className = "stamp filled";
      cell.innerHTML = `<img src="src/assets/check.png" alt="Carimbado"/>`;
    } else if (i === cutsNeeded) {
      cell.className = "stamp gift";
      cell.innerHTML = `<img src="src/assets/gift.png" alt="Recompensa"/>`;
    } else {
      cell.className = "stamp empty";
    }
    grid.appendChild(cell);
  }

  // 4) Barra de progresso
  const percent = Math.round((totalCuts / cutsNeeded) * 100);
  document.getElementById("progress-filled").style.width = `${percent}%`;
  document.getElementById(
    "cuts-remaining"
  ).textContent = `${cutsRemaining} cortes restantes`;
  document.getElementById(
    "progress-count"
  ).textContent = `${totalCuts} de ${cutsNeeded}`;
}
