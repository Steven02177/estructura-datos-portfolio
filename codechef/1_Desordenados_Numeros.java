import java.util.*;

/**
 * 1. Desordenados - NUMEROS
 * Copia TODO este archivo en CodeChef (lenguaje: Java) y pulsa Run.
 * Imprime tabla de metricas de cada metodo + muestra del arreglo ordenado.
 */
public class Main {

    static int comparaciones, intercambios, iteraciones;
    static void reset() { comparaciones = intercambios = iteraciones = 0; }
    static int[] copy(int[] a) { return Arrays.copyOf(a, a.length); }

    static int[] burbuja(int[] src) {
        int[] a = copy(src); reset();
        int n = a.length;
        for (int i = 0; i < n - 1; i++) {
            iteraciones++;
            for (int j = 0; j < n - i - 1; j++) {
                comparaciones++;
                if (a[j] > a[j + 1]) {
                    int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
                    intercambios++;
                }
            }
        }
        return a;
    }

    static int[] burbujaMejorado(int[] src) {
        int[] a = copy(src); reset();
        int n = a.length, i = 0;
        boolean hubo = true;
        while (hubo) {
            hubo = false; iteraciones++;
            for (int j = 0; j < n - i - 1; j++) {
                comparaciones++;
                if (a[j] > a[j + 1]) {
                    int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
                    intercambios++; hubo = true;
                }
            }
            i++;
        }
        return a;
    }

    static int[] seleccion(int[] src) {
        int[] a = copy(src); reset();
        int n = a.length;
        for (int i = 0; i < n - 1; i++) {
            iteraciones++;
            int min = i;
            for (int j = i + 1; j < n; j++) {
                comparaciones++;
                if (a[j] < a[min]) min = j;
            }
            if (min != i) {
                int t = a[i]; a[i] = a[min]; a[min] = t;
                intercambios++;
            }
        }
        return a;
    }

    static int[] insercion(int[] src) {
        int[] a = copy(src); reset();
        for (int i = 1; i < a.length; i++) {
            iteraciones++;
            int key = a[i], j = i - 1;
            while (j >= 0 && a[j] > key) {
                comparaciones++;
                a[j + 1] = a[j];
                intercambios++;
                j--;
            }
            a[j + 1] = key;
        }
        return a;
    }

    static int[] shaker(int[] src) {
        int[] a = copy(src); reset();
        int left = 0, right = a.length - 1;
        while (left < right) {
            iteraciones++;
            boolean swapped = false;
            for (int i = left; i < right; i++) {
                comparaciones++;
                if (a[i] > a[i + 1]) {
                    int t = a[i]; a[i] = a[i + 1]; a[i + 1] = t;
                    intercambios++; swapped = true;
                }
            }
            right--;
            if (!swapped) break;
            for (int i = right; i > left; i--) {
                comparaciones++;
                if (a[i - 1] > a[i]) {
                    int t = a[i - 1]; a[i - 1] = a[i]; a[i] = t;
                    intercambios++; swapped = true;
                }
            }
            left++;
        }
        return a;
    }

    static int[] shell(int[] src) {
        int[] a = copy(src); reset();
        int n = a.length;
        for (int gap = n / 2; gap > 0; gap /= 2) {
            iteraciones++;
            for (int i = gap; i < n; i++) {
                int temp = a[i], j = i;
                while (j >= gap && a[j - gap] > temp) {
                    comparaciones++;
                    a[j] = a[j - gap];
                    intercambios++;
                    j -= gap;
                }
                a[j] = temp;
            }
        }
        return a;
    }

    static int[] quick(int[] src) {
        int[] a = copy(src); reset();
        qs(a, 0, a.length - 1);
        return a;
    }
    static void qs(int[] a, int low, int high) {
        if (low >= high) return;
        iteraciones++;
        int pivot = a[high], i = low - 1;
        for (int j = low; j < high; j++) {
            comparaciones++;
            if (a[j] < pivot) {
                i++;
                int t = a[i]; a[i] = a[j]; a[j] = t;
                intercambios++;
            }
        }
        int t = a[i + 1]; a[i + 1] = a[high]; a[high] = t;
        intercambios++;
        qs(a, low, i);
        qs(a, i + 2, high);
    }

    static int[] mergeSort(int[] src) {
        int[] a = copy(src); reset();
        ms(a, 0, a.length - 1);
        return a;
    }
    static void ms(int[] a, int low, int high) {
        if (low >= high) return;
        iteraciones++;
        int mid = (low + high) / 2;
        ms(a, low, mid);
        ms(a, mid + 1, high);
        int[] L = Arrays.copyOfRange(a, low, mid + 1);
        int[] R = Arrays.copyOfRange(a, mid + 1, high + 1);
        int i = 0, j = 0, k = low;
        while (i < L.length && j < R.length) {
            comparaciones++;
            a[k++] = (L[i] <= R[j]) ? L[i++] : R[j++];
            intercambios++;
        }
        while (i < L.length) { a[k++] = L[i++]; intercambios++; }
        while (j < R.length) { a[k++] = R[j++]; intercambios++; }
    }

