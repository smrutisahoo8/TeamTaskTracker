import { FormEvent, useEffect, useState } from 'react';
import { createTask, deleteTask, fetchTasks, updateTaskStatus } from '../api/tasks.api';
import { TaskCreatePayload, Task } from '../types';
import { STATUS_FLOW, ALL_STATUSES, PRIORITIES } from '../utils/task.constants';
import { useAppContext } from '../context/AppContext';

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<TaskCreatePayload>({ title: '', priority: 'MEDIUM' as const });
  const { auth } = useAppContext();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [priorityFilter, setPriorityFilter] = useState<string | undefined>(undefined);
  const [assigneeFilter, setAssigneeFilter] = useState<number | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { page, limit };
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (assigneeFilter) params.assigneeId = assigneeFilter;

      const response = await fetchTasks(params);
      setTasks(response);
    } catch {
      setError('Unable to load tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, statusFilter, priorityFilter, assigneeFilter]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: name === 'assigneeId' || name === 'projectId' ? (value ? Number(value) : undefined) : value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      const createdTask = await createTask(form);
      setTasks((current) => [createdTask, ...current]);
      setForm({ title: '', priority: 'MEDIUM' });
    } catch {
      setError('Unable to create task.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      setTasks((current) => current.filter((task) => task.Id !== taskId));
    } catch {
      setError('Unable to remove task.');
    }
  };

  return (
    <section className="section-grid">
      <div className="card">
        <h2>Tasks</h2>
        <div style={{ marginBottom: 12 }}>
          <label style={{ marginRight: 8 }}>
            Status
            <select value={statusFilter ?? ''} onChange={(e) => setStatusFilter(e.target.value || undefined)}>
              <option value="">All</option>
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>{s.replace('_', ' ')}</option>
              ))}
            </select>
          </label>
          <label style={{ marginRight: 8 }}>
            Priority
            <select value={priorityFilter ?? ''} onChange={(e) => setPriorityFilter(e.target.value || undefined)}>
              <option value="">All</option>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </label>
          <label>
            Assignee ID
            <input type="number" value={assigneeFilter ?? ''} onChange={(e) => setAssigneeFilter(e.target.value ? Number(e.target.value) : undefined)} />
          </label>
        </div>
        {loading ? (
          <p>Loading tasks…</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assignee</th>
                  <th>Project</th>
                  <th>Due</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.Id}>
                    <td>{task.Title}</td>
                    <td>{task.Priority}</td>
                    <td>
                        <span className={`status-pill status-${task.Status.toLowerCase().replace('_', '-')}`}>
                          {task.Status.replace('_', ' ')}
                        </span>
                        <div style={{ marginTop: 6 }}>
                          {/* status change control if allowed */}
                          <StatusChanger task={task} onUpdate={loadTasks} currentUser={auth.user} />
                        </div>
                    </td>
                    <td>{task.AssigneeId || '—'}</td>
                    <td>{task.ProjectId || '—'}</td>
                    <td>{task.DueDate ? new Date(task.DueDate).toLocaleDateString() : '—'}</td>
                    <td>
                      <button className="button button-secondary" type="button" onClick={() => handleDelete(task.Id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="card">
        <h2>Create Task</h2>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Title
            <input type="text" name="title" value={form.title} onChange={handleChange} required />
          </label>
          <label>
            Description
            <textarea name="description" value={form.description ?? ''} onChange={handleChange} />
          </label>
          <label>
            Priority
            <select name="priority" value={form.priority} onChange={handleChange}>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </label>
          <label>
            Assignee ID
            <input type="number" name="assigneeId" value={form.assigneeId ?? ''} onChange={handleChange} min={1} />
          </label>
          <label>
            Project ID
            <input type="number" name="projectId" value={form.projectId ?? ''} onChange={handleChange} min={1} />
          </label>
          <label>
            Due date
            <input type="date" name="dueDate" value={form.dueDate ?? ''} onChange={handleChange} />
          </label>
          {error && <p className="error-message">{error}</p>}
          <button className="button button-primary" type="submit" disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Create Task'}
          </button>
        </form>
      </div>
    </section>
  );
};

type StatusChangerProps = {
  task: Task;
  onUpdate: () => void;
  currentUser: any;
};

const StatusChanger = ({ task, onUpdate, currentUser }: StatusChangerProps) => {
  const [selected, setSelected] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const allowed = STATUS_FLOW[task.Status] || [];
  const canUpdate = !!currentUser && (currentUser.role === 'MANAGER' || currentUser.role === 'ADMIN' || currentUser.id === task.AssigneeId);

  const options = allowed;

  const handleChange = async (e: any) => {
    const next = e.target.value;
    setSelected(next);
    if (!next) return;
    setLoading(true);
    try {
      await updateTaskStatus(task.Id, { status: next });
      await onUpdate();
    } catch (err) {
      // ignore UI error for now
    } finally {
      setLoading(false);
      setSelected('');
    }
  };

  if (!canUpdate || options.length === 0) return null;

  return (
    <div>
      <select value={selected} onChange={handleChange} disabled={loading}>
        <option value="">Change status…</option>
        {options.map((s) => (
          <option key={s} value={s}>{s.replace('_', ' ')}</option>
        ))}
      </select>
    </div>
  );
};

export default TasksPage;
