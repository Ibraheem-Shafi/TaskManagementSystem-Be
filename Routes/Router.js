const express = require("express");
const userController = require("./../Controllers/userController");
const todoController = require("./../Controllers/todoController");
const authenticateUser = require("./../Middlewares/AuthenticateUser"); // Assuming you have authentication middleware
const router = express.Router()

// User routes
router.post('/users/register', userController.registerUser);
router.post("/user/login", userController.userLogin);
router.get("/user/:id", authenticateUser, userController.getUserById); // Protected route

// Todo routes (protected by authenticateUser)
router.get('/todos/:userId', authenticateUser, todoController.getTodos); // Get todos for logged-in user
router.post('/todos', authenticateUser, todoController.createTodo); // Create todo for logged-in user
router.put('/todo/:id', authenticateUser, todoController.editTodo); // Edit todo for logged-in user
router.delete('/todo/delete/:id', authenticateUser, todoController.deleteTodo); // Delete todo for logged-in user
router.patch('/todos/toggle/:id',  todoController.toggleTodo); // Toggle todo status for logged-in user

module.exports = router;
