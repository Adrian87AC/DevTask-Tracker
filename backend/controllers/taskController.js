// backend/controllers/taskController.js
const Task = require('../models/Task');
const Backlog = require('../models/Backlog');

// @desc    Obtener todas las tareas
// @route   GET /api/tasks
// @access  Public
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find().sort({ fecha: -1 });

        res.json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        console.error('Error al obtener tareas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las tareas',
            error: error.message
        });
    }
};

// @desc    Obtener una tarea por ID
// @route   GET /api/tasks/:id
// @access  Public
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Tarea no encontrada'
            });
        }

        res.json({
            success: true,
            data: task
        });
    } catch (error) {
        console.error('Error al obtener tarea:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener la tarea',
            error: error.message
        });
    }
};

// @desc    Crear nueva tarea
// @route   POST /api/tasks
// @access  Public
exports.createTask = async (req, res) => {
    try {
        const nuevaTarea = new Task(req.body);
        const tareaGuardada = await nuevaTarea.save();

        res.status(201).json({
            success: true,
            message: 'Tarea creada exitosamente',
            data: tareaGuardada
        });
    } catch (error) {
        console.error('Error al crear tarea:', error);

        // Errores de validación de Mongoose
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Error de validación',
                errors: messages
            });
        }

        res.status(400).json({
            success: false,
            message: 'Error al crear la tarea',
            error: error.message
        });
    }
};

// @desc    Actualizar tarea
// @route   PATCH /api/tasks/:id
// @access  Public
exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const actualizacion = req.body;

        // Si se marca como completada, agregar fecha
        if (actualizacion.estado === 'completada' && !actualizacion.fechaCompletada) {
            actualizacion.fechaCompletada = new Date();
        }

        const tareaActualizada = await Task.findByIdAndUpdate(
            id,
            actualizacion,
            {
                new: true, // Devolver el documento actualizado
                runValidators: true // Ejecutar validaciones del esquema
            }
        );

        if (!tareaActualizada) {
            return res.status(404).json({
                success: false,
                message: 'Tarea no encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Tarea actualizada exitosamente',
            data: tareaActualizada
        });
    } catch (error) {
        console.error('Error al actualizar tarea:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Error de validación',
                errors: messages
            });
        }

        res.status(400).json({
            success: false,
            message: 'Error al actualizar la tarea',
            error: error.message
        });
    }
};

// @desc    Eliminar tarea (mover a backlog)
// @route   DELETE /api/tasks/:id
// @access  Public
exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const tarea = await Task.findById(id);

        if (!tarea) {
            return res.status(404).json({
                success: false,
                message: 'Tarea no encontrada'
            });
        }

        // Guardar en backlog antes de eliminar
        const backlogEntry = new Backlog({
            tareaOriginal: tarea.toObject(),
            motivoEliminacion: req.body.motivo || 'Usuario eliminó la tarea'
        });
        await backlogEntry.save();

        // Eliminar tarea
        await Task.findByIdAndDelete(id);

        res.json({
            success: true,
            message: 'Tarea eliminada y guardada en el backlog',
            data: {
                id,
                backlogId: backlogEntry._id
            }
        });
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la tarea',
            error: error.message
        });
    }
};

// @desc    Obtener estadísticas de tareas
// @route   GET /api/tasks/stats
// @access  Public
exports.getTaskStats = async (req, res) => {
    try {
        const total = await Task.countDocuments();
        const pendientes = await Task.countDocuments({ estado: 'pendiente' });
        const enProgreso = await Task.countDocuments({ estado: 'en-progreso' });
        const completadas = await Task.countDocuments({ estado: 'completada' });

        // Agregación por tecnología
        const porTecnologia = await Task.aggregate([
            {
                $group: {
                    _id: '$tecnologia',
                    count: { $sum: 1 },
                    horas: { $sum: '$estimacionHoras' }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Agregación por prioridad
        const porPrioridad = await Task.aggregate([
            {
                $group: {
                    _id: '$prioridad',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Tareas críticas pendientes
        const criticasPendientes = await Task.countDocuments({
            prioridad: 'critica',
            estado: { $ne: 'completada' }
        });

        res.json({
            success: true,
            stats: {
                total,
                pendientes,
                enProgreso,
                completadas,
                porcentajeCompletadas: total > 0 ? ((completadas / total) * 100).toFixed(1) : 0,
                porTecnologia,
                porPrioridad,
                criticasPendientes
            }
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas',
            error: error.message
        });
    }
};

// @desc    Buscar tareas
// @route   GET /api/tasks/search?q=texto
// @access  Public
exports.searchTasks = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Parámetro de búsqueda requerido'
            });
        }

        const tasks = await Task.find({
            $or: [
                { titulo: { $regex: q, $options: 'i' } },
                { descripcion: { $regex: q, $options: 'i' } }
            ]
        }).sort({ fecha: -1 });

        res.json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        console.error('Error al buscar tareas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al buscar tareas',
            error: error.message
        });
    }
};