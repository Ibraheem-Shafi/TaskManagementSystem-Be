const Task = require('../Models/taskSchema');

// Create Task for a specific user
exports.createTask = async (req, res) => {
  const { title, description, dueDate, userId } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      dueDate,
      userId, // Assigning the userId to the task
    });

    await newTask.save();
    return res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({ message: 'Error creating task' });
  }
};

// Get Tasks for a specific user
exports.getTasks = async (req, res) => {
  const { userId } = req.params; // Assuming the userId is passed through the request (e.g., from a JWT or session)

  try {
    const tasks = await Task.find({ userId }); // Filter tasks by userId
    return res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(500).json({ message: 'Error fetching tasks' });
  }
};

exports.getTaskById = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id); // Find task by its ID
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.status(200).json(task);
  } catch (error) {
    console.error('Error fetching task by ID:', error);
    return res.status(500).json({ message: 'Error fetching task' });
  }
};

// Edit Task for a specific user
exports.editTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate, status } = req.body; // Assuming these fields might be updated

  try {
    // First, find the task by its ID
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }

    // Update the fields
    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.status = status !== undefined ? status : task.status;

    // Save the updated task
    const updatedTask = await task.save();

    // Return the updated task
    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(500).json({ message: 'Error updating task' });
  }
};

// Delete Task for a specific user
exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTask = await Task.findOneAndDelete({ _id: id }); // Ensure the task belongs to the current user
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }

    return res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({ message: 'Error deleting task' });
  }
};

// Toggle Task status for a specific user
exports.toggleStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }

    // Cycle through statuses: Pending -> In Progress -> Completed -> Pending
    switch (task.status) {
      case 'Pending':
        task.status = 'In Progress';
        break;
      case 'In Progress':
        task.status = 'Completed';
        break;
      case 'Completed':
        task.status = 'Pending';
        break;
      default:
        task.status = 'Pending';
        break;
    }

    await task.save();
    return res.status(200).json(task);
  } catch (error) {
    console.error('Error toggling task status:', error);
    return res.status(500).json({ message: 'Error toggling task status' });
  }
};
