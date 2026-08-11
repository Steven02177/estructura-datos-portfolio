import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
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

const TRABAJOS_COLLECTION = 'trabajos'

// Cloudinary reemplaza a Firebase Storage (Firebase exige plan Blaze para
// Storage desde feb. 2026). Subida "unsigned" directo desde el navegador,
// sin backend propio y sin exponer ninguna clave secreta.
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`

/**
 * Sube una imagen a Cloudinary y devuelve su URL pública (secure_url).
 */
export async function subirImagen(archivo) {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error(
      'Faltan VITE_CLOUDINARY_CLOUD_NAME o VITE_CLOUDINARY_UPLOAD_PRESET en el .env'
    )
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
 * Crea un nuevo nodo (trabajo) en la lista enlazada.
 * data: { titulo, numeroClase, fecha, descripcion, codigo, salidaTexto }
 * imagenes: { umlFile, salidaFile (opcional) }
 */
export async function crearTrabajo(data, imagenes) {
  const docRef = await addDoc(collection(db, TRABAJOS_COLLECTION), {
    ...data,
    umlUrl: '',
    salidaImagenUrl: '',
    createdAt: serverTimestamp(),
  })

  const updates = {}
  if (imagenes.umlFile) {
    updates.umlUrl = await subirImagen(imagenes.umlFile)
  }
  if (imagenes.salidaFile) {
    updates.salidaImagenUrl = await subirImagen(imagenes.salidaFile)
  }

  if (Object.keys(updates).length > 0) {
    await updateDoc(doc(db, TRABAJOS_COLLECTION, docRef.id), updates)
  }

  return docRef.id
}

/**
 * Trae todos los trabajos ordenados por número de clase.
 */
export async function obtenerTrabajos() {
  const q = query(collection(db, TRABAJOS_COLLECTION), orderBy('numeroClase', 'asc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
}
