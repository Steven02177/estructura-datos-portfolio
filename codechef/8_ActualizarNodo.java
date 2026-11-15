/**
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
}
