/**
 * Código fuente Java de cada método (para mostrar en la web y para CodeChef).
 * Los datos del arreglo se inyectan desde parcialArrays.js al generar el Main completo.
 */

export const CODIGOS_JAVA = {
  burbuja: `// Burbuja Simple - O(n^2)
static void burbuja(int[] a) {
    int n = a.length;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (a[j] > a[j + 1]) {
                int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
            }
        }
    }
}`,

  burbujaMejorado: `// Burbuja Mejorado - O(n^2) peor / O(n) mejor
static void burbujaMejorado(int[] a) {
    int n = a.length, i = 0;
    boolean hubo = true;
    while (hubo) {
        hubo = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (a[j] > a[j + 1]) {
                int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
                hubo = true;
            }
        }
        i++;
    }
}`,

  seleccion: `// Seleccion Directa - O(n^2)
static void seleccion(int[] a) {
    int n = a.length;
    for (int i = 0; i < n - 1; i++) {
        int min = i;
        for (int j = i + 1; j < n; j++) {
            if (a[j] < a[min]) min = j;
        }
        if (min != i) {
            int t = a[i]; a[i] = a[min]; a[min] = t;
        }
    }
}`,

  insercion: `// Insercion Simple - O(n^2) peor / O(n) mejor
static void insercion(int[] a) {
    for (int i = 1; i < a.length; i++) {
        int key = a[i], j = i - 1;
        while (j >= 0 && a[j] > key) {
            a[j + 1] = a[j];
            j--;
        }
        a[j + 1] = key;
    }
}`,

  shaker: `// Shaker Sort - O(n^2)
static void shaker(int[] a) {
    int left = 0, right = a.length - 1;
    while (left < right) {
        boolean swapped = false;
        for (int i = left; i < right; i++) {
            if (a[i] > a[i + 1]) {
                int t = a[i]; a[i] = a[i + 1]; a[i + 1] = t;
                swapped = true;
            }
        }
        right--;
        if (!swapped) break;
        for (int i = right; i > left; i--) {
            if (a[i - 1] > a[i]) {
                int t = a[i - 1]; a[i - 1] = a[i]; a[i] = t;
                swapped = true;
            }
        }
        left++;
    }
}`,

  shell: `// Shell Sort - O(n log^2 n) aprox.
static void shell(int[] a) {
    int n = a.length;
    for (int gap = n / 2; gap > 0; gap /= 2) {
        for (int i = gap; i < n; i++) {
            int temp = a[i], j = i;
            while (j >= gap && a[j - gap] > temp) {
                a[j] = a[j - gap];
                j -= gap;
            }
            a[j] = temp;
        }
    }
}`,

  quick: `// Quick Sort - O(n log n) promedio
static void quick(int[] a, int low, int high) {
    if (low >= high) return;
    int pivot = a[high], i = low - 1;
    for (int j = low; j < high; j++) {
        if (a[j] < pivot) {
            i++;
            int t = a[i]; a[i] = a[j]; a[j] = t;
        }
    }
    int t = a[i + 1]; a[i + 1] = a[high]; a[high] = t;
    quick(a, low, i);
    quick(a, i + 2, high);
}`,

  merge: `// Merge Sort - O(n log n)
static void mergeSort(int[] a, int low, int high) {
    if (low >= high) return;
    int mid = (low + high) / 2;
    mergeSort(a, low, mid);
    mergeSort(a, mid + 1, high);
    int[] L = java.util.Arrays.copyOfRange(a, low, mid + 1);
    int[] R = java.util.Arrays.copyOfRange(a, mid + 1, high + 1);
    int i = 0, j = 0, k = low;
    while (i < L.length && j < R.length)
        a[k++] = (L[i] <= R[j]) ? L[i++] : R[j++];
    while (i < L.length) a[k++] = L[i++];
    while (j < R.length) a[k++] = R[j++];
}`,

  radix: `// Radix Sort - O(d*(n+k)) solo enteros >= 0
static void radix(int[] a) {
    int max = a[0];
    for (int v : a) if (v > max) max = v;
    for (int exp = 1; max / exp > 0; exp *= 10) {
        int[] out = new int[a.length];
        int[] c = new int[10];
        for (int v : a) c[(v / exp) % 10]++;
        for (int i = 1; i < 10; i++) c[i] += c[i - 1];
        for (int i = a.length - 1; i >= 0; i--) {
            int d = (a[i] / exp) % 10;
            out[c[d] - 1] = a[i];
            c[d]--;
        }
        System.arraycopy(out, 0, a, 0, a.length);
    }
}`,

  heap: `// Metodo de Monticulo (Heap Sort) - O(n log n)
static void heap(int[] a) {
    int n = a.length;
    for (int i = n / 2 - 1; i >= 0; i--) heapify(a, n, i);
    for (int i = n - 1; i > 0; i--) {
        int t = a[0]; a[0] = a[i]; a[i] = t;
        heapify(a, i, 0);
    }
}
static void heapify(int[] a, int size, int i) {
    int largest = i, l = 2 * i + 1, r = 2 * i + 2;
    if (l < size && a[l] > a[largest]) largest = l;
    if (r < size && a[r] > a[largest]) largest = r;
    if (largest != i) {
        int t = a[i]; a[i] = a[largest]; a[largest] = t;
        heapify(a, size, largest);
    }
}`,

  bucket: `// Metodo del Cubo (Bucket Sort) - O(n+k) promedio
static void bucket(int[] a) {
    int n = a.length;
    if (n == 0) return;
    int min = a[0], max = a[0];
    for (int v : a) { if (v < min) min = v; if (v > max) max = v; }
    int bc = Math.max(5, (int) Math.sqrt(n));
    java.util.ArrayList<Integer>[] buckets = new java.util.ArrayList[bc];
    for (int i = 0; i < bc; i++) buckets[i] = new java.util.ArrayList<>();
    int range = max - min + 1;
    for (int v : a) {
        int idx = Math.min(bc - 1, (int) (((long)(v - min) * bc) / range));
        buckets[idx].add(v);
    }
    int k = 0;
    for (java.util.ArrayList<Integer> b : buckets) {
        java.util.Collections.sort(b);
        for (int v : b) a[k++] = v;
    }
}`,

  counting: `// Counting Sort - O(n+k) enteros (incluye negativos)
static void counting(int[] a) {
    if (a.length == 0) return;
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
    }
    System.arraycopy(out, 0, a, 0, a.length);
}`,
}

