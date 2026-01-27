// frontend/js/api.js

const API = {
    /**
     * Obtener todas las tareas
     */
    async getTasks() {
        try {
            const response = await fetch(`${CONFIG.API_URL}${CONFIG.ENDPOINTS.TASKS}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener tareas:', error);
            throw error;
        }
    },

    /**
     * Obtener estadísticas
     */
    async getStats() {
        try {
            const response = await fetch(`${CONFIG.API_URL}${CONFIG.ENDPOINTS.STATS}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            throw error;
        }
    },

    /**
     * Crear nueva tarea
     */
    async createTask(taskData) {
        try {
            const response = await fetch(`${CONFIG.API_URL}${CONFIG.ENDPOINTS.TASKS}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al crear la tarea');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al crear tarea:', error);
            throw error;
        }
    },

    /**
     * Actualizar tarea
     */
    async updateTask(taskId, updates) {
        try {
            const response = await fetch(`${CONFIG.API_URL}${CONFIG.ENDPOINTS.TASKS}/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updates)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar la tarea');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al actualizar tarea:', error);
            throw error;
        }
    },

    /**
     * Eliminar tarea
     */
    async deleteTask(taskId, motivo = '') {
        try {
            const response = await fetch(`${CONFIG.API_URL}${CONFIG.ENDPOINTS.TASKS}/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ motivo })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al eliminar la tarea');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al eliminar tarea:', error);
            throw error;
        }
    },

    /**
     * Buscar tareas
     */
    async searchTasks(query) {
        try {
            const response = await fetch(`${CONFIG.API_URL}${CONFIG.ENDPOINTS.SEARCH}?q=${encodeURIComponent(query)}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al buscar tareas:', error);
            throw error;
        }
    },

    /**
     * Obtener backlog
     */
    async getBacklog(limit = 50) {
        try {
            const response = await fetch(`${CONFIG.API_URL}${CONFIG.ENDPOINTS.BACKLOG}?limit=${limit}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener backlog:', error);
            throw error;
        }
    }
};