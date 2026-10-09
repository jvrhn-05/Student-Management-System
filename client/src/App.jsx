import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [age, setAge] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const getStudents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/students");
      setStudents(response.data);
      setErrorMessage("");
    } catch (error) {
      console.error("Error fetching students:", error);
      setErrorMessage("Unable to load students. Check that the server is running.");
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/students")
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
        setErrorMessage("Unable to load students. Check that the server is running.");
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const student = {
      name,
      course,
      age: Number(age),
    };

    try {
      if (editingId !== null) {
        await axios.put(`http://localhost:5000/students/${editingId}`, student);
      } else {
        await axios.post("http://localhost:5000/students", student);
      }
      await getStudents();
      clearForm();
    } catch (error) {
      console.error(
        editingId !== null ? "Error updating student:" : "Error adding student:",
        error,
      );
      setErrorMessage(
        error.response?.data?.message ||
          (editingId !== null
            ? "Unable to update student."
            : "Unable to add student."),
      );
    }
  };

  const clearForm = () => {
    setName("");
    setCourse("");
    setAge("");
    setEditingId(null);
  };

  const handleEdit = (student) => {
    setErrorMessage("");
    setName(student.name);
    setCourse(student.course);
    setAge(String(student.age));
    setEditingId(student._id);
  };

  const handleDelete = async (studentId) => {
    if (window.confirm("Delete this student?")) {
      setErrorMessage("");
      try {
        await axios.delete(`http://localhost:5000/students/${studentId}`);
        if (editingId === studentId) {
          clearForm();
        }
        await getStudents();
      } catch (error) {
        console.error("Error deleting student:", error);
        setErrorMessage(error.response?.data?.message || "Unable to delete student.");
      }
    }
  };

  return (
    <main className="student-app">
      <h1>Student Management System</h1>
      <section className="student-form-section" aria-labelledby="form-title">
        <h2 id="form-title">{editingId !== null ? "Edit Student" : "Add Student"}</h2>
        <form className="student-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Course
            <input
              type="text"
              placeholder="Course"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
            />
          </label>
          <label>
            Age
            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </label>
          <div className="form-actions">
            <button className="button button-primary" type="submit">
              {editingId !== null ? "Update Student" : "Add Student"}
            </button>
            {editingId !== null && (
              <button className="button button-secondary" type="button" onClick={clearForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>
      {errorMessage && (
        <p className="error-message" role="alert">
          {errorMessage}
        </p>
      )}
      <section className="student-list-section" aria-labelledby="students-title">
        <h2 id="students-title">Students</h2>
        {students.length === 0 ? (
          <p className="empty-state">No students found.</p>
        ) : (
          <div className="student-list">
            {students.map((student) => (
              <article className="student-card" key={student._id}>
                <div>
                  <p><strong>Name:</strong> {student.name}</p>
                  <p><strong>Course:</strong> {student.course}</p>
                  <p><strong>Age:</strong> {student.age}</p>
                </div>
                <div className="student-actions">
                  <button
                    className="button button-secondary"
                    type="button"
                    onClick={() => handleEdit(student)}
                  >
                    Edit
                  </button>
                  <button
                    className="button button-danger"
                    type="button"
                    onClick={() => handleDelete(student._id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
export default App;
