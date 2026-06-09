import { useEffect, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaRupeeSign,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaEdit,
  FaTrash,
  FaReceipt,
  FaTimes,
  FaBell,
  FaDownload,
} from "react-icons/fa";
import "./Fees.css";

const defaultPayments = [
  {
    id: 1,
    receipt: "REC001",
    student: "Arjun Kumar",
    className: "Grade 5-A",
    amount: 25000,
    method: "UPI",
    date: "2026-05-12",
    status: "Paid",
  },
  {
    id: 2,
    receipt: "REC002",
    student: "Priya Sharma",
    className: "Grade 6-B",
    amount: 18500,
    method: "Cash",
    date: "2026-05-14",
    status: "Paid",
  },
  {
    id: 3,
    receipt: "REC003",
    student: "Kavin Raj",
    className: "Grade 8-A",
    amount: 12000,
    method: "Card",
    date: "2026-05-16",
    status: "Pending",
  },
];

const defaultFeeStructure = [
  { id: 1, type: "Tuition Fee", className: "Grade 1-8", amount: 30000, frequency: "Yearly" },
  { id: 2, type: "Transport Fee", className: "All Grades", amount: 12000, frequency: "Yearly" },
  { id: 3, type: "Lab Fee", className: "Grade 5-8", amount: 5000, frequency: "Yearly" },
  { id: 4, type: "Sports Fee", className: "All Grades", amount: 3000, frequency: "Yearly" },
];

const defaultDues = [
  {
    id: 1,
    student: "Sneha Devi",
    className: "Grade 5-B",
    due: 15000,
    days: 12,
    phone: "9876543210",
    status: "Overdue",
    reminded: false,
  },
  {
    id: 2,
    student: "Rahul Kumar",
    className: "Grade 6-A",
    due: 8500,
    days: 8,
    phone: "9876501234",
    status: "Pending",
    reminded: false,
  },
];

const emptyPayment = {
  student: "",
  className: "",
  amount: "",
  method: "UPI",
  date: new Date().toISOString().split("T")[0],
  status: "Paid",
};

const emptyFee = {
  type: "",
  className: "",
  amount: "",
  frequency: "Yearly",
};

const emptyDue = {
  student: "",
  className: "",
  due: "",
  days: "",
  phone: "",
  status: "Pending",
  reminded: false,
};

