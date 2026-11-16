import java.util.*;
import java.lang.*;
import java.io.*;

// Clase que representa un Grafo No Dirigido usando Lista de Adyacencia
class GrafoRed {
    private HashMap<String, List<String>> listaAdyacencia = new HashMap<>();

    // Método para agregar un vértice al grafo
    public void agregarVertice(String vertice) {
        listaAdyacencia.putIfAbsent(vertice, new ArrayList<>());
    }

    // Método para agregar una arista bidireccional entre dos vértices
    public void agregarArista(String origen, String destino) {
        agregarVertice(origen);
        agregarVertice(destino);
        listaAdyacencia.get(origen).add(destino);
        listaAdyacencia.get(destino).add(origen); // Al ser no dirigido
    }

    // Método para imprimir la estructura del grafo
    public void imprimirGrafo() {
        System.out.println("--- TOPOLOGÍA DE LA RED (LISTA DE ADYACENCIA) ---");
        for (String vertice : listaAdyacencia.keySet()) {
            System.out.println("Nodo " + vertice + " -> Conectado con: " + listaAdyacencia.get(vertice));
        }
    }

    // Recorrido en Anchura (BFS) para explorar nodos desde un origen
    public void recorrerBFS(String inicio) {
        // CORREGIDO: Se especificó el tipo <String> para evitar errores de conversión
        Set<String> visitados = new HashSet<>();
        Queue<String> cola = new LinkedList<>();

        visitados.add(inicio);
        cola.add(inicio);

        System.out.println("\n--- RECORRIDO EN ANCHURA (BFS) desde [" + inicio + "] ---");

        while (!cola.isEmpty()) {
            String actual = cola.poll(); // Ahora funciona correctamente porque la cola sabe que extrae un String
            System.out.print(actual + " ");

            for (String vecino : listaAdyacencia.getOrDefault(actual, new ArrayList<>())) {
                if (!visitados.contains(vecino)) {
                    visitados.add(vecino);
                    cola.add(vecino);
                }
            }
        }
        System.out.println();
    }
}

class MainGrafo {
    public static void main(String[] args) {
        GrafoRed redCampus = new GrafoRed();

        // 1. Creación y adición de conexiones de nodos
        redCampus.agregarArista("Rectoría", "Ingeniería");
        redCampus.agregarArista("Rectoría", "Biblioteca");
        redCampus.agregarArista("Ingeniería", "Laboratorios");
        redCampus.agregarArista("Biblioteca", "Auditorio");
        redCampus.agregarArista("Laboratorios", "Cafetería");
        redCampus.agregarArista("Auditorio", "Cafetería");

        // 2. Mostrar la representación completa del grafo
        redCampus.imprimirGrafo();

        // 3. Ejecutar recorrido BFS comenzando desde "Rectoría"
        redCampus.recorrerBFS("Rectoría");

        System.out.print("______________________________________________________");
        System.out.println("\n| Total de vértices (nodos) en la red: " + 6 + " |");
    }
}
