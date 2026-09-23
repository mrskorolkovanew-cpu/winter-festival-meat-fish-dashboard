const rawTasks = [
  "1|Концепция и формат|Определить необходимое количество привлечённых людей и подтвердить возможность привлечения на все дни фестиваля|11.11.2026|13.11.2026",
  "2|Концепция и формат|Определить временной интервал проведения фестиваля и тайминг|11.11.2026|17.11.2026",
  "3|Концепция и формат|Разработать детальную программу мероприятий по тематике фестиваля|11.11.2026|17.11.2026",
  "4|Концепция и формат|Проработать вопрос купонной системы|11.11.2026|17.11.2026",
  "5|Концепция и формат|Определить локации проведения фестиваля|11.11.2026|17.11.2026",
  "6|Концепция и формат|Определить и утвердить локации, количество и варианты фудовых и тематических мастер-классов и активностей|11.11.2026|17.11.2026",
  "8|Площадка|Проработать варианты стимуляции посещения всех локаций|17.11.2026|30.11.2026",
  "9|Бюджет|Подготовить детальное ценообразование по фуд- и гриль-зонам|03.12.2026|17.12.2026",
  "10|Бюджет|Разработка и согласование общего бюджета|11.11.2026|27.11.2026",
  "10.1|Бюджет|Food|11.11.2026|18.11.2026",
  "10.2|Бюджет|Общая анимация: ведущий, DJ, аниматоры и др.|17.11.2026|18.11.2026",
  "10.3|Бюджет|Маркетинговый бюджет|13.11.2026|26.11.2026",
  "11|Маркетинг|Маркетинг и реклама|14.11.2026|27.12.2026",
  "11.1|Маркетинг|Формирование заказа баннеров|14.11.2026|27.11.2026",
  "11.2|Маркетинг|Изготовление и монтаж баннеров|30.11.2026|03.12.2026",
  "11.3|Маркетинг|Запуск и продвижение|30.11.2026|27.12.2026",
  "12|Food и развлечения|Food и развлечения|23.11.2026|25.12.2026",
  "12.1|Food и развлечения|Поиск DJ и заключение договора|23.11.2026|12.12.2026",
  "12.2|Food и развлечения|Заключить договор аренды звукового и светового оборудования|23.11.2026|12.12.2026",
  "12.3|Food и развлечения|При необходимости обновить договоры с ведущими и аниматорами|23.11.2026|12.12.2026",
  "12.4|Food и развлечения|Закупить материалы для мастер-классов|03.12.2026|17.12.2026",
  "12.5|Food и развлечения|Закупка грилей|07.12.2026|09.12.2026",
  "12.6|Food и развлечения|Финальный прозвон и сверка с поставщиками по продуктам и дополнительным позициям|17.12.2026|17.12.2026",
  "12.7|Food и развлечения|Формирование заказа на продукцию и пиво|18.12.2026|18.12.2026",
  "12.8|Food и развлечения|Установка звукового и светового оборудования на сцене|22.12.2026|24.12.2026",
  "12.9|Food и развлечения|Брифинг персонала и настройка кассовых мест|23.12.2026|25.12.2026",
  "12.10|Food и развлечения|Приём поставки продукции в парк|24.12.2026|24.12.2026",
  "12.11|Food и развлечения|Подготовка локаций с гриль-зонами и глинтвейном. Финальный чек|25.12.2026|25.12.2026",
  "12.12|Food и развлечения|Проверка готовности, развоз ингредиентов и продукции, установка оборудования с глинтвейном|25.12.2026|25.12.2026",
  "13|Фестиваль|Открытие фестиваля|25.12.2026|25.12.2026",
  "14|Фестиваль|Закрытие фестиваля|09.01.2027|09.01.2027"
];

const fallbackTasks = rawTasks.map((row) => {
  const cells = row.split("|");
  return { id: cells[0], stream: cells[1], title: cells[2], start: cells[3], due: cells[4], status: "Не начато" };
});
let tasks = fallbackTasks;

const scheduleFile = "График_подготовки_Зимний фестиваль _Мясо-Рыба.xlsx";

function streamForTask(id) {
  const taskId = String(id).replace(/\.$/, "");
  if (["1", "2", "3", "4", "5", "6"].includes(taskId)) return "Концепция и формат";
  if (taskId === "8") return "Площадка";
  if (["9", "10", "10.1", "10.2", "10.3"].includes(taskId)) return "Бюджет";
  if (taskId === "11" || taskId.startsWith("11.")) return "Маркетинг";
  if (taskId === "12" || taskId.startsWith("12.")) return "Food и развлечения";
  if (["13", "14"].includes(taskId)) return "Фестиваль";
  return "Другое";
}