function Fees() {
  const [activeTab, setActiveTab] = useState("payments");

  const [payments, setPayments] = useState(() => {
    return JSON.parse(localStorage.getItem("feePayments")) || defaultPayments;
  });

  const [feeStructure, setFeeStructure] = useState(() => {
    return JSON.parse(localStorage.getItem("feeStructure")) || defaultFeeStructure;
  });

  const [pendingDues, setPendingDues] = useState(() => {
    return JSON.parse(localStorage.getItem("pendingDues")) || defaultDues;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("All Classes");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [paymentForm, setPaymentForm] = useState(emptyPayment);
  const [feeForm, setFeeForm] = useState(emptyFee);
  const [dueForm, setDueForm] = useState(emptyDue);

  useEffect(() => {
  localStorage.setItem("feePayments", JSON.stringify(payments));
  window.dispatchEvent(new Event("dashboardUpdate"));
}, [payments]);

  useEffect(() => {
    localStorage.setItem("feeStructure", JSON.stringify(feeStructure));
  }, [feeStructure]);

  useEffect(() => {
    localStorage.setItem("pendingDues", JSON.stringify(pendingDues));
  }, [pendingDues]);

  const formatMoney = (value) => {
    return `₹${Number(value || 0).toLocaleString("en-IN")}`;
  };

  const totalCollection = payments
    .filter((payment) => payment.status === "Paid")
    .reduce((sum, payment) => sum + Number(payment.amount), 0);

  const paidStudents = payments.filter((payment) => payment.status === "Paid").length;

  const pendingAmount =
    payments
      .filter((payment) => payment.status === "Pending")
      .reduce((sum, payment) => sum + Number(payment.amount), 0) +
    pendingDues.reduce((sum, due) => sum + Number(due.due), 0);

  const overdueCount = pendingDues.filter((due) => due.status === "Overdue").length;

  const openAddModal = () => {
    setEditingId(null);
    setPaymentForm(emptyPayment);
    setFeeForm(emptyFee);
    setDueForm(emptyDue);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);

    if (activeTab === "payments") {
      setPaymentForm({
        student: item.student,
        className: item.className,
        amount: item.amount,
        method: item.method,
        date: item.date,
        status: item.status,
      });
    }

    if (activeTab === "structure") {
      setFeeForm({
        type: item.type,
        className: item.className,
        amount: item.amount,
        frequency: item.frequency,
      });
    }

    if (activeTab === "dues") {
      setDueForm({
        student: item.student,
        className: item.className,
        due: item.due,
        days: item.days,
        phone: item.phone,
        status: item.status,
        reminded: item.reminded,
      });
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setPaymentForm(emptyPayment);
    setFeeForm(emptyFee);
    setDueForm(emptyDue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (activeTab === "payments") {
      if (editingId) {
        setPayments((prev) =>
          prev.map((item) =>
            item.id === editingId
              ? { ...item, ...paymentForm, amount: Number(paymentForm.amount) }
              : item
          )
        );
      } else {
        setPayments((prev) => [
          {
            id: Date.now(),
            receipt: `REC${Date.now().toString().slice(-5)}`,
            ...paymentForm,
            amount: Number(paymentForm.amount),
          },
          ...prev,
        ]);
      }
    }

    if (activeTab === "structure") {
      if (editingId) {
        setFeeStructure((prev) =>
          prev.map((item) =>
            item.id === editingId
              ? { ...item, ...feeForm, amount: Number(feeForm.amount) }
              : item
          )
        );
      } else {
        setFeeStructure((prev) => [
          { id: Date.now(), ...feeForm, amount: Number(feeForm.amount) },
          ...prev,
        ]);
      }
    }

    if (activeTab === "dues") {
      if (editingId) {
        setPendingDues((prev) =>
          prev.map((item) =>
            item.id === editingId
              ? {
                  ...item,
                  ...dueForm,
                  due: Number(dueForm.due),
                  days: Number(dueForm.days),
                }
              : item
          )
        );
      } else {
        setPendingDues((prev) => [
          {
            id: Date.now(),
            ...dueForm,
            due: Number(dueForm.due),
            days: Number(dueForm.days),
          },
          ...prev,
        ]);
      }
    }

    closeModal();
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    if (activeTab === "payments") {
      setPayments((prev) => prev.filter((item) => item.id !== id));
    }

    if (activeTab === "structure") {
      setFeeStructure((prev) => prev.filter((item) => item.id !== id));
    }

    if (activeTab === "dues") {
      setPendingDues((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const markDueAsPaid = (due) => {
    const newPayment = {
      id: Date.now(),
      receipt: `REC${Date.now().toString().slice(-5)}`,
      student: due.student,
      className: due.className,
      amount: Number(due.due),
      method: "UPI",
      date: new Date().toISOString().split("T")[0],
      status: "Paid",
    };

    setPayments((prev) => [newPayment, ...prev]);
    setPendingDues((prev) => prev.filter((item) => item.id !== due.id));
    alert(`${due.student}'s due marked as paid.`);
  };

  const sendReminder = (id) => {
    setPendingDues((prev) =>
      prev.map((due) =>
        due.id === id ? { ...due, reminded: true } : due
      )
    );
    alert("Fee reminder sent successfully.");
  };

  const downloadReceipt = (payment) => {
    const receiptText = `
EduSmart School Fee Receipt

Receipt No: ${payment.receipt}
Student: ${payment.student}
Class: ${payment.className}
Amount: ${formatMoney(payment.amount)}
Payment Method: ${payment.method}
Date: ${payment.date}
Status: ${payment.status}
`;

    const blob = new Blob([receiptText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${payment.receipt}.txt`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const filteredPayments = payments.filter((payment) => {
    const keyword = searchTerm.toLowerCase();

    const matchesSearch =
      payment.student.toLowerCase().includes(keyword) ||
      payment.receipt.toLowerCase().includes(keyword) ||
      payment.method.toLowerCase().includes(keyword);

    const matchesClass =
      classFilter === "All Classes" || payment.className === classFilter;

    const matchesStatus =
      statusFilter === "All Status" || payment.status === statusFilter;

    return matchesSearch && matchesClass && matchesStatus;
  });

  const filteredFeeStructure = feeStructure.filter((fee) => {
    const keyword = searchTerm.toLowerCase();

    return (
      fee.type.toLowerCase().includes(keyword) ||
      fee.className.toLowerCase().includes(keyword) ||
      fee.frequency.toLowerCase().includes(keyword)
    );
  });

  const filteredDues = pendingDues.filter((due) => {
    const keyword = searchTerm.toLowerCase();

    const matchesSearch =
      due.student.toLowerCase().includes(keyword) ||
      due.phone.includes(keyword) ||
      due.className.toLowerCase().includes(keyword);

    const matchesClass =
      classFilter === "All Classes" || due.className === classFilter;

    const matchesStatus =
      statusFilter === "All Status" || due.status === statusFilter;

    return matchesSearch && matchesClass && matchesStatus;
  });

  return (
    <div className="fees-page">
      <div className="page-title-row">
        <div>
          <h2>Fee Management</h2>
          <p>Manage fee collection, fee structure and pending dues</p>
        </div>

        <button className="add-btn" onClick={openAddModal}>
          <FaPlus />
          {activeTab === "payments" && "Add Payment"}
          {activeTab === "structure" && "Add Fee"}
          {activeTab === "dues" && "Add Due"}
        </button>
      </div>

      <div className="fee-summary-grid">
        <div className="fee-summary-card">
          <div className="fee-summary-icon blue">
            <FaRupeeSign />
          </div>
          <div>
            <p>Total Collection</p>
            <h3>{formatMoney(totalCollection)}</h3>
          </div>
        </div>

        <div className="fee-summary-card">
          <div className="fee-summary-icon green">
            <FaCheckCircle />
          </div>
          <div>
            <p>Paid Records</p>
            <h3>{paidStudents}</h3>
          </div>
        </div>

        <div className="fee-summary-card">
          <div className="fee-summary-icon orange">
            <FaClock />
          </div>
          <div>
            <p>Pending Amount</p>
            <h3>{formatMoney(pendingAmount)}</h3>
          </div>
        </div>

        <div className="fee-summary-card">
          <div className="fee-summary-icon red">
            <FaExclamationTriangle />
          </div>
          <div>
            <p>Overdue</p>
            <h3>{overdueCount}</h3>
          </div>
        </div>
      </div>

      <div className="fees-tabs">
        <button
          className={activeTab === "payments" ? "active" : ""}
          onClick={() => setActiveTab("payments")}
        >
          Payments
        </button>

        <button
          className={activeTab === "structure" ? "active" : ""}
          onClick={() => setActiveTab("structure")}
        >
          Fee Structure
        </button>

        <button
          className={activeTab === "dues" ? "active" : ""}
          onClick={() => setActiveTab("dues")}
        >
          Pending Dues
        </button>
      </div>

      <div className="fees-filter-card">
        <div className="fees-search">
          <FaSearch />
          <input
            type="text"
            placeholder="Search student, receipt, fee type or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {activeTab !== "structure" && (
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
          >
            <option>All Classes</option>
            <option>Grade 5-A</option>
            <option>Grade 5-B</option>
            <option>Grade 6-A</option>
            <option>Grade 6-B</option>
            <option>Grade 8-A</option>
          </select>
        )}

        {activeTab !== "structure" && (
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Status</option>
            <option>Paid</option>
            <option>Pending</option>
            <option>Overdue</option>
          </select>
        )}
      </div>

      {activeTab === "payments" && (
        <div className="fees-table-card">
          <table>
            <thead>
              <tr>
                <th>Receipt</th>
                <th>Student</th>
                <th>Class</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id}>
                  <td>
                    <div className="receipt-box">
                      <FaReceipt />
                      {payment.receipt}
                    </div>
                  </td>
                  <td>{payment.student}</td>
                  <td>{payment.className}</td>
                  <td>{formatMoney(payment.amount)}</td>
                  <td>{payment.method}</td>
                  <td>{payment.date}</td>
                  <td>
                    <span
                      className={
                        payment.status === "Paid"
                          ? "fee-status paid"
                          : "fee-status pending"
                      }
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button onClick={() => downloadReceipt(payment)}>
                        <FaDownload />
                      </button>
                      <button onClick={() => openEditModal(payment)}>
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(payment.id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: 25 }}>
                    No payments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "structure" && (
        <div className="fee-structure-grid">
          {filteredFeeStructure.map((fee) => (
            <div className="fee-structure-card" key={fee.id}>
              <div className="fee-structure-header">
                <h3>{fee.type}</h3>
                <div className="table-actions">
                  <button onClick={() => openEditModal(fee)}>
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(fee.id)}>
                    <FaTrash />
                  </button>
                </div>
              </div>

              <p>{fee.className}</p>
              <h2>{formatMoney(fee.amount)}</h2>
              <span>{fee.frequency}</span>
            </div>
          ))}

          {filteredFeeStructure.length === 0 && <p>No fee structure found</p>}
        </div>
      )}

      {activeTab === "dues" && (
        <div className="fees-table-card">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Due Amount</th>
                <th>Overdue Days</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredDues.map((due) => (
                <tr key={due.id}>
                  <td>{due.student}</td>
                  <td>{due.className}</td>
                  <td>{formatMoney(due.due)}</td>
                  <td>
                    <span className="fee-status overdue">{due.days} days</span>
                  </td>
                  <td>{due.phone}</td>
                  <td>
                    <span
                      className={
                        due.status === "Overdue"
                          ? "fee-status overdue"
                          : "fee-status pending"
                      }
                    >
                      {due.reminded ? "Reminder Sent" : due.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button onClick={() => sendReminder(due.id)}>
                        <FaBell />
                      </button>
                      <button onClick={() => markDueAsPaid(due)}>
                        <FaCheckCircle />
                      </button>
                      <button onClick={() => openEditModal(due)}>
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(due.id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredDues.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: 25 }}>
                    No pending dues found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="fee-modal">
            <div className="modal-header">
              <h3>
                {editingId ? "Edit" : "Add"}{" "}
                {activeTab === "payments" && "Payment"}
                {activeTab === "structure" && "Fee Structure"}
                {activeTab === "dues" && "Pending Due"}
              </h3>

              <button onClick={closeModal}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {activeTab === "payments" && (
                <div className="form-grid">
                  <div className="form-group">
                    <label>Student Name</label>
                    <input
                      value={paymentForm.student}
                      onChange={(e) =>
                        setPaymentForm({ ...paymentForm, student: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Class</label>
                    <input
                      value={paymentForm.className}
                      onChange={(e) =>
                        setPaymentForm({ ...paymentForm, className: e.target.value })
                      }
                      placeholder="Grade 5-A"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Amount</label>
                    <input
                      type="number"
                      value={paymentForm.amount}
                      onChange={(e) =>
                        setPaymentForm({ ...paymentForm, amount: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Method</label>
                    <select
                      value={paymentForm.method}
                      onChange={(e) =>
                        setPaymentForm({ ...paymentForm, method: e.target.value })
                      }
                    >
                      <option>UPI</option>
                      <option>Cash</option>
                      <option>Card</option>
                      <option>Net Banking</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      value={paymentForm.date}
                      onChange={(e) =>
                        setPaymentForm({ ...paymentForm, date: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={paymentForm.status}
                      onChange={(e) =>
                        setPaymentForm({ ...paymentForm, status: e.target.value })
                      }
                    >
                      <option>Paid</option>
                      <option>Pending</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === "structure" && (
                <div className="form-grid">
                  <div className="form-group">
                    <label>Fee Type</label>
                    <input
                      value={feeForm.type}
                      onChange={(e) =>
                        setFeeForm({ ...feeForm, type: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Class / Grade</label>
                    <input
                      value={feeForm.className}
                      onChange={(e) =>
                        setFeeForm({ ...feeForm, className: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Amount</label>
                    <input
                      type="number"
                      value={feeForm.amount}
                      onChange={(e) =>
                        setFeeForm({ ...feeForm, amount: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Frequency</label>
                    <select
                      value={feeForm.frequency}
                      onChange={(e) =>
                        setFeeForm({ ...feeForm, frequency: e.target.value })
                      }
                    >
                      <option>Monthly</option>
                      <option>Termly</option>
                      <option>Yearly</option>
                      <option>One Time</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === "dues" && (
                <div className="form-grid">
                  <div className="form-group">
                    <label>Student Name</label>
                    <input
                      value={dueForm.student}
                      onChange={(e) =>
                        setDueForm({ ...dueForm, student: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Class</label>
                    <input
                      value={dueForm.className}
                      onChange={(e) =>
                        setDueForm({ ...dueForm, className: e.target.value })
                      }
                      placeholder="Grade 5-A"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Due Amount</label>
                    <input
                      type="number"
                      value={dueForm.due}
                      onChange={(e) =>
                        setDueForm({ ...dueForm, due: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Overdue Days</label>
                    <input
                      type="number"
                      value={dueForm.days}
                      onChange={(e) =>
                        setDueForm({ ...dueForm, days: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      value={dueForm.phone}
                      onChange={(e) =>
                        setDueForm({ ...dueForm, phone: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={dueForm.status}
                      onChange={(e) =>
                        setDueForm({ ...dueForm, status: e.target.value })
                      }
                    >
                      <option>Pending</option>
                      <option>Overdue</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={closeModal}>
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

export default Fees;