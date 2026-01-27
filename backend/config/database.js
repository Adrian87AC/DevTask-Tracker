
// backend/config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('✅ MongoDB Atlas conectado exitosamente');
        console.log(`📦 Host: ${conn.connection.host}`);
        console.log(`🗄️  Database: ${conn.connection.name}`);
    } catch (error) {
        console.error('❌ Error de conexión a MongoDB:', error.message);
        console.error('💡 Verifica tu MONGO_URI en el archivo .env');
        process.exit(1);
    }
};

// Eventos de conexión
mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB desconectado');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ Error de MongoDB:', err);
});

module.exports = connectDB;