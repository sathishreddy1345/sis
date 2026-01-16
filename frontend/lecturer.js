document.addEventListener("DOMContentLoaded", () => {

  // ======================
  // COURSES
  // ======================

  let courses = JSON.parse(localStorage.getItem("courses")) || [];
  const courseList = document.getElementById("courseList");
  const courseInput = document.getElementById("courseName");

  function renderCourses() {
    courseList.innerHTML = "";
    courses.forEach(course => {
      const li = document.createElement("li");
      li.textContent = course;
      courseList.appendChild(li);
    });
  }

  window.createCourse = () => {
    if (!courseInput.value.trim()) return;
    courses.push(courseInput.value.trim());
    localStorage.setItem("courses", JSON.stringify(courses));
    courseInput.value = "";
    renderCourses();
  };

  renderCourses();


  // ======================
  // CALENDAR + DATE SELECTION
  // ======================

  const calendarGrid = document.getElementById("calendarGrid");
  const monthYear = document.getElementById("monthYear");
  const prevMonthBtn = document.getElementById("prevMonth");
  const nextMonthBtn = document.getElementById("nextMonth");

  const eventInput = document.getElementById("eventInput");
  const eventType = document.getElementById("eventType"); // class | exam | meeting
  const addEventBtn = document.getElementById("addEventBtn");
  const eventList = document.getElementById("eventList");

  let currentDate = new Date();
  let selectedDate = null;

  let events = JSON.parse(localStorage.getItem("calendarEvents")) || [];

  function formatDate(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}


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

    for (let i = 0; i < firstDay; i++) {
      calendarGrid.appendChild(document.createElement("div"));
    }

    const today = new Date();
const todayKey = formatDate(today);

for (let day = 1; day <= lastDate; day++) {
  const cell = document.createElement("div");
  cell.textContent = day;

  const cellDate = formatDate(new Date(year, month, day));

  if (cellDate === todayKey) {
    cell.classList.add("today"); // ✅ CURRENT DATE
  }

  if (cellDate === selectedDate) {
    cell.classList.add("selected");
  }

  cell.onclick = () => {
    selectedDate = cellDate;
    renderCalendar();
    renderEvents();
    renderAttendance();
  };

  // event dots
  const dayEvents = events.filter(e => e.date === cellDate);
  if (dayEvents.length > 0) {
    const dotContainer = document.createElement("div");
    dotContainer.className = "event-dots";

    [...new Set(dayEvents.map(e => e.type))].forEach(type => {
      const dot = document.createElement("span");
      dot.className = `event-dot ${type}`;
      dotContainer.appendChild(dot);
    });

    cell.appendChild(dotContainer);
  }

  calendarGrid.appendChild(cell);
}

    
  }

  prevMonthBtn.onclick = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    selectedDate = null;
    renderCalendar();
    renderEvents();
  };

  nextMonthBtn.onclick = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    selectedDate = null;
    renderCalendar();
    renderEvents();
  };

  renderCalendar();


  // ======================
  // DATE-BASED EVENTS (SYNC TO STUDENT)
  // ======================

  function renderEvents() {
    eventList.innerHTML = "";

    if (!selectedDate) {
      eventList.innerHTML = "<li>Select a date</li>";
      return;
    }

    events
      .filter(e => e.date === selectedDate)
      .forEach(e => {
        const li = document.createElement("li");
        li.className = e.type; // class / exam / meeting
        li.textContent = `${e.title}`;
        eventList.appendChild(li);
      });
  }

  addEventBtn.onclick = () => {
  if (!selectedDate) {
    alert("Please select a date first");
    return;
  }

  if (!eventInput.value.trim()) return;

  events.push({
    id: Date.now(),
    title: eventInput.value.trim(),
    date: selectedDate,
    type: eventType ? eventType.value : "class", // fallback safe
    createdBy: "lecturer"
  });

  localStorage.setItem("calendarEvents", JSON.stringify(events));
  eventInput.value = "";

  renderEvents();
  renderCalendar(); // 🔥 REQUIRED
};



  // ======================
  // ATTENDANCE PER DATE
  // ======================

  const attendanceBox = document.getElementById("attendanceStatus");
  let attendance = JSON.parse(localStorage.getItem("attendanceRecords")) || [];

  window.markAttendance = (status) => {
    if (!selectedDate) return;

    attendance.push({
      date: selectedDate,
      status: status // Present / Absent
    });

    localStorage.setItem("attendanceRecords", JSON.stringify(attendance));
    renderAttendance();
  };

  function renderAttendance() {
    if (!attendanceBox || !selectedDate) return;

    const record = attendance.find(a => a.date === selectedDate);
    attendanceBox.textContent = record ? record.status : "Not marked";
  }


  // ======================
  // NOTIFICATIONS (SYNC)
  // ======================

  window.sendNotification = () => {
    const text = document.getElementById("notificationText").value.trim();
    if (!text) return;

    let notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    notifications.push({
      message: text,
      time: new Date().toLocaleString()
    });

    localStorage.setItem("notifications", JSON.stringify(notifications));
    document.getElementById("notificationText").value = "";
  };


  // ======================
  // TODO (LECTURER ONLY)
  // ======================

  const todoInput = document.getElementById("todoInput");
  const todoList = document.getElementById("todoList");

  let todos = JSON.parse(localStorage.getItem("lecturerTodos")) || [];

  function renderTodos() {
    todoList.innerHTML = "";

    todos.forEach((todo, index) => {
      const li = document.createElement("li");
      li.textContent = todo.text;
      if (todo.done) li.classList.add("done");

      li.onclick = () => {
        todos[index].done = !todos[index].done;
        saveTodos();
      };

      const del = document.createElement("span");
      del.textContent = " ✖";
      del.style.cursor = "pointer";

      del.onclick = (e) => {
        e.stopPropagation();
        todos.splice(index, 1);
        saveTodos();
      };

      li.appendChild(del);
      todoList.appendChild(li);
    });
  }

  function saveTodos() {
    localStorage.setItem("lecturerTodos", JSON.stringify(todos));
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
