import java.util.*;

/**
 * TALLER GRAFOS - Ejercicio 3.1
 * Red Social de Amistades con recorrido en profundidad (DFS).
 *
 * Requerimientos del taller:
 *  - Base la clase GrafoDFS (lista de adyacencia, grafo NO dirigido).
 *  - recorrerDFS(String inicio) con una Pila (Stack) + Set<String> visitados.
 *  - Red de al menos 7 vertices y 8 aristas ( aqui: 7 vertices, 9 aristas ).
 *  - Muestra la estructura del grafo y la secuencia exacta de nodos visitados.
 *
 * Copia TODO este archivo en CodeChef (lenguaje: Java) y pulsa Run.
 */
public class Main {

    // ===================== Grafo no dirigido =====================
    static class GrafoDFS {

        // Cada vertice guarda la lista de sus adyacentes (HashMap<String, List<String>>)
        private HashMap<String, List<String>> listaAdyacencia = new HashMap<>();

        void agregarVertice(String vertice) {
            listaAdyacencia.putIfAbsent(vertice, new ArrayList<>());
        }

        // En un grafo NO dirigido la arista va en ambos sentidos.
        void agregarArista(String a, String b) {
            agregarVertice(a);
            agregarVertice(b);
            listaAdyacencia.get(a).add(b);
            listaAdyacencia.get(b).add(a);
        }

        void imprimirGrafo() {
            System.out.println("--- ESTRUCTURA DE LA RED (LISTA DE ADYACENCIA) ---");
            for (String vertice : listaAdyacencia.keySet()) {
                System.out.println("Nodo " + vertice + " -> Conectado con: " + listaAdyacencia.get(vertice));
            }
        }

        /**
         * Recorrido en profundidad (DFS) usando una Pila (Stack) y un
         * conjunto de visitados (HashSet) para no repetir nodos ni entrar en ciclos.
         */
        List<String> recorrerDFS(String inicio) {
            Stack<String> pila = new Stack<>();
            HashSet<String> visitados = new HashSet<>();
            List<String> recorrido = new ArrayList<>();

            pila.push(inicio);
            System.out.println("\n--- RECORRIDO EN PROFUNDIDAD (DFS) desde [" + inicio + "] ---");

            while (!pila.isEmpty()) {
                String actual = pila.pop();

                // El mismo nodo pudo apilarse mas de una vez: se ignora si ya se visito.
                if (visitados.contains(actual)) continue;

                visitados.add(actual);
                recorrido.add(actual);
                System.out.println("Visitando: " + actual
                        + "   | Pila: " + pila
                        + "   | Visitados: " + visitados);

                // Se empujan los vecinos en orden inverso para que el primero
                // de la lista de adyacencia sea el proximo en salir de la pila.
                List<String> vecinos = listaAdyacencia.getOrDefault(actual, new ArrayList<>());
                for (int i = vecinos.size() - 1; i >= 0; i--) {
                    String vecino = vecinos.get(i);
                    if (!visitados.contains(vecino)) {
                        pila.push(vecino);
                    }
                }
            }
            return recorrido;
        }
    }

    public static void main(String[] args) {
        GrafoDFS red = new GrafoDFS();

        // 1. Red social de amistades: 7 personas y 9 relaciones.
        red.agregarArista("Ana", "Bruno");
        red.agregarArista("Ana", "Carla");
        red.agregarArista("Bruno", "Diego");
        red.agregarArista("Carla", "Diego");
        red.agregarArista("Carla", "Elena");
        red.agregarArista("Diego", "Fabián");
        red.agregarArista("Elena", "Fabián");
        red.agregarArista("Fabián", "Gabriela");
        red.agregarArista("Bruno", "Elena");

        // 2. Estructura completa del grafo.
        red.imprimirGrafo();

        // 3. Secuencia exacta del recorrido DFS desde Ana.
        List<String> recorrido = red.recorrerDFS("Ana");

        System.out.println("\nSecuencia DFS desde [Ana]: " + recorrido);
        System.out.println("Total de vertices visitados: " + recorrido.size());
        System.out.println("______________________________________________________");
        System.out.println("| Vertices: 7 | Aristas: 9 | Recorrido completo: "
                + (recorrido.size() == 7 ? "Si" : "No") + " |");
    }
}
