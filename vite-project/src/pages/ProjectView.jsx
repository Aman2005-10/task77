import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ProjectView() {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', status: '' });
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/tasks/${id}`, {
        headers: { Authorization: localStorage.getItem('token') }
      });
      setTasks(res.data);
    } catch (err) {
      setError("Error fetching tasks");
    }
  };

  const addTask = async () => {
    if (!form.title || !form.description || !form.status) {
      setError("All fields are required!");
      return;
    }
    try {
      await axios.post('http://localhost:5000/tasks', { ...form, projectId: id }, {
        headers: { Authorization: localStorage.getItem('token') }
      });
      setForm({ title: '', description: '', status: '' });
      fetchTasks();
      setError(null);
    } catch (err) {
      setError("Error adding task");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`, {
        headers: { Authorization: localStorage.getItem('token') }
      });
      fetchTasks();
    } catch (err) {
      setError("Error deleting task");
    }
  };

  const updateTask = async (taskId) => {
    const updated = prompt('Enter new status (Pending, In Progress, Done)');
    if (updated && ['Pending', 'In Progress', 'Done'].includes(updated)) {
      try {
        await axios.put(`http://localhost:5000/tasks/${taskId}`, { status: updated }, {
          headers: { Authorization: localStorage.getItem('token') }
        });
        fetchTasks();
      } catch (err) {
        setError("Error updating task status");
      }
    } else {
      setError("Invalid status entered");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h3 className="text-2xl font-semibold mb-6 text-center">Tasks</h3>
      
      {/* Error message */}
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      
      {/* Tasks list */}
      <div className="space-y-6">
        {tasks.map(t => (
          <div key={t._id} className="bg-white p-4 rounded-lg shadow-md">
            <p className="font-bold text-lg">{t.title} - <span className={`text-sm ${t.status === 'Done' ? 'text-green-500' : t.status === 'In Progress' ? 'text-yellow-500' : 'text-red-500'}`}>{t.status}</span></p>
            <p>{t.description}</p>
            <p className="text-sm text-gray-500">Created: {new Date(t.createdAt).toLocaleString()}</p>
            <div className="mt-4 space-x-3">
              <button
                onClick={() => updateTask(t._id)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
              >
                Update Status
              </button>
              <button
                onClick={() => deleteTask(t._id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Form */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h4 className="text-xl font-semibold mb-4">Add New Task</h4>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Status (Pending, In Progress, Done)"
          value={form.status}
          onChange={e => setForm({ ...form, status: e.target.value })}
          className="w-full p-3 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addTask}
          className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
        >
          Add Task
        </button>
      </div>
    </div>
  );
}

export default ProjectView;
