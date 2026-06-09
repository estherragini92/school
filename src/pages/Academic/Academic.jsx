import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaBookOpen,
  FaGraduationCap,
  FaClock,
  FaCalendarAlt,
  FaUser,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "./Academic.css";

const grades = Array.from({ length: 10 }, (_, i) => `Grade ${i + 1}`);
const sections = ["A", "B", "C", "D"];
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const timeSlots = [
  "08:00 AM - 09:00 AM",
  "09:00 AM - 10:00 AM",
  "10:00 AM - 10:30 AM",
  "10:30 AM - 11:30 AM",
  "11:30 AM - 12:30 PM",
];

const defaultSubjects = [
  {
    id: 1,
    name: "Mathematics",
    code: "MATH101",
    teacher: "Sarah Johnson",
    hours: "5h",
    grade: "Grade 6",
  },
];

const defaultExams = [
  {
    id: 1,
    title: "Unit Test Mathematics",
    date: "2026-04-18",
    grade: "Grade 6",
    subject: "Mathematics",
    status: "Scheduled",
    result: "Pending",
  },
];

const defaultPeriods = [
  {
    id: 1,
    grade: "Grade 6",
    day: "Monday",
    time: "08:00 AM - 09:00 AM",
    subject: "Mathematics",
    teacher: "Sarah Johnson",
    room: "Room 201",
    color: "blue",
    warning: "",
  },
];

const emptyClassForm = {
  className: "",
  subject: "",
  room: "",
  students: "",
  schedule: "",
  time: "",
  status: "Active",
};

const emptySubjectForm = {
  name: "",
  code: "",
  teacher: "",
  hours: "",
  grade: "",
};

const emptyExamForm = {
  title: "",
  date: "",
  grade: "",
  subject: "",
  status: "Scheduled",
  result: "",
};

const emptyPeriodForm = {
  grade: "Grade 1",
  day: "Monday",
  time: "08:00 AM - 09:00 AM",
  subject: "",
  teacher: "",
  room: "",
  color: "blue",
  warning: "",
};

function normalizeClass(item) {
  if (item.className) {
    return {
      id: item.id || Date.now(),
      className: item.className,
      subject: item.subject || "",
      room: item.room || "",
      students: Number(item.students || 0),
      schedule: item.schedule || "",
      time: item.time || "",
      status: item.status || "Active",
    };
  }

  return {
    id: item.id || Date.now(),
    className: `Grade ${item.grade || "1"}-${item.section || "A"}`,
    subject: item.subject || "Not Assigned",
    room: item.room ? `Room ${item.room}` : "",
    students: Number(item.students || 0),
    schedule: item.schedule || "",
    time: item.time || "",
    status: item.status || "Active",
  };
}

function Academic() {
  const [activeTab, setActiveTab] = useState("classes");

  const [classes, setClasses] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("classes")) || [];
    return saved.map(normalizeClass);
  });

  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem("subjects");
    return saved ? JSON.parse(saved) : defaultSubjects;
  });

  const [exams, setExams] = useState(() => {
    const saved = localStorage.getItem("exams");
    return saved ? JSON.parse(saved) : defaultExams;
  });

  const [periods, setPeriods] = useState(() => {
    const saved = localStorage.getItem("periods");
    return saved ? JSON.parse(saved) : defaultPeriods;
  });

const [marks, setMarks] = useState(() => {
  return JSON.parse(localStorage.getItem("marks")) || [];
});
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("All Grades");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [classForm, setClassForm] = useState({ ...emptyClassForm });
  const [subjectForm, setSubjectForm] = useState({ ...emptySubjectForm });
  const [examForm, setExamForm] = useState({ ...emptyExamForm });
  const [periodForm, setPeriodForm] = useState({ ...emptyPeriodForm });

