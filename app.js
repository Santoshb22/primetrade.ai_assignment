const express = require('express');
const app = express();
const userRoutes = require('./routes/user.route');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use("/api/users", userRoutes);

module.exports = app;