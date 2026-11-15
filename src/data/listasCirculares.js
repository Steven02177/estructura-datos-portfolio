/**
 * Parcial 3 — Listas circulares (ejercicios 3, 4 y 5).
 *
 * Código Java + salida REAL de ejecución.
 * ARCHIVO GENERADO por scripts/gen-parcial3.mjs — no editar a mano.
 * Fuentes: codechef/*.java  ·  scripts/salidas/*.txt
 *
 * Regenerar: node scripts/gen-parcial3.mjs
 */

/** Código de 6_ListaCircularSimple.java */
export const CODIGO_SIMPLE = `/**
 * PARCIAL 3 - Ejercicio 3
 * Lista Circular Sencillamente Enlazada: eliminacion por posicion.
 *
 * Cada clase incluye su estructura de nodos y un main con pruebas.
 * Copia TODO este archivo en CodeChef (lenguaje: Java) y pulsa Run.
 */
public class Main {

    // ===================== Lista circular sencilla =====================
    static class ListaCircularSimple {

        // ---------- Estructura del nodo ----------
        static class Nodo {
            int dato;
            Nodo siguiente;

            Nodo(int dato) {
                this.dato = dato;
            }
        }

        private Nodo cabeza;   // primer nodo de la vuelta
        private Nodo ultimo;   // ultimo nodo: su siguiente regresa a la cabeza
        private int tamano;

        // Inserta al final en O(1) apoyandose en la referencia 'ultimo'
        void insertarAlFinal(int dato) {
            Nodo nuevo = new Nodo(dato);
            if (cabeza == null) {
                nuevo.siguiente = nuevo;      // un solo nodo: se apunta a si mismo
                cabeza = nuevo;
                ultimo = nuevo;
            } else {
                nuevo.siguiente = cabeza;     // el nuevo se enlaza con la cabeza
                ultimo.siguiente = nuevo;     // el ultimo apunta al nuevo
                ultimo = nuevo;
            }
            tamano++;
        }

        /**
         * Elimina el nodo ubicado en la posicion indicada (base 1).
         * Maneja la CABEZA, los nodos intermedios y la COLA de la estructura circular.
         *
         * @return true si elimino; false si hubo un aviso controlado (sin NullPointerException)
         */
        boolean eliminarEnPosicion(int posicion) {
            if (cabeza == null) {
                System.out.println("  [Aviso] La lista esta vacia: no hay nada que eliminar.");
                return false;
            }
            if (posicion < 1 || posicion > tamano) {
                System.out.println("  [Aviso] La posicion " + posicion
                        + " no existe (rango valido: 1 a " + tamano + ").");
                return false;
            }

            if (tamano == 1) {
                // Caso: la lista se queda sin nodos
                cabeza = null;
                ultimo = null;
            } else if (posicion == 1) {
                // Caso: se elimina la CABEZA.
                // El ultimo nodo debe apuntar a la nueva cabeza, o el circulo se rompe.
                Nodo nuevaCabeza = cabeza.siguiente;
                ultimo.siguiente = nuevaCabeza;
                cabeza = nuevaCabeza;
            } else {
                // Caso: nodo intermedio o COLA.
                // Se recorre con UN solo puntero hasta el nodo (posicion - 1):
                // la lista sencilla no guarda quien apunta al nodo a eliminar.
                Nodo anterior = cabeza;
                for (int i = 1; i < posicion - 1; i++) {
                    anterior = anterior.siguiente;
                }
                Nodo eliminado = anterior.siguiente;
                anterior.siguiente = eliminado.siguiente;   // unico puntero a modificar
                if (eliminado == ultimo) {
                    ultimo = anterior;                     // era la cola: mover 'ultimo'
                }
            }
            tamano--;
            return true;
        }

        // Recorre una sola vuelta: la condicion de parada es volver a la cabeza
        void mostrarLista() {
            if (cabeza == null) {
                System.out.println("  Lista vacia");
                return;
            }
            StringBuilder sb = new StringBuilder("  ");
            Nodo actual = cabeza;
            do {
                sb.append(actual.dato).append(" -> ");
                actual = actual.siguiente;
            } while (actual != cabeza);
            sb.append("(regresa a ").append(cabeza.dato).append(")");
            System.out.println(sb + "   [tamano = " + tamano + "]");
        }
    }

    // ===================== Pruebas =====================
    public static void main(String[] args) {
        ListaCircularSimple lista = new ListaCircularSimple();

        // Insercion de 10 nodos
        for (int i = 1; i <= 10; i++) {
            lista.insertarAlFinal(i);          // valores 1, 2, 3, ..., 10
        }

        System.out.println("=== Lista inicial con 10 nodos ===");
        lista.mostrarLista();

        System.out.println();
        System.out.println("--- Caso 1: eliminar nodo INTERMEDIO (posicion 5) ---");
        System.out.println("Antes:");
        lista.mostrarLista();
        lista.eliminarEnPosicion(5);
        System.out.println("Despues:");
        lista.mostrarLista();

        System.out.println();
        System.out.println("--- Caso 2: eliminar la CABEZA (posicion 1) ---");
        System.out.println("Antes:");
        lista.mostrarLista();
        lista.eliminarEnPosicion(1);
        System.out.println("Despues:");
        lista.mostrarLista();

        System.out.println();
        System.out.println("--- Caso 3: eliminar la COLA (posicion 8, la ultima) ---");
        System.out.println("Antes:");
        lista.mostrarLista();
        lista.eliminarEnPosicion(8);
        System.out.println("Despues:");
        lista.mostrarLista();

        System.out.println();
        System.out.println("--- Caso extra: posicion invalida (20) ---");
        lista.eliminarEnPosicion(20);

        System.out.println();
        System.out.println("--- Caso extra: vaciar la lista de a uno ---");
        while (lista.eliminarEnPosicion(1)) {
            // el ultimo llamado que falla imprime el aviso de lista vacia
        }
        lista.mostrarLista();
    }
}`

