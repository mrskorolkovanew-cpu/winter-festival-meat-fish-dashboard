const tasks = [
  { id: "1", stream: "Исходные данные", title: "Загрузить бриф фестиваля", start: "—", due: "—", status: "Ожидает данных" },
  { id: "2", stream: "Исходные данные", title: "Загрузить план задач", start: "—", due: "—", status: "Ожидает данных" },
  { id: "3", stream: "Исходные данные", title: "Загрузить график подготовки", start: "—", due: "—", status: "Ожидает данных" },
  { id: "4", stream: "Программа", title: "Загрузить программу мероприятий", start: "—", due: "—", status: "Ожидает данных" },
  { id: "5", stream: "Бюджет", title: "Сформировать бюджетные показатели", start: "—", due: "—", status: "Ожидает данных" },
  { id: "6", stream: "Площадка", title: "Зафиксировать локации и резервный сценарий", start: "—", due: "—", status: "Ожидает данных" }
];

const statusMeta = {
  "Ожидает данных": { label: "Ожидает данных", color: "#d87932", css: "decision" },
  "Выполнено": { label: "Выполнено", color: "#3d8a61", css: "done" },
  "В работе": { label: "В работе", color: "#5b9bd5", css: "work" },
  "Не начато": { label: "Не начато", color: "#b8c2cc", css: "not-started" }
};
const statusOrder = ["Выполнено", "В работе", "Не начато", "Ожидает данных"];

function one(selector) { return document.querySelector(selector); }
function countFor(status) { return tasks.filter((task) => task.status === status).length; }
function statusClass(status) { return statusMeta[status].css; }

function renderProgress() {
  const total = tasks.length;
  const completed = countFor("Выполнено");
  one("#completed-percent").textContent = Math.round((completed / total) * 100) + "%";
  one("#task-total").textContent = "(" + total + ")";
  one("#stacked-bar").innerHTML = statusOrder.filter((status) => countFor(status) > 0).map((status) => {
    const count = countFor(status);
    return '<span class="stack-segment" title="' + statusMeta[status].label + ': ' + count + '" style="width:' + (count / total) * 100 + '%;background:' + statusMeta[status].color + '"></span>';
  }).join("");
  one("#status-list").innerHTML = statusOrder.filter((status) => countFor(status) > 0).map((status) => {
    return '<div class="status-row"><span class="status-dot" style="background:' + statusMeta[status].color + '"></span><span>' + statusMeta[status].label + '</span><strong>' + countFor(status) + '</strong></div>';
  }).join("");
}

function renderWorkstreams() {
  const streams = Array.from(new Set(tasks.map((task) => task.stream)));
  one("#workstream-grid").innerHTML = streams.map((stream) => {
    const list = tasks.filter((task) => task.stream === stream);
    const done = list.filter((task) => task.status === "Выполнено").length;
    return '<article class="workstream-card"><h3>' + stream + '</h3><p>' + list.length + ' задач · ' + done + ' завершено</p><div class="workstream-meta"><span>готовность</span><strong>' + Math.round((done / list.length) * 100) + '%</strong></div></article>';
  }).join("");
}

function renderFilters() {
  const streams = Array.from(new Set(tasks.map((task) => task.stream)));
  one("#status-filter").insertAdjacentHTML("beforeend", statusOrder.map((status) => '<option value="' + status + '">' + status + '</option>').join(""));
  one("#stream-filter").insertAdjacentHTML("beforeend", streams.map((stream) => '<option value="' + stream + '">' + stream + '</option>').join(""));
}

function renderTaskTable() {
  const selectedStatus = one("#status-filter").value;
  const selectedStream = one("#stream-filter").value;
  const filtered = tasks.filter((task) => (selectedStatus === "all" || task.status === selectedStatus) && (selectedStream === "all" || task.stream === selectedStream));
  one("#visible-task-count").textContent = "Показано: " + filtered.length + " из " + tasks.length;
  one("#task-table-body").innerHTML = filtered.map((task) => '<tr><td>' + task.id + '</td><td>' + task.title + '</td><td>' + task.start + '</td><td>' + task.due + '</td><td><span class="task-status task-status--' + statusClass(task.status) + '">' + task.status + '</span></td></tr>').join("");
}

function showView(viewId) {
  document.querySelectorAll(".view-panel").forEach((panel) => panel.classList.toggle("is-active", panel.id === viewId));
  document.querySelectorAll(".view-tab").forEach((tab) => tab.classList.toggle("is-active", tab.dataset.viewTarget === viewId));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll(".view-tab").forEach((tab) => tab.addEventListener("click", () => showView(tab.dataset.viewTarget)));
document.querySelectorAll("[data-show-schedule]").forEach((button) => button.addEventListener("click", () => showView("schedule-panel")));
document.querySelectorAll("[data-show-overview]").forEach((button) => button.addEventListener("click", () => showView("overview-panel")));
one("#status-filter").addEventListener("change", renderTaskTable);
one("#stream-filter").addEventListener("change", renderTaskTable);

renderProgress();
renderWorkstreams();
renderFilters();
renderTaskTable();
