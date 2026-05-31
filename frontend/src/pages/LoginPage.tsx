import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth.api';
import { useAppContext } from '../context/AppContext';
import { LoginRequest } from '../types';

const LoginPage = () => {
  const { login } = useAppContext();
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginRequest>({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await loginUser(form);
      login(response);
      navigate('/dashboard');
    } catch (err) {
      setError('Login failed. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="card">
      <h2>Sign In</h2>
      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>
        {error && <p className="error-message">{error}</p>}
        <button className="button button-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </section>
  );
};

export default LoginPage;