/** Salida real de 6_ListaCircularSimple.java */
export const SALIDA_SIMPLE = `=== Lista inicial con 10 nodos ===
  1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 9 -> 10 -> (regresa a 1)   [tamano = 10]

--- Caso 1: eliminar nodo INTERMEDIO (posicion 5) ---
Antes:
  1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 9 -> 10 -> (regresa a 1)   [tamano = 10]
Despues:
  1 -> 2 -> 3 -> 4 -> 6 -> 7 -> 8 -> 9 -> 10 -> (regresa a 1)   [tamano = 9]

--- Caso 2: eliminar la CABEZA (posicion 1) ---
Antes:
  1 -> 2 -> 3 -> 4 -> 6 -> 7 -> 8 -> 9 -> 10 -> (regresa a 1)   [tamano = 9]
Despues:
  2 -> 3 -> 4 -> 6 -> 7 -> 8 -> 9 -> 10 -> (regresa a 2)   [tamano = 8]

--- Caso 3: eliminar la COLA (posicion 8, la ultima) ---
Antes:
  2 -> 3 -> 4 -> 6 -> 7 -> 8 -> 9 -> 10 -> (regresa a 2)   [tamano = 8]
Despues:
  2 -> 3 -> 4 -> 6 -> 7 -> 8 -> 9 -> (regresa a 2)   [tamano = 7]

--- Caso extra: posicion invalida (20) ---
  [Aviso] La posicion 20 no existe (rango valido: 1 a 7).

--- Caso extra: vaciar la lista de a uno ---
  [Aviso] La lista esta vacia: no hay nada que eliminar.
  Lista vacia`

