import { FormEvent, useEffect, useState } from 'react';
import { createProject, fetchProjects } from '../api/projects.api';
import { Project, ProjectCreateRequest } from '../types';

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectCreateRequest>({ name: '', status: 'ACTIVE' });
  const [isSaving, setIsSaving] = useState(false);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchProjects();
      setProjects(response);
    } catch {
      setError('Unable to load projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      const createdProject = await createProject(form);
      setProjects((current) => [createdProject, ...current]);
      setForm({ name: '', status: 'ACTIVE' });
    } catch {
      setError('Unable to create project.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="section-grid">
      <div className="card">
        <h2>Projects</h2>
        {loading ? (
          <p>Loading projects…</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Organization</th>
                  <th>Created By</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.Id}>
                    <td>{project.Name}</td>
                    <td>{project.Status}</td>
                    <td>{project.OrganizationId}</td>
                    <td>{project.CreatedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="card">
        <h2>New Project</h2>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Name
            <input type="text" name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            Description
            <textarea name="description" value={form.description ?? ''} onChange={handleChange} />
          </label>
          <label>
            Status
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="ACTIVE">ACTIVE</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </label>
          {error && <p className="error-message">{error}</p>}
          <button className="button button-primary" type="submit" disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Create Project'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ProjectsPage;
