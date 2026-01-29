const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const { exec } = require('child_process');
require('dotenv').config(); // Carga las variables del archivo .env

const app = express();

// Middleware para entender el formato JSON (Necesario para el POST)
app.use(express.json());

// Servir archivos estáticos desde la carpeta frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// Ruta raíz para asegurar que cargue el index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// --- 1. CONEXIÓN A MONGODB [RA3.c] ---
// Usamos la variable de entorno para no mostrar la contraseña aquí
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Conectado a MongoDB Atlas')
  })
  .catch((err) => {
    console.error('Error de conexión:', err)
  });

// --- 2. DEFINIR EL ESQUEMA (MODELO) [RA3.a] ---
const TareaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  tecnologia: String,
  estado: { type: String, default: 'pendiente' },
  prioridad: { type: String, default: 'media' },
  descripcion: String,
  estimacionHoras: { type: Number, default: 0 },
  fecha: { type: Date, default: Date.now }
});

const Tarea = mongoose.model('Tarea', TareaSchema);

// --- 3. RUTAS DE LA API (ENDPOINTS) ---

// [RA2.b] GET: Devuelve todas las tareas
app.get('/api/tasks', async (req, res) => {
  try {
    const tareas = await Tarea.find().sort({ fecha: -1 });
    res.json({ success: true, data: tareas });
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ success: false, mensaje: 'Error al obtener tareas' });
  }
});

// [RA2.d] POST: Recibe un JSON y guarda la tarea
app.post('/api/tasks', async (req, res) => {
  try {
    const nuevaTarea = new Tarea(req.body);
    const tareaGuardada = await nuevaTarea.save();
    res.status(201).json({ success: true, data: tareaGuardada });
  } catch (error) {
    console.error('Error al guardar tarea:', error);
    res.status(400).json({ success: false, mensaje: 'Error al guardar', error });
  }
});

// [RA2.d] DELETE: Elimina la tarea por su ID
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await Tarea.findByIdAndDelete(id);
    res.json({ success: true, mensaje: 'Tarea eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    res.status(500).json({ success: false, mensaje: 'Error al eliminar' });
  }
});

// Actualizar tarea (PATCH/PUT)
app.patch('/api/tasks/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const tareaActualizada = await Tarea.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ success: true, data: tareaActualizada });
  } catch (error) {
    res.status(500).json({ success: false, mensaje: 'Error al actualizar' });
  }
});

// Estadísticas de tareas
app.get('/api/stats', async (req, res) => {
  try {
    const total = await Tarea.countDocuments();
    const pendientes = await Tarea.countDocuments({ estado: 'pendiente' });
    const enProgreso = await Tarea.countDocuments({ estado: 'en-progreso' });
    const completadas = await Tarea.countDocuments({ estado: 'completada' });

    res.json({
      success: true,
      stats: { total, pendientes, enProgreso, completadas }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ success: false, mensaje: 'Error al obtener estadísticas' });
  }
});




// --- 4. ARRANCAR EL SERVIDOR [RA2.a] ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
  console.log(`🌐 Abriendo navegador en http://localhost:${PORT}`);

  // Abrir automáticamente el navegador
  const url = `http://localhost:${PORT}`;
  const command = process.platform === 'win32' ? `start ${url}` :
    process.platform === 'darwin' ? `open ${url}` :
      `xdg-open ${url}`;
  exec(command);
});