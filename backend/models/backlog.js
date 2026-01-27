// backend/models/Backlog.js
const mongoose = require('mongoose');

const backlogSchema = new mongoose.Schema({
    tareaOriginal: {
        type: Object,
        required: [true, 'Los datos de la tarea original son obligatorios']
    },
    fechaEliminacion: {
        type: Date,
        default: Date.now
    },
    motivoEliminacion: {
        type: String,
        default: 'Usuario eliminó la tarea'
    },
    usuarioEliminacion: {
        type: String,
        default: 'Sistema'
    }
}, {
    timestamps: true,
    versionKey: false
});

// Índice para consultas por fecha
backlogSchema.index({ fechaEliminacion: -1 });

// Método para obtener resumen
backlogSchema.methods.getResumen = function () {
    return {
        titulo: this.tareaOriginal.titulo,
        tecnologia: this.tareaOriginal.tecnologia,
        fechaCreacion: this.tareaOriginal.fecha,
        fechaEliminacion: this.fechaEliminacion,
        diasVida: Math.floor((this.fechaEliminacion - new Date(this.tareaOriginal.fecha)) / (1000 * 60 * 60 * 24))
    };
};

module.exports = mongoose.model('Backlog', backlogSchema);