/** Versiones para String[] (nombres) */
export const CODIGOS_JAVA_NOMBRES = {
  burbuja: `// Burbuja Simple (String)
static void burbuja(String[] a) {
    int n = a.length;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (a[j].compareTo(a[j + 1]) > 0) {
                String t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
            }
        }
    }
}`,

  burbujaMejorado: `// Burbuja Mejorado (String)
static void burbujaMejorado(String[] a) {
    int n = a.length, i = 0;
    boolean hubo = true;
    while (hubo) {
        hubo = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (a[j].compareTo(a[j + 1]) > 0) {
                String t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
                hubo = true;
            }
        }
        i++;
    }
}`,

  seleccion: `// Seleccion Directa (String)
static void seleccion(String[] a) {
    int n = a.length;
    for (int i = 0; i < n - 1; i++) {
        int min = i;
        for (int j = i + 1; j < n; j++) {
            if (a[j].compareTo(a[min]) < 0) min = j;
        }
        if (min != i) {
            String t = a[i]; a[i] = a[min]; a[min] = t;
        }
    }
}`,

  insercion: `// Insercion Simple (String)
static void insercion(String[] a) {
    for (int i = 1; i < a.length; i++) {
        String key = a[i];
        int j = i - 1;
        while (j >= 0 && a[j].compareTo(key) > 0) {
            a[j + 1] = a[j];
            j--;
        }
        a[j + 1] = key;
    }
}`,

  shaker: `// Shaker (String)
static void shaker(String[] a) {
    int left = 0, right = a.length - 1;
    while (left < right) {
        boolean swapped = false;
        for (int i = left; i < right; i++) {
            if (a[i].compareTo(a[i + 1]) > 0) {
                String t = a[i]; a[i] = a[i + 1]; a[i + 1] = t;
                swapped = true;
            }
        }
        right--;
        if (!swapped) break;
        for (int i = right; i > left; i--) {
            if (a[i - 1].compareTo(a[i]) > 0) {
                String t = a[i - 1]; a[i - 1] = a[i]; a[i] = t;
                swapped = true;
            }
        }
        left++;
    }
}`,

  shell: `// Shell Sort (String)
static void shell(String[] a) {
    int n = a.length;
    for (int gap = n / 2; gap > 0; gap /= 2) {
        for (int i = gap; i < n; i++) {
            String temp = a[i];
            int j = i;
            while (j >= gap && a[j - gap].compareTo(temp) > 0) {
                a[j] = a[j - gap];
                j -= gap;
            }
            a[j] = temp;
        }
    }
}`,

  quick: `// Quick Sort (String)
static void quick(String[] a, int low, int high) {
    if (low >= high) return;
    String pivot = a[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (a[j].compareTo(pivot) < 0) {
            i++;
            String t = a[i]; a[i] = a[j]; a[j] = t;
        }
    }
    String t = a[i + 1]; a[i + 1] = a[high]; a[high] = t;
    quick(a, low, i);
    quick(a, i + 2, high);
}`,

  merge: `// Merge Sort (String)
static void mergeSort(String[] a, int low, int high) {
    if (low >= high) return;
    int mid = (low + high) / 2;
    mergeSort(a, low, mid);
    mergeSort(a, mid + 1, high);
    String[] L = java.util.Arrays.copyOfRange(a, low, mid + 1);
    String[] R = java.util.Arrays.copyOfRange(a, mid + 1, high + 1);
    int i = 0, j = 0, k = low;
    while (i < L.length && j < R.length)
        a[k++] = (L[i].compareTo(R[j]) <= 0) ? L[i++] : R[j++];
    while (i < L.length) a[k++] = L[i++];
    while (j < R.length) a[k++] = R[j++];
}`,

  heap: `// Heap Sort (String)
static void heap(String[] a) {
    int n = a.length;
    for (int i = n / 2 - 1; i >= 0; i--) heapify(a, n, i);
    for (int i = n - 1; i > 0; i--) {
        String t = a[0]; a[0] = a[i]; a[i] = t;
        heapify(a, i, 0);
    }
}
static void heapify(String[] a, int size, int i) {
    int largest = i, l = 2 * i + 1, r = 2 * i + 2;
    if (l < size && a[l].compareTo(a[largest]) > 0) largest = l;
    if (r < size && a[r].compareTo(a[largest]) > 0) largest = r;
    if (largest != i) {
        String t = a[i]; a[i] = a[largest]; a[largest] = t;
        heapify(a, size, largest);
    }
}`,

  radix: `// Radix Sort NO aplica a nombres (solo enteros)`,
  bucket: `// Bucket Sort tipicamente para numeros; para nombres usar otro metodo`,
  counting: `// Counting Sort NO aplica a nombres (solo enteros)`,
}

