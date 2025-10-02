import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TaskCard from "../component/TaskCard";
import TaskModal from "../component/TaskModal";

const Dashboard = () => {
  const [allTask, setAllTask] = useState([]);
  const token = useSelector((state) => state.user?.token);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_API}/tasks/get_all_tasks`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setAllTask(data.tasks || []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [token, isModalOpen]);

  const handleDelete = async (taskId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_API}/tasks/task/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setAllTask((prev) => prev.filter((t) => t._id !== taskId));
      } else {
        console.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-900">My Tasks</h1>
        <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-indigo-900 text-white rounded-lg hover:bg-indigo-700 transition">
          + Add Task
        </button>
      </div>

      {
        isModalOpen && (
          <TaskModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          task={editingTask}
          />
        )
      }

      {allTask.length === 0 ? (
        <p className="text-gray-600">No tasks found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allTask.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onDelete={handleDelete}
              setEditingTask={setEditingTask}
              setIsModalOpen={setIsModalOpen}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
