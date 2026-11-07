const CATALOGO = [
  {
    id: 1,
    nombre: "Remera blanca",
    precio: 22000,
    categoria: "Remeras",
    descripcion: "Remera clásica de cuello redondo elaborada en punto liso de algodón peinado. Calce recto y terminaciones reforzadas.",
    talles: ["S", "M", "L"],
    stock: { S: 3, M: 2, L: 2 },
    svg: `<svg viewBox="0 0 200 200" width="100%" height="100%">
      <rect width="200" height="200" fill="#f4f3ef"/>
      <g stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="#ffffff">
        <path d="M 68 45 L 86 52 C 95 60 105 60 114 52 L 132 45 L 160 74 L 142 90 L 130 78 L 130 155 L 70 155 L 70 78 L 58 90 L 40 74 Z"/>
        <path d="M 86 52 C 95 62 105 62 114 52" fill="none"/>
        <line x1="70" y1="150" x2="130" y2="150" stroke="#d5d3cb" stroke-width="1.5"/>
        <line x1="44" y1="84" x2="54" y2="74" stroke="#d5d3cb" stroke-width="1.5"/>
        <line x1="156" y1="84" x2="146" y2="74" stroke="#d5d3cb" stroke-width="1.5"/>
      </g>
    </svg>`
  },
  {
    id: 2,
    nombre: "Remera negra",
    precio: 22000,
    categoria: "Remeras",
    descripcion: "Remera esencial en tono negro profundo confeccionada en algodón suave de alta densidad. Cuello fino y calce regular.",
    talles: ["S", "M", "L"],
    stock: { S: 2, M: 3, L: 1 },
    svg: `<svg viewBox="0 0 200 200" width="100%" height="100%">
      <rect width="200" height="200" fill="#f4f3ef"/>
      <g stroke="#111111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="#1e1e1e">
        <path d="M 68 45 L 86 52 C 95 60 105 60 114 52 L 132 45 L 160 74 L 142 90 L 130 78 L 130 155 L 70 155 L 70 78 L 58 90 L 40 74 Z"/>
        <path d="M 86 52 C 95 62 105 62 114 52" fill="none" stroke="#2c2c2c"/>
        <line x1="70" y1="150" x2="130" y2="150" stroke="#2c2c2c" stroke-width="1.5"/>
      </g>
    </svg>`
  },
  {
    id: 3,
    nombre: "Remera estampada",
    precio: 26000,
    categoria: "Remeras",
    descripcion: "Remera de algodón peinado con serigrafía geométrica sutil en el pecho. Corte relajado y textura liviana.",
    talles: ["S", "M", "L"],
    stock: { S: 1, M: 2, L: 0 },
    svg: `<svg viewBox="0 0 200 200" width="100%" height="100%">
      <rect width="200" height="200" fill="#f4f3ef"/>
      <g stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="#eae8e1">
        <path d="M 68 45 L 86 52 C 95 60 105 60 114 52 L 132 45 L 160 74 L 142 90 L 130 78 L 130 155 L 70 155 L 70 78 L 58 90 L 40 74 Z"/>
        <path d="M 86 52 C 95 62 105 62 114 52" fill="none"/>
        <rect x="88" y="80" width="24" height="24" fill="#242424" stroke="none"/>
        <circle cx="100" cy="92" r="6" fill="#eae8e1" stroke="none"/>
      </g>
    </svg>`
  },
  {
    id: 4,
    nombre: "Sweater",
    precio: 58000,
    categoria: "Tejidos",
    descripcion: "Sweater de punto medio tejido con hilado de mezcla con lana merino. Cuello redondo y acabados acanalados en puños y cintura.",
    talles: ["S", "M", "L"],
    stock: { S: 0, M: 1, L: 0 },
    svg: `<svg viewBox="0 0 200 200" width="100%" height="100%">
      <rect width="200" height="200" fill="#f4f3ef"/>
      <g stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="#b8af9c">
        <path d="M 66 48 L 84 54 C 94 60 106 60 116 54 L 134 48 L 164 88 L 146 100 L 130 82 L 130 158 L 70 158 L 70 82 L 54 100 L 36 88 Z"/>
        <path d="M 84 54 C 94 62 106 62 116 54" fill="none"/>
        <line x1="70" y1="150" x2="130" y2="150" stroke="#8d8472" stroke-width="2"/>
        <line x1="39" y1="85" x2="50" y2="95" stroke="#8d8472" stroke-width="2"/>
        <line x1="161" y1="85" x2="150" y2="95" stroke="#8d8472" stroke-width="2"/>
      </g>
    </svg>`
  },
  {
    id: 5,
    nombre: "Buzo canguro",
    precio: 54000,
    categoria: "Buzos",
    descripcion: "Buzo de frisa de algodón con capucha forrada, cordones planos y bolsillo frontal amplio. Calce confortable.",
    talles: ["S", "M", "L"],
    stock: { S: 2, M: 1, L: 1 },
    svg: `<svg viewBox="0 0 200 200" width="100%" height="100%">
      <rect width="200" height="200" fill="#f4f3ef"/>
      <g stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="#4d5359">
        <path d="M 64 52 L 80 44 C 93 40 107 40 120 44 L 136 52 L 164 92 L 146 104 L 130 86 L 130 158 L 70 158 L 70 86 L 54 104 L 36 92 Z"/>
        <path d="M 85 46 C 88 64 112 64 115 46" fill="#383c40"/>
        <path d="M 80 120 L 120 120 L 124 148 L 76 148 Z" fill="#3f4448"/>
        <line x1="94" y1="60" x2="94" y2="78" stroke="#d5d3cb" stroke-width="1.5"/>
        <line x1="106" y1="60" x2="106" y2="78" stroke="#d5d3cb" stroke-width="1.5"/>
      </g>
    </svg>`
  },
  {
    id: 6,
    nombre: "Buzo cuello redondo",
    precio: 48000,
    categoria: "Buzos",
    descripcion: "Buzo clásico confeccionado en frisa invisible de algodón con cuello canalé y hombros caídos.",
    talles: ["S", "M", "L"],
    stock: { S: 0, M: 2, L: 1 },
    svg: `<svg viewBox="0 0 200 200" width="100%" height="100%">
      <rect width="200" height="200" fill="#f4f3ef"/>
      <g stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="#757d82">
        <path d="M 66 48 L 84 54 C 94 60 106 60 116 54 L 134 48 L 164 88 L 146 102 L 130 84 L 130 158 L 70 158 L 70 84 L 54 102 L 36 88 Z"/>
        <path d="M 84 54 C 94 62 106 62 116 54" fill="none"/>
        <line x1="70" y1="152" x2="130" y2="152" stroke="#585e62" stroke-width="2"/>
      </g>
    </svg>`
  },
  {
    id: 7,
    nombre: "Campera",
    precio: 98000,
    categoria: "Abrigos",
    descripcion: "Campera estructurada en gabardina de algodón esmerilado con cierre metálico completo y bolsillos ojal.",
    talles: ["S", "M", "L"],
    stock: { S: 1, M: 1, L: 1 },
    svg: `<svg viewBox="0 0 200 200" width="100%" height="100%">
      <rect width="200" height="200" fill="#f4f3ef"/>
      <g stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="#2b2d30">
        <path d="M 66 46 L 86 50 L 100 58 L 114 50 L 134 46 L 162 86 L 146 98 L 130 82 L 130 158 L 70 158 L 70 82 L 54 98 L 38 86 Z"/>
        <line x1="100" y1="58" x2="100" y2="158" stroke="#d5d3cb" stroke-width="1.5"/>
        <line x1="76" y1="118" x2="88" y2="128" stroke="#1a1a1a" stroke-width="2"/>
        <line x1="124" y1="118" x2="112" y2="128" stroke="#1a1a1a" stroke-width="2"/>
      </g>
    </svg>`
  },
  {
    id: 8,
    nombre: "Pantalón",
    precio: 62000,
    categoria: "Pantalones",
    descripcion: "Pantalón sastre con pinzas delanteras y calce recto contemporáneo. Tejido de sarga fresca de algodón.",
    talles: ["S", "M", "L"],
    stock: { S: 2, M: 1, L: 1 },
    svg: `<svg viewBox="0 0 200 200" width="100%" height="100%">
      <rect width="200" height="200" fill="#f4f3ef"/>
      <g stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="#3a3d40">
        <path d="M 68 45 L 132 45 L 136 162 L 106 162 L 100 90 L 94 162 L 64 162 Z"/>
        <line x1="68" y1="56" x2="132" y2="56" stroke="#26282a" stroke-width="1.5"/>
        <line x1="100" y1="56" x2="100" y2="84" stroke="#26282a" stroke-width="1.5"/>
      </g>
    </svg>`
  },
  {
    id: 9,
    nombre: "Short",
    precio: 30000,
    categoria: "Pantalones",
    descripcion: "Short liviano con cintura elastizada y cordón interno de ajuste. Confeccionado en poplín suave.",
    talles: ["S", "M", "L"],
    stock: { S: 0, M: 2, L: 0 },
    svg: `<svg viewBox="0 0 200 200" width="100%" height="100%">
      <rect width="200" height="200" fill="#f4f3ef"/>
      <g stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="#525b55">
        <path d="M 68 55 L 132 55 L 136 122 L 106 122 L 100 88 L 94 122 L 64 122 Z"/>
        <line x1="68" y1="66" x2="132" y2="66" stroke="#373e3a" stroke-width="1.5"/>
        <path d="M 97 66 L 95 78 M 103 66 L 105 78" stroke="#d5d3cb" stroke-width="1.5"/>
      </g>
    </svg>`
  },
  {
    id: 10,
    nombre: "Tote bag",
    precio: 18000,
    categoria: "Accesorios",
    descripcion: "Bolso tote amplio de lona de algodón crudo de alto gramaje con correas dobles reforzadas para hombro.",
    talles: ["U"],
    stock: { U: 4 },
    svg: `<svg viewBox="0 0 200 200" width="100%" height="100%">
      <rect width="200" height="200" fill="#f4f3ef"/>
      <g stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="#dfd9c8">
        <path d="M 80 85 L 80 50 C 80 40 120 40 120 50 L 120 85" fill="none"/>
        <path d="M 62 85 L 138 85 L 132 165 L 68 165 Z"/>
        <line x1="62" y1="95" x2="138" y2="95" stroke="#c4bdab" stroke-width="1.5"/>
      </g>
    </svg>`
  }
];
