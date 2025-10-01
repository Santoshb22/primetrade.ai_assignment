const express = require('express');
const { createTask, getTasks, getTaskById, updateTask, deleteTask } = require('../controllers/task.controller');

const router = express.Router();

app.post("/add-task", verifyToken, createTask);
app.get("/get_all_tasks", verifyToken, getTasks);
app.get("/task/:id", verifyToken, getTaskById);
app.put("/task/:id", verifyToken, updateTask);
app.delete("/task/:id", verifyToken, deleteTask);

module.exports = router;