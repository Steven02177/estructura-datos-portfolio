import java.util.HashSet;
import java.util.Objects;

class RegistroCorreo {
    private String correo;
    private String nombre;

    public RegistroCorreo(String correo, String nombre) {
        this.correo = correo.trim().toLowerCase();
        this.nombre = nombre;
    }

    public String getCorreo() { return correo; }
    public String getNombre() { return nombre; }

    // Dos registros se consideran iguales si tienen el mismo correo.
    @Override
    public boolean equals(Object objeto) {
        if (this == objeto) return true;
        if (objeto == null || getClass() != objeto.getClass()) return false;
        RegistroCorreo otro = (RegistroCorreo) objeto;
        return Objects.equals(correo, otro.correo);
    }

    @Override
    public int hashCode() {
        return Objects.hash(correo);
    }

    @Override
    public String toString() {
        return nombre + " <" + correo + ">";
    }
}

public class MainHashSet {
    public static void main(String[] args) {
        HashSet<RegistroCorreo> asistentes = new HashSet<>();

        System.out.println("===== REGISTRO DE CORREOS PARA UN EVENTO =====");
        System.out.println("\n--- REGISTRO DE ASISTENTES ---");

        asistentes.add(new RegistroCorreo("laura@gmail.com", "Laura Gómez"));
        asistentes.add(new RegistroCorreo("andres@gmail.com", "Andrés Pérez"));
        asistentes.add(new RegistroCorreo("camila@gmail.com", "Camila Rojas"));
        asistentes.add(new RegistroCorreo("daniel@gmail.com", "Daniel Torres"));
        asistentes.add(new RegistroCorreo("sofia@gmail.com", "Sofía Martínez"));

        for (RegistroCorreo asistente : asistentes) {
            System.out.println(asistente);
        }

        // 1. Intentar registrar un correo que ya existe.
        System.out.println("\n--- INTENTOS DE REGISTRO DUPLICADO ---");
        boolean duplicado1 = asistentes.add(
                new RegistroCorreo("LAURA@gmail.com", "Laura Gómez (nuevo intento)"));
        System.out.println("¿Se agregó LAURA@gmail.com?: " + duplicado1);

        boolean duplicado2 = asistentes.add(
                new RegistroCorreo("camila@gmail.com", "Camila Rojas (nuevo intento)"));
        System.out.println("¿Se agregó camila@gmail.com?: " + duplicado2);

        // 2. Mostrar el total real de registros únicos.
        System.out.println("\nTotal de correos únicos registrados: " + asistentes.size());
    }
}
