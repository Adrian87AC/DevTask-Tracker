// frontend/js/dom.js

const DOM = {
    /**
     * Cargar todas las tareas
     */
    async loadTasks() {
        try {
            STATE.isLoading = true;
            const response = await API.getTasks();

            if (response.success) {
                STATE.tasks = response.data;
                this.renderTasks();
            } else {
                Components.showToast('Error al cargar tareas', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            Components.showToast('Error de conexión con el servidor', 'error');
            this.renderEmptyState('Error de conexión');
        } finally {
            STATE.isLoading = false;
        }
    },

    /**
     * Cargar estadísticas
     */
    async loadStats() {
        try {
            const response = await API.getStats();

            if (response.success) {
                Components.updateStats(response.stats);
            }
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        }
    },

    /**
     * Renderizar tareas en el DOM
     */
    renderTasks() {
        const container = document.getElementById('tasksContainer');

        // Filtrar tareas según filtro activo
        let tasksToShow = STATE.tasks;
        if (STATE.currentFilter !== 'todas') {
            tasksToShow = STATE.tasks.filter(task => task.estado === STATE.currentFilter);
        }

        // Si no hay tareas
        if (tasksToShow.length === 0) {
            this.renderEmptyState('📭 No hay tareas en esta categoría');
            return;
        }

        // Limpiar contenedor
        container.innerHTML = '';

        // Crear y añadir tarjetas
        tasksToShow.forEach(task => {
            const taskCard = Components.createTaskCard(task);
            container.appendChild(taskCard);
        });

        // Añadir event listeners a los botones
        this.attachTaskEventListeners();
    },

    /**
     * Renderizar estado vacío
     */
    renderEmptyState(message) {
        const container = document.getElementById('tasksContainer');
        container.innerHTML = '';
        container.appendChild(Components.createEmptyState(message));
    },

    /**
     * Manejar creación de tarea
     */
    async handleCreateTask(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const taskData = {
            titulo: formData.get('titulo'),
            descripcion: formData.get('descripcion'),
            tecnologia: formData.get('tecnologia'),
            prioridad: formData.get('prioridad'),
            estado: formData.get('estado'),
            estimacionHoras: parseFloat(formData.get('estimacionHoras')) || 0
        };

        try {
            const response = await API.createTask(taskData);

            if (response.success) {
                Components.showToast('Tarea creada exitosamente');
                e.target.reset();
                await this.loadTasks();
                await this.loadStats();
            } else {
                Components.showToast('Error: ' + response.message, 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            Components.showToast('Error al crear la tarea', 'error');
        }
    },

    /**
     * Cambiar estado de tarea (ciclo)
     */
    async cycleTaskStatus(taskId, currentStatus) {
        const newStatus = UTILS.getNextStatus(currentStatus);

        try {
            const response = await API.updateTask(taskId, { estado: newStatus });

            if (response.success) {
                Components.showToast('Estado actualizado');
                await this.loadTasks();
                await this.loadStats();
            } else {
                Components.showToast('Error al actualizar', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            Components.showToast('Error de conexión', 'error');
        }
    },

    /**
     * Eliminar tarea
     */
    async deleteTask(taskId) {
        if (!confirm('¿Estás seguro de eliminar esta tarea? Se moverá al backlog.')) {
            return;
        }

        try {
            const response = await API.deleteTask(taskId);

            if (response.success) {
                Components.showToast('🗑️ Tarea eliminada y guardada en backlog');
                await this.loadTasks();
                await this.loadStats();
            } else {
                Components.showToast('Error al eliminar', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            Components.showToast('Error de conexión', 'error');
        }
    },

    /**
     * Cambiar filtro activo
     */
    changeFilter(filter) {
        STATE.currentFilter = filter;

        // Actualizar botones de filtro
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });

        this.renderTasks();
    },

    /**
     * Añadir event listeners a botones de tareas
     */
    attachTaskEventListeners() {
        const container = document.getElementById('tasksContainer');

        container.addEventListener('click', async (e) => {
            const button = e.target.closest('button[data-action]');
            if (!button) return;

            const action = button.dataset.action;
            const taskId = button.dataset.taskId;

            if (action === 'cycle-status') {
                const currentStatus = button.dataset.currentStatus;
                await this.cycleTaskStatus(taskId, currentStatus);
            } else if (action === 'delete') {
                await this.deleteTask(taskId);
            }
        });
    }
};