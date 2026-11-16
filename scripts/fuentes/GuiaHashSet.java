import java.util.*;
import java.lang.*;
import java.io.*;

// Clase auxiliar para representar un estudiante
class Estudiante {
    String codigo;
    String nombre;

    public Estudiante(String codigo, String nombre) {
        this.codigo = codigo;
        this.nombre = nombre;
    }

    // Sobrescribimos equals y hashCode para comparar objetos correctamente dentro del HashSet
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Estudiante que = (Estudiante) o;
        return Objects.equals(codigo, que.codigo);
    }

    @Override
    public int hashCode() {
        return Objects.hash(codigo);
    }

    @Override
    public String toString() {
        return "[" + codigo + "] " + nombre;
    }
}

class MainHashSet {
    public static void main(String[] args) {
        // 1. Definición e inicialización del HashSet
        java.util.HashSet<Estudiante> listaAsistencia = new java.util.HashSet<>();

        // 2. Creación e inserción de objetos directamente en el HashSet
        listaAsistencia.add(new Estudiante("EST001", "Carlos Pérez"));
        listaAsistencia.add(new Estudiante("EST002", "María Rodríguez"));
        listaAsistencia.add(new Estudiante("EST003", "Juan Gómez"));
        listaAsistencia.add(new Estudiante("EST004", "Ana Martínez"));
        listaAsistencia.add(new Estudiante("EST005", "Luis Hernández"));
        listaAsistencia.add(new Estudiante("EST006", "Sofía López"));
        listaAsistencia.add(new Estudiante("EST007", "Diego Torres"));
        listaAsistencia.add(new Estudiante("EST008", "Laura Ramírez"));
        listaAsistencia.add(new Estudiante("EST009", "Andrés Sánchez"));
        listaAsistencia.add(new Estudiante("EST010", "Paula Díaz"));
        listaAsistencia.add(new Estudiante("EST011", "Javier Castro"));
        listaAsistencia.add(new Estudiante("EST012", "Elena Morales"));
        listaAsistencia.add(new Estudiante("EST013", "Gabriel Vargas"));
        listaAsistencia.add(new Estudiante("EST014", "Valeria Ortíz"));
        listaAsistencia.add(new Estudiante("EST015", "Mateo Silva"));
        listaAsistencia.add(new Estudiante("EST016", "Camila Mendoza"));
        listaAsistencia.add(new Estudiante("EST017", "Daniel Ruiz"));
        listaAsistencia.add(new Estudiante("EST018", "Isabella Romero"));
        listaAsistencia.add(new Estudiante("EST019", "Alejandro Navarro"));
        listaAsistencia.add(new Estudiante("EST020", "Lucía Gutiérrez"));

        // 3. Demostración de búsqueda en O(1) usando contains()
        Estudiante estudianteBuscar = new Estudiante("EST005", "Luis Hernández");
        
        System.out.println("--- BÚSQUEDA EN EL HASHSET ---");
        if (listaAsistencia.contains(estudianteBuscar)) {
            System.out.println("El estudiante existe en la lista: \n" + estudianteBuscar);
        } else {
            System.out.println("El estudiante no se encuentra registrado.");
        }

        // 4. Intentar insertar un elemento duplicado
        System.out.println("\n--- INTENTO DE INSERCIÓN DE DUPLICADO ---");
        boolean insertado = listaAsistencia.add(new Estudiante("EST005", "Luis Hernández (Duplicado)"));
        System.out.println("¿Se pudo insertar el código repetido [EST005]?: " + insertado);
        
        System.out.print("______________________________________________________");
        System.out.println("\n| Cantidad total de estudiantes únicos registrados: " + listaAsistencia.size() + " |");
    }
}
