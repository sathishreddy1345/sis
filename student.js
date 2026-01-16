document.addEventListener("DOMContentLoaded", () => {

  // ======================
  // CALENDAR + DATE SELECTION
  // ======================

  const calendarGrid = document.getElementById("calendarGrid");
  const monthYear = document.getElementById("monthYear");
  const prevMonthBtn = document.getElementById("prevMonth");
  const nextMonthBtn = document.getElementById("nextMonth");

  const eventInput = document.getElementById("eventInput");
  const addEventBtn = document.getElementById("addEventBtn");
  const eventList = document.getElementById("eventList");

  const attendanceStatus = document.getElementById("attendanceStatus");

  let currentDate = new Date();
  let selectedDate = null;

  // 🔗 SHARED DATA FROM LECTURER
  let calendarEvents = JSON.parse(localStorage.getItem("calendarEvents")) || [];
  let attendanceRecords = JSON.parse(localStorage.getItem("attendanceRecords")) || [];

  const formatDate = d => d.toISOString().split("T")[0];

  function renderCalendar() {
    calendarGrid.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthYear.textContent = currentDate.toLocaleString("default", {
      month: "long",
      year: "numeric"
    });

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
      calendarGrid.appendChild(document.createElement("div"));
    }

    for (let day = 1; day <= lastDate; day++) {
      const cell = document.createElement("div");
      cell.textContent = day;

      const cellDate = formatDate(new Date(year, month, day));

      const today = new Date();
      if (
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear()
      ) {
        cell.classList.add("today");
      }

      if (selectedDate === cellDate) {
        cell.classList.add("selected");
      }

      cell.onclick = () => {
        selectedDate = cellDate;
        renderCalendar();
        renderEvents();
        renderAttendance();
      };

      calendarGrid.appendChild(cell);
    }
  }

  prevMonthBtn.onclick = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    selectedDate = null;
    renderCalendar();
    renderEvents();
    renderAttendance();
  };

  nextMonthBtn.onclick = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    selectedDate = null;
    renderCalendar();
    renderEvents();
    renderAttendance();
  };

  renderCalendar();


  // ======================
  // DATE-BASED EVENTS (FROM LECTURER)
  // ======================

  function renderEvents() {
    eventList.innerHTML = "";

    if (!selectedDate) {
      eventList.innerHTML = "<li>Select a date to view events</li>";
      return;
    }

    calendarEvents
      .filter(e => e.date === selectedDate)
      .forEach(e => {
        const li = document.createElement("li");
        li.className = e.type; // class | exam | meeting
        li.textContent = e.title;
        eventList.appendChild(li);
      });
  }

  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  document.querySelector("#studentName").textContent =
    user.profile.name;

  document.querySelector("#studentDept").textContent =
    user.profile.department;



  // ======================
  // STUDENT PERSONAL EVENTS (OPTIONAL)
  // ======================

  addEventBtn.onclick = () => {
  if (!selectedDate || !eventInput.value.trim()) return;

  calendarEvents.push({
    id: Date.now(),
    title: eventInput.value.trim(),
    date: selectedDate,
    type: "personal",
    createdBy: "student"
  });

  localStorage.setItem("calendarEvents", JSON.stringify(calendarEvents));
  eventInput.value = "";

  renderEvents();
  renderCalendar(); // 🔥 REQUIRED for dots
};


  // ======================
  // ATTENDANCE PER DATE
  // ======================

  function renderAttendance() {
    if (!attendanceStatus) return;

    if (!selectedDate) {
      attendanceStatus.textContent = "Select a date";
      return;
    }

    const record = attendanceRecords.find(a => a.date === selectedDate);
    attendanceStatus.textContent = record ? record.status : "Not marked";
  }


  // ======================
  // NOTIFICATIONS
  // ======================

  const notificationList = document.getElementById("notificationList");
  let notifications = JSON.parse(localStorage.getItem("notifications")) || [];

  function renderNotifications() {
    notificationList.innerHTML = "";
    notifications.forEach(note => {
      const li = document.createElement("li");
      li.textContent = note.message;
      notificationList.appendChild(li);
    });
  }

  renderNotifications();


  // ======================
  // STUDENT TODO LIST
  // ======================

  const todoInput = document.getElementById("todoInput");
  const todoList = document.getElementById("todoList");

  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  function renderTodos() {
    todoList.innerHTML = "";

    todos.forEach((todo, index) => {
      const li = document.createElement("li");

      const text = document.createElement("span");
      text.textContent = todo.text;
      if (todo.done) li.classList.add("done");

      const del = document.createElement("span");
      del.textContent = "✖";
      del.style.cursor = "pointer";

      text.onclick = () => {
        todos[index].done = !todos[index].done;
        saveTodos();
      };

      del.onclick = () => {
        todos.splice(index, 1);
        saveTodos();
      };

      li.appendChild(text);
      li.appendChild(del);
      todoList.appendChild(li);
    });
  }

  function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodos();
  }

  todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && todoInput.value.trim()) {
      todos.push({ text: todoInput.value.trim(), done: false });
      todoInput.value = "";
      saveTodos();
    }
  });

  renderTodos();

});
