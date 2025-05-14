import { useEffect, useState } from "react";
import { Link, useNavigate }      from "react-router-dom";
import axiosClient               from "../../axios-client";

export default function ClassroomList() {
  const [classrooms, setClassrooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosClient.get("/classrooms")
      .then(({ data }) => setClassrooms(data))
      .catch(console.error);
  }, []);

  const handleDelete = (id) => {
    if (!confirm("Delete this classroom?")) return;
    axiosClient.delete(`/classrooms/${id}`)
      .then(() => setClassrooms(c => c.filter(x => x.id !== id)))
      .catch(console.error);
  };

  return (
    <div className="entity-list">
      <h2>Classrooms</h2>
      <Link to="/admin/classrooms/new" className="btn">+ New Classroom</Link>
      <ul>
        {classrooms.map(c => (
          <li key={c.id}>
            <span onClick={() => navigate(`/admin/classrooms/${c.id}`)}>
              {c.name}
            </span>
            <button onClick={() => handleDelete(c.id)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
