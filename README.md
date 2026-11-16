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
- **`/parcial-2`** — examen del 2º corte: comparativa visual de ordenamientos.
- **`/parcial-3`** — examen del 3er corte: listas circulares (simulador de punteros,
  respuestas teóricas y código Java con salida real).
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
5. **Para que también acepte documentos Word (.docx):** en la configuración
   del preset revisa el campo **"Allowed formats"** — si está restringido
   solo a imágenes, bórralo o agrega `docx`. Si lo dejas vacío, Cloudinary
   acepta cualquier tipo de archivo.

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
    SortingVisualizer.jsx       → simulador interactivo de métodos de ordenamiento
    ParcialVisualizer.jsx       → simulador de ordenamientos del Parcial 2
    CircularListVisualizer.jsx  → simulador de listas circulares del Parcial 3
  pages/
    Home.jsx                    → portada
    Trabajos.jsx                 → cuadrícula pública
    TrabajoPage.jsx               → detalle de un trabajo
    AdminLogin.jsx                → login
    AdminDashboard.jsx            → panel: tabla + crear/editar/eliminar
    Parcial2.jsx                  → examen 2º corte (/parcial-2)
    Parcial3.jsx                  → examen 3er corte (/parcial-3)
  data/
    listasCirculares.js         → GENERADO: código Java + salidas del Parcial 3
scripts/
  gen-codechef.mjs              → genera los .java del Parcial 2
  gen-parcial3.mjs              → genera src/data/listasCirculares.js
  salidas/                      → salida real (JDK 17) de los .java del Parcial 3
