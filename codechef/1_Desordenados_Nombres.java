import java.util.*;

/**
 * 1. Desordenados - NOMBRES
 * Copia TODO este archivo en CodeChef (lenguaje: Java) y pulsa Run.
 * Ordena strings lexicograficamente (mismo criterio que el proyecto web).
 */
public class Main {

    static int comparaciones, intercambios, iteraciones;
    static void reset() { comparaciones = intercambios = iteraciones = 0; }
    static String[] copy(String[] a) { return Arrays.copyOf(a, a.length); }

    static int cmp(String x, String y) {
        comparaciones++;
        return x.compareTo(y);
    }

    static String[] burbuja(String[] src) {
        String[] a = copy(src); reset();
        int n = a.length;
        for (int i = 0; i < n - 1; i++) {
            iteraciones++;
            for (int j = 0; j < n - i - 1; j++) {
                if (cmp(a[j], a[j + 1]) > 0) {
                    String t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
                    intercambios++;
                }
            }
        }
        return a;
    }

    static String[] burbujaMejorado(String[] src) {
        String[] a = copy(src); reset();
        int n = a.length, i = 0;
        boolean hubo = true;
        while (hubo) {
            hubo = false; iteraciones++;
            for (int j = 0; j < n - i - 1; j++) {
                if (cmp(a[j], a[j + 1]) > 0) {
                    String t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
                    intercambios++; hubo = true;
                }
            }
            i++;
        }
        return a;
    }

    static String[] seleccion(String[] src) {
        String[] a = copy(src); reset();
        int n = a.length;
        for (int i = 0; i < n - 1; i++) {
            iteraciones++;
            int min = i;
            for (int j = i + 1; j < n; j++) {
                if (cmp(a[j], a[min]) < 0) min = j;
            }
            if (min != i) {
                String t = a[i]; a[i] = a[min]; a[min] = t;
                intercambios++;
            }
        }
        return a;
    }

    static String[] insercion(String[] src) {
        String[] a = copy(src); reset();
        for (int i = 1; i < a.length; i++) {
            iteraciones++;
            String key = a[i];
            int j = i - 1;
            while (j >= 0 && cmp(a[j], key) > 0) {
                a[j + 1] = a[j];
                intercambios++;
                j--;
            }
            a[j + 1] = key;
        }
        return a;
    }

    static String[] shaker(String[] src) {
        String[] a = copy(src); reset();
        int left = 0, right = a.length - 1;
        while (left < right) {
            iteraciones++;
            boolean swapped = false;
            for (int i = left; i < right; i++) {
                if (cmp(a[i], a[i + 1]) > 0) {
                    String t = a[i]; a[i] = a[i + 1]; a[i + 1] = t;
                    intercambios++; swapped = true;
                }
            }
            right--;
            if (!swapped) break;
            for (int i = right; i > left; i--) {
                if (cmp(a[i - 1], a[i]) > 0) {
                    String t = a[i - 1]; a[i - 1] = a[i]; a[i] = t;
                    intercambios++; swapped = true;
                }
            }
            left++;
        }
        return a;
    }

    static String[] shell(String[] src) {
        String[] a = copy(src); reset();
        int n = a.length;
        for (int gap = n / 2; gap > 0; gap /= 2) {
            iteraciones++;
            for (int i = gap; i < n; i++) {
                String temp = a[i];
                int j = i;
                while (j >= gap && cmp(a[j - gap], temp) > 0) {
                    a[j] = a[j - gap];
                    intercambios++;
                    j -= gap;
                }
                a[j] = temp;
            }
        }
        return a;
    }

    static String[] quick(String[] src) {
        String[] a = copy(src); reset();
        qs(a, 0, a.length - 1);
        return a;
    }
    static void qs(String[] a, int low, int high) {
        if (low >= high) return;
        iteraciones++;
        String pivot = a[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (cmp(a[j], pivot) < 0) {
                i++;
                String t = a[i]; a[i] = a[j]; a[j] = t;
                intercambios++;
            }
        }
        String t = a[i + 1]; a[i + 1] = a[high]; a[high] = t;
        intercambios++;
        qs(a, low, i);
        qs(a, i + 2, high);
    }