/** Código de 7_ListaCircularDoble.java */
export const CODIGO_DOBLE = `/**
 * PARCIAL 3 - Ejercicio 4
 * Lista Circular Doblemente Enlazada: eliminacion por posicion.
 *
 * Nodo con dato, siguiente y anterior; el ultimo nodo se conecta con el
 * primero en ambos sentidos. Incluye mostrarLista() que recorre en las
 * dos direcciones para verificar la integridad de los enlaces.
 *
 * Copia TODO este archivo en CodeChef (lenguaje: Java) y pulsa Run.
 */
public class Main {

    // ===================== Lista circular doble =====================
    static class ListaCircularDoble {

        // ---------- Estructura del nodo ----------
        static class Nodo {
            int dato;
            Nodo siguiente;
            Nodo anterior;

            Nodo(int dato) {
                this.dato = dato;
            }
        }

        private Nodo cabeza;   // el ultimo nodo siempre es cabeza.anterior
        private int tamano;

        // Inserta al final: el cierre circular se mantiene en ambos sentidos
        void insertarAlFinal(int dato) {
            Nodo nuevo = new Nodo(dato);
            if (cabeza == null) {
                nuevo.siguiente = nuevo;   // un solo nodo: se apunta a si mismo
                nuevo.anterior = nuevo;
                cabeza = nuevo;
            } else {
                Nodo ultimo = cabeza.anterior;
                nuevo.siguiente = cabeza;
                nuevo.anterior = ultimo;
                ultimo.siguiente = nuevo;
                cabeza.anterior = nuevo;
            }
            tamano++;
        }

        /**
         * Elimina el nodo de la posicion indicada (base 1) ajustando de forma
         * BIDIRECCIONAL los punteros siguiente y anterior de los vecinos.
         *
         * @return true si elimino; false si hubo un aviso controlado.
         */
        boolean eliminarEnPosicionDoble(int posicion) {
            if (cabeza == null) {
                System.out.println("  [Aviso] La lista esta vacia: no hay nada que eliminar.");
                return false;
            }
            if (posicion < 1 || posicion > tamano) {
                System.out.println("  [Aviso] La posicion " + posicion
                        + " no existe (rango valido: 1 a " + tamano + ").");
                return false;
            }

            // Localizar el objetivo recorriendo hacia adelante desde la cabeza.
            // Gracias al puntero 'anterior' tambien se podria entrar por
            // cabeza.anterior y recorrer el lado mas corto (a lo sumo n/2 pasos).
            Nodo objetivo = cabeza;
            for (int i = 1; i < posicion; i++) {
                objetivo = objetivo.siguiente;
            }

            if (tamano == 1) {
                // Caso: unico nodo -> la lista queda vacia
                cabeza = null;
            } else {
                // Desvincular ajustando LOS DOS sentidos a la vez:
                // los vecinos quedan enlazados entre si y el circulo se cierra solo.
                objetivo.anterior.siguiente = objetivo.siguiente;
                objetivo.siguiente.anterior = objetivo.anterior;

                if (objetivo == cabeza) {
                    cabeza = objetivo.siguiente;   // era la cabeza: nueva cabeza
                }
            }
            objetivo.siguiente = null;   // ayuda al recolector de basura
            objetivo.anterior = null;
            tamano--;
            return true;
        }

        // Recorre hacia adelante y hacia atras: si ambas salidas son espejo,
        // los enlaces de la lista son consistentes.
        void mostrarLista() {
            if (cabeza == null) {
                System.out.println("  Lista vacia");
                return;
            }

            StringBuilder adelante = new StringBuilder("  Adelante: ");
            Nodo actual = cabeza;
            do {
                adelante.append(actual.dato).append(" <-> ");
                actual = actual.siguiente;
            } while (actual != cabeza);
            adelante.append("(cabeza ").append(cabeza.dato).append(")");

            StringBuilder atras = new StringBuilder("  Atras   : ");
            Nodo ultimo = cabeza.anterior;
            actual = ultimo;
            do {
                atras.append(actual.dato).append(" <-> ");
                actual = actual.anterior;
            } while (actual != ultimo);
            atras.append("(ultimo ").append(ultimo.dato).append(")");

            System.out.println(adelante + "   [tamano = " + tamano + "]");
            System.out.println(atras);
        }
    }

    // ===================== Pruebas =====================
    public static void main(String[] args) {
        ListaCircularDoble lista = new ListaCircularDoble();

        // Insercion de 10 nodos
        for (int i = 1; i <= 10; i++) {
            lista.insertarAlFinal(i * 100);    // valores 100, 200, ..., 1000
        }

        System.out.println("=== Lista doble inicial con 10 nodos ===");
        lista.mostrarLista();

        System.out.println();
        System.out.println("--- Caso 1: eliminar nodo INTERMEDIO (posicion 6) ---");
        System.out.println("Antes:");
        lista.mostrarLista();
        lista.eliminarEnPosicionDoble(6);
        System.out.println("Despues:");
        lista.mostrarLista();

        System.out.println();
        System.out.println("--- Caso 2: eliminar la CABEZA (posicion 1) ---");
        System.out.println("Antes:");
        lista.mostrarLista();
        lista.eliminarEnPosicionDoble(1);
        System.out.println("Despues:");
        lista.mostrarLista();

        System.out.println();
        System.out.println("--- Caso 3: eliminar la COLA (posicion 8, la ultima) ---");
        System.out.println("Antes:");
        lista.mostrarLista();
        lista.eliminarEnPosicionDoble(8);
        System.out.println("Despues:");
        lista.mostrarLista();

        System.out.println();
        System.out.println("--- Caso extra: posicion invalida (15) ---");
        lista.eliminarEnPosicionDoble(15);

        System.out.println();
        System.out.println("--- Caso extra: mantener el cierre con pocos elementos ---");
        ListaCircularDoble pequena = new ListaCircularDoble();
        pequena.insertarAlFinal(1);
        pequena.insertarAlFinal(2);
        pequena.mostrarLista();
        pequena.eliminarEnPosicionDoble(1);
        System.out.println("Tras eliminar la posicion 1 (queda 1 nodo):");
        pequena.mostrarLista();
        pequena.eliminarEnPosicionDoble(1);
        System.out.println("Tras eliminar la posicion 1 (lista vacia):");
        pequena.mostrarLista();
        pequena.eliminarEnPosicionDoble(1);
    }
}`

