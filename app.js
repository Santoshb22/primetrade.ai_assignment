const express = require('express');
const app = express();
const userRoutes = require('./routes/user.route');
const taskRoutes = require('./routes/task.route');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
module.exports = app;