    static String[] mergeSort(String[] src) {
        String[] a = copy(src); reset();
        ms(a, 0, a.length - 1);
        return a;
    }
    static void ms(String[] a, int low, int high) {
        if (low >= high) return;
        iteraciones++;
        int mid = (low + high) / 2;
        ms(a, low, mid);
        ms(a, mid + 1, high);
        String[] L = Arrays.copyOfRange(a, low, mid + 1);
        String[] R = Arrays.copyOfRange(a, mid + 1, high + 1);
        int i = 0, j = 0, k = low;
        while (i < L.length && j < R.length) {
            comparaciones++;
            a[k++] = (L[i].compareTo(R[j]) <= 0) ? L[i++] : R[j++];
            intercambios++;
        }
        while (i < L.length) { a[k++] = L[i++]; intercambios++; }
        while (j < R.length) { a[k++] = R[j++]; intercambios++; }
    }

    static String[] heap(String[] src) {
        String[] a = copy(src); reset();
        int n = a.length;
        for (int i = n / 2 - 1; i >= 0; i--) { iteraciones++; heapify(a, n, i); }
        for (int i = n - 1; i > 0; i--) {
            iteraciones++;
            String t = a[0]; a[0] = a[i]; a[i] = t;
            intercambios++;
            heapify(a, i, 0);
        }
        return a;
    }
    static void heapify(String[] a, int size, int i) {
        int largest = i, l = 2 * i + 1, r = 2 * i + 2;
        if (l < size) { comparaciones++; if (a[l].compareTo(a[largest]) > 0) largest = l; }
        if (r < size) { comparaciones++; if (a[r].compareTo(a[largest]) > 0) largest = r; }
        if (largest != i) {
            String t = a[i]; a[i] = a[largest]; a[largest] = t;
            intercambios++;
            heapify(a, size, largest);
        }
    }

    static void fila(String nombre, String mem, boolean rec, String[] original,
                     java.util.function.Function<String[], String[]> fn) {
        long start = System.nanoTime();
        String[] r = fn.apply(original);
        long ms = (System.nanoTime() - start) / 1_000_000;
        System.out.printf("%-22s | %-8s | %6d ms | %8d | %12d | %10d | %s%n",
            nombre, mem, ms, iteraciones, comparaciones, intercambios, rec ? "Si" : "No");
        for (int i = 1; i < r.length; i++) {
            if (r[i].compareTo(r[i - 1]) < 0) {
                System.out.println("  ERROR: no quedo ordenado con " + nombre);
                return;
            }
        }
    }

