// backend/models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: [true, 'El título es obligatorio'],
        trim: true,
        maxlength: [150, 'El título no puede exceder 150 caracteres']
    },
    descripcion: {
        type: String,
        default: '',
        maxlength: [500, 'La descripción no puede exceder 500 caracteres']
    },
    tecnologia: {
        type: String,
        enum: {
            values: ['JavaScript', 'Java', 'Python', 'C#', 'PHP', 'React', 'Angular', 'Vue', 'Node.js', 'Otro'],
            message: '{VALUE} no es una tecnología válida'
        },
        required: [true, 'La tecnología es obligatoria']
    },
    prioridad: {
        type: String,
        enum: {
            values: ['baja', 'media', 'alta', 'critica'],
            message: '{VALUE} no es una prioridad válida'
        },
        default: 'media'
    },
    estado: {
        type: String,
        enum: {
            values: ['pendiente', 'en-progreso', 'completada'],
            message: '{VALUE} no es un estado válido'
        },
        default: 'pendiente'
    },
    estimacionHoras: {
        type: Number,
        min: [0, 'La estimación no puede ser negativa'],
        max: [999, 'La estimación no puede exceder 999 horas'],
        default: 0
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    fechaCompletada: {
        type: Date,
        default: null
    }
}, {
    timestamps: true, // Añade createdAt y updatedAt automáticamente
    versionKey: false
});

// Middleware pre-save: actualizar fechaCompletada cuando se marca como completada
taskSchema.pre('save', function (next) {
    if (this.isModified('estado') && this.estado === 'completada' && !this.fechaCompletada) {
        this.fechaCompletada = new Date();
    }
    next();
});

// Método para obtener el tiempo transcurrido
taskSchema.methods.getTiempoTranscurrido = function () {
    const ahora = new Date();
    const creacion = this.fecha;
    const dias = Math.floor((ahora - creacion) / (1000 * 60 * 60 * 24));
    return dias;
};

// Índices para mejorar consultas
taskSchema.index({ estado: 1, fecha: -1 });
taskSchema.index({ tecnologia: 1 });
taskSchema.index({ prioridad: 1 });

module.exports = mongoose.model('Task', taskSchema);