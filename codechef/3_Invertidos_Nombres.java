import java.util.*;

/**
 * 3. Invertidos - NOMBRES
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
        "Zoraida", "Zulema", "Zacarías", "Yolanda", "Yolanda", "Ximena", "Wanda", "Violeta",
        "Violeta", "Virginia", "Viviana", "Víctor", "Víctor", "Victoria", "Victoria", "Vicente",
        "Verónica", "Verónica", "Valentina", "Valentina", "Úrsula", "Tomás", "Tomás", "Teresa",
        "Teresa", "Tamara", "Susana", "Susana", "Soledad", "Sofía", "Sofía", "Sofía",
        "Silvia", "Silvia", "Simón", "Silvio", "Severina", "Sergio", "Sergio", "Sergio",
        "Sebastián", "Sebastián", "Sara", "Sara", "Sara", "Sara", "Sandra", "Sandra",
        "Santiago", "Samuel", "Samuel", "Salomón", "Salvador", "Saturnina", "Rubén", "Rubén",
        "Rubén", "Rosario", "Rosario", "Rosa", "Rosalía", "Rodrigo", "Rodrigo", "Rocío",
        "Rocío", "Roberto", "Ricardo", "Ricardo", "Renata", "Regina", "Rebeca", "Raúl",
        "Raúl", "Raúl", "Raquel", "Raquel", "Ramona", "Ramón", "Rafael", "Rafael",
        "Purificación", "Pilar", "Pilar", "Pilar", "Petra", "Pedro", "Pedro", "Pedro",
        "Paz", "Paula", "Paula", "Paula", "Paula", "Patricio", "Patricia", "Patricia",
        "Pablo", "Pablo", "Pablo", "Óscar", "Orlando", "Olga", "Olga", "Octavio",
        "Noelia", "Noelia", "Noelia", "Nieves", "Nicolás", "Nicolás", "Nuria", "Nuria",
        "Natalia", "Natalia", "Natalia", "Natalia", "Mónica", "Mónica", "Montserrat", "Milagros",
        "Miguel", "Miguel", "Miguel", "Micaela", "Mercedes", "Maximiliano", "Maximiliano", "Mauricio",
        "Matilde", "Matías", "Matías", "Mateo", "Mateo", "Marta", "Marta", "Marta",
        "Marta", "Martina", "Martina", "Martina", "Martina", "Martín", "Mariana", "Mariana",
        "Marina", "Marina", "Mario", "Mario", "María", "María", "María", "María",
        "María", "Marcos", "Marcos", "Manuel", "Manuel", "Magdalena", "Luciano", "Lucía",
        "Lucía", "Lucía", "Lucía", "Lucas", "Luis", "Luis", "Luis", "Luis",
        "Luisa", "Luz", "Lorena", "Lorena", "Lorenzo", "Lisandro", "Lidia", "Lidia",
        "Leticia", "Leopoldo", "Leonor", "Leonardo", "Leonardo", "Leandro", "Laura", "Laura",
        "Laura", "Laura", "Laura", "Julián", "Julián", "Julia", "Julia", "Julia",
        "Julio", "Judith", "Juan", "Juan", "Juan", "Josefina", "Josefa", "José",
        "José", "José", "José", "Jorge", "Jorge", "Jonás", "Jesús", "Jesús",
        "Javier", "Javier", "Javier", "Javier", "Jaime", "Jacinta", "Jimena", "Jimena",
        "Iván", "Iván", "Isabel", "Isabel", "Isabel", "Isabela", "Irene", "Irene",
        "Inés", "Inés", "Inmaculada", "Ignacio", "Ignacio", "Hugo", "Hortensia", "Horacio",
        "Herminia", "Héctor", "Guillermo", "Guillermo", "Gustavo", "Guadalupe", "Gonzalo", "Gonzalo",
        "Germán", "Gema", "Gabriel", "Gabriel", "Gabriel", "Gabriela", "Gabriela"
        };

        System.out.println("========================================");
        System.out.println("3. Invertidos - NOMBRES");
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
