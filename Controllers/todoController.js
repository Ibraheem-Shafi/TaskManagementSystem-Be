const Todo = require('../Models/todoSchema');
const User = require('../Models/userSchema');  // Assuming you have a User model

// Create Todo for a specific user
exports.createTodo = async (req, res) => {
  const { text, userId } = req.body;

  try {
    const newTodo = new Todo({
      text,
      completed: false,
      userId, // Assigning the userId to the todo
    });

    await newTodo.save();
    return res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    return res.status(500).json({ message: 'Error creating todo' });
  }
};

// Get Todos for a specific user
exports.getTodos = async (req, res) => {
  const { userId } = req.params; // Assuming the userId is passed through the request (e.g., from a JWT or session)

  try {
    const todos = await Todo.find({ userId }); // Filter todos by userId
    return res.status(200).json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    return res.status(500).json({ message: 'Error fetching todos' });
  }
};
exports.editTodo = async (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;  // Assuming both text and completed might be updated

  try {
    // First, find the todo by its ID
    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found or not authorized' });
    }

    // Update the fields
    todo.text = text || todo.text;  // Only update if new value is provided
    todo.completed = completed !== undefined ? completed : todo.completed;  // Only update if new value is provided

    // Save the updated todo
    const updatedTodo = await todo.save();

    // Return the updated todo
    return res.status(200).json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    return res.status(500).json({ message: 'Error updating todo' });
  }
};


// Delete Todo for a specific user
exports.deleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTodo = await Todo.findOneAndDelete({ _id: id }); // Ensure the todo belongs to the current user
    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found or not authorized' });
    }

    return res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return res.status(500).json({ message: 'Error deleting todo' });
  }
};

// Toggle Todo completion for a specific user
exports.toggleTodo = async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await Todo.findOne({ _id: id }); // Ensure the todo belongs to the current user
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found or not authorized' });
    }

    todo.completed = !todo.completed;
    await todo.save();
    return res.status(200).json(todo);
  } catch (error) {
    console.error('Error toggling todo:', error);
    return res.status(500).json({ message: 'Error toggling todo' });
  }
};
