import { useState, useEffect } from 'react';
import axiosClient from '../../axios-client';
import { useNavigate } from 'react-router-dom';

export default function AddUser() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    hourly_rate: '',
    payment_method: 'cash',
    subject_ids: [],
    classroom_ids: []
  });

  const [errors, setErrors] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [classrooms, setClassrooms] = useState([]);

  useEffect(() => {
    axiosClient.get('/subjects').then(({ data }) => setSubjects(data));
    axiosClient.get('/classrooms').then(({ data }) => setClassrooms(data));
  }, []);

  const onChange = e => {
    const { name, value, multiple, options, type } = e.target;

    if (multiple) {
      const selectedValues = Array.from(options)
        .filter(option => option.selected)
        .map(option => option.value);
      setForm(prev => ({ ...prev, [name]: selectedValues }));
    } else if (type === 'number') {
      setForm(prev => ({ ...prev, [name]: value ? parseFloat(value) : '' }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const onSubmit = async e => {
    e.preventDefault();
    setErrors({});
    try {
      await axiosClient.post('/users', form);
      navigate('/admin/users');
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
      }
    }
  };

  return (
    <div>
      <h2>Create User</h2>
      <form onSubmit={onSubmit}>

        <label>Name:</label>
        <input name="name" value={form.name} onChange={onChange} />
        {errors.name && <p className="error">{errors.name[0]}</p>}

        <label>Email:</label>
        <input name="email" value={form.email} onChange={onChange} />
        {errors.email && <p className="error">{errors.email[0]}</p>}

        <label>Password:</label>
        <input type="password" name="password" value={form.password} onChange={onChange} />
        {errors.password && <p className="error">{errors.password[0]}</p>}

        <label>Role:</label>
        <select name="role" value={form.role} onChange={onChange}>
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
        </select>
        {errors.role && <p className="error">{errors.role[0]}</p>}

        {form.role === 'teacher' && (
          <fieldset>
            <legend>Teacher Details</legend>

            <label>Hourly Rate:</label>
            <input
              type="number"
              name="hourly_rate"
              value={form.hourly_rate}
              onChange={onChange}
              step="0.01"
              min="0"
            />
            {errors.hourly_rate && <p className="error">{errors.hourly_rate[0]}</p>}

            <label>Payment Method:</label>
            <select name="payment_method" value={form.payment_method} onChange={onChange}>
              <option value="cash">Cash</option>
              <option value="check">Check</option>
              <option value="bank">Bank</option>
            </select>
            {errors.payment_method && <p className="error">{errors.payment_method[0]}</p>}

            <label>Subjects:</label>
            <select
              name="subject_ids"
              multiple
              value={form.subject_ids}
              onChange={onChange}
            >
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
            {errors.subject_ids && <p className="error">{errors.subject_ids[0]}</p>}

            <label>Classrooms:</label>
            <select
              name="classroom_ids"
              multiple
              value={form.classroom_ids}
              onChange={onChange}
            >
              {classrooms.map(classroom => (
                <option key={classroom.id} value={classroom.id}>
                  {classroom.name}
                </option>
              ))}
            </select>
            {errors.classroom_ids && <p className="error">{errors.classroom_ids[0]}</p>}
          </fieldset>
        )}

        <button type="submit">Create</button>
      </form>
    </div>
  );
}
