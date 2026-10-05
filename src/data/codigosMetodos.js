/**
 * Código fuente de cada método de ordenamiento (JavaScript limpio).
 * Se muestra debajo de la tabla comparativa en el parcial.
 */

export const CODIGOS = {
  burbuja: `// Burbuja Simple — O(n²)
function burbujaSimple(arr) {
  const a = [...arr];
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
      }
    }
  }
  return a;
}`,

  burbujaMejorado: `// Burbuja Mejorado — O(n²) peor / O(n) mejor
function burbujaMejorado(arr) {
  const a = [...arr];
  const n = a.length;
  let i = 0;
  let huboIntercambio = true;
  while (huboIntercambio) {
    huboIntercambio = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        huboIntercambio = true;
      }
    }
    i++;
  }
  return a;
}`,

  seleccion: `// Selección Directa — O(n²)
function seleccionDirecta(arr) {
  const a = [...arr];
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (a[j] < a[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
    }
  }
  return a;
}`,

  insercion: `// Inserción Simple — O(n²) peor / O(n) mejor
function insercionSimple(arr) {
  const a = [...arr];
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = key;
  }
  return a;
}`,

  shaker: `// Shaker Sort (Cocktail) — O(n²)
function shakerSort(arr) {
  const a = [...arr];
  let left = 0;
  let right = a.length - 1;
  while (left < right) {
    let swapped = false;
    for (let i = left; i < right; i++) {
      if (a[i] > a[i + 1]) {
        [a[i], a[i + 1]] = [a[i + 1], a[i]];
        swapped = true;
      }
    }
    right--;
    if (!swapped) break;
    for (let i = right; i > left; i--) {
      if (a[i - 1] > a[i]) {
        [a[i - 1], a[i]] = [a[i], a[i - 1]];
        swapped = true;
      }
    }
    left++;
  }
  return a;
}`,

  shell: `// Shell Sort — O(n log² n) aprox.
function shellSort(arr) {
  const a = [...arr];
  const n = a.length;
  let gap = Math.floor(n / 2);
  while (gap > 0) {
    for (let i = gap; i < n; i++) {
      const temp = a[i];
      let j = i;
      while (j >= gap && a[j - gap] > temp) {
        a[j] = a[j - gap];
        j -= gap;
      }
      a[j] = temp;
    }
    gap = Math.floor(gap / 2);
  }
  return a;
}`,

  quick: `// Quick Sort — O(n log n) promedio / O(n²) peor
function quickSort(arr) {
  const a = [...arr];
  function partition(low, high) {
    const pivot = a[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      if (a[j] < pivot) {
        i++;
        [a[i], a[j]] = [a[j], a[i]];
      }
    }
    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    return i + 1;
  }
  function qs(low, high) {
    if (low < high) {
      const pi = partition(low, high);
      qs(low, pi - 1);
      qs(pi + 1, high);
    }
  }
  qs(0, a.length - 1);
  return a;
}`,

  merge: `// Merge Sort — O(n log n) siempre
function mergeSort(arr) {
  const a = [...arr];
  function merge(low, mid, high) {
    const L = a.slice(low, mid + 1);
    const R = a.slice(mid + 1, high + 1);
    let i = 0, j = 0, k = low;
    while (i < L.length && j < R.length) {
      a[k++] = L[i] <= R[j] ? L[i++] : R[j++];
    }
    while (i < L.length) a[k++] = L[i++];
    while (j < R.length) a[k++] = R[j++];
  }
  function ms(low, high) {
    if (low < high) {
      const mid = Math.floor((low + high) / 2);
      ms(low, mid);
      ms(mid + 1, high);
      merge(low, mid, high);
    }
  }
  ms(0, a.length - 1);
  return a;
}`,

  radix: `// Radix Sort — O(d · (n + k))  (solo enteros ≥ 0)
function radixSort(arr) {
  const a = [...arr];
  if (a.length === 0) return a;
  const max = Math.max(...a);
  let exp = 1;
  while (Math.floor(max / exp) > 0) {
    const output = new Array(a.length);
    const count = new Array(10).fill(0);
    for (let i = 0; i < a.length; i++) {
      count[Math.floor(a[i] / exp) % 10]++;
    }
    for (let i = 1; i < 10; i++) count[i] += count[i - 1];
    for (let i = a.length - 1; i >= 0; i--) {
      const d = Math.floor(a[i] / exp) % 10;
      output[count[d] - 1] = a[i];
      count[d]--;
    }
    for (let i = 0; i < a.length; i++) a[i] = output[i];
    exp *= 10;
  }
  return a;
}`,

  heap: `// Método de Montículo (Heap Sort) — O(n log n)
function heapSort(arr) {
  const a = [...arr];
  const n = a.length;
  function heapify(size, i) {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    if (l < size && a[l] > a[largest]) largest = l;
    if (r < size && a[r] > a[largest]) largest = r;
    if (largest !== i) {
      [a[i], a[largest]] = [a[largest], a[i]];
      heapify(size, largest);
    }
  }
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }
  for (let i = n - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    heapify(i, 0);
  }
  return a;
}`,

  bucket: `// Método del Cubo (Bucket Sort) — O(n + k) promedio
function bucketSort(arr) {
  const a = [...arr];
  if (a.length === 0) return a;
  const n = a.length;
  const min = Math.min(...a);
  const max = Math.max(...a);
  const bucketCount = Math.max(5, Math.floor(Math.sqrt(n)));
  const buckets = Array.from({ length: bucketCount }, () => []);
  const range = max - min + 1;
  for (const v of a) {
    const idx = Math.min(
      bucketCount - 1,
      Math.floor(((v - min) / range) * bucketCount)
    );
    buckets[idx].push(v);
  }
  let k = 0;
  for (const b of buckets) {
    b.sort((x, y) => x - y);
    for (const v of b) a[k++] = v;
  }
  return a;
}`,

  counting: `// Counting Sort — O(n + k)  (solo enteros)
function countingSort(arr) {
  if (arr.length === 0) return [...arr];
  const a = [...arr];
  const min = Math.min(...a);
  const max = Math.max(...a);
  const rango = max - min + 1;
  const count = new Array(rango).fill(0);
  for (const v of a) count[v - min]++;
  for (let i = 1; i < rango; i++) count[i] += count[i - 1];
  const ordenado = new Array(a.length);
  for (let i = a.length - 1; i >= 0; i--) {
    const idx = a[i] - min;
    ordenado[count[idx] - 1] = a[i];
    count[idx]--;
  }
  return ordenado;
}`,
}
