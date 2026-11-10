const CATALOGO = [
  {
    id: 1,
    nombre: "Campera Snoopy",
    precio: 118000,
    categoria: "Abrigos",
    descripcion: "Campera acolchada de corte holgado con cierre frontal reforzado, cuello alto y parche temático Snoopy en el pecho.",
    talles: ["S", "M", "L"],
    stock: { S: 2, M: 2, L: 1 },
    imagenes: [
      "imagenes/snoopy/Campera/tifn-snoopy-sept261726-4bd249b14eb6b172a517888807779860-1024-1024.webp",
      "imagenes/snoopy/Campera/tifn-snoopy-sept261728-7e3274a9855bbff27517888807772718-1024-1024.webp",
      "imagenes/snoopy/Campera/tifn-snoopy-sept261733-7080e0e60076d0734717888807807736-1024-1024.webp",
      "imagenes/snoopy/Campera/tifn-snoopy-sept261734-e5097398aae2aaa9b217888807806139-1024-1024.webp",
      "imagenes/snoopy/Campera/tifn-snoopy-sept261739-98fb16c1914871f1a817888807784542-1024-1024.webp"
    ],
    svg: `<svg viewBox="0 0 200 200" width="100%" height="100%">
      <rect width="200" height="200" fill="#F5F0E6"/>
      <g stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="#1E3B2F">
        <path d="M 66 46 L 86 50 L 100 58 L 114 50 L 134 46 L 162 86 L 146 98 L 130 82 L 130 158 L 70 158 L 70 82 L 54 98 L 38 86 Z"/>
        <line x1="100" y1="58" x2="100" y2="158" stroke="#7F8C6A" stroke-width="1.5"/>
      </g>
    </svg>`
  },
  {
    id: 2,
    nombre: "Buzo Verde Snoopy",
    precio: 74000,
    categoria: "Buzos",
    descripcion: "Buzo oversized confeccionado en frisa de algodón peinado verde bosque con capucha forrada y estampa serigráfica frontal.",
    talles: ["S", "M", "L"],
    stock: { S: 2, M: 3, L: 1 },
    imagenes: [
      "imagenes/snoopy/buzo verde/tifn-snoopy-sept261545-1b4365fb58348010f017888801373524-1024-1024.webp",
      "imagenes/snoopy/buzo verde/tifn-snoopy-sept261549-59f8901993f37686c417888801386592-1024-1024.webp",
      "imagenes/snoopy/buzo verde/tifn-snoopy-sept261555-9fafb2e63137286aea17888801378847-1024-1024.webp",
      "imagenes/snoopy/buzo verde/tifn-snoopy-sept261556-d1c21e2d3612ca55b317888801383568-1024-1024.webp"
    ],
    svg: `<svg viewBox="0 0 200 200" width="100%" height="100%">
      <rect width="200" height="200" fill="#F5F0E6"/>
      <g stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="#1E3B2F">
        <path d="M 64 52 L 80 44 C 93 40 107 40 120 44 L 136 52 L 164 92 L 146 104 L 130 86 L 130 158 L 70 158 L 70 86 L 54 104 L 36 92 Z"/>
        <path d="M 85 46 C 88 64 112 64 115 46" fill="#13261e"/>
      </g>
    </svg>`
  },
  {
    id: 3,
    nombre: "Buzo Social Snoopy",
    precio: 72000,
    categoria: "Buzos",
    descripcion: "Buzo cuello redondo en frisa pesada premium con estampa gráfica Peanuts Tennis Social Club y ribetes acanalados.",
    talles: ["S", "M", "L"],
    stock: { S: 1, M: 2, L: 2 },
    imagenes: [
      "imagenes/snoopy/buzo social/tifn1-8842325bf4aa33d9ea17775767361379-1024-1024.webp",
      "imagenes/snoopy/buzo social/tifn3-c147fdc5d118cd5ef117775767321482-1024-1024.webp",
      "imagenes/snoopy/buzo social/short-de-bano-mickey-041-af346c57356708a67c16678328842442-1024-1024.webp"
    ],
    svg: `<svg viewBox="0 0 200 200" width="100%" height="100%">
      <rect width="200" height="200" fill="#F5F0E6"/>
      <g stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="#e8ebe8">
        <path d="M 66 48 L 84 54 C 94 60 106 60 116 54 L 134 48 L 164 88 L 146 102 L 130 84 L 130 158 L 70 158 L 70 84 L 54 102 L 36 88 Z"/>
        <circle cx="100" cy="100" r="14" fill="#7F8C6A" stroke="none"/>
      </g>
    </svg>`
  },
  {
    id: 4,
    nombre: "Sweater Snoopy Jacquard",
    precio: 82000,
    categoria: "Tejidos",
    descripcion: "Sweater tejido con hilado suave de textura abrigada, diseño Snoopy en jacquard artesanal y cuello redondo.",
    talles: ["S", "M", "L"],
    stock: { S: 0, M: 2, L: 1 },
    imagenes: [
      "imagenes/snoopy/sweater/tifn-snoopy-2520016-f37064914bb6ecb32b17550150398286-1024-1024.webp",
      "imagenes/snoopy/sweater/short-de-bano-mickey-041-af346c57356708a67c16678328842442-1024-1024.webp"
    ],
    svg: `<svg viewBox="0 0 200 200" width="100%" height="100%">
      <rect width="200" height="200" fill="#F5F0E6"/>
      <g stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="#b8af9c">
        <path d="M 66 48 L 84 54 C 94 60 106 60 116 54 L 134 48 L 164 88 L 146 100 L 130 82 L 130 158 L 70 158 L 70 82 L 54 100 L 36 88 Z"/>
      </g>
    </svg>`
  },
  {
    id: 5,
    nombre: "Remera Joe Cool",
    precio: 36000,
    categoria: "Remeras",
    descripcion: "Remera regular de puro algodón 24/1 con estampa Joe Cool con anteojos de sol y terminación tacto seda.",
    talles: ["S", "M", "L"],
    stock: { S: 3, M: 2, L: 2 },
    imagenes: [
      "imagenes/snoopy/remera 2/tifn-snoopy-sept261654-2e676fac07cf39dde417888803682811-1024-1024.webp",
      "imagenes/snoopy/remera 2/tifn-snoopy-sept261663-2b844d4135b526f87017888803684901-1024-1024.webp",
      "imagenes/snoopy/remera 2/r.webp"
    ],
    svg: `<svg viewBox="0 0 200 200" width="100%" height="100%">
      <rect width="200" height="200" fill="#F5F0E6"/>
      <g stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="#ffffff">
        <path d="M 68 45 L 86 52 C 95 60 105 60 114 52 L 132 45 L 160 74 L 142 90 L 130 78 L 130 155 L 70 155 L 70 78 L 58 90 L 40 74 Z"/>
      </g>
    </svg>`
  },
  {
    id: 6,
    nombre: "Remera Azul Snoopy",
    precio: 36000,
    categoria: "Remeras",
    descripcion: "Remera manga corta azul marino confeccionada en algodón mercerizado con detalle bordado en frente.",
    talles: ["S", "M", "L"],
    stock: { S: 2, M: 2, L: 1 },
    imagenes: [
      "imagenes/snoopy/remera azul/tifn39-84ba0c5980ffedd9a717775763506999-1024-1024.webp",
      "imagenes/snoopy/remera azul/tifn41-3e379b78848b52a8ed17775763513201-1024-1024.webp",
      "imagenes/snoopy/remera azul/tifn42-3e75adbc077298cbb817775763514340-1024-1024.webp",
      "imagenes/snoopy/remera azul/short-de-bano-mickey-031-336c0119ef41b1a53316678328838324-1024-1024.webp"
    ],
    svg: `<svg viewBox="0 0 200 200" width="100%" height="100%">
      <rect width="200" height="200" fill="#F5F0E6"/>
      <g stroke="#111111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="#1b2a38">
        <path d="M 68 45 L 86 52 C 95 60 105 60 114 52 L 132 45 L 160 74 L 142 90 L 130 78 L 130 155 L 70 155 L 70 78 L 58 90 L 40 74 Z"/>
      </g>
    </svg>`
  },
  {
    id: 7,
    nombre: "Pantalón Snoopy Relaxed",
    precio: 68000,
    categoria: "Pantalones",
    descripcion: "Pantalón rústico liviano de calce relajado con cintura elasticada, bolsillos laterales y vivo decorativo.",
    talles: ["S", "M", "L"],
    stock: { S: 1, M: 2, L: 1 },
    imagenes: [
      "imagenes/snoopy/pantalon/tifn-snoopy-2520023-bce045c7aa12fe94b617550228966070-1024-1024.webp",
      "imagenes/snoopy/pantalon/short-de-bano-mickey-031-336c0119ef41b1a53316678328838324-1024-1024.webp"
    ],
    svg: `<svg viewBox="0 0 200 200" width="100%" height="100%">
      <rect width="200" height="200" fill="#F5F0E6"/>
      <g stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="#2d3732">
        <path d="M 68 45 L 132 45 L 136 162 L 106 162 L 100 90 L 94 162 L 64 162 Z"/>
      </g>
    </svg>`
  },
  {
    id: 8,
    nombre: "Short Verde Snoopy",
    precio: 42000,
    categoria: "Pantalones",
    descripcion: "Short deportivo en algodón peinado verde esmeralda con cintura ajustable y parche bordado Snoopy.",
    talles: ["S", "M", "L"],
    stock: { S: 2, M: 2, L: 0 },
    imagenes: [
      "imagenes/snoopy/short verde/tifn-ss26-octubre0812-1-9f0c333fa07f1a0def17599351642096-1024-1024.webp",
      "imagenes/snoopy/short verde/tifn-ss26-octubre0814-d704c0a39da9a098cb17599351636239-1024-1024.webp"
    ],
    svg: `<svg viewBox="0 0 200 200" width="100%" height="100%">
      <rect width="200" height="200" fill="#F5F0E6"/>
      <g stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="#1E3B2F">
        <path d="M 68 55 L 132 55 L 136 122 L 106 122 L 100 88 L 94 122 L 64 122 Z"/>
      </g>
    </svg>`
  },
  {
    id: 9,
    nombre: "Short Blanco Snoopy",
    precio: 42000,
    categoria: "Pantalones",
    descripcion: "Short de verano en tono marfil con cordón interno regulable y diseño minimalista Snoopy en lateral.",
    talles: ["S", "M", "L"],
    stock: { S: 0, M: 2, L: 1 },
    imagenes: [
      "imagenes/snoopy/short blanco/tifn-ss26-octubre0807-c5c8c92e9c6c26436e17599356137187-1024-1024.webp",
      "imagenes/snoopy/short blanco/short-de-bano-mickey-031-336c0119ef41b1a53316678328838324-1024-1024.webp"
    ],
    svg: `<svg viewBox="0 0 200 200" width="100%" height="100%">
      <rect width="200" height="200" fill="#F5F0E6"/>
      <g stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="#f4f5f2">
        <path d="M 68 55 L 132 55 L 136 122 L 106 122 L 100 88 L 94 122 L 64 122 Z"/>
      </g>
    </svg>`
  },
  {
    id: 10,
    nombre: "Bufanda Snoopy Winter",
    precio: 34000,
    categoria: "Accesorios",
    descripcion: "Bufanda de tacto ultrasuave confeccionada con hilado de punto fino y diseño bicolor Snoopy con flecos.",
    talles: ["U"],
    stock: { U: 4 },
    imagenes: [
      "imagenes/snoopy/bufanda/tifn-aw260530-2211809df09f76ad0017775756906141-1024-1024.webp",
      "imagenes/snoopy/bufanda/short-de-bano-mickey-041-af346c57356708a67c16678328842442-1024-1024.webp"
    ],
    svg: `<svg viewBox="0 0 200 200" width="100%" height="100%">
      <rect width="200" height="200" fill="#F5F0E6"/>
      <g stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="#1E3B2F">
        <path d="M 60 70 L 140 70 L 140 100 L 60 100 Z"/>
        <path d="M 115 100 L 140 100 L 135 160 L 110 160 Z"/>
      </g>
    </svg>`
  },
  {
    id: 11,
    nombre: "Mochila Snoopy Urbana",
    precio: 72000,
    categoria: "Accesorios",
    descripcion: "Mochila urbana resistente al agua con compartimento acolchado para notebook de hasta 15 pulgadas y parche Snoopy.",
    talles: ["U"],
    stock: { U: 3 },
    imagenes: [
      "imagenes/snoopy/mochila/tifn-snoopy-sept261751-1fd170e056459a324c17888809612910-1024-1024.webp",
      "imagenes/snoopy/mochila/tifn-snoopy-sept261752-a45fcf14b75b09862717888809614676-1024-1024.webp",
      "imagenes/snoopy/mochila/tifn-snoopy-sept261753-65dbea9d15e842418517888809562780-1024-1024.webp"
    ],
    svg: `<svg viewBox="0 0 200 200" width="100%" height="100%">
      <rect width="200" height="200" fill="#F5F0E6"/>
      <g stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="#1E3B2F">
        <rect x="65" y="60" width="70" height="95" rx="16"/>
        <rect x="75" y="110" width="50" height="35" rx="8" fill="#1E3B2F"/>
      </g>
    </svg>`
  },
  {
    id: 12,
    nombre: "Tote Bag Snoopy",
    precio: 26000,
    categoria: "Accesorios",
    descripcion: "Bolso tote bag en lona de algodón reforzada de alto gramaje con asas dobles y serigrafía artística Snoopy.",
    talles: ["U"],
    stock: { U: 5 },
    imagenes: [
      "imagenes/snoopy/tote/tifn-snoopy-sept261745-a77eef97103508109b17888808941376-1024-1024.webp",
      "imagenes/snoopy/tote/tifn-snoopy-sept261747-26fe8928a84ad9708817888808953174-1024-1024.webp"
    ],
    svg: `<svg viewBox="0 0 200 200" width="100%" height="100%">
      <rect width="200" height="200" fill="#F5F0E6"/>
      <g stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="#dfd9c8">
        <path d="M 80 85 L 80 50 C 80 40 120 40 120 50 L 120 85" fill="none"/>
        <path d="M 62 85 L 138 85 L 132 165 L 68 165 Z"/>
      </g>
    </svg>`
  },
  {
    id: 13,
    nombre: "Gorra Azul Snoopy",
    precio: 28000,
    categoria: "Accesorios",
    descripcion: "Gorra de sarga 100% algodón en color azul petróleo con bordado Snoopy frontal y hebilla trasera metálica regulable.",
    talles: ["U"],
    stock: { U: 4 },
    imagenes: [
      "imagenes/snoopy/gorra azul/tifn-aw260535-8a405cd6f6160f085017775756184136-1024-1024.webp",
      "imagenes/snoopy/gorra azul/tifn-aw260536-4c2bb23a93f9c4ebad17775756183428-1024-1024.webp",
      "imagenes/snoopy/gorra azul/tifn-aw260537-26d9f22a885d17d05817775756179597-1024-1024.webp"
    ],
    svg: `<svg viewBox="0 0 200 200" width="100%" height="100%">
      <rect width="200" height="200" fill="#F5F0E6"/>
      <g stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="#1b2a38">
        <path d="M 70 110 C 70 75 130 75 130 110 Z"/>
        <path d="M 65 110 C 90 110 135 110 155 125 L 75 125 Z"/>
      </g>
    </svg>`
  },
  {
    id: 14,
    nombre: "Gorra Snoopy Vintage",
    precio: 28000,
    categoria: "Accesorios",
    descripcion: "Gorra estilo vintage con panel frontal bordado, visera semi curva y cierre ajustable.",
    talles: ["U"],
    stock: { U: 3 },
    imagenes: [
      "imagenes/snoopy/gorra 2/tifn23-2208f117a9ec833e1517775757173961-1024-1024.webp",
      "imagenes/snoopy/gorra 2/tifn24-3b9a832291b733c41d17775757178808-1024-1024.webp"
    ],
    svg: `<svg viewBox="0 0 200 200" width="100%" height="100%">
      <rect width="200" height="200" fill="#F5F0E6"/>
      <g stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="#1E3B2F">
        <path d="M 70 110 C 70 75 130 75 130 110 Z"/>
        <path d="M 65 110 C 90 110 135 110 155 125 L 75 125 Z"/>
      </g>
    </svg>`
  },
  {
    id: 15,
    nombre: "Medias Snoopy Classic",
    precio: 14000,
    categoria: "Accesorios",
    descripcion: "Medias de media caña en algodón con elastano, puntera sin costuras y bordado distintivo de Snoopy.",
    talles: ["U"],
    stock: { U: 6 },
    imagenes: [
      "imagenes/snoopy/medias/4-919ae77cbe675809e117779116123214-1024-1024.webp",
      "imagenes/snoopy/medias/short-de-bano-mickey-031-336c0119ef41b1a53316678328838324-1024-1024.webp"
    ],
    svg: `<svg viewBox="0 0 200 200" width="100%" height="100%">
      <rect width="200" height="200" fill="#F5F0E6"/>
      <g stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="#ffffff">
        <path d="M 85 50 L 115 50 L 115 115 L 140 135 L 125 155 L 85 115 Z"/>
      </g>
    </svg>`
  },
  {
    id: 16,
    nombre: "Medias Snoopy Tennis",
    precio: 14000,
    categoria: "Accesorios",
    descripcion: "Medias deportivas acanaladas de alta amortiguación con motivo Snoopy jugando al tenis.",
    talles: ["U"],
    stock: { U: 5 },
    imagenes: [
      "imagenes/snoopy/medias 2/racquet-1-7daf9ae255ff0ebb2417550970086691-1024-1024.webp"
    ],
    svg: `<svg viewBox="0 0 200 200" width="100%" height="100%">
      <rect width="200" height="200" fill="#F5F0E6"/>
      <g stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="#7F8C6A">
        <path d="M 85 50 L 115 50 L 115 115 L 140 135 L 125 155 L 85 115 Z"/>
      </g>
    </svg>`
  }
];
