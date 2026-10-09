import { useEffect, useState } from "react";
import axios from "axios";
function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [age, setAge] = useState("");
  const [editingId, setEditingId] = useState(null);

  const getStudents = () => {
    axios
      .get("http://localhost:5000/students")
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.log("Error fetching students:", error);
      });
  };
  useEffect(() => {
    getStudents();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const student = {
      name,
      course,
      age: Number(age),
    };
    if (editingId) {
      axios
        .put(`http://localhost:5000/students/${editingId}`, student)
        .then(() => {
          getStudents();
          clearForm();
        })
        .catch((error) => {
          console.log("Error updating student:", error);
        });
    } else {
      axios
        .post("http://localhost:5000/students", student)
        .then(() => {
          getStudents();
          clearForm();
        })
        .catch((error) => {
          console.log("Error adding student:", error);
        });
    }
  };

  const clearForm = () => {
    setName("");
    setCourse("");
    setAge("");
    setEditingId(null);
  };

  const handleEdit = (student) => {
    setName(student.name);
    setCourse(student.course);
    setAge(student.age);
    setEditingId(student._id);
  };

  const handleDelete = (studentId) => {
    if (window.confirm("Delete this student?")) {
      axios
        .delete(`http://localhost:5000/students/${studentId}`)
        .then(() => {
          getStudents();
        })
        .catch((error) => {
          console.log("Error deleting student:", error);
        });
    }
  };
  return (
    <div>
      <h1>Student Management System</h1>
      <h2>{editingId ? "Edit Student" : "Add Student"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
        <button type="submit">
          {editingId ? "Update Student" : "Add Student"}
        </button>
        {editingId && (
          <button type="button" onClick={clearForm}>
            Cancel
          </button>
        )}
      </form>
      <h2>Students</h2>
      {students.map((student) => (
        <div key={student._id}>
          <p>Name: {student.name}</p>
          <p>Course: {student.course}</p>
          <p>Age: {student.age}</p>
          <button onClick={() => handleEdit(student)}>Edit</button>
          <button onClick={() => handleDelete(student._id)}>Delete</button>
          <hr />
        </div>
      ))}
    </div>
  );
}
export default App;
