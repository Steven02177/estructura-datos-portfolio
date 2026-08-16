import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'

// Estas variables se leen del archivo .env (ver .env.example).
// En Vercel se configuran en Settings > Environment Variables.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)

const TRABAJOS_COLLECTION = 'trabajos'

// ---------------------------------------------------------------------------
// Autenticación (solo administrador). El profesor/visitante nunca inicia
// sesión: navega la página en modo lectura sin pasar por aquí.
// ---------------------------------------------------------------------------

export function iniciarSesion(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
}

export function cerrarSesion() {
  return signOut(auth)
}

/**
 * Suscribe un callback(user | null) a los cambios de sesión.
 * Devuelve la función para cancelar la suscripción.
 */
export function observarSesion(callback) {
  return onAuthStateChanged(auth, callback)
}

// ---------------------------------------------------------------------------
// Cloudinary (imágenes). Firebase Storage exige plan Blaze desde feb. 2026,
// así que las imágenes se suben directo al navegador vía preset "unsigned".
// ---------------------------------------------------------------------------

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
const TAMANO_MAXIMO_MB = 10

/**
 * Sube una imagen a Cloudinary y devuelve su URL pública (secure_url).
 */
export async function subirImagen(archivo) {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error(
      'Faltan VITE_CLOUDINARY_CLOUD_NAME o VITE_CLOUDINARY_UPLOAD_PRESET en el .env'
    )
  }
  if (!archivo.type.startsWith('image/')) {
    throw new Error('El archivo debe ser una imagen.')
  }
  if (archivo.size > TAMANO_MAXIMO_MB * 1024 * 1024) {
    throw new Error(`La imagen no puede superar ${TAMANO_MAXIMO_MB} MB.`)
  }

  const formData = new FormData()
  formData.append('file', archivo)
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

  const respuesta = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: 'POST',
    body: formData,
  })

  if (!respuesta.ok) {
    const detalle = await respuesta.text().catch(() => '')
    throw new Error(`Error al subir imagen a Cloudinary (${respuesta.status}): ${detalle}`)
  }

  const data = await respuesta.json()
  if (!data.secure_url) {
    throw new Error('Cloudinary no devolvió una URL válida.')
  }

  return data.secure_url
}

/**
 * Sube un documento (Word, PDF, etc.) a Cloudinary como recurso "raw" y
 * devuelve su URL pública.
 */
export async function subirDocumento(archivo) {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error(
      'Faltan VITE_CLOUDINARY_CLOUD_NAME o VITE_CLOUDINARY_UPLOAD_PRESET en el .env'
    )
  }
  const extensionesValidas = ['.doc', '.docx']
  const nombre = archivo.name.toLowerCase()
  if (!extensionesValidas.some((ext) => nombre.endsWith(ext))) {
    throw new Error('El documento debe ser un archivo .doc o .docx.')
  }
  if (archivo.size > TAMANO_MAXIMO_MB * 1024 * 1024) {
    throw new Error(`El documento no puede superar ${TAMANO_MAXIMO_MB} MB.`)
  }

  const formData = new FormData()
  formData.append('file', archivo)
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

  const urlRaw = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`
  const respuesta = await fetch(urlRaw, { method: 'POST', body: formData })

  if (!respuesta.ok) {
    const detalle = await respuesta.text().catch(() => '')
    throw new Error(`Error al subir el documento a Cloudinary (${respuesta.status}): ${detalle}`)
  }

  const data = await respuesta.json()
  if (!data.secure_url) {
    throw new Error('Cloudinary no devolvió una URL válida para el documento.')
  }

  return data.secure_url
}

// ---------------------------------------------------------------------------
// CRUD de trabajos (Firestore)
// ---------------------------------------------------------------------------

/**
 * Crea un nuevo trabajo.
 * data: { titulo, numeroClase, fecha, descripcion, codigo, salidaTexto }
 * imagenes: { umlFile, salidaFile (opcional) }
 */
export async function crearTrabajo(data, imagenes) {
  const docRef = await addDoc(collection(db, TRABAJOS_COLLECTION), {
    ...data,
    umlUrl: '',
    salidaImagenUrl: '',
    documentoUrl: '',
    createdAt: serverTimestamp(),
  })

  const updates = {}
  if (imagenes.umlFile) {
    updates.umlUrl = await subirImagen(imagenes.umlFile)
  }
  if (imagenes.salidaFile) {
    updates.salidaImagenUrl = await subirImagen(imagenes.salidaFile)
  }
  if (imagenes.docFile) {
    updates.documentoUrl = await subirDocumento(imagenes.docFile)
  }

  if (Object.keys(updates).length > 0) {
    await updateDoc(doc(db, TRABAJOS_COLLECTION, docRef.id), updates)
  }

  return docRef.id
}

/**
 * Edita un trabajo existente. Solo sube imágenes nuevas si se adjuntaron.
 */
export async function editarTrabajo(id, data, imagenes = {}) {
  const updates = { ...data }

  if (imagenes.umlFile) {
    updates.umlUrl = await subirImagen(imagenes.umlFile)
  }
  if (imagenes.salidaFile) {
    updates.salidaImagenUrl = await subirImagen(imagenes.salidaFile)
  }
  if (imagenes.docFile) {
    updates.documentoUrl = await subirDocumento(imagenes.docFile)
  }

  await updateDoc(doc(db, TRABAJOS_COLLECTION, id), updates)
}

/**
 * Elimina un trabajo. Las imágenes quedan en Cloudinary (no se borran desde
 * el cliente por seguridad: borrar requiere el API Secret, que nunca debe
 * estar en el frontend). Es un costo aceptable en el free tier.
 */
export async function eliminarTrabajo(id) {
  await deleteDoc(doc(db, TRABAJOS_COLLECTION, id))
}

/** Trae todos los trabajos ordenados por número de clase. */
export async function obtenerTrabajos() {
  const q = query(collection(db, TRABAJOS_COLLECTION), orderBy('numeroClase', 'asc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
}

/** Trae un solo trabajo por id. */
export async function obtenerTrabajo(id) {
  const snap = await getDoc(doc(db, TRABAJOS_COLLECTION, id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}
