const express = require("express");
const userController = require("../Controllers/userController");
const taskController = require("../Controllers/taskController");
const authenticateUser = require("../Middlewares/AuthenticateUser"); // Assuming you have authentication middleware
const router = express.Router();

// User routes
router.post('/users/register', userController.registerUser);
router.post("/user/login", userController.userLogin);
router.get("/users/:id", authenticateUser, userController.getUserById); // Protected route
router.post("/users/logout", authenticateUser, userController.userLogout); // Protected route

// Task routes (protected by authenticateUser)
router.post('/tasks', authenticateUser, taskController.createTask); // Create a new task
router.get('/tasks/:userId', authenticateUser, taskController.getTasks); // Retrieve all tasks for the logged-in user
router.get('/tasks/:id', authenticateUser, taskController.getTaskById); // Retrieve a specific task
router.put('/tasks/:id', authenticateUser, taskController.editTask); // Update a task
router.delete('/tasks/:id', authenticateUser, taskController.deleteTask); // Delete a task
router.patch('/tasks/toggle/:id', authenticateUser, taskController.toggleStatus); // Toggle task status for the logged-in user

module.exports = router;