/** Salida real de 7_ListaCircularDoble.java */
export const SALIDA_DOBLE = `=== Lista doble inicial con 10 nodos ===
  Adelante: 100 <-> 200 <-> 300 <-> 400 <-> 500 <-> 600 <-> 700 <-> 800 <-> 900 <-> 1000 <-> (cabeza 100)   [tamano = 10]
  Atras   : 1000 <-> 900 <-> 800 <-> 700 <-> 600 <-> 500 <-> 400 <-> 300 <-> 200 <-> 100 <-> (ultimo 1000)

--- Caso 1: eliminar nodo INTERMEDIO (posicion 6) ---
Antes:
  Adelante: 100 <-> 200 <-> 300 <-> 400 <-> 500 <-> 600 <-> 700 <-> 800 <-> 900 <-> 1000 <-> (cabeza 100)   [tamano = 10]
  Atras   : 1000 <-> 900 <-> 800 <-> 700 <-> 600 <-> 500 <-> 400 <-> 300 <-> 200 <-> 100 <-> (ultimo 1000)
Despues:
  Adelante: 100 <-> 200 <-> 300 <-> 400 <-> 500 <-> 700 <-> 800 <-> 900 <-> 1000 <-> (cabeza 100)   [tamano = 9]
  Atras   : 1000 <-> 900 <-> 800 <-> 700 <-> 500 <-> 400 <-> 300 <-> 200 <-> 100 <-> (ultimo 1000)

--- Caso 2: eliminar la CABEZA (posicion 1) ---
Antes:
  Adelante: 100 <-> 200 <-> 300 <-> 400 <-> 500 <-> 700 <-> 800 <-> 900 <-> 1000 <-> (cabeza 100)   [tamano = 9]
  Atras   : 1000 <-> 900 <-> 800 <-> 700 <-> 500 <-> 400 <-> 300 <-> 200 <-> 100 <-> (ultimo 1000)
Despues:
  Adelante: 200 <-> 300 <-> 400 <-> 500 <-> 700 <-> 800 <-> 900 <-> 1000 <-> (cabeza 200)   [tamano = 8]
  Atras   : 1000 <-> 900 <-> 800 <-> 700 <-> 500 <-> 400 <-> 300 <-> 200 <-> (ultimo 1000)

--- Caso 3: eliminar la COLA (posicion 8, la ultima) ---
Antes:
  Adelante: 200 <-> 300 <-> 400 <-> 500 <-> 700 <-> 800 <-> 900 <-> 1000 <-> (cabeza 200)   [tamano = 8]
  Atras   : 1000 <-> 900 <-> 800 <-> 700 <-> 500 <-> 400 <-> 300 <-> 200 <-> (ultimo 1000)
Despues:
  Adelante: 200 <-> 300 <-> 400 <-> 500 <-> 700 <-> 800 <-> 900 <-> (cabeza 200)   [tamano = 7]
  Atras   : 900 <-> 800 <-> 700 <-> 500 <-> 400 <-> 300 <-> 200 <-> (ultimo 900)

--- Caso extra: posicion invalida (15) ---
  [Aviso] La posicion 15 no existe (rango valido: 1 a 7).

--- Caso extra: mantener el cierre con pocos elementos ---
  Adelante: 1 <-> 2 <-> (cabeza 1)   [tamano = 2]
  Atras   : 2 <-> 1 <-> (ultimo 2)
Tras eliminar la posicion 1 (queda 1 nodo):
  Adelante: 2 <-> (cabeza 2)   [tamano = 1]
  Atras   : 2 <-> (ultimo 2)
Tras eliminar la posicion 1 (lista vacia):
  Lista vacia
  [Aviso] La lista esta vacia: no hay nada que eliminar.`

