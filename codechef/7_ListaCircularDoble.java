/**
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
}
