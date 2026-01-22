require('dotenv').config(); // Carga las variables del archivo .env
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Middleware para entender el formato JSON (Necesario para el POST)
app.use(express.json());

// --- 1. CONEXIÓN A MONGODB [RA3.c] ---
// Usamos la variable de entorno para no mostrar la contraseña aquí
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch((err) => console.error('❌ Error de conexión:', err));

// --- 2. DEFINIR EL ESQUEMA (MODELO) [RA3.a] ---
// Esto define qué datos aceptamos. Uso los campos de tu imagen anterior.
const TareaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  tecnologia: String,
  estado: { type: Boolean, default: false }, // true = terminada, false = pendiente
  fecha: { type: Date, default: Date.now }
});

const Tarea = mongoose.model('Tarea', TareaSchema);

// --- 3. RUTAS DE LA API (ENDPOINTS) ---

// [RA2.b] GET: Devuelve todas las tareas
app.get('/api/tasks', async (req, res) => {
  try {
    const tareas = await Tarea.find(); // Busca todo en la BD
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener tareas' });
  }
});

// [RA2.d] POST: Recibe un JSON y guarda la tarea
app.post('/api/tasks', async (req, res) => {
  try {
    // Creamos una nueva tarea con lo que nos envían en req.body
    const nuevaTarea = new Tarea(req.body);
    const tareaGuardada = await nuevaTarea.save(); // Guardar en Atlas
    res.status(201).json(tareaGuardada);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al guardar', error });
  }
});

// [RA2.d] DELETE: Elimina la tarea por su ID
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await Tarea.findByIdAndDelete(id);
    res.json({ mensaje: 'Tarea eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar' });
  }
});

// --- 4. ARRANCAR EL SERVIDOR [RA2.a] ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});