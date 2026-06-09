import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  FaPlus,
  FaSearch,
  FaFileImport,
  FaEdit,
  FaTrash,
  FaEye,
  FaTimes,
  FaCamera,
} from "react-icons/fa";
import "./UserManagement.css";

const defaultStudents = [
  {
    id: 1,
    name: "Arjun Kumar",
    rollNo: "STU001",
    className: "5",
    section: "A",
    parent: "Ravi Kumar",
    parentEmail: "ravi@example.com",
    phone: "9876543210",
    email: "",
    address: "",
    status: "Active",
    photo: "",
  },
];

const defaultStaff = [
  {
    id: 1,
    name: "Sarah Connor",
    employeeId: "EMP001",
    department: "Mathematics",
    role: "Teacher",
    phone: "9876543201",
    email: "sarah@example.com",
    status: "Active",
  },
];

const defaultParents = [
  {
    id: 1,
    name: "Ravi Kumar",
    student: "Arjun Kumar",
    relation: "Father",
    phone: "9876543210",
    email: "ravi@example.com",
    status: "Active",
  },
];

const emptyStudentForm = {
  name: "",
  rollNo: "",
  className: "",
  section: "",
  parent: "",
  parentEmail: "",
  phone: "",
  email: "",
  address: "",
  status: "Active",
  photo: "",
};

const emptyStaffForm = {
  name: "",
  employeeId: "",
  department: "",
  role: "",
  phone: "",
  email: "",
  status: "Active",
};

const emptyParentForm = {
  name: "",
  student: "",
  relation: "",
  phone: "",
  email: "",
  status: "Active",
};

