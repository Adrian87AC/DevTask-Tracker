// backend/routes/tasks.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Rutas principales
router.get('/', taskController.getAllTasks);
router.post('/', taskController.createTask);

// Rutas especiales (deben ir ANTES de las rutas con :id)
router.get('/stats', taskController.getTaskStats);
router.get('/search', taskController.searchTasks);

// Rutas con ID
router.get('/:id', taskController.getTaskById);
router.patch('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;