    public static void main(String[] args) {
        String[] datos = {
        "Sebastián", "Valeria", "Mateo", "Isabella", "Leonardo", "Daniela", "Emilio", "Gabriela",
        "Nicolás", "Renata", "Benjamín", "Jimena", "Santiago", "Adriana", "Rodrigo", "Fernanda",
        "Maximiliano", "Carolina", "Tomás", "Mónica", "Felipe", "Alejandra", "Ignacio", "Mariana",
        "Esteban", "Silvia", "Ángel", "Teresa", "Hugo", "Rosa", "Ramón", "Pilar",
        "Arturo", "Gloria", "Gustavo", "Rocío", "Enrique", "Amparo", "Roberto", "Dolores",
        "Alfredo", "Mercedes", "Eduardo", "Inés", "Lorenzo", "Concepción", "Martín", "Estrella",
        "Armando", "Luz", "Julio", "Francisca", "Agustín", "Antonia", "Rafael", "Remedios",
        "César", "Encarnación", "Vicente", "Josefa", "Ernesto gustavo", "Blanca", "Jaime", "Ángeles",
        "Héctor", "Trinidad", "Mauricio", "Dolores", "Germán", "Rosario", "Salvador", "Consuelo",
        "Tomás", "Soledad", "Alonso", "Asunción", "Julián", "Milagros", "Bruno", "Esperanza",
        "Marcos", "Paz", "Damián", "Fe", "Emiliano", "Caridad", "Matías", "Purificación",
        "Fabián", "Nieves", "Orlando", "Angustias", "Patricio", "Socorro", "Ezequiel", "Virtudes",
        "Simón", "Visitación", "Baltasar", "Rosalía", "Leandro", "Araceli", "Octavio", "Nuria",
        "Luciano", "Montserrat", "Silvio", "Begoña", "Eugenio", "Inmaculada", "Claudio", "Guadalupe",
        "Horacio", "Piedad", "Valentín", "Amparo", "Lisandro", "Azucena", "Celso", "Jacinta",
        "Dante", "Lorena", "Gaspar", "Miriam", "Urbano", "Rebeca", "Feliciano", "Raquel",
        "Zacarías", "Judith", "Bautista", "Lidia", "Dámaso", "Noemi", "Elías", "Débora",
        "Isaías", "Esther", "Jonás", "Ruth", "Melchor", "Abigail", "Salomón", "Raquel",
        "Tobías", "Susana", "Abdón", "Leticia", "Acisclo", "Gema", "Abelardo", "Elisa",
        "Adán", "Diana", "Adolfo", "Alicia", "Albino", "Cecilia", "Alcides", "Silvia",
        "Amadeo", "Olga", "Ambrosio", "Irene", "Amílcar", "Paloma", "Anastasio", "Celia",
        "Anselmo", "Sonia", "Apolinar", "Yolanda", "Aquiles", "Elvira", "Arcadio", "Angélica",
        "Ariel", "Bárbara", "Aristóteles", "Catalina", "Arnaldo", "Clotilde", "Arsenio", "Magdalena",
        "Atanasio", "Aurelia", "Augusto", "Hortensia", "Aureliano", "Flora", "Bartolomé", "Delia",
        "Basilio", "Eugenia", "Belisario", "Fabiola", "Benedicto", "Felisa", "Bernabé", "Filomena",
        "Blas", "Herminia", "Bonifacio", "Josefina", "Calixto", "Leocadia", "Casimiro", "Leonor",
        "Cayetano", "Luisa", "Celestino", "Matilde", "Cipriano", "Micaela", "Cirilo", "Petra",
        "Clemente", "Ramona", "Constantino", "Regina", "Cornelio", "Salomé", "Cosme", "Saturnina",
        "Crisanto", "Severina", "Crisóstomo", "Teófila", "Cristóbal", "Tomasa"
        };

        System.out.println("========================================");
        System.out.println("1. Desordenados - NOMBRES");
        System.out.println("n = " + datos.length);
        System.out.println("========================================");
        System.out.printf("%-22s | %-8s | %8s | %8s | %12s | %10s | %s%n",
            "Estructura", "Memoria", "Tiempo", "Iters", "Comparaciones", "Intercambios", "Recursiva");
        System.out.println("------------------------------------------------------------------------------------------------");

        fila("Burbuja Simple", "O(1)", false, datos, Main::burbuja);
        fila("Burbuja Mejorado", "O(1)", false, datos, Main::burbujaMejorado);
        fila("Seleccion Directa", "O(1)", false, datos, Main::seleccion);
        fila("Insercion Simple", "O(1)", false, datos, Main::insercion);
        fila("Shaker", "O(1)", false, datos, Main::shaker);
        fila("Shell Sort", "O(1)", false, datos, Main::shell);
        fila("Quick Sort", "O(log n)", true, datos, Main::quick);
        fila("Merge Sort", "O(n)", true, datos, Main::mergeSort);
        fila("Metodo de Monticulo", "O(1)", false, datos, Main::heap);

        String[] ordenado = mergeSort(datos);
        System.out.println();
        System.out.println("Arreglo ordenado (primeros 10):");
        System.out.print("[");
        for (int i = 0; i < Math.min(10, ordenado.length); i++) {
            if (i > 0) System.out.print(", ");
            System.out.print(ordenado[i]);
        }
        if (ordenado.length > 10) System.out.print(", ...");
        System.out.println("]");
        System.out.println("Ultimos 5: " + Arrays.toString(Arrays.copyOfRange(ordenado, Math.max(0, ordenado.length - 5), ordenado.length)));
        System.out.println("Total elementos: " + ordenado.length);
    }
}
