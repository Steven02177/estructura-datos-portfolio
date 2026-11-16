import java.util.*;

/**
 * TALLER GRAFOS - Ejercicio 3.2
 * Grafo Dirigido con verificacion de conexion directa.
 * Contexto: Red de Transacciones de Dinero (transferencias entre cuentas).
 *
 * Requerimientos del taller:
 *  - Clase GrafoDirigido: agregarArista(origen, destino) agrega SOLO la
 *    direccion origen -> destino (no bidireccional).
 *  - boolean existeCaminoDirecto(origen, destino) en O(vecinos).
 *  - Al menos 6 cuentas y 2 consultas (una con camino y una sin camino).
 *
 * Copia TODO este archivo en CodeChef (lenguaje: Java) y pulsa Run.
 */
public class Main {

    // ===================== Grafo dirigido =====================
    static class GrafoDirigido {

        private HashMap<String, List<String>> listaAdyacencia = new HashMap<>();

        void agregarVertice(String vertice) {
            listaAdyacencia.putIfAbsent(vertice, new ArrayList<>());
        }

        // Solo se registra la salida origen -> destino. La inversa NO existe.
        void agregarArista(String origen, String destino) {
            agregarVertice(origen);
            agregarVertice(destino);
            listaAdyacencia.get(origen).add(destino);
        }

        /**
         * Determina si existe una conexion saliente DIRECTA desde origen hacia destino.
         * Complejidad O(vecinos): solo se recorre la lista de salida del origen
         * (con un HashSet de vecinos seria O(1) promedio).
         */
        boolean existeCaminoDirecto(String origen, String destino) {
            List<String> vecinos = listaAdyacencia.get(origen);
            if (vecinos == null) {
                return false; // la cuenta origen no tiene transferencias registradas
            }
            return vecinos.contains(destino);
        }

        void imprimirGrafo() {
            System.out.println("--- TRANSFERENCIAS REGISTRADAS (LISTA DE ADYACENCIA DIRIGIDA) ---");
            for (String cuenta : listaAdyacencia.keySet()) {
                System.out.println("Cuenta " + cuenta + " transfiere a: " + listaAdyacencia.get(cuenta));
            }
        }
    }

    public static void main(String[] args) {
        GrafoDirigido red = new GrafoDirigido();

        // 1. Seis cuentas con transferencias de dinero (aristas dirigidas).
        red.agregarArista("Laura", "Andrés");
        red.agregarArista("Laura", "Camila");
        red.agregarArista("Andrés", "Daniel");
        red.agregarArista("Camila", "Sofía");
        red.agregarArista("Daniel", "Miguel");
        red.agregarArista("Sofía", "Miguel");
        red.agregarArista("Miguel", "Laura");

        // 2. Estructura completa del grafo dirigido.
        red.imprimirGrafo();

        // 3. Consulta 1: si existe transferencia directa Laura -> Andrés.
        System.out.println("\n--- CONSULTAS DE TRANSFERENCIA DIRECTA ---");
        boolean consulta1 = red.existeCaminoDirecto("Laura", "Andrés");
        System.out.println("¿Existe transferencia directa Laura -> Andrés?: " + consulta1);

        // 4. Consulta 2: NO existe transferencia directa Sofía -> Laura
        //    (Sofía solo transfiere a Miguel, aunque Miguel sí le transfiera a Laura).
        boolean consulta2 = red.existeCaminoDirecto("Sofía", "Laura");
        System.out.println("¿Existe transferencia directa Sofía -> Laura?: " + consulta2);

        System.out.println("______________________________________________________");
        System.out.println("| Cuentas: 6 | Transferencias dirigidas: 7 |");
        System.out.println("| Camino directo Laura->Andrés: " + consulta1
                + " | Camino directo Sofía->Laura: " + consulta2 + " |");
    }
}
