AEE. "El Monolito Artesanal"
Como ya sabéis, el calendario apremia. El próximo 23 de febrero de 2026 empezáis vuestro periodo DUAL. Antes de que esto ocurra, necesito asegurarme de que entendéis cómo funciona el motor bajo el capó.
No quiero "magia". No quiero librerías que hagan el trabajo por vosotros. Para esta actividad quiero Ingeniería. Vamos a desarrollar una aplicación FullStack completa utilizando exclusivamente estándares web nativos (Vanilla JS) y un Backend robusto. Esta actividad demostrará que sois capaces de conectar todos los puntos: desde el clic del usuario hasta el byte en el disco duro del servidor.
¡Ánimo! Están construyendo la base de vuestro futuro profesional. Recuerden: un buen FullStack no depende de la herramienta, sino de su capacidad para comprender el problema.
Tabla de contenidos
Objetivo del Proyecto: "DevTask Tracker"	2
Requisitos Técnicos e Intermodulares	2
1. La Base de Datos (MongoDB Atlas) - RA3	2
2. El Backend (Node.js + Express) - RA2	2
3. El Frontend (Vanilla JS + HTML + CSS) - RA1	3
Criterios de Evaluación (Rúbrica)	4
Entregables	5
Referencias Recomendadas	5


Objetivo del Proyecto: "DevTask Tracker"
Vais a construir un Gestor de Tareas para Desarrolladores. Una aplicación SPA (Single Page Application) sencilla donde un equipo de desarrollo pueda registrar las tareas técnicas pendientes, ver su estado y eliminarlas cuando ya no sean necesarias.
La aplicación debe permitir:
Visualizar todas las tareas almacenadas en la base de datos (MongoDB Atlas).
Crear una nueva tarea con: Título, Descripción, Tecnología (ej: Java, JS, Python) y Estado (Pendiente/Completada).
Eliminar una tarea de la lista y guardarla en un histórico (Backlog) como resultado documental de la tarea.
Feedback visual: La interfaz debe actualizarse sin recargar la página completa.
Requisitos Técnicos e Intermodulares
Para superar esta actividad, debéis integrar conocimientos de Base de Datos, Programación en Servidor y Diseño de Interfaces.
1. La Base de Datos (MongoDB Atlas) - RA3
Debéis crear un Cluster en la nube.
Esquema Mongoose (RA3.a, RA3.e):
titulo: String, obligatorio.
tecnologia: String (o Enum).
estado: Boolean (o String 'pending'/'done').
fecha: Date (default: now).
2. El Backend (Node.js + Express) - RA2
Servidor escuchando en puerto 3000 o 3001 (RA2.a).
Conexión segura a MongoDB (sin exponer contraseñas en el código, usen .env si es posible, o gestionad bien la cadena) (RA3.c).
API REST (RA2.b, RA2.d):
GET /api/tasks: Devuelve el JSON con todas las tareas.
POST /api/tasks: Recibe un JSON y guarda la tarea.
DELETE /api/tasks/:id: Elimina la tarea por su ID.

3. El Frontend (Vanilla JS + HTML + CSS) - RA1
HTML5 Semántico: Estructura limpia.
CSS (RA1.c): Diseño propio. Podéis usar CSS Grid o Flexbox. Quiero que se vea profesional (¡Nada de Times New Roman sobre fondo blanco!).
JavaScript (RA1.e):
Uso de fetch() con async/await para comunicarse con vuestra API.
Manipulación del DOM (document.createElement, innerHTML, etc.) para pintar las tareas dinámicamente.
Gestión de eventos (click en botón "Guardar" o "Borrar").
Nota: Aunque el RA1 menciona frameworks, en esta práctica se evalúa la capacidad de gestionar la "Interfaz Dinámica" y el "Rendimiento" (RA1.e) comprendiendo el ciclo de vida de la petición HTTP, base fundamental para luego usar frameworks.
