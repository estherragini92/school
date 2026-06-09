import { useEffect, useState } from "react";
import { FaUserGraduate } from "react-icons/fa";
import "./ParentChildInfo.css";

function ParentChildInfo() {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState("All");

  const loadChildren = () => {
    const students = JSON.parse(localStorage.getItem("students")) || [];
    setChildren(students);
  };

  useEffect(() => {
    loadChildren();

    window.addEventListener("dashboardUpdate", loadChildren);
    window.addEventListener("storage", loadChildren);

    return () => {
      window.removeEventListener("dashboardUpdate", loadChildren);
      window.removeEventListener("storage", loadChildren);
    };
  }, []);

  const filteredChildren =
    selectedChild === "All"
      ? children
      : children.filter((child) => String(child.id) === selectedChild);

  return (
    <div className="parent-child-info-page">
      <div className="page-header">
        <div>
          <h2>Child Information</h2>
          <p>View your child details and academic information</p>
        </div>

        <div className="child-filter">
          <select
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
          >
            <option value="All">All Children</option>

            {children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name} - Grade {child.className || child.grade || "N/A"}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredChildren.length > 0 ? (
        <div className="child-grid">
          {filteredChildren.map((child) => (
            <div className="child-card" key={child.id}>
              <div className="child-avatar">
                {child.photo ? (
                  <img src={child.photo} alt={child.name} />
                ) : (
                  <FaUserGraduate />
                )}
              </div>

              <h3>{child.name}</h3>

              <div className="child-details">
                <p>
                  <strong>Roll No:</strong> {child.rollNo || "N/A"}
                </p>

                <p>
                  <strong>Grade:</strong> Grade{" "}
                  {child.className || child.grade || "N/A"}
                </p>

                <p>
                  <strong>Section:</strong> {child.section || "N/A"}
                </p>

                <p>
                  <strong>Parent:</strong>{" "}
                  {child.parent || child.parentName || "N/A"}
                </p>

                <p>
                  <strong>Parent Email:</strong>{" "}
                  {child.parentEmail || "N/A"}
                </p>

                <p>
                  <strong>Phone:</strong> {child.phone || "N/A"}
                </p>

                <p>
                  <strong>Address:</strong> {child.address || "N/A"}
                </p>

                <p>
                  <strong>Status:</strong> {child.status || "Active"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-child-card">
          <FaUserGraduate className="no-child-icon" />
          <h3>No Child Found</h3>
          <p>No student details available. Please add students from Admin.</p>
        </div>
      )}
    </div>
  );
}

export default ParentChildInfo;