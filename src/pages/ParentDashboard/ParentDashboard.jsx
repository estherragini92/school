import { useEffect, useState } from "react";
import {
  FaUserGraduate,
  FaCalendarCheck,
  FaClipboardList,
  FaMoneyBillWave,
  FaBell,
  FaChartLine,
} from "react-icons/fa";
import "./ParentDashboard.css";

function ParentDashboard() {
  const [data, setData] = useState({
    students: [],
    attendance: [],
    marks: [],
    assignments: [],
    fees: [],
    notifications: [],
  });

  const [selectedChildId, setSelectedChildId] = useState("");

  const loadData = () => {
    const students = JSON.parse(localStorage.getItem("students")) || [];
    const attendance =
      JSON.parse(localStorage.getItem("studentAttendance")) || [];
    const marks = JSON.parse(localStorage.getItem("marks")) || [];
    const assignments = JSON.parse(localStorage.getItem("assignments")) || [];
    const fees = JSON.parse(localStorage.getItem("feePayments")) || [];
    const notifications =
      JSON.parse(localStorage.getItem("teacherNotifications")) || [];

    setData({
      students,
      attendance,
      marks,
      assignments,
      fees,
      notifications,
    });

    if (students.length > 0) {
      setSelectedChildId((prev) => prev || String(students[0].id));
    }
  };

  useEffect(() => {
    loadData();

    window.addEventListener("dashboardUpdate", loadData);
    window.addEventListener("teacherNotificationUpdate", loadData);
    window.addEventListener("storage", loadData);

    return () => {
      window.removeEventListener("dashboardUpdate", loadData);
      window.removeEventListener("teacherNotificationUpdate", loadData);
      window.removeEventListener("storage", loadData);
    };
  }, []);

  const child =
    data.students.find((student) => String(student.id) === selectedChildId) ||
    data.students[0];

  const childId = child?.id;
  const childName = child?.name || "";
  const childGrade = child?.className || child?.grade || "";
  const childSection = child?.section || "";

  const gradeText = childGrade ? `Grade ${childGrade}` : "Grade N/A";
  const sectionText = childSection ? `Section ${childSection}` : "Section N/A";

  const childAttendance = data.attendance.filter(
    (item) =>
      String(item.studentId) === String(childId) ||
      item.studentName === childName ||
      item.name === childName
  );

  const presentCount = childAttendance.filter(
    (item) => item.status === "Present"
  ).length;

  const attendancePercent =
    childAttendance.length > 0
      ? Math.round((presentCount / childAttendance.length) * 100)
      : Number(child?.attendance || 0);

  const childMarks = data.marks.filter(
    (item) =>
      String(item.studentId) === String(childId) ||
      item.studentName === childName ||
      item.name === childName
  );

  const averageMarks =
    childMarks.length > 0
      ? Math.round(
          childMarks.reduce(
            (sum, item) =>
              sum + Number(item.percentage || item.marks || item.score || 0),
            0
          ) / childMarks.length
        )
      : Number(child?.performance || 0);

  const childAssignments = data.assignments.filter((item) => {
    const assignmentGrade = String(
      item.className || item.grade || item.class || ""
    );

    return (
      String(item.studentId) === String(childId) ||
      item.studentName === childName ||
      assignmentGrade === String(childGrade) ||
      assignmentGrade === `Grade ${childGrade}` ||
      assignmentGrade === `${childGrade}-${childSection}` ||
      assignmentGrade === `Grade ${childGrade}-${childSection}`
    );
  });

  const pendingAssignments = childAssignments.filter(
    (item) => item.status !== "Completed"
  ).length;

  const childFees = data.fees.filter((item) => {
    const feeStudentName = item.student || item.studentName || item.name || "";

    return (
      String(item.studentId) === String(childId) ||
      feeStudentName.toLowerCase().trim() === childName.toLowerCase().trim()
    );
  });

  const totalPaid = childFees
    .filter((item) => item.status === "Paid")
    .reduce((sum, item) => {
      return sum + Number(item.amount || item.paidAmount || 0);
    }, 0);

  const childNotifications = data.notifications.filter((note) => {
    const notificationGrade = String(
      note.className || note.grade || note.class || ""
    );

    return (
      !notificationGrade ||
      String(note.studentId) === String(childId) ||
      note.studentName === childName ||
      notificationGrade === String(childGrade) ||
      notificationGrade === `Grade ${childGrade}` ||
      notificationGrade === `${childGrade}-${childSection}` ||
      notificationGrade === `Grade ${childGrade}-${childSection}`
    );
  });

  return (
    <div className="parent-dashboard-page">
      <div className="parent-dashboard-header">
        <div>
          <h2>Parent Dashboard</h2>
          <p>Track your child&apos;s academic progress and updates</p>
        </div>

        {data.students.length > 0 && (
          <select
            className="child-select"
            value={selectedChildId}
            onChange={(e) => setSelectedChildId(e.target.value)}
          >
            {data.students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name} - Grade{" "}
                {student.className || student.grade || "N/A"}{" "}
                {student.section || ""}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="parent-child-card">
        <div className="parent-child-avatar">
          {child?.photo ? (
            <img src={child.photo} alt={child.name} />
          ) : (
            <FaUserGraduate />
          )}
        </div>

        <div>
          <h3>{child?.name || "No child added"}</h3>

          <p>
            {child
              ? `${gradeText} - ${sectionText} · Roll No: ${
                  child.rollNo || "N/A"
                }`
              : "Add student details from Admin User Management"}
          </p>

          <p>Parent: {child?.parentName || child?.parent || "Not added"}</p>
        </div>
      </div>

      <div className="parent-stats-grid">
        <div className="parent-stat-card">
          <FaCalendarCheck />
          <div>
            <p>Attendance</p>
            <h3>{attendancePercent}%</h3>
          </div>
        </div>

        <div className="parent-stat-card">
          <FaChartLine />
          <div>
            <p>Average Marks</p>
            <h3>{averageMarks}%</h3>
          </div>
        </div>

        <div className="parent-stat-card">
          <FaClipboardList />
          <div>
            <p>Pending Assignments</p>
            <h3>{pendingAssignments}</h3>
          </div>
        </div>

        <div className="parent-stat-card">
          <FaMoneyBillWave />
          <div>
            <p>Total Paid Fees</p>
            <h3>₹{totalPaid.toLocaleString("en-IN")}</h3>
          </div>
        </div>
      </div>

      <div className="parent-card">
        <h3>Attendance Status</h3>

        {childAttendance.length > 0 ? (
          childAttendance.slice(0, 7).map((item, index) => (
            <div className="parent-list-item" key={item.id || index}>
              <div>
                <h4>{item.date || "Date not added"}</h4>
                <p>{childName}</p>
              </div>

              <span
                className={
                  item.status === "Present"
                    ? "attendance-present"
                    : "attendance-absent"
                }
              >
                {item.status}
              </span>
            </div>
          ))
        ) : (
          <p>No attendance added yet</p>
        )}
      </div>

      <div className="parent-dashboard-grid">
        <div className="parent-card">
          <h3>Recent Marks</h3>

          {childMarks.length > 0 ? (
            childMarks.slice(0, 5).map((mark, index) => (
              <div className="parent-list-item" key={mark.id || index}>
                <div>
                  <h4>{mark.subject || "Subject"}</h4>
                  <p>{mark.examType || mark.exam || "Exam"}</p>
                </div>
                <strong>{mark.percentage || mark.marks || 0}%</strong>
              </div>
            ))
          ) : (
            <p>No marks added yet</p>
          )}
        </div>

        <div className="parent-card">
          <h3>Fee Payments</h3>

          {childFees.length > 0 ? (
            childFees.slice(0, 5).map((fee, index) => (
              <div className="parent-list-item" key={fee.id || index}>
                <div>
                  <h4>{fee.receipt || "Receipt"}</h4>
                  <p>
                    {fee.date || "Date not added"} ·{" "}
                    {fee.method || "Method not added"}
                  </p>
                </div>

                <strong>
                  ₹{Number(fee.amount || fee.paidAmount || 0).toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>
            ))
          ) : (
            <p>No fee payment added yet</p>
          )}
        </div>

        <div className="parent-card">
          <h3>Assignments</h3>

          {childAssignments.length > 0 ? (
            childAssignments.slice(0, 5).map((item, index) => (
              <div className="parent-list-item" key={item.id || index}>
                <div>
                  <h4>{item.title || "Assignment"}</h4>
                  <p>
                    {item.className || item.grade || gradeText} · Due:{" "}
                    {item.dueDate || "Not added"}
                  </p>
                </div>
                <span>{item.status || "Pending"}</span>
              </div>
            ))
          ) : (
            <p>No assignments yet</p>
          )}
        </div>

        <div className="parent-card">
          <h3>Notifications</h3>

          {childNotifications.length > 0 ? (
            childNotifications.slice(0, 5).map((note, index) => (
              <div className="parent-notification" key={note.id || index}>
                <FaBell />
                <div>
                  <h4>{note.title || note.text || "Notification"}</h4>
                  <p>{note.message || note.description || ""}</p>
                  <small>{note.date || note.time || ""}</small>
                </div>
              </div>
            ))
          ) : (
            <p>No notifications yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ParentDashboard;