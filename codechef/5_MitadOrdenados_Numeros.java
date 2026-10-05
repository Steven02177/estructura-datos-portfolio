import java.util.*;

/**
 * 5. Medianamente ordenados - NUMEROS
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
        7843, 2109, 9876, 1234, 5678, 8901, 3456, 6543, 4321, 9012, 2876, 7654,
        1098, 5432, 8765, 3210, 6789, 4567, 9234, 1876, 7321, 2543, 8109, 5987,
        3654, 9876, 1432, 6234, 4789, 8543, 2109, 7098, 5234, 9654, 1987, 6876,
        3987, 8234, 4654, 7456, 1654, 5876, 9321, 3456, 8678, 2345, 6109, 4876,
        7890, 1234, 5678, 9456, 3876, 7234, 2678, 8987, 5321, 9109, 1543, 6543,
        4234, 8456, 2987, 7654, 5987, 9876, 1876, 6321, 3543, 8109, 4567, 7987,
        2456, 5654, 9234, 3109, 8876, 6678, 1321, 4987, 7543, 2234, 9654, 5456,
        8321, 3678, 6987, 1678, 4543, 7876, 2109, 5987, 9012, 3234, 8654, 6456,
        1987, 4321, 7234, 5234, 9876, 2876, 8543, 6234, 3456, 7654, 1456, 5678,
        9321, 4109, 8234, 2543, 6876, 3987, 7456, 1234, 5876, 9654, 4678, 8109,
        2321, 6543, 3678, 7987, 5456, 9234, 1876, 4876, 8678, 6109, 3421, 8901,
        1567, 7210, 4890, 9345, 2678, 6123, 8456, 3789, 5123, 9876, 2345, 6789,
        4012, 8567, 1234, 7890, 3456, 9012, 5678, 1098, 6543, 2109, 8765, 4321,
        7821, 3210, 9234, 5432, 1876, 6987, 3654, 8109, 4567, 7234, 2876, 9456,
        5234, 1654, 6321, 3987, 8543, 4109, 7654, 2345, 9109, 5876, 1456, 6876,
        3109, 8234, 4789, 7098, 2543, 9654, 5321, 1987, 6456, 3876, 8678, 4234,
        7987, 2678, 9321, 5987, 1321, 6234, 3543, 8876, 4654, 7456, 2109, 9012,
        5456, 1789, 6678, 3234, 8321, 4987, 7109, 2456, 9543, 5789, 1678, 6109,
        3789, 8456, 4321, 7543, 2876, 9234, 5109, 1876, 6987, 3456, 8012, 4678,
        7321, 2234, 9765, 5654, 1234, 6543, 3987, 8109, 4876, 7654, 2987, 9109,
        5876, 1543, 6789, 3321, 8987, 4456, 7234, 2012, 9654, 5321, 1000, 1003,
        1007, 1012, 1015, 1018, 1022, 1025, 1030, 1034, 1037, 1041, 1046, 1050,
        1053, 1058, 1062, 1065, 1069, 1074, 1078, 1081, 1085, 1090, 1093, 1097,
        1102, 1106, 1110, 1114, 1119, 1123, 1127, 1131, 1136, 1140, 1144, 1149,
        1153, 1157, 1162, 1166, 1170, 1175, 1179, 1183, 1188, 1192, 1196, 1201,
        1205, 1209, 1214, 1218, 1222, 1227, 1231, 1235, 1240, 1244, 1248, 1253,
        1257, 1261, 1266, 1270, 1274, 1279, 1283, 1287, 1292, 1296, 1300, 1305,
        1309, 1313, 1318, 1322, 1326, 1331, 1335, 1339, 1344, 1348, 1352, 1357,
        1361, 1365, 1370, 1374, 1378, 1383, 1387, 1391, 1396, 1400, 1404, 1409,
        1413, 1417, 1422, 1426, 1430, 1435, 1439, 1443, 1448, 1452, 1456, 1461,
        1465, 1469, 1474, 1478, 1482, 1487, 1491, 1495, 1500, 1504, 1508, 1513,
        1517, 1521, 1526, 1530, 1534, 1539, 1543, 1547, 1552, 1556, 1560, 1565,
        1569, 1573, 1578, 1582, 1586, 1591, 1595, 1599, 1604, 1608, 1612, 1617,
        1621, 1625, 1630, 1634, 1638, 1643, 1647, 1651, 1656, 1660, 1664, 1669,
        1673, 1677, 1682, 1686, 1690, 1695, 1699, 1703, 1708, 1712, 1716, 1721,
        1725, 1729, 1734, 1738, 1742, 1747, 1751, 1755, 1760, 1764, 1768, 1773,
        1777, 1781, 1786, 1790, 1794, 1799, 1803, 1807, 1812, 1816, 1820, 1825,
        1829, 1833, 1838, 1842, 1846, 1851, 1855, 1859, 1864, 1868, 1872, 1877,
        1881, 1885, 1890, 1894, 1898, 1903, 1907, 1911, 1916, 1920, 1924, 1929,
        1933, 1937, 1942, 1946, 1950, 1955, 1959, 1963, 1968, 1972, 1976, 1981,
        1985, 1989, 1994, 1998, 2002, 2007, 2011, 2015, 2020, 2024, 2028, 2033,
        2037, 2041, 2046, 2050, 2054, 2059, 2063, 2067
        };

        System.out.println("========================================");
        System.out.println("5. Medianamente ordenados - NUMEROS");
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
