import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../axios-client';

export default function SubjectForm({ edit }) {
  const [subject, setSubject] = useState({ name: '' });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (edit && id) {
      axiosClient.get(`/subjects/${id}`)
        .then(({ data }) => setSubject(data))
        .catch(console.error);
    }
  }, [edit, id]);

  const handleSubmit = e => {
    e.preventDefault();
    const request = edit
      ? axiosClient.put(`/subjects/${id}`, subject)
      : axiosClient.post('/subjects', subject);

    request
      .then(() => navigate('/admin/subjects'))
      .catch(console.error);
  };

  return (
    <div className="subject-form">
      <h2>{edit ? '✏️ Edit Subject' : '➕ Add Subject'}</h2>
      <form onSubmit={handleSubmit}>
        <label>Subject Name:</label>
        <input
          type="text"
          value={subject.name}
          onChange={e => setSubject({ ...subject, name: e.target.value })}
          required
        />
        <button type="submit">💾 Save</button>
      </form>
    </div>
  );
}