    static int[] heap(int[] src) {
        int[] a = copy(src); reset();
        int n = a.length;
        for (int i = n / 2 - 1; i >= 0; i--) { iteraciones++; heapify(a, n, i); }
        for (int i = n - 1; i > 0; i--) {
            iteraciones++;
            int t = a[0]; a[0] = a[i]; a[i] = t;
            intercambios++;
            heapify(a, i, 0);
        }
        return a;
    }
    static void heapify(int[] a, int size, int i) {
        int largest = i, l = 2 * i + 1, r = 2 * i + 2;
        if (l < size) { comparaciones++; if (a[l] > a[largest]) largest = l; }
        if (r < size) { comparaciones++; if (a[r] > a[largest]) largest = r; }
        if (largest != i) {
            int t = a[i]; a[i] = a[largest]; a[largest] = t;
            intercambios++;
            heapify(a, size, largest);
        }
    }

    static int[] counting(int[] src) {
        int[] a = copy(src); reset();
        iteraciones = 1;
        int min = a[0], max = a[0];
        for (int v : a) { if (v < min) min = v; if (v > max) max = v; }
        int rango = max - min + 1;
        int[] c = new int[rango];
        for (int v : a) c[v - min]++;
        for (int i = 1; i < rango; i++) c[i] += c[i - 1];
        int[] out = new int[a.length];
        for (int i = a.length - 1; i >= 0; i--) {
            out[c[a[i] - min] - 1] = a[i];
            c[a[i] - min]--;
            intercambios++;
        }
        return out;
    }

    static void fila(String nombre, String mem, boolean rec, int[] original,
                     java.util.function.Function<int[], int[]> fn) {
        long start = System.nanoTime();
        int[] r = fn.apply(original);
        long ms = (System.nanoTime() - start) / 1_000_000;
        System.out.printf("%-22s | %-8s | %6d ms | %8d | %12d | %10d | %s%n",
            nombre, mem, ms, iteraciones, comparaciones, intercambios, rec ? "Si" : "No");
        for (int i = 1; i < r.length; i++) {
            if (r[i] < r[i - 1]) {
                System.out.println("  ERROR: no quedo ordenado con " + nombre);
                return;
            }
        }
    }

    public static void main(String[] args) {
        int[] datos = {
        7234, 1456, 9087, 3421, 5678, 8901, 2345, 6789, 4012, 9876, 1234, 5432,
        8765, 3210, 6543, 9012, 2109, 7890, 4567, 8234, 1098, 5876, 3654, 9234,
        2987, 6321, 8109, 4789, 7456, 1987, 5234, 9654, 3087, 6876, 2456, 8543,
        4321, 7098, 1654, 5987, 9321, 3456, 8012, 2678, 6109, 9543, 4876, 7234,
        1432, 5109, 8876, 3789, 6234, 9109, 2543, 7654, 4209, 8456, 1876, 5321,
        9876, 3012, 6678, 2234, 7987, 4543, 8321, 1209, 5678, 9234, 3543, 6987,
        2876, 8109, 4654, 7321, 1543, 5876, 9012, 3234, 6456, 2109, 8654, 4987,
        7109, 1876, 5234, 9456, 3678, 6321, 2654, 8987, 4234, 7543, 1321, 5654,
        9678, 3109, 6543, 2987, 8234, 4456, 7876, 1654, 5987, 9321, 3876, 6109,
        2456, 8678, 4109, 7234, 1987, 5456, 9876, 3321, 6654, 2109, 8543, 4678,
        7456, 1234, 5678, 9109, 3654, 6876, 2321, 8876, 4543, 7678, 1456, 5987,
        9234, 3456, 6234, 2678, 8109, 4876, 7321, 1678, 5234, 9654, 3987, 6456,
        2876, 8321, 4234, 7109, 1876, 5456, 9012, 3678, 6987, 2543, 8654, 4321,
        7876, 1234, 5876, 9456, 3234, 6678, 2109, 8987, 4654, 7543, 1987, 5321,
        9678, 3456, 6234, 2876, 8456, 4109, 7654, 1543, 5678, 9876, 3109, 6543,
        2321, 8234, 4987, 7234, 1654, 5987, 9321, 3678, 6876, 2456, 8678, 4543,
        7456, 1876, 5234, 9109, 3876, 6321, 2654, 8543, 4678, 7987, 1321, 5456,
        9234, 3543, 6109, 2987, 8876, 4234, 7678, 1456, 5678, 9654, 3321, 6654,
        2234, 8321, 4876, 7109, 1678, 5987, 9012, 3654, 6456, 2543, 8109, 4321,
        7876, 1234, 5876, 9456, 3234, 6987, 2678, 8654, 4543, 7321, 1092, 5543,
        8910, 2765, 6345, 9182, 3829, 7410, 1593, 4281
        };

        System.out.println("========================================");
        System.out.println("1. Desordenados - NUMEROS");
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
        fila("Counting Sort", "O(n+k)", false, datos, Main::counting);

        int[] ordenado = mergeSort(datos);
        System.out.println();
        System.out.println("Arreglo ordenado (primeros 15):");
        System.out.print("[");
        for (int i = 0; i < Math.min(15, ordenado.length); i++) {
            if (i > 0) System.out.print(", ");
            System.out.print(ordenado[i]);
        }
        if (ordenado.length > 15) System.out.print(", ...");
        System.out.println("]");
        System.out.println("Ultimos 5: " + Arrays.toString(Arrays.copyOfRange(ordenado, Math.max(0, ordenado.length - 5), ordenado.length)));
        System.out.println("Total elementos: " + ordenado.length);
    }
}
