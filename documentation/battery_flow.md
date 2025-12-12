# Guía de Implementación: Carga Dinámica de Imágenes de Baterías

Este documento explica cómo implementar el sistema de carga dinámica de imágenes para baterías en cualquier proyecto web. Este flujo permite generar automáticamente las URLs de las imágenes basándose en los códigos de producto (ej. "NS60", "42"), evitando la necesidad de cargar manualmente cada imagen.

## 1. Concepto General

En lugar de tener una base de datos con URLs estáticas para cada batería, utilizamos una **convención de nombres**. Si sabemos que la batería tiene el código `NS60` y sabemos que en el servidor las imágenes se guardan como `NS60-01-700x700.webp`, podemos construir la URL programáticamente.

## 2. La Función Core (`generarImagenesBateria`)

Esta es la función principal que debes copiar en tu nuevo proyecto. Toma un código (o dos posibles códigos) y devuelve un array con las URLs válidas.

```javascript
/**
 * Genera URLs de imágenes basadas en el código de la batería.
 * @param {string} valorHP - Código principal (ej. "NS60 HP")
 * @param {string} valorFE - Código alternativo/fallback
 * @returns {string[]} Array de URLs de imágenes
 */
function generarImagenesBateria(valorHP, valorFE) {
  // 1. Prioridad: Usa valorHP si existe, si no usa valorFE
  let codigoCrudo = valorHP ? valorHP : valorFE;

  // 2. Validación: Si no hay código, retorna imagen por defecto
  if (!codigoCrudo || codigoCrudo.trim() === "") {
    // URL de una imagen genérica o "placeholder"
    return ['https://bateriasecuador.com/wp-content/uploads/2023/09/42-01-700x700.webp'];
  }

  // 3. Sanitización: Limpia el código para que coincida con el nombre del archivo
  // Ejemplo: Convierte "NS60 HP" -> "NS60"
  let codigo = codigoCrudo.toString()
    .replace(/HP/gi, '') // Elimina "HP" (case insensitive)
    .trim();             // Elimina espacios al inicio/final

  // 4. Construcción de URLs
  // Ajusta la URL base según donde estén alojadas tus imágenes
  const baseUrl = "https://bateriasecuador.com/wp-content/uploads/2023/09";
  
  return [
    `${baseUrl}/${codigo}-01-700x700.webp`, // Vista frontal
    `${baseUrl}/${codigo}-02-700x700.webp`  // Vista lateral/otra
  ];
}
```

## 3. Integración con tus Datos

Para usar esto en tu aplicación, necesitas "inyectar" estas imágenes en tus datos antes de usarlos. Aquí tienes un ejemplo de cómo procesar tu lista de productos (raw data) para agregarle las imágenes automáticamente.

### Ejemplo de Estructura de Datos (Raw)

Supongamos que tienes esto en tu base de datos o archivo JSON:

```javascript
const rawData = [
  {
    id: 1,
    modelo: "Chevrolet Sail",
    bateria: {
      codigo: "42 / NS60", // Nota que a veces vienen códigos compuestos
      specs: "12V 45Ah"
    }
  }
];
```

### Lógica de Mapeo (Transformación)

Usa este código para crear tu base de datos final (`db`) con las imágenes ya listas:

```javascript
export const db = rawData.map(item => {
  // 1. Obtener el código limpio
  let code = item.bateria?.codigo || '';
  let cleanCode = code;
  
  // Si el código es compuesto (ej: "42 / NS60"), tomamos la primera parte
  // que es la que suele coincidir con el nombre del archivo.
  if (code && code.includes(' / ')) {
    cleanCode = code.split(' / ')[0];
  }

  // 2. Generar las imágenes
  const images = generarImagenesBateria(cleanCode, null);

  // 3. Retornar el objeto con la nueva propiedad 'img' en la batería
  return {
    ...item,
    bateria: {
      ...item.bateria,
      // Asignamos la primera imagen generada
      img: images.length > 0 ? images[0] : 'url_imagen_por_defecto.jpg'
    }
  };
});
```

## 4. Requisitos para que funcione

1.  **Nombres de Archivos en el Servidor**: Las imágenes en tu servidor (o en Baterías Ecuador) deben seguir estrictamente el patrón: `CODIGO-01-700x700.webp`.
    *   Si el código es `42`, el archivo debe ser `42-01-700x700.webp`.
2.  **Códigos Limpios**: Tu función de limpieza (`replace`, `trim`) debe ser capaz de dejar el código exactamente como está en el nombre del archivo.

## 5. Uso en el Frontend

Una vez que tienes tu objeto `db` procesado, usarlo es muy simple:

```javascript
// En tu componente o función de renderizado
const producto = db[0]; // Primer producto
const imgElement = document.createElement('img');

// La propiedad .img ya contiene la URL correcta generada automáticamente
imgElement.src = producto.bateria.img; 

// Es buena práctica añadir un manejo de errores por si la imagen no existe
imgElement.onerror = function() {
    this.src = './assets/img/bateria_default.png';
};

document.body.appendChild(imgElement);
```