function formatIntArray(arr) {
  const lines = []
  for (let i = 0; i < arr.length; i += 12) {
    lines.push('            ' + arr.slice(i, i + 12).join(', ') + (i + 12 < arr.length ? ',' : ''))
  }
  return lines.join('\n')
}

function formatStringArray(arr) {
  const lines = []
  for (let i = 0; i < arr.length; i += 6) {
    const chunk = arr.slice(i, i + 6).map(s =>
      '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"'
    ).join(', ')
    lines.push('            ' + chunk + (i + 6 < arr.length ? ',' : ''))
  }
  return lines.join('\n')
}

/**
 * Genera un Main.java completo para CodeChef con los datos actuales
 * de parcialArrays (escenario + tipo).
 */
export function generarMainCodeChef({ label, tipo, datos, metodoId }) {
  const esNumeros = tipo === 'numeros'
  const metodo = metodoId || 'merge'

  if (esNumeros) {
    const codigoMetodo = CODIGOS_JAVA[metodo] || CODIGOS_JAVA.merge
    const llamada =
      metodo === 'quick' ? 'quick(a, 0, a.length - 1);'
      : metodo === 'merge' ? 'mergeSort(a, 0, a.length - 1);'
      : metodo === 'heap' ? 'heap(a);'
      : `${metodo}(a);`

    return `import java.util.*;

// ${label} - NUMEROS  |  n = ${datos.length}
// Generado desde parcialArrays.js — pega en CodeChef (Java) y Run
public class Main {

${codigoMetodo}

    public static void main(String[] args) {
        int[] a = {
${formatIntArray(datos)}
        };

        System.out.println("Antes (" + a.length + " elementos):");
        System.out.println(Arrays.toString(Arrays.copyOf(a, Math.min(20, a.length))) + (a.length > 20 ? " ..." : ""));

        ${llamada}

        System.out.println("Despues:");
        System.out.println(Arrays.toString(Arrays.copyOf(a, Math.min(20, a.length))) + (a.length > 20 ? " ..." : ""));
        System.out.println("Ultimos 5: " + Arrays.toString(Arrays.copyOfRange(a, Math.max(0, a.length - 5), a.length)));
    }
}
`
  }

  // Nombres
  const codigoMetodo = CODIGOS_JAVA_NOMBRES[metodo] || CODIGOS_JAVA_NOMBRES.merge
  if (['radix', 'counting', 'bucket'].includes(metodo)) {
    return `// El metodo "${metodo}" no aplica a nombres (solo enteros).
// Elige Burbuja, Quick, Merge, Shell, etc. en el selector de metodo.`
  }
  const llamada =
    metodo === 'quick' ? 'quick(a, 0, a.length - 1);'
    : metodo === 'merge' ? 'mergeSort(a, 0, a.length - 1);'
    : metodo === 'heap' ? 'heap(a);'
    : `${metodo}(a);`

  return `import java.util.*;

// ${label} - NOMBRES  |  n = ${datos.length}
// Generado desde parcialArrays.js — pega en CodeChef (Java) y Run
public class Main {

${codigoMetodo}

    public static void main(String[] args) {
        String[] a = {
${formatStringArray(datos)}
        };

        System.out.println("Antes (" + a.length + " elementos):");
        System.out.println(Arrays.toString(Arrays.copyOf(a, Math.min(15, a.length))) + (a.length > 15 ? " ..." : ""));

        ${llamada}

        System.out.println("Despues:");
        System.out.println(Arrays.toString(Arrays.copyOf(a, Math.min(15, a.length))) + (a.length > 15 ? " ..." : ""));
        System.out.println("Ultimos 5: " + Arrays.toString(Arrays.copyOfRange(a, Math.max(0, a.length - 5), a.length)));
    }
}
`
}
