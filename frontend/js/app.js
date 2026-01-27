// frontend/js/app.js

/**
 * Inicialización de la aplicación
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DevTask Tracker - Iniciando aplicación...');

    // Cargar datos iniciales
    initializeApp();

    // Configurar event listeners
    setupEventListeners();

    console.log('✅ Aplicación iniciada correctamente');
});

/**
 * Inicializar aplicación
 */
async function initializeApp() {
    try {
        // Cargar tareas y estadísticas
        await Promise.all([
            DOM.loadTasks(),
            DOM.loadStats()
        ]);
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
        Components.showToast('Error al cargar la aplicación', 'error');
    }
}

/**
 * Configurar todos los event listeners
 */
function setupEventListeners() {
    // Formulario de nueva tarea
    const taskForm = document.getElementById('taskForm');
    if (taskForm) {
        taskForm.addEventListener('submit', (e) => DOM.handleCreateTask(e));
    }

    // Botones de filtro
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filter = e.target.dataset.filter;
            DOM.changeFilter(filter);
        });
    });

    // Atajos de teclado (opcional)
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

/**
 * Manejar atajos de teclado
 */
function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + K para enfocar el campo de título
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('titulo')?.focus();
    }

    // Escape para limpiar el formulario
    if (e.key === 'Escape') {
        document.getElementById('taskForm')?.reset();
    }
}

/**
 * Funciones globales expuestas para uso desde HTML
 * (útil para onclick inline si es necesario)
 */
window.DevTaskApp = {
    cycleStatus: (taskId, currentStatus) => DOM.cycleTaskStatus(taskId, currentStatus),
    deleteTask: (taskId) => DOM.deleteTask(taskId),
    changeFilter: (filter) => DOM.changeFilter(filter),
    reloadData: () => initializeApp()
};