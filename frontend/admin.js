// ======================
// SHARED DATA (JSON)
// ======================

let students = JSON.parse(localStorage.getItem("students")) || [];
let lecturers = JSON.parse(localStorage.getItem("lecturers")) || [];
let courses = JSON.parse(localStorage.getItem("courses")) || [];

// ======================
// DASHBOARD COUNTS
// ======================

function updateCounts() {
  document.getElementById("studentCount").textContent = students.length;
  document.getElementById("lecturerCount").textContent = lecturers.length;
  document.getElementById("courseCount").textContent = courses.length;
}

// ======================
// ADD STUDENT
// ======================

function addStudent() {
  const name = document.getElementById("studentName").value.trim();
  const year = document.getElementById("studentYear").value.trim();

  if (!name || !year) return alert("Enter all fields");

  const student = {
    id: Date.now(),
    name,
    year,
    username: name.toLowerCase().replace(/\s/g, ""),
    password: "stud123"
  };

  students.push(student);
  localStorage.setItem("students", JSON.stringify(students));

  document.getElementById("studentName").value = "";
  document.getElementById("studentYear").value = "";

  updateCounts();
  alert("Student added & synced");
}

// ======================
// ADD LECTURER
// ======================

function addLecturer() {
  const name = document.getElementById("lecturerName").value.trim();
  if (!name) return alert("Enter lecturer name");

  const lecturer = {
    id: Date.now(),
    name,
    username: name.toLowerCase().replace(/\s/g, ""),
    password: "lect123"
  };

  lecturers.push(lecturer);
  localStorage.setItem("lecturers", JSON.stringify(lecturers));

  document.getElementById("lecturerName").value = "";
  updateCounts();
  alert("Lecturer added & synced");
}

// ======================
// ADD COURSE
// ======================

function addCourse() {
  const name = document.getElementById("courseName").value.trim();
  if (!name) return alert("Enter course name");

  const course = {
    id: Date.now(),
    name,
    lecturer: null
  };

  courses.push(course);
  localStorage.setItem("courses", JSON.stringify(courses));

  document.getElementById("courseName").value = "";
  updateCounts();
  alert("Course created");
}

// ======================
// LOGOUT
// ======================

function logout() {
  window.location.href = "index.html";
}

// ======================
// INIT
// ======================

updateCounts();