/** Código de 8_ActualizarNodo.java */
export const CODIGO_ACTUALIZAR = `/**
 * PARCIAL 3 - Ejercicio 5
 * Actualizacion de datos en un nodo (lista circular doblemente enlazada).
 *
 * Se usa la estructura del ejercicio 4 para demostrar lo analizado en el
 * ejercicio 2: el RECORRIDO hasta el nodo depende de la estructura, pero la
 * asignacion nodo.dato = nuevoDato es identica en cualquier lista.
 *
 * Incluye ambos metodos pedidos:
 *   - actualizarValorEnPosicion(int posicion, int nuevoDato)
 *   - actualizarPorDato(int datoAntiguo, int datoNuevo)
 *
 * Copia TODO este archivo en CodeChef (lenguaje: Java) y pulsa Run.
 */
public class Main {

    // ===================== Lista circular doble con actualizacion =====================
    static class ListaCircularDoble {

        // ---------- Estructura del nodo ----------
        static class Nodo {
            int dato;
            Nodo siguiente;
            Nodo anterior;

            Nodo(int dato) {
                this.dato = dato;
            }
        }

        private Nodo cabeza;   // el ultimo nodo siempre es cabeza.anterior
        private int tamano;

        void insertarAlFinal(int dato) {
            Nodo nuevo = new Nodo(dato);
            if (cabeza == null) {
                nuevo.siguiente = nuevo;
                nuevo.anterior = nuevo;
                cabeza = nuevo;
            } else {
                Nodo ultimo = cabeza.anterior;
                nuevo.siguiente = cabeza;
                nuevo.anterior = ultimo;
                ultimo.siguiente = nuevo;
                cabeza.anterior = nuevo;
            }
            tamano++;
        }

        /**
         * FASE 1 (depende de los enlaces): recorrer hasta la posicion pedida.
         * FASE 2 (independiente de los punteros): asignar el nuevo dato.
         *
         * @return true si actualizo; false si hubo un aviso controlado
         *         (nunca lanza NullPointerException).
         */
        boolean actualizarValorEnPosicion(int posicion, int nuevoDato) {
            if (cabeza == null) {
                System.out.println("  [Aviso] La lista esta vacia: no hay nada que actualizar.");
                return false;
            }
            if (posicion < 1 || posicion > tamano) {
                System.out.println("  [Aviso] La posicion " + posicion
                        + " no existe (rango valido: 1 a " + tamano + ").");
                return false;
            }

            Nodo objetivo = cabeza;                  // FASE 1: recorrido por la estructura
            for (int i = 1; i < posicion; i++) {
                objetivo = objetivo.siguiente;
            }

            int valorAnterior = objetivo.dato;
            objetivo.dato = nuevoDato;               // FASE 2: no toca siguiente ni anterior
            System.out.println("  [OK] Posicion " + posicion + ": "
                    + valorAnterior + " -> " + nuevoDato);
            return true;
        }

        /**
         * Recorre UNA sola vuelta (condicion de parada: volver a la cabeza) y
         * actualiza la primera coincidencia del dato antiguo.
         */
        boolean actualizarPorDato(int datoAntiguo, int datoNuevo) {
            if (cabeza == null) {
                System.out.println("  [Aviso] La lista esta vacia: no hay nada que actualizar.");
                return false;
            }

            Nodo actual = cabeza;
            do {
                if (actual.dato == datoAntiguo) {
                    int valorAnterior = actual.dato;
                    actual.dato = datoNuevo;         // misma asignacion que por posicion
                    System.out.println("  [OK] Dato " + valorAnterior + " -> " + datoNuevo);
                    return true;
                }
                actual = actual.siguiente;
            } while (actual != cabeza);

            System.out.println("  [Aviso] El dato " + datoAntiguo + " no existe en la lista.");
            return false;
        }

        void mostrarLista() {
            if (cabeza == null) {
                System.out.println("  Lista vacia");
                return;
            }

            StringBuilder adelante = new StringBuilder("  Adelante: ");
            Nodo actual = cabeza;
            do {
                adelante.append(actual.dato).append(" <-> ");
                actual = actual.siguiente;
            } while (actual != cabeza);
            adelante.append("(cabeza ").append(cabeza.dato).append(")");

            StringBuilder atras = new StringBuilder("  Atras   : ");
            Nodo ultimo = cabeza.anterior;
            actual = ultimo;
            do {
                atras.append(actual.dato).append(" <-> ");
                actual = actual.anterior;
            } while (actual != ultimo);
            atras.append("(ultimo ").append(ultimo.dato).append(")");

            System.out.println(adelante + "   [tamano = " + tamano + "]");
            System.out.println(atras);
        }
    }

    // ===================== Pruebas =====================
    public static void main(String[] args) {
        ListaCircularDoble lista = new ListaCircularDoble();

        // Lista con 6 nodos: 20, 40, 60, 80, 100, 120
        for (int i = 1; i <= 6; i++) {
            lista.insertarAlFinal(i * 20);
        }

        System.out.println("=== Estado inicial (6 nodos) ===");
        lista.mostrarLista();

        System.out.println();
        System.out.println("--- Actualizar por POSICION (posicion 3 -> 777) ---");
        System.out.println("Antes:");
        lista.mostrarLista();
        lista.actualizarValorEnPosicion(3, 777);
        System.out.println("Despues:");
        lista.mostrarLista();

        System.out.println();
        System.out.println("--- Actualizar por DATO (100 -> 999) ---");
        System.out.println("Antes:");
        lista.mostrarLista();
        lista.actualizarPorDato(100, 999);
        System.out.println("Despues:");
        lista.mostrarLista();

        System.out.println();
        System.out.println("--- Casos controlados (sin excepciones) ---");
        lista.actualizarValorEnPosicion(15, 1);   // posicion inexistente
        lista.actualizarPorDato(1234, 1);         // dato inexistente

        System.out.println();
        System.out.println("--- Lista vacia ---");
        ListaCircularDoble vacia = new ListaCircularDoble();
        vacia.actualizarValorEnPosicion(1, 5);
        vacia.actualizarPorDato(10, 20);
    }
}`

