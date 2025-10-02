import React from "react";

const TaskCard = ({ task, onDelete, setEditingTask, setIsModalOpen }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-5 border hover:shadow-lg transition flex flex-col justify-between">
      <h2 className="sm:text-xl font-bold text-indigo-900 mb-2">{task.title}</h2>

      <p className="text-gray-700 mb-2">{task.description}</p>

      <div className="text-sm text-gray-600 space-y-1 mb-4">
        <p><span className="font-semibold">Priority:</span> {task.priority}</p>
        <p><span className="font-semibold">Status:</span> {task.status}</p>
        <p>
          <span className="font-semibold">Due Date:</span>{" "}
          {new Date(task.dueDate).toLocaleDateString()}
        </p>
      </div>

      <div className="flex justify-between mt-auto">
        <button
          onClick={() => {
            setEditingTask(task)
            setIsModalOpen(true)
          }}
          className="px-4 py-2 bg-yellow-700 text-white rounded-lg hover:bg-yellow-600 transition"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task._id)}
          className="px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-700 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
