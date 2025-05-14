import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient                from "../../axios-client";

export default function ClassroomForm({ edit }) {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const [name, setName] = useState("");

  useEffect(() => {
    if (edit) {
      axiosClient.get(`/classrooms/${id}`)
        .then(({ data }) => setName(data.name))
        .catch(console.error);
    }
  }, [edit, id]);

  const onSubmit = (e) => {
    e.preventDefault();
    const req = edit
      ? axiosClient.put(`/classrooms/${id}`, { name })
      : axiosClient.post("/classrooms", { name });

    req.then(() => navigate("/admin/classrooms"))
       .catch(err => alert("Error: " + err.response.data.message));
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>{edit ? "Edit" : "Create"} Classroom</h2>
      <label>Name</label>
      <input value={name} onChange={e => setName(e.target.value)} required />
      <button type="submit">{edit ? "Save" : "Create"}</button>
      <button type="button" onClick={() => navigate(-1)}>Cancel</button>
    </form>
  );
}
