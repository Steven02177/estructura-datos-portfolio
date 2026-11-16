import java.util.*;
import java.lang.*;
import java.io.*;

// Clase auxiliar para el ejemplo
class Producto {
    String nombre;
    double precio;

    public Producto(String nombre, double precio) {
        this.nombre = nombre;
        this.precio = precio;
    }

    @Override
    public String toString() {
        return nombre + " ($" + precio + ")";
    }
}

class MainHash {
    public static void main(String[] args) {
        // 1. Definición e inicialización de la Tabla Hash (HashMap)
        // Llave: String (Código del producto), Valor: Objeto Producto
        java.util.HashMap<String, Producto> mapaInventario = new java.util.HashMap<>();

        // 2. Creación y almacenamiento de objetos directamente en el código (Sin Scanner)
        mapaInventario.put("PROD001", new Producto("Procesador AMD Ryzen 5 5600X", 750000));
        mapaInventario.put("PROD002", new Producto("Procesador Intel Core i7 12700K", 1650000));
        mapaInventario.put("PROD003", new Producto("Monitor Dell 24 Pulgadas FHD", 550000));
        mapaInventario.put("PROD004", new Producto("Tarjeta Grafica NVIDIA RTX 4060 Ti", 2300000));
        mapaInventario.put("PROD005", new Producto("Memoria RAM Corsair Vengeance 16GB DDR4", 220000));
        mapaInventario.put("PROD006", new Producto("Disco Sólido SSD Kingston 1TB NVMe M.2", 280000));
        mapaInventario.put("PROD007", new Producto("Placa Madre ASUS Prime B550M-A", 490000));
        mapaInventario.put("PROD008", new Producto("Fuente de Poder EVGA 600W 80 Plus Bronze", 290000));
        mapaInventario.put("PROD009", new Producto("Chasis Gamer Corsair Carbide Spec-05", 320000));
        mapaInventario.put("PROD010", new Producto("Refrigeracion Liquida Cooler Master ML240", 420000));
        mapaInventario.put("PROD011", new Producto("Teclado Mecanico Logitech G413", 350000));
        mapaInventario.put("PROD012", new Producto("Mouse Optico Razer DeathAdder Essential", 120000));
        mapaInventario.put("PROD013", new Producto("Diadema HyperX Cloud Stinger II", 190000));
        mapaInventario.put("PROD014", new Producto("Tarjeta Grafica AMD Radeon RX 7600", 1450000));
        mapaInventario.put("PROD015", new Producto("Disco Duro Externo Toshibas 2TB", 310000));
        mapaInventario.put("PROD016", new Producto("Memoria RAM Kingston Fury 8GB DDR5", 180000));
        mapaInventario.put("PROD017", new Producto("Pasta Termica Corsair TM30", 450000));
        mapaInventario.put("PROD018", new Producto("Ventilador para Chasis Iceberg 120mm", 35000));
        mapaInventario.put("PROD019", new Producto("Tarjeta de Red Wi-Fi TP-Link Archer PCIE", 115000));
        mapaInventario.put("PROD020", new Producto("Monitor Gamer LG UltraGear 27 Pulgadas", 1150000));

        // 3. Demostración de acceso directo O(1) usando la palabra reservada/llave
        String buscarCodigo = "PROD002";
        
        System.out.println("--- BÚSQUEDA EN LA TABLA HASH ---");
        if (mapaInventario.containsKey(buscarCodigo)) {
            // El mapa encuentra el objeto instantáneamente gracias al Hash de la llave
            Producto encontrado = mapaInventario.get(buscarCodigo);
            System.out.println("Producto encontrado para el codigo [" + buscarCodigo + "]: \n" + encontrado);
        } else {
            System.out.println("El producto con codigo " + buscarCodigo + " no existe.");
        }

        // 4. ¿Qué pasa si insertamos una llave que ya existe?
        System.out.println("\n--- MODIFICACIÓN POR LLAVE ---");
        mapaInventario.put("PROD002", new Producto("Mouse Logic GT Master", 90000));
        System.out.println("Nuevo valor de PROD003: \n" + mapaInventario.get("PROD002"));
        System.out.print("______________________________________________________");
        System.out.println("\n| Cantidad de productos cargados en el inventario: " + mapaInventario.size() + " |");
    }
}
