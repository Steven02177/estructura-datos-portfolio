# Estructura de Datos — Keyner García / UDES

Portafolio académico con portada, cuadrícula pública de trabajos y panel de
administrador protegido. Cada trabajo documenta: título, número de clase,
fecha, descripción, código fuente, diagrama UML y salida de ejecución.

Stack: **React + Vite + Tailwind + React Router + Framer Motion + Firebase
(Firestore + Authentication) + Cloudinary (imágenes)**. Desplegado en
**Vercel**, sin servidor propio y sin tarjeta de crédito.

## Cómo está dividido

- **`/`** — portada (landing).
- **`/trabajos`** — cuadrícula pública de todos los trabajos. Solo lectura.
- **`/trabajos/:id`** — detalle de un trabajo. Solo lectura.
- **`/admin/login`** — inicio de sesión del administrador.
- **`/admin`** — panel protegido: crear, editar y eliminar trabajos.

Un visitante o profesor puede navegar `/`, `/trabajos` y el detalle de cada
trabajo sin iniciar sesión, y nunca ve botones de editar/eliminar/agregar.
Esos controles solo existen dentro de `/admin`, que exige sesión iniciada.

## 1. Crear el proyecto de Firebase

1. https://console.firebase.google.com → **Agregar proyecto**.
2. **Compilación → Firestore Database** → Crear base de datos → modo
   *producción* → región más cercana.
3. **No actives Storage** (Firebase exige plan Blaze de pago para Storage
   desde feb. 2026 — por eso usamos Cloudinary en su lugar).
4. **⚙️ Configuración del proyecto → General** → "Tus apps" → crea una app
   web (`</>`) → copia el `firebaseConfig`.

## 2. Activar Authentication y crear tu usuario admin

1. **Compilación → Authentication → Comenzar**.
2. En "Sign-in method", activa el proveedor **Correo electrónico/contraseña**.
3. Ve a la pestaña **Users** → **Add user** → crea tu propio usuario (el
   correo y contraseña con los que vas a entrar a `/admin/login`). Este es
   el único usuario que va a existir — no hay registro público, solo tú.

## 3. Crear la cuenta de Cloudinary (imágenes)

1. Cuenta gratuita en https://cloudinary.com.
2. Dashboard → copia el **Cloud name**.
3. Settings → Upload → Upload presets → Add upload preset → modo
   **Unsigned**. Copia el nombre del preset.
4. Nunca copies ni uses el **API Secret** — no hace falta con preset
   unsigned, y jamás debe ir en el frontend.

## 4. Reglas de Firestore (obligatorio — protege los datos de verdad)

Cualquiera puede **leer**, pero solo un usuario **autenticado** (es decir,
tú, desde `/admin`) puede **escribir**. Esto es lo que de verdad impide que
un visitante modifique datos, no solo el ocultar botones en la interfaz.

**Firestore → Reglas:**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 5. Variables de entorno

```bash
cp .env.example .env
```

Rellena con tu `firebaseConfig` y tus datos de Cloudinary:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

VITE_CLOUDINARY_CLOUD_NAME=...
VITE_CLOUDINARY_UPLOAD_PRESET=...
```

## 6. Correr en local

```bash
npm install
npm run dev
```

Prueba en este orden:
1. `/` — portada carga con la animación del grafo de fondo.
2. `/trabajos` — cuadrícula (vacía al inicio, es normal).
3. `/admin/login` — inicia sesión con el usuario que creaste en el paso 2.
4. Dentro de `/admin`, crea un trabajo con imagen de UML. Debe aparecer de
   inmediato en `/trabajos`.
5. Cierra sesión y confirma que `/admin` te redirige a `/admin/login` — esa
   es la ruta protegida funcionando.

## 7. Subir a GitHub

```bash
git init
git add .
git commit -m "Rediseño: portada, cuadrícula, admin con auth"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/estructura-datos-portfolio.git
git push -u origin main
```

## 8. Desplegar en Vercel

1. https://vercel.com → **Add New → Project** → importa el repo.
2. Vercel detecta Vite automáticamente.
3. **Environment Variables**: agrega las 7 variables del `.env`.
4. Deploy. `vercel.json` ya incluye el rewrite necesario para que
   `/trabajos/algún-id` funcione al recargar la página directamente (SPA con
   React Router).

## Estructura del proyecto

```
src/
  firebase.js                 → Firestore, Auth y Cloudinary
  App.jsx                     → rutas
  context/AuthContext.jsx     → estado de sesión global
  components/
    Layout.jsx, NavBar.jsx     → shell compartido (nav responsive + footer)
    GraphBackground.jsx        → grafo animado del hero (firma visual)
    RutaProtegida.jsx          → guarda /admin en el cliente
    TrabajoCard.jsx             → card de la cuadrícula pública
    CodeBlock.jsx               → bloque de código con numeración
    AddTrabajoForm.jsx          → formulario, sirve para crear y editar
  pages/
    Home.jsx                    → portada
    Trabajos.jsx                 → cuadrícula pública
    TrabajoPage.jsx               → detalle de un trabajo
    AdminLogin.jsx                → login
    AdminDashboard.jsx            → panel: tabla + crear/editar/eliminar
```

## Nota de seguridad importante sobre Cloudinary

El preset "unsigned" de Cloudinary es, por diseño, un endpoint público:
cualquiera que conozca tu `cloud_name` y el nombre del preset podría subir
una imagen (no editar ni ver tus datos, solo subir archivos a esa carpeta).
Es una limitación conocida de cualquier subida sin backend propio, y es un
riesgo aceptable para un proyecto académico. Si más adelante quieres
cerrarlo del todo, la solución es una función serverless de Vercel que
firme la subida con el API Secret — puedo ayudarte a montarla si te
interesa, pero no es necesaria para este entregable.
