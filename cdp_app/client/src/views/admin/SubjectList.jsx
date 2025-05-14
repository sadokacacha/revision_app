    import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../axios-client';

export default function SubjectList() {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    axiosClient.get('/subjects')
      .then(({ data }) => setSubjects(data))
      .catch(console.error);
  }, []);

  return (
    <div className="subject-list">
      <h2>📚 Subjects</h2>
      <Link to="/admin/subjects/new" className="add-btn">+ Add New Subject</Link>

      <table>
        <thead>
          <tr>
            <th>Subject Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map(subject => (
            <tr key={subject.id}>
              <td>{subject.name}</td>
              <td>
                <Link to={`/admin/subjects/${subject.id}`}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