/** Salida real de 8_ActualizarNodo.java */
export const SALIDA_ACTUALIZAR = `=== Estado inicial (6 nodos) ===
  Adelante: 20 <-> 40 <-> 60 <-> 80 <-> 100 <-> 120 <-> (cabeza 20)   [tamano = 6]
  Atras   : 120 <-> 100 <-> 80 <-> 60 <-> 40 <-> 20 <-> (ultimo 120)

--- Actualizar por POSICION (posicion 3 -> 777) ---
Antes:
  Adelante: 20 <-> 40 <-> 60 <-> 80 <-> 100 <-> 120 <-> (cabeza 20)   [tamano = 6]
  Atras   : 120 <-> 100 <-> 80 <-> 60 <-> 40 <-> 20 <-> (ultimo 120)
  [OK] Posicion 3: 60 -> 777
Despues:
  Adelante: 20 <-> 40 <-> 777 <-> 80 <-> 100 <-> 120 <-> (cabeza 20)   [tamano = 6]
  Atras   : 120 <-> 100 <-> 80 <-> 777 <-> 40 <-> 20 <-> (ultimo 120)

--- Actualizar por DATO (100 -> 999) ---
Antes:
  Adelante: 20 <-> 40 <-> 777 <-> 80 <-> 100 <-> 120 <-> (cabeza 20)   [tamano = 6]
  Atras   : 120 <-> 100 <-> 80 <-> 777 <-> 40 <-> 20 <-> (ultimo 120)
  [OK] Dato 100 -> 999
Despues:
  Adelante: 20 <-> 40 <-> 777 <-> 80 <-> 999 <-> 120 <-> (cabeza 20)   [tamano = 6]
  Atras   : 120 <-> 999 <-> 80 <-> 777 <-> 40 <-> 20 <-> (ultimo 120)

--- Casos controlados (sin excepciones) ---
  [Aviso] La posicion 15 no existe (rango valido: 1 a 6).
  [Aviso] El dato 1234 no existe en la lista.

--- Lista vacia ---
  [Aviso] La lista esta vacia: no hay nada que actualizar.
  [Aviso] La lista esta vacia: no hay nada que actualizar.`

