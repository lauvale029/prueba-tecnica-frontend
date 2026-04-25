# Frontend - Sistema de Gestión Escolar

Esta es la interfaz de usuario del sistema, construida con React, TypeScript y Vite. Ofrece validaciones en tiempo real, notificaciones (Toasts) y un diseño limpio y responsivo.

---

## ⚠️ Cómo levantar la aplicación (Docker)

La contenedorización y el despliegue de esta aplicación están gestionados de forma centralizada mediante Docker Compose desde el repositorio del **Backend**.

Para levantar el proyecto completo de la forma correcta, por favor dirígete al **[README del repositorio del Backend](<https://github.com/lauvale029/prueba-tecnica-backend.git>)** y sigue las instrucciones detalladas de clonación y ejecución.

---

## 💻 Desarrollo Local (Sin Docker)

Si deseas correr únicamente el frontend en modo de desarrollo en tu máquina (sin contenedores):

**1. Instala las dependencias:**

```bash
npm install
```

**2. Inicia el servidor de Vite:**

```bash
npm run dev
```

> **Nota:** Para que la aplicación funcione, asegúrate de tener el backend corriendo localmente o mediante Docker, exponiendo la API en `http://localhost:8082/api`.