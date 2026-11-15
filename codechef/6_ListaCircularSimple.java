/**
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
}
