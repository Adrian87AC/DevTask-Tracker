// backend/controllers/backlogController.js
const Backlog = require('../models/Backlog');

// @desc    Obtener histórico de backlog
// @route   GET /api/backlog
// @access  Public
exports.getBacklog = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const backlog = await Backlog.find()
            .sort({ fechaEliminacion: -1 })
            .limit(limit);

        res.json({
            success: true,
            count: backlog.length,
            data: backlog
        });
    } catch (error) {
        console.error('Error al obtener backlog:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el backlog',
            error: error.message
        });
    }
};

// @desc    Obtener estadísticas del backlog
// @route   GET /api/backlog/stats
// @access  Public
exports.getBacklogStats = async (req, res) => {
    try {
        const total = await Backlog.countDocuments();

        // Agregación por tecnología
        const porTecnologia = await Backlog.aggregate([
            {
                $group: {
                    _id: '$tareaOriginal.tecnologia',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        res.json({
            success: true,
            stats: {
                total,
                porTecnologia
            }
        });
    } catch (error) {
        console.error('Error al obtener estadísticas de backlog:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas del backlog',
            error: error.message
        });
    }
};

// @desc    Limpiar backlog antiguo
// @route   DELETE /api/backlog/clean
// @access  Public (en producción debería ser privado)
exports.cleanOldBacklog = async (req, res) => {
    try {
        const diasAntiguedad = parseInt(req.query.days) || 90;
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() - diasAntiguedad);

        const resultado = await Backlog.deleteMany({
            fechaEliminacion: { $lt: fechaLimite }
        });

        res.json({
            success: true,
            message: `Backlog limpiado exitosamente`,
            eliminados: resultado.deletedCount
        });
    } catch (error) {
        console.error('Error al limpiar backlog:', error);
        res.status(500).json({
            success: false,
            message: 'Error al limpiar el backlog',
            error: error.message
        });
    }
};