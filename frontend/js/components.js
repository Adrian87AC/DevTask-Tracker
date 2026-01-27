// frontend/js/components.js

const Components = {
    /**
     * Crear tarjeta de tarea
     */
    createTaskCard(task) {
        const card = document.createElement('div');
        card.className = `task-card prioridad-${task.prioridad}`;
        card.dataset.taskId = task._id;

        const fecha = UTILS.formatDate(task.fecha);
        const horasHtml = task.estimacionHoras > 0
            ? `<span class="badge">⏱️ ${task.estimacionHoras}h</span>`
            : '';

        card.innerHTML = `
            <div class="task-header">
                <div>
                    <div class="task-title">${UTILS.escapeHtml(task.titulo)}</div>
                    <div class="task-badges">
                        <span class="badge badge-tech">${UTILS.escapeHtml(task.tecnologia)}</span>
                        <span class="badge badge-estado ${task.estado}">${UTILS.formatEstado(task.estado)}</span>
                        <span class="badge badge-prioridad">${UTILS.formatPrioridad(task.prioridad)}</span>
                        ${horasHtml}
                    </div>
                </div>
            </div>
            ${task.descripcion ? `<div class="task-description">${UTILS.escapeHtml(task.descripcion)}</div>` : ''}
            <div class="task-meta">
                <div class="task-date">📅 ${fecha}</div>
                <div class="task-actions">
                    <button class="btn-small btn-edit" data-action="cycle-status" data-task-id="${task._id}" data-current-status="${task.estado}">
                        ${UTILS.getNextStatusLabel(task.estado)}
                    </button>
                    <button class="btn-small btn-delete" data-action="delete" data-task-id="${task._id}">
                        Eliminar
                    </button>
                </div>
            </div>
        `;

        return card;
    },

    /**
     * Crear estado de carga
     */
    createLoadingState() {
        const loading = document.createElement('div');
        loading.className = 'loading';
        loading.innerHTML = `
            <div class="spinner"></div>
            <p>Cargando tareas...</p>
        `;
        return loading;
    },

    /**
     * Crear estado vacío
     */
    createEmptyState(message = '📭 No hay tareas en esta categoría') {
        const empty = document.createElement('div');
        empty.className = 'empty-state';
        empty.innerHTML = `
            <div class="empty-state-icon">📋</div>
            <p>${message}</p>
        `;
        return empty;
    },

    /**
     * Mostrar notificación toast
     */
    showToast(message, type = 'success') {
        // Eliminar toasts anteriores
        const existingToasts = document.querySelectorAll('.toast');
        existingToasts.forEach(toast => toast.remove());

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, CONFIG.TOAST_DURATION);
    },

    /**
     * Actualizar estadísticas en el dashboard
     */
    updateStats(stats) {
        document.getElementById('statTotal').textContent = stats.total || 0;
        document.getElementById('statPendientes').textContent = stats.pendientes || 0;
        document.getElementById('statEnProgreso').textContent = stats.enProgreso || 0;
        document.getElementById('statCompletadas').textContent = stats.completadas || 0;
    }
};