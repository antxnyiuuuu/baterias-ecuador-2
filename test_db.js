import { db } from './database.js';

console.log("Verificando generación de imágenes...");

const chevrolet = db.find(b => b.id_marca === 'chevrolet');
if (chevrolet) {
    const sail = chevrolet.modelos.find(m => m.nombre === 'Sail');
    if (sail) {
        console.log(`Modelo: ${sail.nombre}`);
        console.log(`Código Batería: ${sail.bateria.codigo}`);
        console.log(`URL Generada: ${sail.bateria.img}`);
    }

    const dmax = chevrolet.modelos.find(m => m.nombre === 'D-Max');
    if (dmax) {
        console.log(`\nModelo: ${dmax.nombre}`);
        console.log(`Código Batería: ${dmax.bateria.codigo}`);
        console.log(`URL Generada: ${dmax.bateria.img}`);
    }
}