useEffect(() => {
  const loadMarks = () => {
    setMarks(JSON.parse(localStorage.getItem("marks")) || []);
  };

  loadMarks();

  window.addEventListener("dashboardUpdate", loadMarks);
  window.addEventListener("storage", loadMarks);

  return () => {
    window.removeEventListener("dashboardUpdate", loadMarks);
    window.removeEventListener("storage", loadMarks);
  };
}, []);

  useEffect(() => {
    const loadClasses = () => {
      const saved = JSON.parse(localStorage.getItem("classes")) || [];
      setClasses(saved.map(normalizeClass));
    };

    loadClasses();

    window.addEventListener("dashboardUpdate", loadClasses);
    window.addEventListener("storage", loadClasses);

    return () => {
      window.removeEventListener("dashboardUpdate", loadClasses);
      window.removeEventListener("storage", loadClasses);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("classes", JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem("subjects", JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem("exams", JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem("periods", JSON.stringify(periods));
  }, [periods]);

  const resetModal = () => {
    setShowModal(false);
    setEditingId(null);
    setClassForm({ ...emptyClassForm });
    setSubjectForm({ ...emptySubjectForm });
    setExamForm({ ...emptyExamForm });
    setPeriodForm({ ...emptyPeriodForm });
  };

  const openAddModal = () => {
    setEditingId(null);

    if (activeTab === "classes") setClassForm({ ...emptyClassForm });
    if (activeTab === "subjects") setSubjectForm({ ...emptySubjectForm });
    if (activeTab === "exams") setExamForm({ ...emptyExamForm });
    if (activeTab === "timetable") {
      setPeriodForm({
        ...emptyPeriodForm,
        grade: gradeFilter === "All Grades" ? "Grade 1" : gradeFilter,
      });
    }

    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);

    if (activeTab === "classes") setClassForm(normalizeClass(item));
    if (activeTab === "subjects") setSubjectForm(item);
    if (activeTab === "exams") setExamForm(item);
    if (activeTab === "timetable") setPeriodForm(item);

    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    if (activeTab === "classes") {
      setClasses((prev) => prev.filter((item) => item.id !== id));
    }

    if (activeTab === "subjects") {
      setSubjects((prev) => prev.filter((item) => item.id !== id));
    }

    if (activeTab === "exams") {
      setExams((prev) => prev.filter((item) => item.id !== id));
    }

    if (activeTab === "timetable") {
      setPeriods((prev) => prev.filter((item) => item.id !== id));
    }

    window.dispatchEvent(new Event("dashboardUpdate"));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (activeTab === "classes") {
      const newClass = {
        id: editingId || Date.now(),
        ...classForm,
        students: Number(classForm.students || 0),
      };

      setClasses((prev) =>
        editingId
          ? prev.map((item) => (item.id === editingId ? newClass : item))
          : [newClass, ...prev]
      );
    }

    if (activeTab === "subjects") {
      const newSubject = {
        id: editingId || Date.now(),
        ...subjectForm,
      };

      setSubjects((prev) =>
        editingId
          ? prev.map((item) => (item.id === editingId ? newSubject : item))
          : [newSubject, ...prev]
      );
    }

    if (activeTab === "exams") {
      const newExam = {
        id: editingId || Date.now(),
        ...examForm,
      };

      setExams((prev) =>
        editingId
          ? prev.map((item) => (item.id === editingId ? newExam : item))
          : [newExam, ...prev]
      );
    }

    if (activeTab === "timetable") {
      const newPeriod = {
        id: editingId || Date.now(),
        ...periodForm,
      };

      setPeriods((prev) =>
        editingId
          ? prev.map((item) => (item.id === editingId ? newPeriod : item))
          : [newPeriod, ...prev]
      );
    }

    window.dispatchEvent(new Event("dashboardUpdate"));
    resetModal();
  };

  const filteredClasses = classes.filter((item) => {
    const keyword = search.toLowerCase().trim();

    const matchesSearch =
      keyword === "" ||
      (item.className || "").toLowerCase().includes(keyword) ||
      (item.subject || "").toLowerCase().includes(keyword) ||
      (item.room || "").toLowerCase().includes(keyword) ||
      (item.schedule || "").toLowerCase().includes(keyword);

    const matchesGrade =
      gradeFilter === "All Grades" ||
      (item.className || "").startsWith(gradeFilter);

    return matchesSearch && matchesGrade;
  });

  const filteredSubjects = subjects.filter((item) => {
    const keyword = search.toLowerCase().trim();

    const matchesSearch =
      keyword === "" ||
      (item.name || "").toLowerCase().includes(keyword) ||
      (item.code || "").toLowerCase().includes(keyword) ||
      (item.teacher || "").toLowerCase().includes(keyword);

    const matchesGrade =
      gradeFilter === "All Grades" || item.grade === gradeFilter;

    return matchesSearch && matchesGrade;
  });

  const filteredExams = exams.filter((item) => {
    const keyword = search.toLowerCase().trim();

    const matchesSearch =
      keyword === "" ||
      (item.title || "").toLowerCase().includes(keyword) ||
      (item.subject || "").toLowerCase().includes(keyword) ||
      (item.status || "").toLowerCase().includes(keyword);

    const matchesGrade =
      gradeFilter === "All Grades" || item.grade === gradeFilter;

    return matchesSearch && matchesGrade;
  });
  const filteredMarks = marks.filter((item) => {
  const keyword = search.toLowerCase().trim();

  const matchesSearch =
    keyword === "" ||
    (item.examType || "").toLowerCase().includes(keyword) ||
    (item.subject || "").toLowerCase().includes(keyword) ||
    (item.studentName || "").toLowerCase().includes(keyword) ||
    (item.className || "").toLowerCase().includes(keyword);

  const matchesGrade =
    gradeFilter === "All Grades" ||
    (item.className || "").startsWith(gradeFilter);

  return matchesSearch && matchesGrade;
});

  const getPeriod = (day, time) => {
    return periods.find(
      (period) =>
        period.day === day &&
        period.time === time &&
        (gradeFilter === "All Grades" || period.grade === gradeFilter) &&
        (search.trim() === "" ||
          (period.subject || "").toLowerCase().includes(search.toLowerCase()) ||
          (period.teacher || "").toLowerCase().includes(search.toLowerCase()))
    );
  };

  return (
    <div className="academic-page">
      <div className="page-title-row">
        <div>
          <h2>Academic Management</h2>
          <p>Classes, subjects, timetable and exams</p>
        </div>

        <button className="add-btn" onClick={openAddModal}>
          <FaPlus />
          {activeTab === "classes" && "Add Class"}
          {activeTab === "subjects" && "Add Subject"}
          {activeTab === "timetable" && "Add Period"}
          {activeTab === "exams" && "Add Exam"}
        </button>
      </div>

      <div className="academic-tabs">
        <button
          onClick={() => setActiveTab("classes")}
          className={activeTab === "classes" ? "active" : ""}
        >
          <FaGraduationCap /> Classes & Sections
        </button>

        <button
          onClick={() => setActiveTab("subjects")}
          className={activeTab === "subjects" ? "active" : ""}
        >
          <FaBookOpen /> Subjects
        </button>

        <button
          onClick={() => setActiveTab("timetable")}
          className={activeTab === "timetable" ? "active" : ""}
        >
          <FaClock /> Timetable
        </button>

        <button
          onClick={() => setActiveTab("exams")}
          className={activeTab === "exams" ? "active" : ""}
        >
          <FaCalendarAlt /> Exams & Results
        </button>
      </div>

      <div className="academic-filter">
        <div className="academic-search">
          <FaSearch />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={gradeFilter}
          onChange={(e) => setGradeFilter(e.target.value)}
        >
          <option value="All Grades">All Grades</option>
          {grades.map((grade) => (
            <option key={grade} value={grade}>
              {grade}
            </option>
          ))}
        </select>
      </div>

      {activeTab === "classes" && (
        <div className="class-grid">
          {filteredClasses.length > 0 ? (
            filteredClasses.map((item) => (
              <div className="class-card" key={item.id}>
                <div className="class-card-top">
                  <div className="class-icon">
                    <FaGraduationCap />
                  </div>

                  <div className="class-actions">
                    <FaEdit onClick={() => openEdit(item)} />
                    <FaTrash onClick={() => handleDelete(item.id)} />
                  </div>
                </div>

                <h3>{item.className}</h3>
                <p>{item.subject || "No subject added"}</p>
                <p>Room: {item.room || "Not assigned"}</p>
                <p>{item.students || 0} Students</p>

                <div className="class-line"></div>

                <p>
                  Schedule: <b>{item.schedule || "Not set"}</b>
                </p>
                <p>
                  Time: <b>{item.time || "Not set"}</b>
                </p>

                <span>{item.status || "Active"}</span>
              </div>
            ))
          ) : (
            <p>No classes added yet</p>
          )}
        </div>
      )}

      {activeTab === "subjects" && (
        <div className="academic-table-card">
          <table>
            <thead>
              <tr>
                <th>Subject Name</th>
                <th>Code</th>
                <th>Teacher</th>
                <th>Hrs/Wk</th>
                <th>Grade</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredSubjects.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>
                    <span className="pill">{item.code}</span>
                  </td>
                  <td>
                    <span className="pill blue">{item.teacher}</span>
                  </td>
                  <td>
                    <span className="pill green">{item.hours}</span>
                  </td>
                  <td>{item.grade}</td>
                  <td>
                    <div className="table-actions">
                      <FaEdit onClick={() => openEdit(item)} />
                      <FaTrash onClick={() => handleDelete(item.id)} />
                    </div>
                  </td>
                </tr>
              ))}

              {filteredSubjects.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: 25 }}>
                    No subjects found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "timetable" && (
        <div className="timetable-card">
          <div className="timetable-grid">
            <div className="time-head">TIME</div>

            {days.map((day) => (
              <div className="day-head" key={day}>
                {day.toUpperCase()}
              </div>
            ))}

            {timeSlots.map((time) => (
              <div className="time-row" key={time}>
                <div className="time-cell">{time}</div>

                {days.map((day) => {
                  if (time === "10:00 AM - 10:30 AM") {
                    return (
                      <div className="period-card lunch" key={`${day}-${time}`}>
                        <h4>BREAK</h4>
                      </div>
                    );
                  }

                  const period = getPeriod(day, time);

                  return period ? (
                    <div
                      className={`period-card ${period.color}`}
                      key={`${day}-${time}`}
                    >
                      <div className="period-top">
                        <h4>{period.subject}</h4>
                        <div className="period-actions">
                          <FaEdit onClick={() => openEdit(period)} />
                          <FaTrash onClick={() => handleDelete(period.id)} />
                        </div>
                      </div>

                      <p>
                        <FaUser /> {period.teacher}
                      </p>
                      <p>
                        <FaMapMarkerAlt /> {period.room}
                      </p>

                      {period.warning && (
                        <div className="period-warning">{period.warning}</div>
                      )}
                    </div>
                  ) : (
                    <button
                      className="period-card add-period"
                      key={`${day}-${time}`}
                      onClick={() => {
                        setEditingId(null);
                        setPeriodForm({
                          ...emptyPeriodForm,
                          grade:
                            gradeFilter === "All Grades"
                              ? "Grade 1"
                              : gradeFilter,
                          day,
                          time,
                        });
                        setShowModal(true);
                      }}
                    >
                      +<br />
                      Add Period
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

     {activeTab === "exams" && (
  <div className="exam-list">
    {filteredMarks.length > 0 ? (
      filteredMarks.map((item) => (
        <div className="exam-card" key={item.id}>
          <div className="exam-icon">
            <FaGraduationCap />
          </div>

          <div>
            <h3>
              {item.examType} - {item.subject}
              <span className="exam-status completed">Completed</span>
            </h3>

            <p>
              {item.className}
              {item.section ? `-${item.section}` : ""} · {item.studentName}
            </p>

            <p className="passed">
              Marks: {item.marksObtained}/{item.totalMarks} · Percentage:{" "}
              {item.percentage}% · Grade {item.grade}
            </p>
          </div>
        </div>
      ))
    ) : (
      <p>No exam marks added yet</p>
    )}
  </div>
)}

      {showModal && (
        <div className="modal-overlay">
          <div className="academic-modal">
            <div className="modal-header">
              <h3>
                {editingId ? "Edit" : "Add New"}{" "}
                {activeTab === "classes" && "Class"}
                {activeTab === "subjects" && "Subject"}
                {activeTab === "timetable" && "Period"}
                {activeTab === "exams" && "Exam"}
              </h3>

              <button onClick={resetModal}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {activeTab === "classes" && (
                <div className="form-grid">
                  <div className="form-group">
                    <label>Class Name</label>
                    <select
                      value={classForm.className}
                      onChange={(e) =>
                        setClassForm({
                          ...classForm,
                          className: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select Class</option>
                      {grades.map((grade) =>
                        sections.map((section) => (
                          <option key={`${grade}-${section}`}>
                            {grade}-{section}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Subject</label>
                    <input
                      value={classForm.subject}
                      onChange={(e) =>
                        setClassForm({
                          ...classForm,
                          subject: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Room</label>
                    <input
                      value={classForm.room}
                      onChange={(e) =>
                        setClassForm({ ...classForm, room: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Students</label>
                    <input
                      type="number"
                      value={classForm.students}
                      onChange={(e) =>
                        setClassForm({
                          ...classForm,
                          students: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Schedule</label>
                    <input
                      value={classForm.schedule}
                      onChange={(e) =>
                        setClassForm({
                          ...classForm,
                          schedule: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Time</label>
                    <input
                      value={classForm.time}
                      onChange={(e) =>
                        setClassForm({ ...classForm, time: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group full">
                    <label>Status</label>
                    <select
                      value={classForm.status}
                      onChange={(e) =>
                        setClassForm({ ...classForm, status: e.target.value })
                      }
                    >
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === "subjects" && (
                <div className="form-grid">
                  <div className="form-group">
                    <label>Subject Name</label>
                    <input
                      value={subjectForm.name}
                      onChange={(e) =>
                        setSubjectForm({ ...subjectForm, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Code</label>
                    <input
                      value={subjectForm.code}
                      onChange={(e) =>
                        setSubjectForm({ ...subjectForm, code: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Teacher</label>
                    <input
                      value={subjectForm.teacher}
                      onChange={(e) =>
                        setSubjectForm({
                          ...subjectForm,
                          teacher: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Hours / Week</label>
                    <input
                      value={subjectForm.hours}
                      onChange={(e) =>
                        setSubjectForm({
                          ...subjectForm,
                          hours: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-group full">
                    <label>Grade</label>
                    <select
                      value={subjectForm.grade}
                      onChange={(e) =>
                        setSubjectForm({
                          ...subjectForm,
                          grade: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select Grade</option>
                      {grades.map((grade) => (
                        <option key={grade}>{grade}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
{activeTab === "timetable" && (
  <div className="form-grid">
    <div className="form-group">
      <label>Grade</label>
      <select
        value={periodForm.grade}
        onChange={(e) =>
          setPeriodForm({ ...periodForm, grade: e.target.value })
        }
        required
      >
        <option value="">Select Grade</option>
        {grades.map((grade) => (
          <option key={grade} value={grade}>
            {grade}
          </option>
        ))}
      </select>
    </div>

    <div className="form-group">
      <label>Day</label>
      <select
        value={periodForm.day}
        onChange={(e) =>
          setPeriodForm({ ...periodForm, day: e.target.value })
        }
        required
      >
        <option value="">Select Day</option>
        {days.map((day) => (
          <option key={day} value={day}>
            {day}
          </option>
        ))}
      </select>
    </div>

    <div className="form-group">
      <label>Time Slot</label>
      <select
        value={periodForm.time}
        onChange={(e) =>
          setPeriodForm({ ...periodForm, time: e.target.value })
        }
        required
      >
        <option value="">Select Time</option>
        {timeSlots
          .filter((slot) => slot !== "10:00 AM - 10:30 AM")
          .map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
      </select>
    </div>

    <div className="form-group">
      <label>Subject</label>
      <input
        value={periodForm.subject}
        onChange={(e) =>
          setPeriodForm({ ...periodForm, subject: e.target.value })
        }
        required
      />
    </div>

    <div className="form-group">
      <label>Teacher</label>
      <input
        value={periodForm.teacher}
        onChange={(e) =>
          setPeriodForm({ ...periodForm, teacher: e.target.value })
        }
        required
      />
    </div>

    <div className="form-group">
      <label>Room</label>
      <input
        value={periodForm.room}
        onChange={(e) =>
          setPeriodForm({ ...periodForm, room: e.target.value })
        }
        required
      />
    </div>

    <div className="form-group">
      <label>Color</label>
      <select
        value={periodForm.color}
        onChange={(e) =>
          setPeriodForm({ ...periodForm, color: e.target.value })
        }
      >
        <option value="blue">Blue</option>
        <option value="green">Green</option>
        <option value="purple">Purple</option>
        <option value="orange">Orange</option>
        <option value="red">Red</option>
      </select>
    </div>

    <div className="form-group full">
      <label>Warning</label>
      <input
        value={periodForm.warning}
        onChange={(e) =>
          setPeriodForm({ ...periodForm, warning: e.target.value })
        }
        placeholder="Optional"
      />
    </div>
  </div>
)}      
              
              {activeTab === "exams" && (
                <div className="form-grid">
                  <div className="form-group full">
                    <label>Exam Title</label>
                    <input
                      value={examForm.title}
                      onChange={(e) =>
                        setExamForm({ ...examForm, title: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      value={examForm.date}
                      onChange={(e) =>
                        setExamForm({ ...examForm, date: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Grade</label>
                    <select
                      value={examForm.grade}
                      onChange={(e) =>
                        setExamForm({ ...examForm, grade: e.target.value })
                      }
                      required
                    >
                      <option value="">Select Grade</option>
                      {grades.map((grade) => (
                        <option key={grade}>{grade}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Subject</label>
                    <input
                      value={examForm.subject}
                      onChange={(e) =>
                        setExamForm({ ...examForm, subject: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={examForm.status}
                      onChange={(e) =>
                        setExamForm({ ...examForm, status: e.target.value })
                      }
                    >
                      <option>Completed</option>
                      <option>Scheduled</option>
                      <option>Planning</option>
                      <option>Upcoming</option>
                    </select>
                  </div>

                  <div className="form-group full">
                    <label>Result</label>
                    <input
                      value={examForm.result}
                      onChange={(e) =>
                        setExamForm({ ...examForm, result: e.target.value })
                      }
                      placeholder="Pending / 30 Passed"
                    />
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={resetModal}>
                  Cancel
                </button>

                <button type="submit" className="save-btn">
                  {editingId ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Academic;