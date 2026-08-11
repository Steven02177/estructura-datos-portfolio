# Bitácora de Estructura de Datos — Keyner / UDES

Portafolio interactivo para subir cada ejercicio de la clase (diagrama UML +
código fuente + salida). El menú se renderiza como una lista enlazada: cada
ejercicio es un nodo, conectado al siguiente, con un nodo `NULL` al final
donde se agrega el próximo.

Stack: **React + Vite + Tailwind + Firebase Firestore (solo datos) +
Cloudinary (solo imágenes)**, pensado para desplegarse en **Vercel** sin
servidor propio y **sin tarjeta de crédito**.

> **Nota sobre Storage:** el proyecto usó Firebase Storage originalmente,
> pero desde febrero de 2026 Firebase exige el plan de pago Blaze incluso
> para uso gratuito de Storage. Para no meter tarjeta, las imágenes (UML y
> salida) se suben a **Cloudinary** (tiene tier gratuito permanente, sin
> tarjeta, con subida "unsigned" directo desde el navegador). Firestore se
> queda en Firebase, en el plan gratuito Spark, sin cambios.

## 1. Crear el proyecto de Firebase (solo Firestore)

1. Ve a https://console.firebase.google.com → **Agregar proyecto**.
2. Dentro del proyecto, entra a **Compilación → Firestore Database** →
   **Crear base de datos** → modo *producción* → elige la región más cercana
   (ej. `us-central` o `southamerica-east1`).
3. **No actives Storage** — no lo necesitas y te pediría plan Blaze.
4. Ve a **⚙️ Configuración del proyecto → General**, baja hasta "Tus apps",
   crea una **app web** (ícono `</>`). Copia el objeto `firebaseConfig` que
   te muestra: ahí están los valores para el `.env`.

## 2. Crear la cuenta de Cloudinary (solo imágenes)

1. Crea una cuenta gratuita en https://cloudinary.com.
2. En el Dashboard, copia tu **Cloud name**.
3. Crea un **Upload Preset** en modo **Unsigned** (Settings → Upload →
   Upload presets → Add upload preset). Copia el nombre del preset.
4. Esos dos valores van al `.env` (siguiente paso). No necesitas ni copies
   el **API Secret** — con el preset "unsigned" no hace falta, y nunca debe
   ir en el frontend.

## 3. Configurar las reglas de Firestore (para el semestre, sin login)

Como es un proyecto académico personal y no vamos a implementar login, las
reglas quedan abiertas a lectura/escritura. **Esto es aceptable para este
caso de uso**, pero significa que cualquiera con la URL podría escribir en
tu base de datos si la comparte. Si más adelante quieres cerrarla, se puede
agregar Firebase Auth.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /trabajos/{trabajoId} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

## 4. Configurar variables de entorno localmente

```bash
cp .env.example .env
```

Rellena `.env` con los valores de tu `firebaseConfig` y de Cloudinary:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

VITE_CLOUDINARY_CLOUD_NAME=...
VITE_CLOUDINARY_UPLOAD_PRESET=...
```

## 5. Correr en local

```bash
npm install
npm run dev
```

Abre la URL que te muestre la terminal (por defecto `http://localhost:5173`).
Prueba el botón **"agregar nodo"** para subir tu primer ejercicio, con
imagen de UML incluida — esa es la prueba real de que Cloudinary quedó bien
conectado.

## 6. Subir a GitHub

```bash
git init
git add .
git commit -m "Portafolio Estructura de Datos"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/estructura-datos-portfolio.git
git push -u origin main
```

## 7. Desplegar en Vercel

1. Entra a https://vercel.com → **Add New → Project** → importa el
   repositorio de GitHub.
2. Framework preset: Vercel detecta **Vite** automáticamente.
3. En **Environment Variables**, agrega las 7 variables del `.env` (las 5 de
   Firebase + las 2 de Cloudinary, con el prefijo `VITE_` tal cual).
4. **Deploy**. Cada `git push` a `main` vuelve a desplegar solo.

## Cómo se agrega un ejercicio cada clase

1. Entra a tu URL de Vercel.
2. Clic en **"+ siguiente = NULL — agregar nodo"**.
3. Llena título, número de clase, sube la imagen del UML, pega el código y
   la salida.
4. Guardar — aparece de inmediato en la lista, ya enlazado.

## Estructura del proyecto

```
src/
  firebase.js              → conexión a Firestore/Storage
  App.jsx                  → estado global y layout
  components/
    Header.jsx              → nombre, universidad, materia
    LinkedListMenu.jsx       → menú = lista enlazada de nodos
    NodeCard.jsx             → un nodo individual
    TrabajoDetail.jsx        → UML + código + salida del nodo activo
    CodeBlock.jsx            → bloque de código con numeración de líneas
    AddTrabajoForm.jsx       → formulario/modal para agregar un nodo
```