function UserManagement() {
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("students");

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem("students");
    return saved ? JSON.parse(saved) : defaultStudents;
  });

  const [staff, setStaff] = useState(() => {
    const saved = localStorage.getItem("staff");
    return saved ? JSON.parse(saved) : defaultStaff;
  });

  const [parents, setParents] = useState(() => {
    const saved = localStorage.getItem("parents");
    return saved ? JSON.parse(saved) : defaultParents;
  });

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [studentForm, setStudentForm] = useState({ ...emptyStudentForm });
  const [staffForm, setStaffForm] = useState({ ...emptyStaffForm });
  const [parentForm, setParentForm] = useState({ ...emptyParentForm });

  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("All Grades");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [commonSearch, setCommonSearch] = useState("");

  useEffect(() => {
    if (location.state?.openAddStudent) {
      setActiveTab("students");
      setEditingId(null);
      setStudentForm({ ...emptyStudentForm });
      setShowModal(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
    window.dispatchEvent(new Event("dashboardUpdate"));
  }, [students]);

  useEffect(() => {
    localStorage.setItem("staff", JSON.stringify(staff));
    window.dispatchEvent(new Event("dashboardUpdate"));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem("parents", JSON.stringify(parents));
    window.dispatchEvent(new Event("dashboardUpdate"));
  }, [parents]);

  useEffect(() => {
    const handleCommonSearch = (e) => {
      setCommonSearch(e.detail.toLowerCase());
    };

    window.addEventListener("commonSearch", handleCommonSearch);

    return () => {
      window.removeEventListener("commonSearch", handleCommonSearch);
    };
  }, []);

  const addDashboardActivity = (message) => {
    const oldActivities =
      JSON.parse(localStorage.getItem("dashboardActivities")) || [];

    const updatedActivities = [message, ...oldActivities].slice(0, 10);

    localStorage.setItem(
      "dashboardActivities",
      JSON.stringify(updatedActivities)
    );

    window.dispatchEvent(new Event("dashboardUpdate"));
  };

  const resetModal = () => {
    setShowModal(false);
    setEditingId(null);
    setStudentForm({ ...emptyStudentForm });
    setStaffForm({ ...emptyStaffForm });
    setParentForm({ ...emptyParentForm });
  };

  const openEditModal = (item) => {
    setEditingId(item.id);

    if (activeTab === "students") {
      setStudentForm({
        name: item.name || "",
        rollNo: item.rollNo || "",
        className: item.className || "",
        section: item.section || "",
        parent: item.parent || "",
        parentEmail: item.parentEmail || "",
        phone: item.phone || "",
        email: item.email || "",
        address: item.address || "",
        status: item.status || "Active",
        photo: item.photo || "",
      });
    }

    if (activeTab === "staff") {
      setStaffForm({
        name: item.name || "",
        employeeId: item.employeeId || "",
        department: item.department || "",
        role: item.role || "",
        phone: item.phone || "",
        email: item.email || "",
        status: item.status || "Active",
      });
    }

    if (activeTab === "parents") {
      setParentForm({
        name: item.name || "",
        student: item.student || "",
        relation: item.relation || "",
        phone: item.phone || "",
        email: item.email || "",
        status: item.status || "Active",
      });
    }

    setShowModal(true);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setStudentForm((prev) => ({
        ...prev,
        photo: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

const createParentFromStudent = (student) => {
  if (!student.parent || !student.phone) return;

  setParents((prevParents) => {
    const existingParent = prevParents.find(
      (parent) =>
        parent.phone === student.phone ||
        parent.name?.toLowerCase() === student.parent?.toLowerCase()
    );

    if (existingParent) {
      return prevParents.map((parent) =>
        parent.id === existingParent.id
          ? {
              ...parent,
              name: student.parent,
              phone: student.phone,
              email: student.parentEmail || parent.email,
              student: parent.student?.includes(student.name)
                ? parent.student
                : `${parent.student}, ${student.name}`,
              status: "Active",
            }
          : parent
      );
    }

    const newParent = {
      id: Date.now() + Math.random(),
      name: student.parent,
      student: student.name,
      relation: "Parent",
      phone: student.phone,
      email: student.parentEmail || "",
      status: "Active",
    };

    return [newParent, ...prevParents];
  });

  window.dispatchEvent(new Event("dashboardUpdate"));
};


  const handleSubmit = (e) => {
    e.preventDefault();

    if (activeTab === "students") {
      if (editingId) {
        const updatedStudent = {
          id: editingId,
          ...studentForm,
        };

        setStudents((prev) =>
          prev.map((item) => (item.id === editingId ? updatedStudent : item))
        );

        createParentFromStudent(updatedStudent);
        addDashboardActivity(`${studentForm.name} details updated`);
      } else {
        const newStudent = {
          id: Date.now(),
          ...studentForm,
        };

        setStudents((prev) => [newStudent, ...prev]);
        createParentFromStudent(newStudent);

        addDashboardActivity(
          `${studentForm.name} admitted to Grade ${studentForm.className}`
        );
      }
    }

    if (activeTab === "staff") {
      if (editingId) {
        setStaff((prev) =>
          prev.map((item) =>
            item.id === editingId ? { ...item, ...staffForm } : item
          )
        );

        addDashboardActivity(`${staffForm.name} staff details updated`);
      } else {
        setStaff((prev) => [{ id: Date.now(), ...staffForm }, ...prev]);
        addDashboardActivity(`${staffForm.name} added to staff`);
      }
    }

    if (activeTab === "parents") {
      if (editingId) {
        setParents((prev) =>
          prev.map((item) =>
            item.id === editingId ? { ...item, ...parentForm } : item
          )
        );

        addDashboardActivity(`${parentForm.name} parent details updated`);
      } else {
        setParents((prev) => [{ id: Date.now(), ...parentForm }, ...prev]);
        addDashboardActivity(`${parentForm.name} added as parent`);
      }
    }

    resetModal();
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    if (activeTab === "students") {
      const deleted = students.find((item) => item.id === id);
      setStudents((prev) => prev.filter((item) => item.id !== id));

      if (deleted) {
        addDashboardActivity(`${deleted.name} removed from student records`);
      }
    }

    if (activeTab === "staff") {
      const deleted = staff.find((item) => item.id === id);
      setStaff((prev) => prev.filter((item) => item.id !== id));

      if (deleted) {
        addDashboardActivity(`${deleted.name} removed from staff records`);
      }
    }

    if (activeTab === "parents") {
      const deleted = parents.find((item) => item.id === id);
      setParents((prev) => prev.filter((item) => item.id !== id));

      if (deleted) {
        addDashboardActivity(`${deleted.name} removed from parent records`);
      }
    }
  };

  const filteredStudents = students.filter((student) => {
    const keyword = (searchTerm || commonSearch).toLowerCase().trim();

    const matchesSearch =
      keyword === "" ||
      student.name?.toLowerCase().includes(keyword) ||
      student.rollNo?.toLowerCase().includes(keyword) ||
      student.parent?.toLowerCase().includes(keyword) ||
      student.phone?.includes(keyword) ||
      student.email?.toLowerCase().includes(keyword) ||
      String(student.className || "").toLowerCase().includes(keyword) ||
      student.section?.toLowerCase().includes(keyword);

    const matchesClass =
      classFilter === "All Grades" ||
      String(student.className) === classFilter ||
      String(student.className) === classFilter.replace("Grade ", "");

    const matchesStatus =
      statusFilter === "All Status" || student.status === statusFilter;

    return matchesSearch && matchesClass && matchesStatus;
  });

  const filteredStaff = staff.filter((item) => {
    const keyword = (searchTerm || commonSearch).toLowerCase().trim();

    const matchesSearch =
      keyword === "" ||
      item.name?.toLowerCase().includes(keyword) ||
      item.employeeId?.toLowerCase().includes(keyword) ||
      item.department?.toLowerCase().includes(keyword) ||
      item.role?.toLowerCase().includes(keyword) ||
      item.phone?.includes(keyword) ||
      item.email?.toLowerCase().includes(keyword);

    const matchesStatus =
      statusFilter === "All Status" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const filteredParents = parents.filter((item) => {
    const keyword = (searchTerm || commonSearch).toLowerCase().trim();

    const matchesSearch =
      keyword === "" ||
      item.name?.toLowerCase().includes(keyword) ||
      item.student?.toLowerCase().includes(keyword) ||
      item.relation?.toLowerCase().includes(keyword) ||
      item.phone?.includes(keyword) ||
      item.email?.toLowerCase().includes(keyword);

    const matchesStatus =
      statusFilter === "All Status" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="user-page">
      <div className="page-title-row">
        <div>
          <h2>User Management</h2>
          <p>Manage students, staff and parents across the school</p>
        </div>

        <div className="page-actions">
          <button type="button" className="import-btn">
            <FaFileImport />
            Import Excel
          </button>

          <button
            type="button"
            className="add-btn"
            onClick={() => {
              setEditingId(null);
              setStudentForm({ ...emptyStudentForm });
              setStaffForm({ ...emptyStaffForm });
              setParentForm({ ...emptyParentForm });
              setShowModal(true);
            }}
          >
            <FaPlus />
            {activeTab === "students" && "Add Student"}
            {activeTab === "staff" && "Add Staff"}
            {activeTab === "parents" && "Add Parent"}
          </button>
        </div>
      </div>

      <div className="tabs">
        <button
          type="button"
          className={activeTab === "students" ? "tab active" : "tab"}
          onClick={() => setActiveTab("students")}
        >
          Students <span>{students.length}</span>
        </button>

        <button
          type="button"
          className={activeTab === "staff" ? "tab active" : "tab"}
          onClick={() => setActiveTab("staff")}
        >
          Staff <span>{staff.length}</span>
        </button>

        <button
          type="button"
          className={activeTab === "parents" ? "tab active" : "tab"}
          onClick={() => setActiveTab("parents")}
        >
          Parents <span>{parents.length}</span>
        </button>
      </div>

      <div className="filter-card">
        <div className="student-search">
          <FaSearch />
          <input
            type="text"
            placeholder="Search name, ID, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {activeTab === "students" && (
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
          >
            <option value="All Grades">All Grades</option>

            {Array.from({ length: 10 }, (_, i) => (
              <option key={i + 1} value={`Grade ${i + 1}`}>
                Grade {i + 1}
              </option>
            ))}
          </select>
        )}

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {activeTab === "students" && (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll No</th>
                <th>Grade</th>
                <th>Parent</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <div className="student-info">
                        {student.photo ? (
                          <img
                            src={student.photo}
                            alt={student.name}
                            className="student-photo"
                          />
                        ) : (
                          <div className="student-avatar">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span>{student.name}</span>
                      </div>
                    </td>

                    <td>{student.rollNo}</td>
                    <td>
                      Grade {student.className} - {student.section}
                    </td>
                    <td>{student.parent}</td>
                    <td>{student.phone}</td>
                    <td>
                      <span
                        className={
                          student.status === "Active"
                            ? "status active-status"
                            : "status inactive-status"
                        }
                      >
                        {student.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-icons">
                        <button type="button" title="View">
                          <FaEye />
                        </button>

                        <button
                          type="button"
                          onClick={() => openEditModal(student)}
                        >
                          <FaEdit />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(student.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: 25 }}>
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "staff" && (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Staff</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredStaff.length > 0 ? (
                filteredStaff.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="student-info">
                        <div className="student-avatar">
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td>{item.employeeId}</td>
                    <td>{item.department}</td>
                    <td>{item.role}</td>
                    <td>{item.phone}</td>
                    <td>{item.email}</td>
                    <td>
                      <span
                        className={
                          item.status === "Active"
                            ? "status active-status"
                            : "status inactive-status"
                        }
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-icons">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: 25 }}>
                    No staff found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "parents" && (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Parent</th>
                <th>Student</th>
                <th>Relation</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredParents.length > 0 ? (
                filteredParents.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="student-info">
                        <div className="student-avatar">
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td>{item.student}</td>
                    <td>{item.relation}</td>
                    <td>{item.phone}</td>
                    <td>{item.email}</td>
                    <td>
                      <span
                        className={
                          item.status === "Active"
                            ? "status active-status"
                            : "status inactive-status"
                        }
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-icons">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: 25 }}>
                    No parents found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="student-modal">
            <div className="modal-header">
              <h3>
                {editingId ? "Edit" : "Add"}{" "}
                {activeTab === "students" && "Student"}
                {activeTab === "staff" && "Staff"}
                {activeTab === "parents" && "Parent"}
              </h3>

              <button type="button" onClick={resetModal}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {activeTab === "students" && (
                <>
                  <div className="photo-upload">
                    {studentForm.photo ? (
                      <img
                        src={studentForm.photo}
                        alt="Student"
                        className="photo-preview"
                      />
                    ) : (
                      <div className="photo-circle">
                        <FaCamera />
                      </div>
                    )}

                    <label className="upload-photo-btn">
                      Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        hidden
                      />
                    </label>
                  </div>

                  <h4>Student Information</h4>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>Student Name</label>
                      <input
                        value={studentForm.name}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Roll Number</label>
                      <input
                        value={studentForm.rollNo}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            rollNo: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Grade</label>
                      <select
                        value={studentForm.className}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            className: e.target.value,
                          })
                        }
                        required
                      >
                        <option value="">Select Grade</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((grade) => (
                          <option key={grade} value={grade}>
                            Grade {grade}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Section</label>
                      <select
                        value={studentForm.section}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            section: e.target.value,
                          })
                        }
                        required
                      >
                        <option value="">Select Section</option>
                        <option>A</option>
                        <option>B</option>
                        <option>C</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        value={studentForm.email}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Status</label>
                      <select
                        value={studentForm.status}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            status: e.target.value,
                          })
                        }
                      >
                        <option>Active</option>
                        <option>Inactive</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Parent Name</label>
                      <input
                        value={studentForm.parent}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            parent: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        value={studentForm.phone}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            phone: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Parent Email</label>
                      <input
                        type="email"
                        value={studentForm.parentEmail}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            parentEmail: e.target.value,
                          })
                        }
                        placeholder="parent@school.com"
                      />
                    </div>

                    <div className="form-group full">
                      <label>Address</label>
                      <textarea
                        value={studentForm.address}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            address: e.target.value,
                          })
                        }
                      ></textarea>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "staff" && (
                <div className="form-grid">
                  <div className="form-group">
                    <label>Staff Name</label>
                    <input
                      value={staffForm.name}
                      onChange={(e) =>
                        setStaffForm({ ...staffForm, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Employee ID</label>
                    <input
                      value={staffForm.employeeId}
                      onChange={(e) =>
                        setStaffForm({
                          ...staffForm,
                          employeeId: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Department</label>
                    <input
                      value={staffForm.department}
                      onChange={(e) =>
                        setStaffForm({
                          ...staffForm,
                          department: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Role</label>
                    <input
                      value={staffForm.role}
                      onChange={(e) =>
                        setStaffForm({ ...staffForm, role: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      value={staffForm.phone}
                      onChange={(e) =>
                        setStaffForm({ ...staffForm, phone: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={staffForm.email}
                      onChange={(e) =>
                        setStaffForm({ ...staffForm, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group full">
                    <label>Status</label>
                    <select
                      value={staffForm.status}
                      onChange={(e) =>
                        setStaffForm({ ...staffForm, status: e.target.value })
                      }
                    >
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === "parents" && (
                <div className="form-grid">
                  <div className="form-group">
                    <label>Parent Name</label>
                    <input
                      value={parentForm.name}
                      onChange={(e) =>
                        setParentForm({ ...parentForm, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Student Name</label>
                    <input
                      value={parentForm.student}
                      onChange={(e) =>
                        setParentForm({
                          ...parentForm,
                          student: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Relation</label>
                    <select
                      value={parentForm.relation}
                      onChange={(e) =>
                        setParentForm({
                          ...parentForm,
                          relation: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select Relation</option>
                      <option>Father</option>
                      <option>Mother</option>
                      <option>Guardian</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      value={parentForm.phone}
                      onChange={(e) =>
                        setParentForm({ ...parentForm, phone: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={parentForm.email}
                      onChange={(e) =>
                        setParentForm({ ...parentForm, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={parentForm.status}
                      onChange={(e) =>
                        setParentForm({
                          ...parentForm,
                          status: e.target.value,
                        })
                      }
                    >
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={resetModal}
                >
                  Cancel
                </button>

                <button type="submit" className="save-btn">
                  {editingId ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;