```

## Representación visual de ordenamiento (2º corte)

En el formulario de admin hay un checkbox **"Activar representación visual de
ordenamiento"**. Al activarlo en un trabajo, la página de detalle muestra un
simulador interactivo con:

- Entrada de datos (números separados por coma)
- Selector de método: Burbuja simple / mejorado, Selección, Inserción,
  ShakerSort, ShellSort, QuickSort, RadixSort
- Control de velocidad
- Gráfico de barras animado (colores: valores, comparando, intercambio, ordenado)
- Log de pasos (iteraciones, intercambios, comparaciones) y tiempo

El método se preselecciona automáticamente según el título del trabajo cuando
es posible. El profesor puede cambiar datos y método al momento de revisar.

## Listas circulares (3er corte)

La ruta **`/parcial-3`** contiene la entrega del examen del tercer parcial:

- **Respuestas teóricas** de los enunciados 1 y 2 (diferencias de eliminación
  entre lista circular sencilla y doble; qué parte de la actualización depende
  de la estructura y qué parte es independiente de los punteros), con tablas
  comparativas.
- **`CircularListVisualizer`**: simulador interactivo que dibuja la lista sobre
  una circunferencia (flechas `siguiente` y, en la doble, `anterior`), anima el
  recorrido hasta el nodo objetivo, muestra las ecuaciones de punteros que aplica
  cada operación (insertar, `eliminarEnPosicion`, `actualizarValorEnPosicion`,
  `actualizarPorDato`) y valida los casos fuera de rango con avisos controlados.
  Usa los mismos datos iniciales que los `main` de Java (1..10 y 100..1000).
- **Código Java** de los ejercicios 3, 4 y 5 con botón de copiar (listo para
  pegar en CodeChef) y su **salida real de ejecución**.

### Código Java del Parcial 3

Están en `codechef/` (independientes entre sí, uno por ejercicio):

| Archivo | Ejercicio |
|---------|-----------|
| `6_ListaCircularSimple.java` | 3 — `eliminarEnPosicion` |
| `7_ListaCircularDoble.java` | 4 — `eliminarEnPosicionDoble` + `mostrarLista` |
| `8_ActualizarNodo.java` | 5 — `actualizarValorEnPosicion` / `actualizarPorDato` |

El archivo `src/data/listasCirculares.js` (código + salidas) **está generado**;
para regenerarlo después de tocar un `.java` o una salida:

```bash
node scripts/gen-parcial3.mjs
```

Las salidas reales viven en `scripts/salidas/*.txt` (compilado y ejecutado con
JDK 17). Si cambias un `.java`, recompila y reescribe su `.txt` antes de
regenerar el módulo.

## Talleres: Hash y Grafos (clases 9 y 10)

Dos rutas nuevas contienen los dos talleres prácticos del semestre, cada uno
como trabajo independiente con su propia navegación interna:

### `/taller-hash` — HashMap vs HashSet

- **Marco teórico**: función hash y buckets, definición formal de `HashMap` y
  `HashSet`, complejidad temporal (O(1) promedio y degradación a O(n) con el
  treeify de Java 8), colisiones y el contrato `equals()`/`hashCode()`, más el
  cuadro comparativo pedido en el Word.
- **`HashVisualizer`**: simulador que calcula el `hashCode()` real de Java
  (`h = 31·h + c`), el índice real de Java 8 (`(h ^ (h >>> 16)) & (n - 1)`) y
  dibuja los 16 buckets con colisiones encadenadas; alterna modo `HashMap`
  (llave → valor) y `HashSet` (elementos únicos con `add()` rechazando
  duplicados).
- **Ejemplos guía** (`Parte 2`) y **ejercicios 3.1 y 3.2** con código, botón de
  copiar y salida real de ejecución.

### `/taller-grafos` — Taller práctico: Grafos

- **Marco teórico** (Parte 1 del Word): G = (V, E), dirigido/no dirigido,
  ponderado, lista vs matriz de adyacencia, tabla de complejidad espacial y
  temporal, BFS (cola + `HashSet`) y DFS (pila) con pseudocódigo.
- **`GrafoVisualizer`**: cuatro grafos reales del taller (campus con BFS, red
  social con DFS, transferencias dirigidas y la traza `tracert`), recorrido paso
  a paso, lista/matriz de adyacencia con grados y consulta de
  `existeCaminoDirecto`.
- **Parte 2** (análisis de `Grafos.java`), **ejercicios 3.1 y 3.2** y la **traza
  CMD real** (`tracert -d -h 12 -w 800 www.google.com`), todos con salida real.

### Código Java de los talleres

Están en `codechef/` (además de los códigos guía, que viven en
`scripts/fuentes/`):

| Archivo | Taller / ejercicio |
|---------|--------------------|
| `9_MainHashMap.java` | Hash 3.1 — calificaciones con `HashMap` |
| `9_MainHashSet.java` | Hash 3.2 — correos únicos con `HashSet` |
| `Grafos.java` | Grafos Parte 2 — ejemplo guía `GrafoRed`/`MainGrafo` (BFS) |
| `10_GrafoDFS.java` | Grafos 3.1 — DFS con `Stack` (7 vértices, 9 aristas) |
| `11_GrafoDirigido.java` | Grafos 3.2 — `GrafoDirigido` + `existeCaminoDirecto` |
| `12_TracertGrafo.java` | Grafos — traza `tracert` como grafo dirigido |

`src/data/tallerHash.js` y `src/data/tallerGrafos.js` **están generados**;
para regenerarlos después de tocar un `.java` o una salida:

```bash
node scripts/gen-talleres.mjs
```

### Integración con el panel administrativo

El formulario «nuevo/editar trabajo» incluye el campo **página especial**
(`paginaEspecial`: `'' | 'hash' | 'grafos'`):

- La tarjeta del trabajo en `/trabajos` enlaza a la página completa del taller.
- Las capturas (imagen de salida), el diagrama UML y el Word que adjuntes en
  ese trabajo aparecen en la sección **Evidencias** del taller correspondiente.
- Los trabajos antiguos sin el campo siguen funcionando igual (ficha estándar).

No rompe registros previos: el campo es opcional y con valor por defecto `''`.

## Documentos Word (.docx)

Cada trabajo admite opcionalmente un archivo `.docx`. Se sube a Cloudinary
como recurso "raw" (no imagen) y en la página de detalle se muestra
**convertido a HTML directamente en el navegador** con la librería
`mammoth` — el profesor lo lee ahí mismo, sin descargarlo ni abrirlo en
Word/Google Docs. Si la conversión falla por algún motivo, se muestra un
enlace de respaldo para abrir el archivo original.

Limitación conocida: `mammoth` interpreta el texto, estilos y tablas del
`.docx`, pero no reproduce diseño complejo (columnas, encabezados/pies de
página, SmartArt). Para un documento de texto normal funciona muy bien.

## Nota de seguridad importante sobre Cloudinary

El preset "unsigned" de Cloudinary es, por diseño, un endpoint público:
cualquiera que conozca tu `cloud_name` y el nombre del preset podría subir
una imagen (no editar ni ver tus datos, solo subir archivos a esa carpeta).
Es una limitación conocida de cualquier subida sin backend propio, y es un
riesgo aceptable para un proyecto académico. Si más adelante quieres
cerrarlo del todo, la solución es una función serverless de Vercel que
firme la subida con el API Secret — puedo ayudarte a montarla si te
interesa, pero no es necesaria para este entregable.