function normalizeDate(value) {
  if (typeof value === "number" && window.XLSX) {
    const date = XLSX.SSF.parse_date_code(value);
    if (date) {
      return String(date.d).padStart(2, "0") + "." + String(date.m).padStart(2, "0") + "." + date.y;
    }
  }
  if (value instanceof Date) {
    return String(value.getDate()).padStart(2, "0") + "." + String(value.getMonth() + 1).padStart(2, "0") + "." + value.getFullYear();
  }
  const text = String(value).trim();
  const match = text.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (!match) return text;
  return match[1].padStart(2, "0") + "." + match[2].padStart(2, "0") + "." + match[3];
}

function normalizeStatus(value) {
  const status = String(value || "").trim();
  return statusMeta[status] ? status : "Не начато";
}

function loadSpreadsheetLibrary() {
  if (window.XLSX) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
    script.onload = resolve;
    script.onerror = () => reject(new Error("Не удалось подключить модуль чтения графика"));
    document.head.append(script);
  });
}

async function loadTasksFromSchedule() {
  try {
    await loadSpreadsheetLibrary();
    const response = await fetch(encodeURI(scheduleFile), { cache: "no-store" });
    if (!response.ok) throw new Error("График пока недоступен");
    const workbook = XLSX.read(await response.arrayBuffer(), { type: "array", cellDates: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true, defval: "" });
    const headerRow = rows.findIndex((row) => String(row[0]).trim() === "№" && String(row[1]).trim() === "Задача");
    if (headerRow < 0) throw new Error("Не найдена строка заголовков");
    const headers = rows[headerRow].map((value) => String(value).trim());
    const startColumn = headers.findIndex((value) => value === "Начало");
    const dueColumn = headers.findIndex((value) => value.startsWith("Окончание"));
    const statusColumn = headers.findIndex((value) => value === "Статус");
    const importedTasks = rows.slice(headerRow + 1)
      .filter((row) => String(row[0]).trim() && String(row[1]).trim() && String(row[startColumn]).trim() && String(row[dueColumn]).trim())
      .map((row) => {
        const id = String(row[0]).trim().replace(/\.$/, "");
        return {
          id,
          stream: streamForTask(id),
          title: String(row[1]).trim(),
          start: normalizeDate(row[startColumn]),
          due: normalizeDate(row[dueColumn]),
          status: normalizeStatus(statusColumn >= 0 ? row[statusColumn] : "")
        };
      });
    if (!importedTasks.length) throw new Error("В графике нет задач");
    one("#source-status").textContent = "Источник: график подготовки";
    return importedTasks;
  } catch (error) {
    one("#source-status").textContent = "Источник: резервная версия графика";
    console.warn("Не удалось загрузить график подготовки", error);
    return fallbackTasks;
  }
}

const statusMeta = {
  "Выполнено": { label: "Выполнено", color: "#3d8a61", css: "done" },
  "В работе": { label: "В работе", color: "#5b9bd5", css: "work" },
  "Не начато": { label: "Не начато", color: "#b8c2cc", css: "not-started" }
};
const statusOrder = ["Выполнено", "В работе", "Не начато"];

function one(selector) { return document.querySelector(selector); }
function countFor(status) { return tasks.filter((task) => task.status === status).length; }
function statusClass(status) { return statusMeta[status].css; }

function renderProgress() {
  const total = tasks.length;
  const completed = countFor("Выполнено");
  one("#completed-percent").textContent = Math.round((completed / total) * 100) + "%";
  one("#task-total").textContent = "(" + total + ")";
  one("#task-summary").textContent = total;
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
  one("#status-filter").innerHTML = '<option value="all">Все статусы</option>' + statusOrder.map((status) => '<option value="' + status + '">' + status + '</option>').join("");
  one("#stream-filter").innerHTML = '<option value="all">Все направления</option>' + streams.map((stream) => '<option value="' + stream + '">' + stream + '</option>').join("");
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

async function initializeDashboard() {
  renderDashboard();
  tasks = await loadTasksFromSchedule();
  renderDashboard();
}

function renderDashboard() {
  renderProgress();
  renderWorkstreams();
  renderFilters();
  renderTaskTable();
}

initializeDashboard();
