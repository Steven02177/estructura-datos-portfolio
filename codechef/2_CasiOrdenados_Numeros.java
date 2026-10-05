import java.util.*;

/**
 * 2. Casi ordenados - NUMEROS
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
        1050, 1012, 1025, 1038, 1018, 1042, 1060, 1075, 1055, 1082, 1095, 1110,
        1098, 1125, 1140, 1130, 1152, 1168, 1158, 1180, 1195, 1210, 1202, 1225,
        1240, 1232, 1255, 1270, 1262, 1285, 1300, 1292, 1315, 1330, 1322, 1345,
        1360, 1352, 1375, 1390, 1382, 1405, 1420, 1412, 1435, 1450, 1442, 1465,
        1480, 1472, 1495, 1510, 1502, 1525, 1540, 1532, 1555, 1570, 1562, 1585,
        1600, 1592, 1615, 1630, 1622, 1645, 1660, 1652, 1675, 1690, 1682, 1705,
        1720, 1712, 1735, 1750, 1742, 1765, 1780, 1772, 1795, 1810, 1802, 1825,
        1840, 1832, 1855, 1870, 1862, 1885, 1900, 1892, 1915, 1930, 1922, 1945,
        1960, 1952, 1975, 1990, 1982, 2005, 2020, 2012, 2035, 2050, 2042, 2065,
        2080, 2072, 2095, 2110, 2102, 2125, 2140, 2132, 2155, 2170, 2162, 2185,
        2200, 2192, 2215, 2230, 2222, 2245, 2260, 2252, 2275, 2290, 2282, 2305,
        2320, 2312, 2335, 2350, 2342, 2365, 2380, 2372, 2395, 2410, 2402, 2425,
        2440, 2432, 2455, 2470, 2462, 2485, 2500, 2492, 2515, 2530, 2522, 2545,
        2560, 2552, 2575, 2590, 2582, 2605, 2620, 2612, 2635, 2650, 2642, 2665,
        2680, 2672, 2695, 2710, 2702, 2725, 2740, 2732, 2755, 2770, 2762, 2785,
        2800, 2792, 2815, 2830, 2822, 2845, 2860, 2852, 2875, 2890, 2882, 2905,
        2920, 2912, 2935, 2950, 2942, 2965, 2980, 2995
        };

        System.out.println("========================================");
        System.out.println("2. Casi ordenados - NUMEROS");
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
