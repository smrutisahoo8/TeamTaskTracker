import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth.api';
import { useAppContext } from '../context/AppContext';
import { RegisterRequest } from '../types';

const RegisterPage = () => {
  const { login } = useAppContext();
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterRequest>({
    fullName: '',
    email: '',
    password: '',
    organizationId: 1,
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: name === 'organizationId' ? Number(value) : value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await registerUser(form);
      login(response);
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed. Please check your input and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="card">
      <h2>Create an account</h2>
      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Full name
          <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required />
        </label>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>
        <label>
          Organization ID
          <input type="number" name="organizationId" value={form.organizationId} onChange={handleChange} min={1} required />
        </label>
        {error && <p className="error-message">{error}</p>}
        <button className="button button-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registering…' : 'Register'}
        </button>
      </form>
    </section>
  );
};

export default RegisterPage;
