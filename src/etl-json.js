// Cargar las librerías
const { log } = require("console"); // Para mensajes por consola (terminal)
const fs = require("fs"); // Para lecturas/escrituras de archivos
const path = require("path"); // Para acceso a directorios
const XLSX = require("xlsx"); // Para manejo de archivos Excel (XLS, XLSX)
const createCsvWriter = require('csv-writer').createObjectCsvWriter; // Para generar archivo CSV

// Definir archivo de origen
let rawdata = fs.readFileSync('output/energia.json');
let hoja_json = JSON.parse(rawdata);


// Definir filtros
const REGION = "Metropolitana de Santiago";
const COMMUNES = ["Santiago Centro", "Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", 
                "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", 
                "Recoleta", "Renca", "San Joaquín", "San Miguel", "San Ramón", "Vitacura", "Puente Alto", "Pirque", "San José de Maipo", "Colina", "Lampa", "Tiltil", "San Bernardo", "Buin", "Calera de Tango",
                "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor", ];

// Definir la GEO-Posición por comuna
 /*const GEO = {
    "VALPARAISO": [-33.0438639, -71.6023175],
    "PETORCA": [-32.25123, -70.9408742],
    "LA LIGUA": [-32.4501874, -71.2418708],
    "QUILLOTA": [-33.0156341, -71.5468906],
    "LOS ANDES": [-32.83204, -70.6145295],
    "MARGA MARGA": [-33.0816332, -71.3825493],
};
*/

// Preparar variable donde se mantendrá la transformación, en formato JSON
var output_data = {} // Objeto Arreglo "vacío", es decir sin datos

// Ciclo para recorrer todas las filas de la hoja

for (let idx = 0; idx < hoja_json.length; idx++) {
    /*
    obs: al recorrer cada fila, está se referencia por la variable "idx"
  
    Extraer datos de acuerdo a filtros:
      - REGION
      - COMUNAS
    */
    let region_hoja = hoja_json[idx].REGION; // Obtiene el valor de la columna REGION
    let comuna_hoja = hoja_json[idx].COMUNA; // Obtiene el valor de la columna COMUNA

    // Validar condición que la fila leida coincida con los filtros requeridos.
    // Ya que la variable COMMUNES es un arreglo, se una un método para validar.
    if (region_hoja == REGION && COMMUNES.indexOf(comuna_hoja) > -1) {

        // log("Datos en Hoja para [" + REGION + " - " + COMMUNES + "]", hoja_json[idx]);

        // Obtener el registro desde la variable donde se mantendrá la transformación
        let data_comuna = output_data[comuna_hoja];

        if (data_comuna) {
            // Si existe el registro, se aumentan los contadores
            data_comuna['DATA']['Gasolina 93 $/L'] += hoja_json[idx]['Gasolina 93 $/L'];
            data_comuna['DATA']['Gasolina 95 $/L'] += hoja_json[idx]['Gasolina 95 $/L'];
            data_comuna['DATA']['Gasolina 97 $/L'] += hoja_json[idx]['Gasolina 97 $/L'];
            data_comuna['DATA']['Petróleo Diesel $/L'] += hoja_json[idx]['Petróleo Diesel $/L'];
            
        } else {
            // Al no existir registro, se establece los contadores
            data_comuna = {};
            data_comuna['COMUNA'] = hoja_json[idx]['COMUNA'];
            data_comuna['DATA'] = {};
            data_comuna['DATA']['COMUNA'] = hoja_json[idx]['COMUNA'];
            data_comuna['DATA']['Gasolina 93 $/L'] += hoja_json[idx]['Gasolina 93 $/L'];
            data_comuna['DATA']['Gasolina 95 $/L'] += hoja_json[idx]['Gasolina 95 $/L'];
            data_comuna['DATA']['Gasolina 97 $/L'] += hoja_json[idx]['Gasolina 97 $/L'];
            data_comuna['DATA']['Petróleo Diesel $/L'] += hoja_json[idx]['Petróleo Diesel $/L'];
        }

        // Se almacena en la variable la información procesada
        output_data[comuna_hoja] = data_comuna;
    }
}

// Muestra por consola el contenido de información procesada
log("Data de Salida", output_data);

/*
Generar archivo JSON
*/
// Definir archivo de salida (JSON)
const json_file = path.resolve("output/energia-rm.json");
// Guardar en JSON los datos transformados 
fs.writeFileSync(json_file, JSON.stringify(output_data));