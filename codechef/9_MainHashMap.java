import java.util.HashMap;
import java.util.Map;

class Estudiante {
    private String matricula;
    private String nombre;
    private double nota;

    public Estudiante(String matricula, String nombre, double nota) {
        this.matricula = matricula;
        this.nombre = nombre;
        this.nota = nota;
    }

    public String getMatricula() { return matricula; }
    public String getNombre() { return nombre; }
    public double getNota() { return nota; }

    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setNota(double nota) { this.nota = nota; }

    @Override
    public String toString() {
        return "Matrícula: " + matricula +
               " | Nombre: " + nombre +
               " | Nota: " + String.format("%.1f", nota);
    }
}

public class MainHashMap {
    public static void main(String[] args) {
        // La matrícula funciona como llave única y el estudiante como valor.
        HashMap<String, Estudiante> calificaciones = new HashMap<>();

        // 1. Insertar cinco registros.
        calificaciones.put("UDES001", new Estudiante("UDES001", "Laura Gómez", 4.5));
        calificaciones.put("UDES002", new Estudiante("UDES002", "Andrés Pérez", 3.8));
        calificaciones.put("UDES003", new Estudiante("UDES003", "Camila Rojas", 4.2));
        calificaciones.put("UDES004", new Estudiante("UDES004", "Daniel Torres", 3.5));
        calificaciones.put("UDES005", new Estudiante("UDES005", "Sofía Martínez", 4.7));

        System.out.println("===== SISTEMA DE GESTIÓN DE CALIFICACIONES =====");
        System.out.println("\n--- REGISTROS INICIALES ---");
        for (Map.Entry<String, Estudiante> registro : calificaciones.entrySet()) {
            System.out.println(registro.getValue());
        }

        // 2. Consultar un registro por su llave.
        String matriculaBuscar = "UDES003";
        System.out.println("\n--- CONSULTA DE ESTUDIANTE ---");
        if (calificaciones.containsKey(matriculaBuscar)) {
            System.out.println("Registro encontrado: " + calificaciones.get(matriculaBuscar));
        } else {
            System.out.println("No existe un estudiante con esa matrícula.");
        }

        // 3. Actualizar el valor asociado a una llave existente.
        System.out.println("\n--- ACTUALIZACIÓN DE CALIFICACIÓN ---");
        calificaciones.put("UDES003",
                new Estudiante("UDES003", "Camila Rojas", 4.8));
        System.out.println("Registro actualizado: " + calificaciones.get("UDES003"));

        // 4. Mostrar el total de registros.
        System.out.println("\nTotal de estudiantes registrados: " + calificaciones.size());
    }
}
