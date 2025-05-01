import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const fetchProjects = async () => {
    const res = await axios.get('http://localhost:5000/projects', {
      headers: { Authorization: localStorage.getItem('token') }
    });
    setProjects(res.data);
  };

  const addProject = async () => {
    if (!name.trim()) {
      alert("Project name cannot be empty.");
      return;
    }

    if (projects.length >= 4) {
      alert("You can only have a maximum of 4 projects.");
      return;
    }

    await axios.post('http://localhost:5000/projects', { name }, {
      headers: { Authorization: localStorage.getItem('token') }
    });
    setName('');
    fetchProjects();
  };

  const deleteProject = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await axios.delete(`http://localhost:5000/projects/${projectId}`, {
        headers: { Authorization: localStorage.getItem('token') }
      });
      fetchProjects(); // Refresh the project list after deletion
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    } else {
      fetchProjects();
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg">
        
        {/* Navbar */}
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t-lg">
          <h1 className="text-2xl font-bold">Task Tracker</h1>
          {/* Add logout button to navbar */}
          {localStorage.getItem('token') && (
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white py-1 px-4 rounded-md hover:bg-red-700 transition duration-200"
            >
              Logout
            </button>
          )}
        </div>

        <h2 className="text-3xl font-semibold text-gray-700 mb-6 mt-10">Your Projects</h2>

        {/* Check for login status */}
        {localStorage.getItem('token') ? (
          <>
            {/* Project List */}
            {projects.length === 0 ? (
              <p className="text-gray-500">No projects found. Add a new project!</p>
            ) : (
              <div className="space-y-4">
                {projects.map((p) => (
                  <div key={p._id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-md hover:bg-gray-200 transition duration-200">
                    <Link to={`/project/${p._id}`} className="text-xl text-blue-500 hover:underline">
                      {p.name}
                    </Link>
                    <button
                      onClick={() => deleteProject(p._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Project */}
            {projects.length < 4 && (
              <div className="mt-6">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="New Project"
                />
                <button
                  onClick={addProject}
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
                >
                  Add Project
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center">
            <p className="text-gray-500">You are not logged in. Please <Link to="/login" className="text-blue-500 hover:underline">Login</Link> or <Link to="/signup" className="text-blue-500 hover:underline">Sign Up</Link>.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
