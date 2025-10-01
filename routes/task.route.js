const express = require('express');
const { createTask, getTasks, getTaskById, updateTask, deleteTask } = require('../controllers/task.controller');
const verifyToken = require('../middlewares/auth.middleware');

const router = express.Router();

router.post("/add-task", verifyToken, createTask);
router.get("/get_all_tasks", verifyToken, getTasks);
router.get("/task/:id", verifyToken, getTaskById);
router.put("/task/:id", verifyToken, updateTask);
router.delete("/task/:id", verifyToken, deleteTask);

module.exports = router;