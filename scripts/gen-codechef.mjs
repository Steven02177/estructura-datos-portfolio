import {
  nombresDesordenados, numerosDesordenados,
  nombresCasiOrdenados, numerosCasiOrdenados,
  nombresInvertidos, numerosInvertidos,
  nombresRepetidos, numerosRepetidos,
  nombresMitadOrdenados, numerosMitadOrdenados,
} from '../src/data/parcialArrays.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '..', 'codechef')
fs.mkdirSync(outDir, { recursive: true })

const scenarios = [
  { id: '1_Desordenados', label: '1. Desordenados', nombres: nombresDesordenados, numeros: numerosDesordenados },
  { id: '2_CasiOrdenados', label: '2. Casi ordenados', nombres: nombresCasiOrdenados, numeros: numerosCasiOrdenados },
  { id: '3_Invertidos', label: '3. Invertidos', nombres: nombresInvertidos, numeros: numerosInvertidos },
  { id: '4_Repetidos', label: '4. Con repeticiones', nombres: nombresRepetidos, numeros: numerosRepetidos },
  { id: '5_MitadOrdenados', label: '5. Medianamente ordenados', nombres: nombresMitadOrdenados, numeros: numerosMitadOrdenados },
]

function javaStringArray(arr) {
  const lines = []
  for (let i = 0; i < arr.length; i += 8) {
    const chunk = arr.slice(i, i + 8).map(s =>
      '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"'
    ).join(', ')
    lines.push('        ' + chunk + (i + 8 < arr.length ? ',' : ''))
  }
  return lines.join('\n')
}

function javaIntArray(arr) {
  const lines = []
  for (let i = 0; i < arr.length; i += 12) {
    const chunk = arr.slice(i, i + 12).join(', ')
    lines.push('        ' + chunk + (i + 12 < arr.length ? ',' : ''))
  }
  return lines.join('\n')
}

function templateNumeros(className, label, arr) {
  return `import java.util.*;

/**
 * ${label} - NUMEROS
 * Copia TODO este archivo en CodeChef (lenguaje: Java) y pulsa Run.
 * Imprime tabla de metricas de cada metodo + muestra del arreglo ordenado.
 */
public class ${className} {

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
${javaIntArray(arr)}
        };

        System.out.println("========================================");
        System.out.println("${label} - NUMEROS");
        System.out.println("n = " + datos.length);
        System.out.println("========================================");
        System.out.printf("%-22s | %-8s | %8s | %8s | %12s | %10s | %s%n",
            "Estructura", "Memoria", "Tiempo", "Iters", "Comparaciones", "Intercambios", "Recursiva");
        System.out.println("------------------------------------------------------------------------------------------------");

        fila("Burbuja Simple", "O(1)", false, datos, ${className}::burbuja);
        fila("Burbuja Mejorado", "O(1)", false, datos, ${className}::burbujaMejorado);
        fila("Seleccion Directa", "O(1)", false, datos, ${className}::seleccion);
        fila("Insercion Simple", "O(1)", false, datos, ${className}::insercion);
        fila("Shaker", "O(1)", false, datos, ${className}::shaker);
        fila("Shell Sort", "O(1)", false, datos, ${className}::shell);
        fila("Quick Sort", "O(log n)", true, datos, ${className}::quick);
        fila("Merge Sort", "O(n)", true, datos, ${className}::mergeSort);
        fila("Metodo de Monticulo", "O(1)", false, datos, ${className}::heap);
        fila("Counting Sort", "O(n+k)", false, datos, ${className}::counting);

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
`
}

function templateNombres(className, label, arr) {
  return `import java.util.*;

/**
 * ${label} - NOMBRES
 * Copia TODO este archivo en CodeChef (lenguaje: Java) y pulsa Run.
 * Ordena strings lexicograficamente (mismo criterio que el proyecto web).
 */
public class ${className} {

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
${javaStringArray(arr)}
        };

        System.out.println("========================================");
        System.out.println("${label} - NOMBRES");
        System.out.println("n = " + datos.length);
        System.out.println("========================================");
        System.out.printf("%-22s | %-8s | %8s | %8s | %12s | %10s | %s%n",
            "Estructura", "Memoria", "Tiempo", "Iters", "Comparaciones", "Intercambios", "Recursiva");
        System.out.println("------------------------------------------------------------------------------------------------");

        fila("Burbuja Simple", "O(1)", false, datos, ${className}::burbuja);
        fila("Burbuja Mejorado", "O(1)", false, datos, ${className}::burbujaMejorado);
        fila("Seleccion Directa", "O(1)", false, datos, ${className}::seleccion);
        fila("Insercion Simple", "O(1)", false, datos, ${className}::insercion);
        fila("Shaker", "O(1)", false, datos, ${className}::shaker);
        fila("Shell Sort", "O(1)", false, datos, ${className}::shell);
        fila("Quick Sort", "O(log n)", true, datos, ${className}::quick);
        fila("Merge Sort", "O(n)", true, datos, ${className}::mergeSort);
        fila("Metodo de Monticulo", "O(1)", false, datos, ${className}::heap);

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
`
}

const lines = ['# Codigos para CodeChef (Java)', '', 'Cada archivo es independiente.', 'Copia TODO el .java en CodeChef → lenguaje **Java** → Run.', '', '| Archivo | Que es |', '|---------|--------|']

for (const s of scenarios) {
  // CodeChef espera normalmente la clase pública llamada Main
  const fileNum = s.id + '_Numeros.java'
  const fileNom = s.id + '_Nombres.java'
  fs.writeFileSync(path.join(outDir, fileNum), templateNumeros('Main', s.label, s.numeros))
  fs.writeFileSync(path.join(outDir, fileNom), templateNombres('Main', s.label, s.nombres))
  lines.push(`| ${fileNum} | ${s.label} — solo numeros (n=${s.numeros.length}) |`)
  lines.push(`| ${fileNom} | ${s.label} — solo nombres (n=${s.nombres.length}) |`)
  console.log('OK', fileNum, s.numeros.length, '|', fileNom, s.nombres.length)
}

fs.writeFileSync(path.join(outDir, 'README.md'), lines.join('\n'))
console.log('DONE →', outDir)
