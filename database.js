// Battery Database - Vehicle Information

// Función para generar URLs de imágenes de baterías
function generarImagenesBateria(valorHP, valorFE) {
  // 1. Prioridad y Fallback
  let codigoCrudo = valorHP ? valorHP : valorFE;

  // 2. Validación de "Consultar"
  if (!codigoCrudo || codigoCrudo.trim() === "") {
    return ['https://bateriasecuador.com/wp-content/uploads/2023/09/42-01-700x700.webp'];
  }

  // 3. Sanitización (Limpiar "HP" y espacios)
  // Ejemplo: "NS60 HP" -> "NS60"
  let codigo = codigoCrudo.toString()
    .replace(/HP/gi, '') // Quita "HP" o "hp"
    .trim();             // Quita espacios extra

  // 4. Retornar Array de URLs
  return [
    `https://bateriasecuador.com/wp-content/uploads/2023/09/${codigo}-01-700x700.webp`,
    `https://bateriasecuador.com/wp-content/uploads/2023/09/${codigo}-02-700x700.webp`
  ];
}

const rawData = [
  {
    "id_marca": "chevrolet",
    "nombre_marca": "Chevrolet",
    "logo": "./images/chevrolet.png",
    "modelos": [
      {
        "nombre": "Sail",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://www.chevrolet.cl/content/dam/chevrolet/south-america/chile/espanol/index/cars/2025-sail/mov/sail-negro-2000x1000.jpg?imwidth=1200",
        "bateria": {
          "codigo": "42 / NS60",
          "specs": "12V 45Ah - Poste Izq",
        }
      },
      {
        "nombre": "D-Max",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTarkfqZHQYrjzq2XqWqdvHVhResCMFTw4kRA&s",
        "bateria": {
          "codigo": "27 / N70",
          "specs": "12V 80Ah - Poste Der (Inv)",
        }
      },
      {
        "nombre": "Spark GT",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS3K9GjpZD5bvv-uP_qQWnzb8kwu0vzC3XzA&s",
        "bateria": {
          "codigo": "42 / NS40",
          "specs": "12V 40Ah - Poste Izq",
        }
      },
      {
        "nombre": "Onix",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMyfMuM-cjfBLfDi2azVnF6W8yO0OXXIN5hw&s",
        "bateria": {
          "codigo": "47 / L2",
          "specs": "12V 60Ah - Poste Der",
        }
      },
      {
        "nombre": "Cruze",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6GprE7xOBFZjv5t1veijbVjMGWdo9gTFUhw&s",
        "bateria": {
          "codigo": "47 / L2",
          "specs": "12V 60Ah - Poste Der",
        }
      },
      {
        "nombre": "Trailblazer",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://www.assachevrolet.com.ec/content/dam/chevrolet/sa/ec/es/master/index/models/trailblazer/myr-june-2025/2-colorizer/2025-jelly-07.jpg?imwidth=1920",
        "bateria": {
          "codigo": "27 / N70",
          "specs": "12V 85Ah - Poste Der (Inv)",
        }
      },
      {
        "nombre": "Equinox",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://di-uploads-pod1.dealerinspire.com/coxchevy/uploads/2017/06/Equinox-Silver-Ice.jpeg",
        "bateria": {
          "codigo": "48 / L3",
          "specs": "12V 70Ah - Poste Der",
        }
      }
    ]
  },
  {
    "id_marca": "kia",
    "nombre_marca": "Kia",
    "logo": "./images/Kia.png",
    "modelos": [
      {
        "nombre": "Sportage R",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8xqNZ3cMp3Qi-K1LqW3u5ESAucep2NF69Mw&s",
        "bateria": {
          "codigo": "48 / L3",
          "specs": "12V 70Ah - Poste Der (Hundido)",
        }
      },
      {
        "nombre": "Picanto",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCY7EPtmfpOr-ZmH7HD3M1o83WznR5PIpj-A&s",
        "bateria": {
          "codigo": "NS40",
          "specs": "12V 35Ah - Poste Izq (Fino)",
        }
      },
      {
        "nombre": "Soluto",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://acroadtrip.blob.core.windows.net/catalogo-imagenes/xl/RT_V_610583d7e33c48b99aef93a5b0d5c717.jpg",
        "bateria": {
          "codigo": "47 / L2",
          "specs": "12V 60Ah - Poste Der",
        }
      },
      {
        "nombre": "Rio",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://personaliza.kiaecuador.com.ec/api/ImgMvc/VmVrImg?v=157",
        "bateria": {
          "codigo": "47 / L2",
          "specs": "12V 60Ah - Poste Der",
        }
      },
      {
        "nombre": "Sorento",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://d1i6h2eptoatah.cloudfront.net/U-684/U-684_1.JPG",
        "bateria": {
          "codigo": "27 / N70",
          "specs": "12V 85Ah - Poste Der (Inv)",
        }
      },
      {
        "nombre": "Cerato",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvrxFhYMrqpMyhKiU7ZxN8nNVDV5ssK_Ne7w&s",
        "bateria": {
          "codigo": "47 / L2",
          "specs": "12V 60Ah - Poste Der",
        }
      }
    ]
  },
  {
    "id_marca": "toyota",
    "nombre_marca": "Toyota",
    "logo": "./images/toyota.jpg",
    "modelos": [
      {
        "nombre": "Corolla",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://d1i6h2eptoatah.cloudfront.net/CF-1038/CF-1038_1.JPG",
        "bateria": {
          "codigo": "47 / L2",
          "specs": "12V 60Ah - Poste Der",
        }
      },
      {
        "nombre": "Camry",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://media.zigcdn.com/media/model/2024/Dec/toyota-camry_600x400.jpg",
        "bateria": {
          "codigo": "47 / L2",
          "specs": "12V 60Ah - Poste Der",
        }
      },
      {
        "nombre": "Prius",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://www.iihs.org/cdn-cgi/image/width=636/api/ratings/model-year-images/2086/",
        "bateria": {
          "codigo": "NS60",
          "specs": "12V 50Ah - Poste Izq",
        }
      },
      {
        "nombre": "Yaris",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://www.toyotaperu.com.pe/sites/default/files/360/yaris25_blanco040_00.jpg",
        "bateria": {
          "codigo": "NS40",
          "specs": "12V 40Ah - Poste Izq",
        }
      },
      {
        "nombre": "RAV4",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://media.ed.edmunds-media.com/toyota/rav4-hybrid/2025/oem/2025_toyota_rav4-hybrid_4dr-suv_se_fq_oem_1_1600.jpg",
        "bateria": {
          "codigo": "48 / L3",
          "specs": "12V 70Ah - Poste Der",
        }
      },
      {
        "nombre": "Corolla Cross",
        "anios": ["2020", "2021", "2022", "2023", "2024"],
        "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJLuioU0bs0qx_kj-aKTbuAAX3FyleT-odJQ&s",
        "bateria": {
          "codigo": "47 / L2",
          "specs": "12V 60Ah - Poste Der",
        }
      },
      {
        "nombre": "C-HR",
        "anios": ["2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://www.diariomotor.com/imagenes/2019/10/toyota-c-hr-gr-sport-p.jpg?class=XL",
        "bateria": {
          "codigo": "47 / L2",
          "specs": "12V 60Ah - Poste Der",
        }
      },
      {
        "nombre": "Highlander",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://media.ed.edmunds-media.com/toyota/grand-highlander/2026/oem/2026_toyota_grand-highlander_4dr-suv_platinum_fq_oem_1_600.jpg",
        "bateria": {
          "codigo": "27 / N70",
          "specs": "12V 85Ah - Poste Der (Inv)",
        }
      },
      {
        "nombre": "Hilux",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://alborautostoyota.com/wp-content/uploads/2025/09/Hilux.jpg",
        "bateria": {
          "codigo": "27 / N70",
          "specs": "12V 80Ah - Poste Der (Inv)",
        }
      },
      {
        "nombre": "Fortuner",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://acroadtrip.blob.core.windows.net/catalogo-imagenes/s/RT_V_18a61d0d9d96461091778441cb18304b.jpg",
        "bateria": {
          "codigo": "27 / N70",
          "specs": "12V 85Ah - Poste Der (Inv)",
        }
      },
      {
        "nombre": "Land Cruiser",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://kobemotor.es/wp-content/uploads/2025/02/Land-Cruiser-VX-L-Perfil.webp",
        "bateria": {
          "codigo": "27 / N70",
          "specs": "12V 100Ah - Poste Der (Inv)",
        }
      }
    ]
  },
  {
    "id_marca": "hyundai",
    "nombre_marca": "Hyundai",
    "logo": "./images/hyundai.png",
    "modelos": [
      {
        "nombre": "Tucson",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://www.hyundai.com.ec/static/media/3.0dd887c3ff075eb61799.webp",
        "bateria": {
          "codigo": "47 / L2",
          "specs": "12V 60Ah - Poste Der (Hundido)",
        }
      },
      {
        "nombre": "Creta",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://www.autodato.com/wp-content/uploads/2015/06/Hyundai-Creta-21.jpg.webp",
        "bateria": {
          "codigo": "47 / L2",
          "specs": "12V 60Ah - Poste Der",
        }
      },
      {
        "nombre": "Elantra",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://citymagazine.si/wp-content/uploads/2024/02/2024-Hyundai-Elantra-004.jpg",
        "bateria": {
          "codigo": "47 / L2",
          "specs": "12V 60Ah - Poste Der",
        }
      },
      {
        "nombre": "Santa Fe",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://www.univision.com/_next/image?url=https%3A%2F%2Fst1.uvnimg.com%2F30%2F2e%2F756101da440e8ea79235962bf7f1%2Fhyundai-santa-fe-2019-1600-01-1.jpg&w=1280&q=75",
        "bateria": {
          "codigo": "27 / N70",
          "specs": "12V 85Ah - Poste Der (Inv)",
        }
      },
      {
        "nombre": "Accent",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://acroadtrip.blob.core.windows.net/catalogo-imagenes/m/RT_V_175e8c1593744170b8d3664a6dd69015.webp",
        "bateria": {
          "codigo": "47 / L2",
          "specs": "12V 60Ah - Poste Der",
        }
      }
    ]
  },
  {
    "id_marca": "mazda",
    "nombre_marca": "Mazda",
    "logo": "./images/mazda.png",
    "modelos": [
      {
        "nombre": "Mazda 3",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://cdn.wheel-size.com/thumbs/7f/f2/7ff29b051c83eeb29cb8c09a707bb39b.jpg",
        "bateria": {
          "codigo": "24 / NS60L",
          "specs": "12V 60Ah - Poste Izq",
        }
      },
      {
        "nombre": "BT-50",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://www.maresacenter.com/hubfs/MARESA%20CENTER/Web/Modelos/BT-50/2021-08-18-bt50-ltd-4wd-dc-red-volcano-mc-1.jpg",
        "bateria": {
          "codigo": "27 / N70",
          "specs": "12V 90Ah - Poste Der (Inv)",
        }
      },
      {
        "nombre": "CX-5",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://acroadtrip.blob.core.windows.net/catalogo-imagenes/xl/RT_V_3eb836d3741b4f24a1641202bd150f4f.webp",
        "bateria": {
          "codigo": "48 / L3",
          "specs": "12V 70Ah - Poste Der",
        }
      },
      {
        "nombre": "CX-9",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://noticias.pro.pvt.coches.com/wp-content/uploads/2014/11/CX-9-newspress-2.jpg?force_format=original&w=1575&h=1089",
        "bateria": {
          "codigo": "27 / N70",
          "specs": "12V 85Ah - Poste Der (Inv)",
        }
      }
    ]
  },
  {
    "id_marca": "nissan",
    "nombre_marca": "Nissan",
    "logo": "./images/nissan.png",
    "modelos": [
      {
        "nombre": "Sentra",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbCczcKKZnBWbQsic47S58WKxCWd3j7NQZ3w&s",
        "bateria": {
          "codigo": "47 / L2",
          "specs": "12V 60Ah - Poste Der",
        }
      },
      {
        "nombre": "Versa",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://res.cloudinary.com/wpchile/image/upload//w_700,f_auto,q_auto:good/kovacsecrm/bms_producto_mutimedia/1474/Layer-06.jpg",
        "bateria": {
          "codigo": "47 / L2",
          "specs": "12V 60Ah - Poste Der",
        }
      },
      {
        "nombre": "X-Trail",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShV48THvzziYxYju1cGTXZPnK5M7aCaCXaGQ&s",
        "bateria": {
          "codigo": "48 / L3",
          "specs": "12V 70Ah - Poste Der",
        }
      },
      {
        "nombre": "Frontier",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://www.nissan-cdn.net/content/dam/Nissan/ec/vehicles/frontier21/vehicles/frontier/MY21/VAP/frontier_seta_3_4_24.jpg.ximg.l_12_m.smart.jpg",
        "bateria": {
          "codigo": "27 / N70",
          "specs": "12V 80Ah - Poste Der (Inv)",
        }
      }
    ]
  },
  {
    "id_marca": "ford",
    "nombre_marca": "Ford",
    "logo": "./images/ford.png",
    "modelos": [
      {
        "nombre": "Focus",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRfRNcH9FrNqiOPFfxJ-1agmkUc1RpykzCgQ&s",
        "bateria": {
          "codigo": "47 / L2",
          "specs": "12V 60Ah - Poste Der",
        }
      },
      {
        "nombre": "Fiesta",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUa7UbSQ0Fjx5MGlUvCk-0Q9xbU1stioqt5A&s",
        "bateria": {
          "codigo": "NS40",
          "specs": "12V 40Ah - Poste Izq",
        }
      },
      {
        "nombre": "Escape",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ6lRErYSLdLkdGEPq-prrTRHVuY1vzmfI8w&s",
        "bateria": {
          "codigo": "48 / L3",
          "specs": "12V 70Ah - Poste Der",
        }
      },
      {
        "nombre": "Ranger",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://live.dealer-asset.co/images/br1168/product/paintSwatch/vehicle/ford-peru-ranger-raptor-color-gris-piedra.png?s=1024",
        "bateria": {
          "codigo": "27 / N70",
          "specs": "12V 80Ah - Poste Der (Inv)",
        }
      }
    ]
  },
  {
    "id_marca": "volkswagen",
    "nombre_marca": "Volkswagen",
    "logo": "./images/Volkswagen.png",
    "modelos": [
      {
        "nombre": "Jetta",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://images.hgmsites.net/lrg/2025-volkswagen-jetta-autobahn-manual-angular-front-exterior-view_100959788_l.webp",
        "bateria": {
          "codigo": "47 / L2",
          "specs": "12V 60Ah - Poste Der",
        }
      },
      {
        "nombre": "Golf",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://automagazine.ec/wp-content/uploads/2019/10/Volkswagen-Golf-8.png",
        "bateria": {
          "codigo": "47 / L2",
          "specs": "12V 60Ah - Poste Der",
        }
      },
      {
        "nombre": "Tiguan",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://www.autonocion.com/wp-content/uploads/2024/01/Tiguan1-1130x594.jpg",
        "bateria": {
          "codigo": "48 / L3",
          "specs": "12V 70Ah - Poste Der",
        }
      },
      {
        "nombre": "Amarok",
        "anios": ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        "img": "https://assets.volkswagen.com/is/image/volkswagenag/Highline-4?Zml0PWNyb3AsMSZmbXQ9cG5nJndpZD02NjYmYWxpZ249MC4wMCwwLjAwJmJmYz1vZmYmMGVmNg==",
        "bateria": {
          "codigo": "27 / N70",
          "specs": "12V 80Ah - Poste Der (Inv)",
        }
      }
    ]
  }
];
// Process rawData to generate images and export as db
export const db = rawData.map(brand => ({
  ...brand,
  modelos: brand.modelos.map(model => {
    // Extract code for image generation
    // Logic: If code has " / ", take the FIRST part (e.g., "42 / NS60" -> "42")
    // because the numeric code corresponds to the image filename on the server.
    let code = model.bateria?.codigo || '';
    let cleanCode = code;
    if (code && code.includes(' / ')) {
      cleanCode = code.split(' / ')[0];
    }

    // Generate images
    const images = generarImagenesBateria(cleanCode, null);

    return {
      ...model,
      bateria: {
        ...model.bateria,
        img: images.length > 0 ? images[0] : model.bateria.img
      }
    };
  })
}));
