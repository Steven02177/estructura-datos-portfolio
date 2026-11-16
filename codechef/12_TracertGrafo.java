import java.util.*;

/**
 * TALLER GRAFOS - Traza de red (CMD: tracert www.google.com)
 * Construye un GRAFO DIRIGIDO a partir de la traza real ejecutada en Windows
 * y muestra la lista de adyacencia y el camino resultante hasta Google.
 *
 * Copia TODO este archivo en CodeChef (lenguaje: Java) y pulsa Run.
 */
public class Main {

    // ===================== Grafo dirigido de la traza =====================
    static class TracertGrafo {

        // LinkedHashMap conserva el orden en que aparecen los saltos en la traza.
        private LinkedHashMap<String, List<String>> saltos = new LinkedHashMap<>();

        void agregarSalto(String desde, String hacia) {
            saltos.putIfAbsent(desde, new ArrayList<>());
            saltos.putIfAbsent(hacia, new ArrayList<>());
            saltos.get(desde).add(hacia); // dirigido: solo desde -> hacia
        }

        void imprimirGrafo() {
            System.out.println("--- TRAZA COMO GRAFO DIRIGIDO (LISTA DE ADYACENCIA) ---");
            for (String nodo : saltos.keySet()) {
                List<String> destinos = saltos.get(nodo);
                if (destinos.isEmpty()) {
                    System.out.println("Nodo " + nodo + " -> (destino final de la traza)");
                } else {
                    System.out.println("Nodo " + nodo + " -> " + destinos);
                }
            }
        }
    }

    public static void main(String[] args) {
        TracertGrafo ruta = new TracertGrafo();

        // Salida real de: tracert -d -h 12 -w 800 www.google.com
        // (una linea por salto; el salto 3 no respondio: se registra como "*").
        ruta.agregarSalto("Mi equipo", "192.168.1.1");
        ruta.agregarSalto("192.168.1.1", "190.96.224.1");
        ruta.agregarSalto("190.96.224.1", "3: * (tiempo de espera)");
        ruta.agregarSalto("3: * (tiempo de espera)", "72.14.213.234");
        ruta.agregarSalto("72.14.213.234", "142.251.154.119");
        ruta.agregarSalto("142.251.154.119", "www.google.com");

        // 1. Representacion completa de la traza como grafo dirigido.
        ruta.imprimirGrafo();

        // 2. Camino seguido desde el equipo hasta Google.
        System.out.println("\n--- CAMINO RESULTANTE ---");
        System.out.println("Mi equipo -> 192.168.1.1 -> 190.96.224.1 -> 3: * (tiempo de espera)"
                + " -> 72.14.213.234 -> 142.251.154.119 -> www.google.com");

        System.out.println("______________________________________________________");
        System.out.println("| Saltos de la traza: 5 | Vertices del grafo: 7 | Aristas dirigidas: 6 |");
    }
}
