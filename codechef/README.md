# Codigos para CodeChef (Java)

Cada archivo es independiente.
Copia TODO el .java en CodeChef → lenguaje **Java** → Run.

| Archivo | Que es |
|---------|--------|
| 1_Desordenados_Numeros.java | 1. Desordenados — solo numeros (n=248) |
| 1_Desordenados_Nombres.java | 1. Desordenados — solo nombres (n=230) |
| 2_CasiOrdenados_Numeros.java | 2. Casi ordenados — solo numeros (n=200) |
| 2_CasiOrdenados_Nombres.java | 2. Casi ordenados — solo nombres (n=222) |
| 3_Invertidos_Numeros.java | 3. Invertidos — solo numeros (n=249) |
| 3_Invertidos_Nombres.java | 3. Invertidos — solo nombres (n=247) |
| 4_Repetidos_Numeros.java | 4. Con repeticiones — solo numeros (n=300) |
| 4_Repetidos_Nombres.java | 4. Con repeticiones — solo nombres (n=250) |
| 5_MitadOrdenados_Numeros.java | 5. Medianamente ordenados — solo numeros (n=500) |
| 5_MitadOrdenados_Nombres.java | 5. Medianamente ordenados — solo nombres (n=250) |

Parcial 3 — listas circulares:

| Archivo | Que es |
|---------|--------|
| 6_ListaCircularSimple.java | Ej. 3 — circular sencilla con eliminarEnPosicion (main con 10 nodos) |
| 7_ListaCircularDoble.java | Ej. 4 — circular doble con eliminarEnPosicionDoble + mostrarLista en ambas direcciones |
| 8_ActualizarNodo.java | Ej. 5 — actualizarValorEnPosicion y actualizarPorDato sin NullPointerException |

Clase 9 — Taller Hash (HashMap vs HashSet). Compilan en local con
`javac NOMBRE.java` y se ejecutan con `java NOMBRE`:

| Archivo | Que es |
|---------|--------|
| 9_MainHashMap.java | Ej. 3.1 — calificaciones (5 registros, consulta, actualización, size()) |
| 9_MainHashSet.java | Ej. 3.2 — correos únicos (5 + 2 duplicados rechazados por add()) |

Códigos guía de la Parte 2 (en `scripts/fuentes/`): `GuiaHashMap.java`
(inventario de 20 productos) y `GuiaHashSet.java` (asistencia de 20
estudiantes).

Clase 10 — Taller Grafos (`10_`, `11_` y `12_` usan `public class Main`:
lista para CodeChef; `Grafos.java` es el ejemplo guía del profesor):

| Archivo | Que es |
|---------|--------|
| Grafos.java | Parte 2 — GrafoRed/MainGrafo: red de campus con BFS desde Rectoría |
| 10_GrafoDFS.java | Ej. 3.1 — red social con recorrerDFS (Stack + HashSet) |
| 11_GrafoDirigido.java | Ej. 3.2 — transferencias dirigidas + existeCaminoDirecto |
| 12_TracertGrafo.java | Traza tracert real de CMD como grafo dirigido |