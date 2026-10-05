import java.util.*;

/**
 * 4. Con repeticiones - NUMEROS
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
        3456, 7821, 1234, 9087, 4567, 2109, 8765, 5432, 1023, 6789, 3456, 9012,
        1098, 7654, 4321, 8901, 2345, 5678, 9234, 1456, 6543, 3210, 7890, 4098,
        8234, 1987, 5321, 9876, 2567, 6109, 3789, 7432, 1876, 5098, 8543, 4209,
        9654, 2876, 6321, 1456, 7234, 3987, 8109, 1543, 5876, 9321, 4654, 2109,
        6987, 3456, 7821, 1234, 8654, 5432, 9109, 1987, 4567, 7098, 3210, 6543,
        2876, 8765, 5234, 9456, 1234, 4789, 7321, 1876, 6109, 3654, 8234, 5987,
        9876, 2345, 1543, 4098, 7654, 6321, 9234, 3876, 8109, 5432, 2109, 6789,
        1098, 4321, 7890, 3456, 9012, 5678, 8543, 2876, 6234, 1987, 4567, 7234,
        1876, 5321, 9654, 3109, 8765, 6543, 2345, 5098, 9321, 4654, 7876, 1234,
        6109, 3789, 8234, 5876, 9456, 2567, 7098, 4321, 1456, 6987, 3654, 8109,
        1987, 5234, 9109, 4789, 7543, 2109, 6321, 3456, 8876, 5432, 9876, 1654,
        4098, 7234, 1876, 6543, 3210, 8654, 5987, 9321, 2345, 6789, 4567, 7890,
        1234, 5109, 8765, 3876, 9654, 6234, 2876, 4321, 7654, 1987, 5678, 9012,
        3456, 8234, 1543, 6109, 4789, 7321, 9876, 5432, 2109, 8543, 6987, 3654,
        1098, 5234, 9456, 4567, 7098, 2876, 6543, 1456, 8109, 3789, 5876, 9321,
        1876, 4654, 7234, 6321, 9109, 3210, 8765, 5098, 2345, 7876, 4321, 9654,
        1234, 6109, 3456, 8234, 5987, 2567, 7543, 9876, 4789, 1987, 6234, 8876,
        3654, 5432, 9321, 2109, 7654, 4098, 1876, 6987, 3876, 8109, 5234, 9456,
        1654, 4567, 7321, 2876, 6543, 9012, 3210, 8654, 5678, 1234, 4321, 7890,
        6109, 9234, 3456, 8765, 5876, 2345, 7098, 4654, 9876, 1543, 6789, 3987,
        8234, 5321, 9654, 2109, 7234, 4876, 1987, 6321, 3654, 8543, 5432, 9109,
        3456, 7821, 1234, 9087, 4567, 2109, 8765, 5432, 6789, 9012, 1098, 7654,
        4321, 8901, 2345, 5678, 9234, 6543, 3210, 7890, 4098, 8234, 5321, 9876,
        2567, 6109, 3789, 7432, 1876, 5098, 8543, 4209, 9654, 2876, 6321, 7234,
        3987, 8109, 1543, 5876, 9321, 4654, 6987, 8654, 9109, 1987, 7098, 9456
        };

        System.out.println("========================================");
        System.out.println("4. Con repeticiones - NUMEROS");
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
