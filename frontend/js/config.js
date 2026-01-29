// frontend/js/config.js

// Configuración de la API
const CONFIG = {
    API_URL: 'http://localhost:3000/api',
    ENDPOINTS: {
        TASKS: '/tasks',
        STATS: '/stats',
        BACKLOG: '/backlog',
        SEARCH: '/tasks/search'
    },
    TOAST_DURATION: 3000,
    MAX_RETRY_ATTEMPTS: 3
};

// Estado global de la aplicación
const STATE = {
    tasks: [],
    currentFilter: 'todas',
    isLoading: false
};

// Utilidades
const UTILS = {
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    formatDate(dateString) {
        const fecha = new Date(dateString);
        return fecha.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    formatEstado(estado) {
        const labels = {
            'pendiente': 'Pendiente',
            'en-progreso': 'En Progreso',
            'completada': 'Completada'
        };
        return labels[estado] || estado;
    },

    formatPrioridad(prioridad) {
        const icons = {
            'baja': '🟢 Baja',
            'media': '🟡 Media',
            'alta': '🟠 Alta',
            'critica': '🔴 Crítica'
        };
        return icons[prioridad] || prioridad;
    },

    getNextStatus(currentStatus) {
        const cycle = {
            'pendiente': 'en-progreso',
            'en-progreso': 'completada',
            'completada': 'pendiente'
        };
        return cycle[currentStatus];
    },

    getNextStatusLabel(currentStatus) {
        const labels = {
            'pendiente': '▶️ Iniciar',
            'en-progreso': '✅ Completar',
            'completada': '🔄 Reabrir'
        };
        return labels[currentStatus] || 'Cambiar';
    }
};