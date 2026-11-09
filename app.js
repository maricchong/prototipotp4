const RUTA_ADMIN = '#/p/k7x2m';
const MINIMO_CUOTAS = 150000;
const TASA_DESCUENTO = 0.15;

const CLAVE_AJUSTES = 'tienda_ajustes';
const CLAVE_SESION = 'tienda_sesion';
const CLAVE_CARRITO = 'tienda_cart';
const CLAVE_CUPON = 'tienda_cupon';
const CLAVE_CHECKOUT = 'tienda_checkout';
const CLAVE_EVENTOS = 'tienda_ev';
const CLAVE_HISTORIAL = 'tienda_historial';
const CLAVE_TEMPORIZADOR = 'tienda_reserva_tiempo';

const CODIGOS = [
  'k01', 'k02', 'k04', 'k07', 'k09',
  'k10', 'k11', 'k12', 'k13', 'k14',
  'k15', 'k17', 'k18', 'k20', 'k23',
  'k25', 'k26', 'k28', 'k31', 'k32', 'k33'
];

const PRESETS = {
  activo: ['k01', 'k02', 'k04', 'k07', 'k09', 'k10', 'k11', 'k12', 'k13', 'k14', 'k15', 'k17', 'k18', 'k20', 'k23', 'k25', 'k26', 'k28', 'k31', 'k32', 'k33'],
  s0: [],
  s1: ['k01', 'k02', 'k20', 'k23', 'k09'],
  s2: ['k10', 'k11', 'k12', 'k13', 'k14'],
  s3: ['k15', 'k17', 'k18', 'k25', 'k26'],
  s4: ['k04', 'k28', 'k09', 'k01']
};

const ETIQUETAS_CODIGOS = {
  k01: 'Mínimo de cuotas no visible en catálogo y opciones inactivas sin aviso',
  k02: 'Mínimo de cuotas únicamente en indicador de información',
  k04: 'Código de descuento informado en franja inferior',
  k07: 'Disponibilidad no indicada en detalle de producto',
  k09: 'Inactivación de cuotas al aplicar descuento',
  k10: 'Paso intermedio con sugerencias complementarias',
  k11: 'Reiteración de correo en pantalla de revisión',
  k12: 'Reinicio de método de pago al modificar envío',
  k13: 'Reinicio de código promocional al retroceder navegación',
  k14: 'Consulta obligatoria de medidas antes de elegir talle',
  k15: 'Selección inicial en talle S con validación en ficha y carrito',
  k17: 'Inversión de jerarquía en botones de confirmación',
  k18: 'Reinicio de talle al modificar cantidad en carrito',
  k20: 'Condiciones de cuotas en panel desplegable inferior',
  k23: 'Lista de cuotas con desplazamiento vertical interno',
  k25: 'Aviso sobrepuesto previo a confirmar pedido',
  k26: 'Estilo atenuado en botones principales de acción',
  k28: 'Validación estricta de código de descuento en minúsculas',
  k31: 'Reserva de stock con temporizador discreto de 7 minutos',
  k32: 'Botón volver en checkout con redirección a catálogo',
  k33: 'Casilla de suscripción combinada con aceptación de condiciones requerida'
};

const METODOS_ENVIO = [
  { id: 'domicilio', nombre: 'Envío a domicilio', costo: 4500, plazo: '3 a 5 días hábiles' },
  { id: 'express', nombre: 'Envío express', costo: 8000, plazo: '24 a 48 h' },
  { id: 'sucursal', nombre: 'Retiro en sucursal', costo: 0, plazo: '48 h' }
];

let exposicionesRegistradas = new Set();
let ultimaRuta = '';
let timestampUltimaRuta = Date.now();
let guiaConsultada = false;
let categoriaFiltroActiva = 'Todos';

function leerStorage(clave, valorPorDefecto) {
  try {
    const valor = localStorage.getItem(clave);
    return valor ? JSON.parse(valor) : valorPorDefecto;
  } catch (e) {
    return valorPorDefecto;
  }
}

function escribirStorage(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch (e) {}
}

function obtenerAjustes() {
  const guardado = leerStorage(CLAVE_AJUSTES, null);
  const inicial = {
    preset: 'activo',
    perfil: 'humano',
    k01: true,
    k02: true,
    k04: true,
    k07: true,
    k09: true,
    k10: true,
    k11: true,
    k12: true,
    k13: true,
    k14: true,
    k15: true,
    k17: true,
    k18: true,
    k20: true,
    k23: true,
    k25: true,
    k26: true,
    k28: true,
    k31: true,
    k32: true,
    k33: true
  };
  if (guardado) {
    return Object.assign({}, inicial, guardado);
  }
  escribirStorage(CLAVE_AJUSTES, inicial);
  return inicial;
}

function guardarAjustes(ajustes) {
  escribirStorage(CLAVE_AJUSTES, ajustes);
}

function obtenerSesion() {
  let sesion = leerStorage(CLAVE_SESION, null);
  if (!sesion) {
    const ajustes = obtenerAjustes();
    sesion = {
      id: 's_' + Math.random().toString(36).substring(2, 8),
      inicio: Date.now(),
      perfil: ajustes.perfil || 'humano',
      preset: ajustes.preset || 'activo',
      codigos: CODIGOS.filter(k => ajustes[k])
    };
    escribirStorage(CLAVE_SESION, sesion);
  }
  return sesion;
}

function iniciarNuevaSesion(presetClave = 'activo', perfil = 'humano', codigosSeleccionados = null) {
  const ajustes = {
    preset: presetClave,
    perfil: perfil
  };
  CODIGOS.forEach(k => {
    if (codigosSeleccionados) {
      ajustes[k] = codigosSeleccionados.includes(k);
    } else if (PRESETS[presetClave]) {
      ajustes[k] = PRESETS[presetClave].includes(k);
    } else {
      ajustes[k] = false;
    }
  });
  guardarAjustes(ajustes);

  const nuevaSesion = {
    id: 's_' + Math.random().toString(36).substring(2, 8),
    inicio: Date.now(),
    perfil: perfil,
    preset: presetClave,
    codigos: CODIGOS.filter(k => ajustes[k])
  };
  escribirStorage(CLAVE_SESION, nuevaSesion);
  escribirStorage(CLAVE_CARRITO, []);
  escribirStorage(CLAVE_CUPON, null);
  escribirStorage(CLAVE_CHECKOUT, {
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    cp: '',
    envio: 'domicilio',
    pago: 'debito',
    cuotas: '1'
  });
  exposicionesRegistradas = new Set();
  guiaConsultada = false;
  return nuevaSesion;
}

function registrarEvento(tipo, detalle = '', ref = '') {
  const sesion = obtenerSesion();
  const eventos = leerStorage(CLAVE_EVENTOS, []);
  const evento = {
    s: sesion.id,
    t: Date.now(),
    p: window.location.hash || '#/',
    tipo: tipo,
    d: detalle,
    ref: ref
  };
  eventos.push(evento);
  escribirStorage(CLAVE_EVENTOS, eventos);
}

function registrarExposicion(ref, detalle = '') {
  if (exposicionesRegistradas.has(ref)) return;
  exposicionesRegistradas.add(ref);
  registrarEvento('exposicion', detalle, ref);
}

function observarExposicion(elemento, ref, detalle = 'Visualización directa') {
  if (!elemento) return;
  if ('IntersectionObserver' in window) {
    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach(entrada => {
        if (entrada.isIntersecting && entrada.intersectionRatio >= 0.5) {
          registrarExposicion(ref, detalle);
          observador.disconnect();
        }
      });
    }, { threshold: 0.5 });
    observador.observe(elemento);
  }
}

function obtenerCarrito() {
  return leerStorage(CLAVE_CARRITO, []);
}

function obtenerTiempoReserva() {
  const carrito = obtenerCarrito();
  if (carrito.length === 0) {
    escribirStorage(CLAVE_TEMPORIZADOR, null);
    return null;
  }
  let tiempoFin = leerStorage(CLAVE_TEMPORIZADOR, null);
  const ahora = Date.now();
  if (!tiempoFin || typeof tiempoFin !== 'number') {
    tiempoFin = ahora + 7 * 60 * 1000;
    escribirStorage(CLAVE_TEMPORIZADOR, tiempoFin);
  }
  return tiempoFin;
}

function renderIndicadorTemporizador() {
  const carrito = obtenerCarrito();
  if (carrito.length === 0) return '';
  const tiempoFin = obtenerTiempoReserva();
  if (!tiempoFin) return '';
  const restanteMs = Math.max(0, tiempoFin - Date.now());
  const totalSeg = Math.floor(restanteMs / 1000);
  const min = Math.floor(totalSeg / 60);
  const seg = totalSeg % 60;
  const textoTiempo = `${min < 10 ? '0' : ''}${min}:${seg < 10 ? '0' : ''}${seg}`;
  return `
    <div class="temporizador-reserva-discreto" id="indicador-reserva-stock">
      <span class="icono-reloj-discreto">⏱</span>
      <span>Tus prendas están reservadas por <strong id="contador-tiempo-reserva">${textoTiempo}</strong> min</span>
    </div>
  `;
}

function iniciarTemporizadorReserva() {
  if (window.intervaloReserva) {
    clearInterval(window.intervaloReserva);
  }
  window.intervaloReserva = setInterval(() => {
    const carrito = obtenerCarrito();
    if (carrito.length === 0) return;
    const tiempoFin = obtenerTiempoReserva();
    if (!tiempoFin) return;
    const restanteMs = tiempoFin - Date.now();
    if (restanteMs <= 0) {
      clearInterval(window.intervaloReserva);
      guardarCarrito([]);
      escribirStorage(CLAVE_TEMPORIZADOR, null);
      registrarEvento('reserva_vencida', 'Stock liberado por temporizador de 7 min', 'k31');
      const hash = window.location.hash || '#/';
      if (hash === '#/carrito' || hash.startsWith('#/checkout/')) {
        window.location.hash = '#/carrito';
        renderCarrito();
      }
      return;
    }
    const elContador = document.getElementById('contador-tiempo-reserva');
    if (elContador) {
      const totalSeg = Math.floor(restanteMs / 1000);
      const min = Math.floor(totalSeg / 60);
      const seg = totalSeg % 60;
      elContador.textContent = `${min < 10 ? '0' : ''}${min}:${seg < 10 ? '0' : ''}${seg}`;
    }
  }, 1000);
}

function guardarCarrito(carrito) {
  escribirStorage(CLAVE_CARRITO, carrito);
  actualizarContadorBolsa();
  if (carrito.length === 0) {
    escribirStorage(CLAVE_TEMPORIZADOR, null);
  } else {
    const tiempoAct = leerStorage(CLAVE_TEMPORIZADOR, null);
    if (!tiempoAct || typeof tiempoAct !== 'number' || tiempoAct < Date.now()) {
      escribirStorage(CLAVE_TEMPORIZADOR, Date.now() + 7 * 60 * 1000);
    }
  }
}

function obtenerCupon() {
  return leerStorage(CLAVE_CUPON, null);
}

function guardarCupon(cupon) {
  escribirStorage(CLAVE_CUPON, cupon);
}

function obtenerCheckout() {
  return leerStorage(CLAVE_CHECKOUT, {
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    cp: '',
    envio: 'domicilio',
    pago: 'debito',
    cuotas: '1'
  });
}

function guardarCheckout(datos) {
  escribirStorage(CLAVE_CHECKOUT, datos);
}

function formatearMoneda(valor) {
  return '$ ' + Number(valor || 0).toLocaleString('es-AR');
}

function calcularSubtotal(carrito) {
  return carrito.reduce((acc, item) => {
    const prod = CATALOGO.find(p => p.id === item.id);
    return acc + (prod ? prod.precio * item.cantidad : 0);
  }, 0);
}

function calcularDescuento(subtotal, cupon) {
  if (!cupon) return 0;
  return Math.round(subtotal * TASA_DESCUENTO);
}

function obtenerCostoEnvio(envioId) {
  const metodo = METODOS_ENVIO.find(m => m.id === envioId);
  return metodo ? metodo.costo : 0;
}

function actualizarContadorBolsa() {
  const contador = document.getElementById('contador-bolsa');
  if (!contador) return;
  const carrito = obtenerCarrito();
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  contador.textContent = totalItems;
}

function actualizarBannerSuperior() {
  const franja = document.getElementById('franja-aviso');
  if (franja) {
    franja.textContent = 'HASTA 6 CUOTAS SIN INTERÉS EN TODA LA COLECCIÓN CÁPSULA';
  }
}

function verificarParametroUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    const parametroS = params.get('s');
    if (parametroS && PRESETS[parametroS] !== undefined) {
      iniciarNuevaSesion(parametroS);
      const urlLimpia = window.location.pathname + window.location.hash;
      window.history.replaceState(null, '', urlLimpia);
    }
  } catch (e) {}
}

function renderCatalogo() {
  const vista = document.getElementById('vista-principal');

  const categorias = ['Todos', 'Remeras', 'Buzos', 'Abrigos', 'Pantalones', 'Accesorios'];

  const productosFiltrados = categoriaFiltroActiva === 'Todos'
    ? CATALOGO
    : CATALOGO.filter(p => p.categoria === categoriaFiltroActiva);

  let html = `
    <div class="banner-destacado-cuotas">
      <span class="banner-destacado-etiqueta">TEMPORADA 2026 · BENEFICIO ESPECIAL</span>
      <h1 class="banner-destacado-titulo">HASTA 6 CUOTAS SIN INTERÉS</h1>
      <p class="banner-destacado-subtitulo">Aprovechá financiación en 3 y 6 cuotas sin interés con tarjetas bancarias seleccionadas en toda la colección cápsula.</p>
      <div class="banner-destacado-pills">
        <span class="banner-pill">3 Y 6 CUOTAS SIN INTERÉS</span>
        <span class="banner-pill">ENVÍOS A TODO EL PAÍS</span>
        <span class="banner-pill">EDICIÓN LIMITADA</span>
      </div>
    </div>

    <div class="contenedor">
      <div class="barra-filtros">
        ${categorias.map(cat => `
          <button type="button" class="filtro-boton ${categoriaFiltroActiva === cat ? 'activo' : ''}" data-cat="${cat}">
            ${cat}
          </button>
        `).join('')}
      </div>

      <section class="cuadricula-productos">
  `;

  productosFiltrados.forEach(prod => {
    html += `
      <article class="tarjeta-producto" data-id="${prod.id}">
        <a href="#/producto/${prod.id}" class="tarjeta-imagen" aria-label="${prod.nombre}">
          ${prod.svg}
        </a>
        <div class="tarjeta-info">
          <span class="tarjeta-categoria">${prod.categoria}</span>
          <h2 class="tarjeta-nombre"><a href="#/producto/${prod.id}">${prod.nombre}</a></h2>
          <div class="tarjeta-precio">${formatearMoneda(prod.precio)}</div>
          <div class="tarjeta-promo">Hasta 6 cuotas sin interés</div>
        </div>
      </article>
    `;
  });

  html += `
      </section>
    </div>
  `;
  vista.innerHTML = html;

  vista.querySelectorAll('.filtro-boton').forEach(btn => {
    btn.addEventListener('click', () => {
      categoriaFiltroActiva = btn.getAttribute('data-cat');
      renderCatalogo();
    });
  });
}

function renderDetalle(id) {
  const vista = document.getElementById('vista-principal');
  const prod = CATALOGO.find(p => p.id === Number(id));
  if (!prod) {
    window.location.hash = '#/';
    return;
  }

  const ajustes = obtenerAjustes();
  let talleInicial = prod.talles.includes('S') ? 'S' : prod.talles[0];

  let tooltipMinimoHtml = '';
  if (ajustes.k02) {
    tooltipMinimoHtml = `<span class="icono-info-minimo" id="icono-info-detalle" title="Cuotas sin interés a partir de $ 150.000" aria-label="Información">i</span>`;
  }

  vista.innerHTML = `
    <div class="contenedor">
      <div class="detalle-grid">
        <div class="detalle-imagen">
          ${prod.svg}
        </div>
        <div class="detalle-info">
          <div>
            <span class="tarjeta-categoria">${prod.categoria}</span>
            <h1 class="detalle-titulo">${prod.nombre}</h1>
            <div class="detalle-valoraciones-fila"><span class="estrellas-doradas">★★★★★</span><span>4.9 (42 valoraciones verificadas)</span></div>
          </div>
          <div class="detalle-precio">${formatearMoneda(prod.precio)}</div>
          <div class="detalle-cuotas-info">Hasta 6 cuotas sin interés con tarjetas bancarias ${tooltipMinimoHtml}</div>
          <p class="detalle-descripcion">${prod.descripcion}</p>

          <div class="grupo-campo">
            <div class="grupo-etiqueta">
              <span>Talle</span>
              <button type="button" class="enlace-guia" id="btn-abrir-guia">Guía de medidas y talles</button>
            </div>
            <div class="selector-talles" role="radiogroup" aria-label="Selección de talle">
              ${prod.talles.map(t => {
                const activo = t === talleInicial ? 'seleccionado' : '';
                const bloqueado = (ajustes.k14 && !guiaConsultada) ? 'bloqueado' : '';

                return `
                  <button type="button"
                    class="talle-opcion ${activo} ${bloqueado}"
                    data-talle="${t}"
                    role="radio"
                    aria-checked="${t === talleInicial ? 'true' : 'false'}">
                    ${t}
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <div id="contenedor-aviso-detalle"></div>

          <div class="grupo-campo">
            <button type="button" class="btn btn-primary btn-block" id="btn-agregar-carrito">
              Agregar a la bolsa
            </button>
          </div>

          <div class="bloque-sellos-producto">
            <div class="sello-item"><span>🚚</span><span>Envíos a todo el país en 24-48 hs</span></div>
            <div class="sello-item"><span>🔄</span><span>Primer cambio gratis por 30 días</span></div>
            <div class="sello-item"><span>💳</span><span>Hasta 6 cuotas sin interés</span></div>
            <div class="sello-item"><span>🌿</span><span>100% Algodón peinado premium</span></div>
          </div>

          <div class="detalle-acordeones">
            <div class="acordeon-ficha-item">
              <button type="button" class="acordeon-ficha-boton" data-ficha="composicion">
                <span>Composición y confección</span>
                <span class="icono-flecha">▾</span>
              </button>
              <div class="acordeon-ficha-cuerpo">
                <p>Prenda confeccionada en hilado 100% algodón peinado 24/1 de fibra seleccionada o sarga pesada según el modelo. Tejido respirable de textura suave al tacto con tratamiento de preencogido y teñido reactivo que mantiene la intensidad del color. Cuello con ribeté elástico reforzado con costura doble al tono para asegurar máxima durabilidad y conservar la forma con el uso cotidiano. Confección artesanal íntegramente realizada en talleres de Buenos Aires.</p>
              </div>
            </div>

            <div class="acordeon-ficha-item">
              <button type="button" class="acordeon-ficha-boton" data-ficha="cuidados">
                <span>Cuidados de la prenda</span>
                <span class="icono-flecha">▾</span>
              </button>
              <div class="acordeon-ficha-cuerpo">
                <p>Lavar con agua fría a mano o en lavarropas en programa suave para prendas delicadas. Lavar siempre del revés para preservar la superficie del tejido. No usar lavandina ni quitamanchas abrasivos. Secar extendido en plano a la sombra; evitar el uso de secarropas por calor. Planchar a temperatura moderada con paño húmedo o del revés evitando contacto directo con estampas o botones.</p>
              </div>
            </div>

            <div class="acordeon-ficha-item">
              <button type="button" class="acordeon-ficha-boton" data-ficha="envios">
                <span>Envíos, retiros y cambios</span>
                <span class="icono-flecha">▾</span>
              </button>
              <div class="acordeon-ficha-cuerpo">
                <p>Procesamos y despachamos todas las órdenes dentro de las 24 a 48 hs hábiles posteriores a la confirmación del pago. Los envíos a domicilio se realizan mediante correo prioritario con código de seguimiento que recibirás por correo electrónico. Disponemos de retiro sin costo en sucursales seleccionadas. Si necesitás cambiar de talle, disponés de 30 días corridos con el primer cambio 100% bonificado.</p>
              </div>
            </div>
          </div>

          <div class="resenas-caja">
            <div style="font-size: 15px; font-weight: 700;">Opiniones de compradores</div>
            <div class="resena-item">
              <div class="estrellas-doradas">★★★★★</div>
              <p>“El calce es perfecto y el algodón es sumamente suave. Me sorprendió la calidad de las costuras y la rapidez del envío.”</p>
              <div class="resena-autor">Sofía R. — Compradora verificada</div>
            </div>
            <div class="resena-item">
              <div class="estrellas-doradas">★★★★★</div>
              <p>“Excelente prenda básica, de las que no se deforman con los lavados. Definitivamente volveré a pedir de esta colección.”</p>
              <div class="resena-autor">Lucas M. — Comprador verificado</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  let talleSeleccionado = talleInicial;

  const btnGuia = document.getElementById('btn-abrir-guia');
  btnGuia.addEventListener('click', () => {
    mostrarModalGuia(prod);
  });

  if (ajustes.k02) {
    const iconEl = document.getElementById('icono-info-detalle');
    if (iconEl) {
      iconEl.addEventListener('mouseenter', () => registrarExposicion('k02', 'Hover en indicador de detalle'));
      iconEl.addEventListener('focus', () => registrarExposicion('k02', 'Foco en indicador de detalle'));
    }
  }

  const botonesTalle = vista.querySelectorAll('.talle-opcion');
  botonesTalle.forEach(btn => {
    btn.addEventListener('click', () => {
      if (ajustes.k14 && !guiaConsultada) {
        mostrarAvisoDetalle('Por favor consultá la Guía de medidas antes de seleccionar el talle.');
        return;
      }

      botonesTalle.forEach(b => {
        b.classList.remove('seleccionado');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('seleccionado');
      btn.setAttribute('aria-checked', 'true');
      talleSeleccionado = btn.getAttribute('data-talle');
      registrarEvento('cambio_talle', `${prod.nombre} - ${talleSeleccionado}`);
    });
  });

  const btnAgregar = document.getElementById('btn-agregar-carrito');
  btnAgregar.addEventListener('click', () => {
    if (ajustes.k14 && !guiaConsultada) {
      mostrarAvisoDetalle('Por favor consultá la Guía de medidas antes de agregar el producto.');
      return;
    }

    const stockActual = prod.stock[talleSeleccionado] !== undefined ? prod.stock[talleSeleccionado] : 0;

    if (stockActual === 0) {
      mostrarAvisoDetalle('No pudimos agregar el producto. Intentá de nuevo.');
      registrarEvento('alerta_stock', `${prod.nombre} ${talleSeleccionado} agotado`, 'k07');
      return;
    }

    const carrito = obtenerCarrito();
    const existente = carrito.find(item => item.id === prod.id && item.talle === talleSeleccionado);
    const cantidadEnCarrito = existente ? existente.cantidad : 0;

    if (cantidadEnCarrito + 1 > stockActual) {
      mostrarAvisoDetalle('No pudimos agregar el producto. Intentá de nuevo.');
      return;
    }

    if (existente) {
      existente.cantidad += 1;
    } else {
      carrito.push({ id: prod.id, talle: talleSeleccionado, cantidad: 1 });
    }

    guardarCarrito(carrito);
    registrarEvento('agregar_producto', `${prod.nombre} ${talleSeleccionado}`);
    window.location.hash = '#/carrito';
  });

  vista.querySelectorAll('.acordeon-ficha-boton').forEach(btn => {
    btn.addEventListener('click', () => {
      const cuerpo = btn.nextElementSibling;
      if (cuerpo) {
        const abierto = cuerpo.classList.toggle('desplegado');
        const flecha = btn.querySelector('.icono-flecha');
        if (flecha) flecha.textContent = abierto ? '▴' : '▾';
      }
    });
  });
}

function mostrarAvisoDetalle(mensaje) {
  const contenedor = document.getElementById('contenedor-aviso-detalle');
  if (contenedor) {
    contenedor.innerHTML = `<div class="alerta-mensaje" role="alert">${mensaje}</div>`;
  }
}

function mostrarModalGuia(prod) {
  const contenedor = document.getElementById('modal-guia-contenedor');
  const ajustes = obtenerAjustes();

  contenedor.innerHTML = `
    <div class="modal-fondo" id="modal-guia-fondo">
      <div class="modal-caja" role="dialog" aria-modal="true" aria-labelledby="modal-guia-titulo">
        <div class="modal-encabezado">
          <h2 class="modal-titulo" id="modal-guia-titulo">Guía de medidas y talles</h2>
          <button type="button" class="modal-cerrar" id="btn-cerrar-modal" aria-label="Cerrar ventana">✕</button>
        </div>
        <p class="detalle-descripcion">Medidas de referencia expresadas en centímetros tomadas directamente sobre la prenda extendida.</p>
        <table class="tabla-medidas">
          <thead>
            <tr>
              <th>Talle</th>
              <th>Pecho / Busto</th>
              <th>Cintura</th>
              <th>Cadera</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>S</td>
              <td>88 - 92 cm</td>
              <td>68 - 72 cm</td>
              <td>92 - 96 cm</td>
            </tr>
            <tr>
              <td>M</td>
              <td>94 - 98 cm</td>
              <td>74 - 78 cm</td>
              <td>98 - 102 cm</td>
            </tr>
            <tr>
              <td>L</td>
              <td>100 - 106 cm</td>
              <td>80 - 86 cm</td>
              <td>104 - 110 cm</td>
            </tr>
          </tbody>
        </table>
        <div>
          <button type="button" class="btn btn-primary btn-block" id="btn-cerrar-modal-accion">Cerrar y continuar</button>
        </div>
      </div>
    </div>
  `;

  function cerrarModal() {
    contenedor.innerHTML = '';
    guiaConsultada = true;
    if (ajustes.k14) {
      registrarExposicion('k14', 'Cierre de guía de medidas');
      const opciones = document.querySelectorAll('.talle-opcion');
      opciones.forEach(o => o.classList.remove('bloqueado'));
      const aviso = document.getElementById('contenedor-aviso-detalle');
      if (aviso) aviso.innerHTML = '';
    }
  }

  document.getElementById('btn-cerrar-modal').addEventListener('click', cerrarModal);
  document.getElementById('btn-cerrar-modal-accion').addEventListener('click', cerrarModal);
}

function renderCarrito() {
  const vista = document.getElementById('vista-principal');
  const carrito = obtenerCarrito();
  const cupon = obtenerCupon();
  const ajustes = obtenerAjustes();

  if (carrito.length === 0) {
    vista.innerHTML = `
      <div class="contenedor">
        <div class="pantalla-centrada">
          <h1 class="detalle-titulo">Tu bolsa está vacía</h1>
          <p class="hero-bajada">Explorá la colección y seleccioná tus prendas para comenzar.</p>
          <a href="#/" class="btn btn-primary">Ir a la colección</a>
        </div>
      </div>
    `;
    return;
  }

  const subtotal = calcularSubtotal(carrito);
  const descuento = calcularDescuento(subtotal, cupon);
  const total = subtotal - descuento;

  let filaArticulosHtml = '';

  carrito.forEach((item, indice) => {
    const prod = CATALOGO.find(p => p.id === item.id);
    if (!prod) return;

    filaArticulosHtml += `
      <div class="carrito-fila" data-indice="${indice}">
        <div class="carrito-mini">
          ${prod.svg}
        </div>
        <div>
          <div class="carrito-titulo">${prod.nombre}</div>
          <div class="carrito-sub">Talle: <strong>${item.talle}</strong> · ${formatearMoneda(prod.precio)} c/u</div>
        </div>
        <div class="control-cantidad">
          <button type="button" class="btn-cantidad" data-accion="restar" data-indice="${indice}" aria-label="Restar unidad">-</button>
          <span class="valor-cantidad">${item.cantidad}</span>
          <button type="button" class="btn-cantidad" data-accion="sumar" data-indice="${indice}" aria-label="Sumar unidad">+</button>
        </div>
        <div>
          <button type="button" class="btn-eliminar" data-indice="${indice}" aria-label="Eliminar ${prod.nombre}">✕</button>
        </div>
      </div>
    `;
  });

  let tooltipMinimoHtml = '';
  if (ajustes.k02) {
    tooltipMinimoHtml = `<span class="icono-info-minimo" id="icono-info-carrito" title="Cuotas sin interés a partir de $ 150.000" aria-label="Información">i</span>`;
  }

  vista.innerHTML = `
    <div class="contenedor">
      ${renderIndicadorTemporizador()}
      <h1 class="detalle-titulo" style="margin-bottom: 24px;">Bolsa de compras</h1>
      <div class="carrito-layout">
        <div class="tabla-carrito">
          ${filaArticulosHtml}
        </div>

        <div class="resumen-caja">
          <h2 class="resumen-titulo">Resumen de compra</h2>
          <div class="resumen-linea">
            <span>Subtotal</span>
            <span>${formatearMoneda(subtotal)}</span>
          </div>

          ${cupon ? `
            <div class="resumen-linea resumen-descuento">
              <span>Descuento (15%)</span>
              <span>- ${formatearMoneda(descuento)}</span>
            </div>
          ` : ''}

          <div class="resumen-linea total">
            <span>Total estimado</span>
            <span>${formatearMoneda(total)}</span>
          </div>

          <div class="tarjeta-promo">
            Hasta 6 cuotas sin interés con tarjetas bancarias ${tooltipMinimoHtml}
          </div>

          <div>
            <label for="input-codigo-cupon" class="grupo-etiqueta" style="margin-bottom: 6px;">Código de descuento</label>
            <div class="seccion-cupon">
              <input type="text" id="input-codigo-cupon" class="input-cupon" placeholder="Capsula 15" value="${cupon ? cupon.codigo : ''}">
              <button type="button" class="btn btn-secondary btn-sm" id="btn-aplicar-cupon">Aplicar</button>
            </div>
            <div id="mensaje-cupon" style="margin-top: 8px;"></div>
          </div>

          <button type="button" class="btn btn-primary btn-block" id="btn-iniciar-compra">
            Iniciar compra
          </button>
        </div>
      </div>
    </div>
  `;

  if (ajustes.k02) {
    const iconEl = document.getElementById('icono-info-carrito');
    if (iconEl) {
      iconEl.addEventListener('mouseenter', () => registrarExposicion('k02', 'Hover en indicador de carrito'));
      iconEl.addEventListener('focus', () => registrarExposicion('k02', 'Foco en indicador de carrito'));
    }
  }

  vista.querySelectorAll('.btn-cantidad').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.getAttribute('data-indice'));
      const accion = btn.getAttribute('data-accion');
      const item = carrito[idx];
      const prod = CATALOGO.find(p => p.id === item.id);
      if (!prod) return;

      if (accion === 'sumar') {
        const stockActual = prod.stock[item.talle] || 0;
        if (item.cantidad + 1 <= stockActual) {
          item.cantidad += 1;
        } else {
          return;
        }
      } else if (accion === 'restar') {
        if (item.cantidad > 1) {
          item.cantidad -= 1;
        } else {
          carrito.splice(idx, 1);
        }
      }

      if (ajustes.k18 && item && prod.talles.includes('S')) {
        item.talle = 'S';
        registrarEvento('cambio_talle', `${prod.nombre} restablecido a S`, 'k18');
      }

      guardarCarrito(carrito);
      renderCarrito();
    });
  });

  vista.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.getAttribute('data-indice'));
      carrito.splice(idx, 1);
      guardarCarrito(carrito);
      renderCarrito();
    });
  });

  const btnCupon = document.getElementById('btn-aplicar-cupon');
  const inputCupon = document.getElementById('input-codigo-cupon');
  const mensajeCupon = document.getElementById('mensaje-cupon');

  btnCupon.addEventListener('click', () => {
    const rawVal = inputCupon.value.trim();

    if (rawVal === 'capsula15') {
      guardarCupon({ codigo: 'capsula15', tasa: TASA_DESCUENTO });
      registrarEvento('cupon_aplicado', 'capsula15');
      mensajeCupon.innerHTML = '<div class="exito-mensaje">Cupón aplicado correctamente (15% OFF).</div>';
      setTimeout(() => renderCarrito(), 500);
    } else {
      registrarEvento('cupon_rechazado', rawVal, 'k28');
      mensajeCupon.innerHTML = '<div class="alerta-mensaje" role="alert">Código no reconocido.</div>';
    }
  });

  const btnIniciar = document.getElementById('btn-iniciar-compra');
  btnIniciar.addEventListener('click', () => {
    window.location.hash = '#/checkout/datos';
  });
}

function renderSugerencias() {
  const vista = document.getElementById('vista-principal');
  const ajustes = obtenerAjustes();

  const sugeridos = CATALOGO.filter(p => p.id === 10 || p.id === 1);

  vista.innerHTML = `
    <div class="contenedor">
      <div class="checkout-cabecera-navegacion">
        <div class="barra-superior-checkout">
          <button type="button" class="enlace-volver-paso" id="btn-volver-catalogo">Volver</button>
        </div>
      </div>
      ${renderIndicadorTemporizador()}

      <div class="pantalla-centrada" style="max-width: 680px;" id="contenedor-sugerencias">
        <h1 class="detalle-titulo">¿Querés agregar algo más?</h1>
        <p class="hero-bajada">Complementos ideales seleccionados para tu conjunto antes de continuar.</p>
        <div class="cuadricula-productos" style="width: 100%; margin: 20px 0;">
          ${sugeridos.map(p => `
            <div class="tarjeta-producto">
              <div class="tarjeta-imagen" style="aspect-ratio: 1/1;">${p.svg}</div>
              <div class="tarjeta-info">
                <span class="tarjeta-categoria">${p.categoria}</span>
                <div class="tarjeta-nombre">${p.nombre}</div>
                <div class="tarjeta-precio">${formatearMoneda(p.precio)}</div>
                <button type="button" class="btn btn-secondary btn-sm btn-agregar-sugerido" data-id="${p.id}" style="margin-top: 10px;">Sumar a la bolsa</button>
              </div>
            </div>
          `).join('')}
        </div>
        <a href="#/checkout/envio" class="btn btn-primary btn-block" id="btn-continuar-sugerencias">Continuar con la compra</a>
      </div>
    </div>
  `;

  const btnVolver = document.getElementById('btn-volver-catalogo');
  if (btnVolver) {
    btnVolver.addEventListener('click', () => {
      registrarEvento('navegacion_volver', 'Regreso desde sugerencias a catalogo', 'k32');
      window.location.hash = '#/';
    });
  }

  const contenedor = document.getElementById('contenedor-sugerencias');
  if (ajustes.k10) {
    observarExposicion(contenedor, 'k10', 'Paso de sugerencias complementarias');
  }

  vista.querySelectorAll('.btn-agregar-sugerido').forEach(btn => {
    btn.addEventListener('click', () => {
      const pid = Number(btn.getAttribute('data-id'));
      const prod = CATALOGO.find(p => p.id === pid);
      if (!prod) return;
      const talle = prod.talles[0];
      const carrito = obtenerCarrito();
      const existente = carrito.find(item => item.id === prod.id && item.talle === talle);
      if (existente) {
        existente.cantidad += 1;
      } else {
        carrito.push({ id: prod.id, talle: talle, cantidad: 1 });
      }
      guardarCarrito(carrito);
      btn.textContent = 'Agregado ✓';
      btn.disabled = true;
    });
  });
}

function renderLateralCheckout(datos, subtotal, descuento, metodoEnvioObj, total, carrito) {
  return `
    <aside class="lateral-resumen-caja">
      <div class="lateral-resumen-titulo">Resumen de tu pedido (${carrito.reduce((acc, i) => acc + i.cantidad, 0)} prendas)</div>
      <div class="resumen-prendas-carrusel-horizontal" role="region" aria-label="Prendas seleccionadas">
        ${carrito.map(item => {
          const prod = CATALOGO.find(p => p.id === item.id);
          if (!prod) return '';
          return `
            <div class="tarjeta-prenda-mini-scroll">
              <div class="tarjeta-prenda-mini-img">${prod.svg}</div>
              <div class="tarjeta-prenda-mini-nombre" title="${prod.nombre}">${prod.nombre}</div>
              <div class="tarjeta-prenda-mini-meta">Talle ${item.talle} · ×${item.cantidad}</div>
              <div class="tarjeta-prenda-mini-precio">${formatearMoneda(prod.precio * item.cantidad)}</div>
            </div>
          `;
        }).join('')}
      </div>
      <div class="lateral-items-lista">
        ${carrito.map(item => {
          const prod = CATALOGO.find(p => p.id === item.id);
          if (!prod) return '';
          return `
            <div class="lateral-item-fila">
              <div>
                <div class="lateral-item-nombre">${prod.nombre}</div>
                <div class="lateral-item-sub">Talle: ${item.talle} · Cantidad: ${item.cantidad}</div>
              </div>
              <div style="font-weight: 600;">${formatearMoneda(prod.precio * item.cantidad)}</div>
            </div>
          `;
        }).join('')}
      </div>

      <div style="border-top: 1px solid var(--color-borde); padding-top: 12px; display: flex; flex-direction: column; gap: 6px;">
        <div class="resumen-linea">
          <span>Subtotal</span>
          <span>${formatearMoneda(subtotal)}</span>
        </div>
        ${descuento > 0 ? `
          <div class="resumen-linea resumen-descuento">
            <span>Descuento aplicado</span>
            <span>- ${formatearMoneda(descuento)}</span>
          </div>
        ` : ''}
        ${metodoEnvioObj ? `
          <div class="resumen-linea">
            <span>Envío (${metodoEnvioObj.nombre})</span>
            <span>${metodoEnvioObj.costo === 0 ? 'Gratis' : formatearMoneda(metodoEnvioObj.costo)}</span>
          </div>
        ` : ''}
        <div class="resumen-linea total" style="margin-top: 6px;">
          <span>Total a pagar</span>
          <span>${formatearMoneda(total)}</span>
        </div>
      </div>

      <div class="sellos-seguridad-caja">
        <div class="sello-seguridad-linea">
          <span>🔒</span>
          <span>Compra 100% segura con cifrado SSL TLS 1.3</span>
        </div>
        <div class="sello-seguridad-linea">
          <span>🛡️</span>
          <span>Garantía oficial y primer cambio sin cargo por 30 días</span>
        </div>
        <div class="sello-seguridad-linea">
          <span>🚚</span>
          <span>Despacho con seguimiento en tiempo real</span>
        </div>
        <div class="logos-pagos-fila">
          <span class="logo-pago-badge">VISA</span>
          <span class="logo-pago-badge">MASTERCARD</span>
          <span class="logo-pago-badge">CABAL</span>
          <span class="logo-pago-badge">NARANJA</span>
          <span class="logo-pago-badge">DÉBITO</span>
          <span class="logo-pago-badge">TRANSFERENCIA</span>
        </div>
      </div>
    </aside>
  `;
}

function renderBarraPasos(pasoActivo) {
  const porcentaje = ((pasoActivo - 1) / 3) * 100;
  return `
    <div class="checkout-cabecera-navegacion">
      <div class="barra-superior-checkout">
        <button type="button" class="enlace-volver-paso" id="btn-volver-catalogo">Volver</button>
      </div>
      <div class="linea-progreso-checkout" role="navigation" aria-label="Progreso del proceso de compra">
        <div class="pista-linea-progreso">
          <div class="pista-linea-activa" style="width: ${porcentaje}%;"></div>
        </div>
        <div class="pasos-lista-horizontal">
          <a href="#/checkout/datos" class="paso-nodo ${pasoActivo === 1 ? 'nodo-activo' : (pasoActivo > 1 ? 'nodo-completo' : '')}">
            <div class="nodo-circulo">${pasoActivo > 1 ? '✓' : '1'}</div>
            <span class="nodo-texto">Datos</span>
          </a>
          <a href="#/checkout/envio" class="paso-nodo ${pasoActivo === 2 ? 'nodo-activo' : (pasoActivo > 2 ? 'nodo-completo' : '')}">
            <div class="nodo-circulo">${pasoActivo > 2 ? '✓' : '2'}</div>
            <span class="nodo-texto">Envío</span>
          </a>
          <a href="#/checkout/pago" class="paso-nodo ${pasoActivo === 3 ? 'nodo-activo' : (pasoActivo > 3 ? 'nodo-completo' : '')}">
            <div class="nodo-circulo">${pasoActivo > 3 ? '✓' : '3'}</div>
            <span class="nodo-texto">Pago</span>
          </a>
          <a href="#/checkout/revision" class="paso-nodo ${pasoActivo === 4 ? 'nodo-activo' : ''}">
            <div class="nodo-circulo">4</div>
            <span class="nodo-texto">Revisión</span>
          </a>
        </div>
      </div>
    </div>
  `;
}

function renderCheckoutDatos() {
  const vista = document.getElementById('vista-principal');
  const carrito = obtenerCarrito();
  if (carrito.length === 0) {
    window.location.hash = '#/carrito';
    return;
  }

  const datos = obtenerCheckout();
  const cupon = obtenerCupon();
  const ajustes = obtenerAjustes();
  const subtotal = calcularSubtotal(carrito);
  const descuento = calcularDescuento(subtotal, cupon);
  const total = subtotal - descuento;

  vista.innerHTML = `
    <div class="contenedor">
      ${renderBarraPasos(1)}
      ${renderIndicadorTemporizador()}
      <h1 class="detalle-titulo" style="margin-bottom: 24px;">Datos de contacto y entrega</h1>

      <div class="checkout-grid-layout">
        <form id="form-datos" class="formulario-caja">
          <div class="grupo-campo">
            <label class="grupo-etiqueta" for="input-nombre">Nombre y apellido</label>
            <input type="text" id="input-nombre" class="campo-control" required value="${datos.nombre || ''}" placeholder="Ej. Camila Morales">
          </div>

          <div class="campo-fila">
            <div class="grupo-campo">
              <label class="grupo-etiqueta" for="input-email">Correo electrónico</label>
              <input type="email" id="input-email" class="campo-control" required value="${datos.email || ''}" placeholder="nombre@correo.com">
            </div>
            <div class="grupo-campo">
              <label class="grupo-etiqueta" for="input-telefono">Teléfono móvil</label>
              <input type="tel" id="input-telefono" class="campo-control" required value="${datos.telefono || ''}" placeholder="11 5555 4444">
            </div>
          </div>

          <div class="grupo-campo">
            <label class="grupo-etiqueta" for="input-direccion">Dirección y número de puerta</label>
            <input type="text" id="input-direccion" class="campo-control" required value="${datos.direccion || ''}" placeholder="Av. Corrientes 1234, Piso 4 B">
          </div>

          <div class="campo-fila">
            <div class="grupo-campo">
              <label class="grupo-etiqueta" for="input-ciudad">Ciudad o localidad</label>
              <input type="text" id="input-ciudad" class="campo-control" required value="${datos.ciudad || ''}" placeholder="Ciudad Autónoma de Buenos Aires">
            </div>
            <div class="grupo-campo">
              <label class="grupo-etiqueta" for="input-cp">Código postal</label>
              <input type="text" id="input-cp" class="campo-control" required value="${datos.cp || ''}" placeholder="C1043">
            </div>
          </div>

          <div class="bloque-suscripcion-condiciones">
            <label class="etiqueta-casilla-discreta" for="check-suscripcion-condiciones">
              <input type="checkbox" id="check-suscripcion-condiciones" class="control-casilla-discreta">
              <span>Deseo suscribirme para recibir novedades, promociones exclusivas e información de lanzamientos por correo electrónico, y acepto las condiciones generales del servicio y las políticas de privacidad de la tienda.</span>
            </label>
            <div class="acordeon-terminos-discreto">
              <button type="button" class="boton-terminos-discreto" id="btn-terminos-datos" aria-expanded="false">
                Ver términos y condiciones
              </button>
              <div class="cuerpo-terminos-discreto" id="cuerpo-terminos-datos">
                <p>El acceso y utilización de la presente plataforma de comercio electrónico implica la aceptación plena de las cláusulas contractuales aquí estipuladas. Las operaciones comerciales celebradas a través de este canal digital se rigen por la legislación vigente en la República Argentina en materia de defensa del consumidor, lealtad comercial y protección de datos personales.</p>
                <p>La disponibilidad de stock, los precios informados y las descripciones técnicas de las prendas se encuentran sujetos a confirmación y procesamiento por parte del sistema central al momento de registrar la orden. La empresa se reserva el derecho de validar la identidad del titular de los medios de pago empleados para prevenir transacciones no consentidas.</p>
                <p>Los envíos se efectúan mediante empresas de logística autorizadas bajo los plazos y tarifas informados en el checkout. La garantía de cambio rige dentro de los 30 días corridos de recibida la mercadería siempre que las prendas conserven sus etiquetas originales de fábrica, no hayan sido utilizadas ni alteradas y se encuentren en idénticas condiciones a las remitidas.</p>
                <p>Las comunicaciones periódicas, notificaciones de despacho y confirmaciones de pago se cursarán a la casilla de correo declarada por el usuario en el formulario de contacto.</p>
                <p>Asimismo, los planes comerciales de financiación en 3 y 6 cuotas sin interés se encuentran reservados con exclusividad para aquellas órdenes de compra cuyo importe total neto facturado resulte igual o superior al monto mínimo de $ 150.000 (ciento cincuenta mil pesos), deducidos descuentos promocionales y sin computar gastos de envío.</p>
              </div>
            </div>
          </div>

          <div id="alerta-datos"></div>

          <button type="submit" class="btn btn-primary btn-block">Continuar al envío</button>
        </form>

        ${renderLateralCheckout(datos, subtotal, descuento, null, total, carrito)}
      </div>
    </div>
  `;

  document.getElementById('btn-volver-catalogo').addEventListener('click', () => {
    registrarEvento('navegacion_volver', 'Regreso desde datos a catalogo', 'k32');
    window.location.hash = '#/';
  });

  const btnTerm = document.getElementById('btn-terminos-datos');
  const cuerpoTerm = document.getElementById('cuerpo-terminos-datos');
  if (btnTerm && cuerpoTerm) {
    btnTerm.addEventListener('click', () => {
      const abierto = cuerpoTerm.classList.toggle('desplegado');
      btnTerm.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    });
  }

  document.getElementById('form-datos').addEventListener('submit', (e) => {
    e.preventDefault();
    datos.nombre = document.getElementById('input-nombre').value.trim();
    datos.email = document.getElementById('input-email').value.trim();
    datos.telefono = document.getElementById('input-telefono').value.trim();
    datos.direccion = document.getElementById('input-direccion').value.trim();
    datos.ciudad = document.getElementById('input-ciudad').value.trim();
    datos.cp = document.getElementById('input-cp').value.trim();

    if (!datos.nombre || !datos.email || !datos.direccion) {
      document.getElementById('alerta-datos').innerHTML = '<div class="alerta-mensaje" role="alert">Completá todos los campos requeridos.</div>';
      return;
    }

    const checkCond = document.getElementById('check-suscripcion-condiciones');
    if (!checkCond || !checkCond.checked) {
      const alerta = document.getElementById('alerta-datos');
      alerta.innerHTML = '<div class="alerta-mensaje" role="alert">Debe completar todos los datos para continuar.</div>';
      alerta.scrollIntoView({ behavior: 'smooth', block: 'center' });
      registrarEvento('condiciones_no_aceptadas', 'Intento de avance sin marcar condiciones', 'k33');
      return;
    }

    guardarCheckout(datos);
    registrarEvento('paso_datos_completado');
    if (ajustes.k10) {
      window.location.hash = '#/checkout/sugerencias';
    } else {
      window.location.hash = '#/checkout/envio';
    }
  });
}

function renderCheckoutEnvio() {
  const vista = document.getElementById('vista-principal');
  const carrito = obtenerCarrito();
  if (carrito.length === 0) {
    window.location.hash = '#/carrito';
    return;
  }

  const datos = obtenerCheckout();
  const cupon = obtenerCupon();
  const ajustes = obtenerAjustes();

  const subtotal = calcularSubtotal(carrito);
  const descuento = calcularDescuento(subtotal, cupon);
  const metodoEnvioObj = METODOS_ENVIO.find(m => m.id === datos.envio) || METODOS_ENVIO[0];
  const costoEnvio = metodoEnvioObj.costo;
  const total = subtotal - descuento + costoEnvio;

  vista.innerHTML = `
    <div class="contenedor">
      ${renderBarraPasos(2)}
      ${renderIndicadorTemporizador()}
      <h1 class="detalle-titulo" style="margin-bottom: 24px;">Selección del método de entrega</h1>

      <div class="checkout-grid-layout">
        <div class="formulario-caja">
          ${METODOS_ENVIO.map(m => `
            <label class="tarjeta-opcion ${datos.envio === m.id ? 'seleccionada' : ''}">
              <div class="tarjeta-opcion-lado">
                <input type="radio" name="metodo-envio" value="${m.id}" ${datos.envio === m.id ? 'checked' : ''}>
                <div>
                  <div style="font-weight: 700;">${m.nombre}</div>
                  <div class="tarjeta-promo">${m.plazo}</div>
                </div>
              </div>
              <div style="font-weight: 700;">${m.costo === 0 ? 'Gratis' : formatearMoneda(m.costo)}</div>
            </label>
          `).join('')}

          <button type="button" class="btn btn-primary btn-block" id="btn-continuar-envio">Continuar al pago</button>
        </div>

        ${renderLateralCheckout(datos, subtotal, descuento, metodoEnvioObj, total, carrito)}
      </div>
    </div>
  `;

  document.getElementById('btn-volver-catalogo').addEventListener('click', () => {
    registrarEvento('navegacion_volver', 'Regreso desde envio a catalogo', 'k32');
    window.location.hash = '#/';
  });

  vista.querySelectorAll('input[name="metodo-envio"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const envioPrevio = datos.envio;
      datos.envio = radio.value;

      if (ajustes.k12 && envioPrevio !== datos.envio) {
        datos.pago = 'debito';
        datos.cuotas = '1';
        registrarEvento('reinicio_pago_por_envio', `Cambio de ${envioPrevio} a ${datos.envio}`, 'k12');
      }

      guardarCheckout(datos);
      renderCheckoutEnvio();
    });
  });

  document.getElementById('btn-continuar-envio').addEventListener('click', () => {
    registrarEvento('paso_envio_completado', datos.envio);
    window.location.hash = '#/checkout/pago';
  });
}

function renderCheckoutPago() {
  const vista = document.getElementById('vista-principal');
  const carrito = obtenerCarrito();
  if (carrito.length === 0) {
    window.location.hash = '#/carrito';
    return;
  }

  const datos = obtenerCheckout();
  datos.pago = 'debito';
  datos.cuotas = '1';
  guardarCheckout(datos);

  const cupon = obtenerCupon();
  const ajustes = obtenerAjustes();

  const subtotal = calcularSubtotal(carrito);
  const descuento = calcularDescuento(subtotal, cupon);
  const baseParaCuotas = subtotal - descuento;
  const admiteCuotas = baseParaCuotas >= MINIMO_CUOTAS;

  const metodoEnvioObj = METODOS_ENVIO.find(m => m.id === datos.envio) || METODOS_ENVIO[0];
  const costoEnvio = metodoEnvioObj.costo;
  const total = subtotal - descuento + costoEnvio;

  let tooltipMinimoHtml = '';
  if (ajustes.k02) {
    tooltipMinimoHtml = `<span class="icono-info-minimo" id="icono-info-pago" title="Cuotas sin interés a partir de $ 150.000" aria-label="Información">i</span>`;
  }

  let selectorPromocionesHtml = '';
  if (datos.pago === 'credito') {
    selectorPromocionesHtml = `
      <div class="grupo-campo" style="margin-top: 18px;">
        <label class="grupo-etiqueta" for="selector-promociones-financiacion">Promociones y planes de financiación ${tooltipMinimoHtml}</label>
        <select id="selector-promociones-financiacion" class="campo-control selector-promociones-scroll">
          <option value="" disabled ${!datos.cuotas ? 'selected' : ''}>-- Seleccioná un plan o promoción --</option>
          <option disabled>Plan Ahora 12 - 12 cuotas fijas (No disponible)</option>
          <option disabled>Banco Santander - 15% reintegro (No disponible)</option>
          <option disabled>Banco Galicia - 3 cuotas fijas (No disponible)</option>
          <option disabled>Banco BBVA - 6 cuotas fijas (No disponible)</option>
          <option disabled>Banco Macro - 3 cuotas fijas (No disponible)</option>
          <option disabled>Banco Nación - 20% reintegro (No disponible)</option>
          <option disabled>Banco Provincia - 4 cuotas fijas (No disponible)</option>
          <option disabled>Tarjeta Naranja - Plan Z (No disponible)</option>
          <option disabled>Tarjeta Cencosud - 3 cuotas fijas (No disponible)</option>
          <option disabled>Tarjeta Cabal - 6 cuotas fijas (No disponible)</option>
          <option disabled>Tarjeta American Express - 12 cuotas fijas (No disponible)</option>
          <option disabled>Banco Credicoop - 3 cuotas fijas (No disponible)</option>
          <option disabled>Banco Patagonia - 10% reintegro (No disponible)</option>
          <option disabled>Banco Ciudad - 6 cuotas fijas (No disponible)</option>
          <option value="1" ${datos.cuotas === '1' ? 'selected' : ''}>1 pago directo (${formatearMoneda(total)})</option>
          <option value="3" ${!admiteCuotas ? 'disabled' : ''} ${datos.cuotas === '3' ? 'selected' : ''}>Plan Cápsula - 3 cuotas sin interés de ${formatearMoneda(Math.round(total / 3))}</option>
          <option value="6" ${!admiteCuotas ? 'disabled' : ''} ${datos.cuotas === '6' ? 'selected' : ''}>Plan Cápsula - 6 cuotas sin interés de ${formatearMoneda(Math.round(total / 6))}</option>
        </select>
      </div>
    `;
  }

  let acordeonHtml = '';
  if (ajustes.k20) {
    acordeonHtml = `
      <div class="acordeon-terminos-discreto">
        <button type="button" class="boton-terminos-discreto" id="btn-acordeon-condiciones" aria-expanded="false">
          Ver términos y condiciones de financiación
        </button>
        <div class="cuerpo-terminos-discreto" id="cuerpo-acordeon-condiciones">
          <p>Promociones de financiación válidas para compras minoristas con tarjetas de crédito emitidas por entidades bancarias autorizadas en la República Argentina. Costo Financiero Total Efectivo Anual (CFTEA): 0,00%. Tasa Nominal Anual (TNA): 0,00%. Tasa Efectiva Anual (TEA): 0,00%. Sujeto a previa aprobación crediticia y límites de compra establecidos por la entidad emisora del plástico correspondiente.</p>
          <p>No acumulable con otras promociones bancarias, reintegros especiales de cartera, bonificaciones por convenio gremial ni descuentos por liquidación de temporada. Quedan expresamente excluidas del beneficio tarjetas corporativas, tarjetas de compra prepagas y operaciones realizadas a través de plataformas de cobro de terceros no homologadas.</p>
          <p>La vigencia comercial de las opciones financieras corresponde a transacciones concertadas y procesadas durante el período vigente de la colección. En caso de cancelaciones, devoluciones o desconocimientos de compra, el reintegro se efectuará por el monto neto abonado según la modalidad de pago oportunamente seleccionada.</p>
          <p>Asimismo, los planes comerciales de financiación en 3 y 6 cuotas sin interés se encuentran reservados con exclusividad para aquellas órdenes de compra cuyo importe total neto facturado resulte igual o superior al monto mínimo de $ 150.000 (ciento cincuenta mil pesos), deducidos descuentos promocionales y sin computar gastos de envío.</p>
        </div>
      </div>
    `;
  }

  vista.innerHTML = `
    <div class="contenedor">
      ${renderBarraPasos(3)}
      ${renderIndicadorTemporizador()}
      <h1 class="detalle-titulo" style="margin-bottom: 24px;">Selección del medio de pago</h1>

      <div class="checkout-grid-layout">
        <div class="formulario-caja">
          <div class="grupo-campo">
            <label class="grupo-etiqueta" for="selector-medio-pago">Medio de pago</label>
            <select id="selector-medio-pago" class="campo-control">
              <option value="debito" ${datos.pago === 'debito' ? 'selected' : ''}>Tarjeta de débito (1 pago directo)</option>
              <option value="credito" ${datos.pago === 'credito' ? 'selected' : ''}>Tarjeta de crédito (cuotas y promociones)</option>
              <option value="transferencia" ${datos.pago === 'transferencia' ? 'selected' : ''}>Transferencia bancaria</option>
            </select>
          </div>

          ${selectorPromocionesHtml}
          ${acordeonHtml}

          <button type="button"
            class="btn btn-primary btn-block ${ajustes.k26 ? 'is-disabled' : ''}"
            ${ajustes.k26 ? 'aria-disabled="true"' : ''}
            id="btn-continuar-pago">
            Pagar y continuar
          </button>
        </div>

        ${renderLateralCheckout(datos, subtotal, descuento, metodoEnvioObj, total, carrito)}
      </div>
    </div>
  `;

  document.getElementById('btn-volver-catalogo').addEventListener('click', () => {
    registrarEvento('navegacion_volver', 'Regreso desde pago a catalogo', 'k32');
    window.location.hash = '#/';
  });

  if (ajustes.k02) {
    const iconEl = document.getElementById('icono-info-pago');
    if (iconEl) {
      iconEl.addEventListener('mouseenter', () => registrarExposicion('k02', 'Hover en indicador de pago'));
      iconEl.addEventListener('focus', () => registrarExposicion('k02', 'Foco en indicador de pago'));
    }
  }

  if (ajustes.k20) {
    const btnAcordeon = document.getElementById('btn-acordeon-condiciones');
    const cuerpoAcordeon = document.getElementById('cuerpo-acordeon-condiciones');
    if (btnAcordeon && cuerpoAcordeon) {
      btnAcordeon.addEventListener('click', () => {
        const abierto = cuerpoAcordeon.classList.toggle('desplegado');
        btnAcordeon.setAttribute('aria-expanded', abierto ? 'true' : 'false');
        if (abierto) registrarExposicion('k20', 'Apertura de acordeón de condiciones');
      });
    }
  }

  const btnContinuar = document.getElementById('btn-continuar-pago');
  if (ajustes.k26) {
    observarExposicion(btnContinuar, 'k26', 'Botón de pago con aspecto atenuado');
  }

  const selMedio = document.getElementById('selector-medio-pago');
  selMedio.addEventListener('change', () => {
    datos.pago = selMedio.value;
    if (datos.pago !== 'credito') {
      datos.cuotas = '1';
    } else {
      datos.cuotas = '';
    }
    guardarCheckout(datos);
    renderCheckoutPago();
  });

  const selPromo = document.getElementById('selector-promociones-financiacion');
  if (selPromo) {
    observarExposicion(selPromo, 'k23', 'Desplegable de promociones de financiación');
    selPromo.addEventListener('change', () => {
      datos.cuotas = selPromo.value;
      guardarCheckout(datos);
      registrarEvento('seleccion_cuotas', `${datos.cuotas} cuotas`);
    });
  }

  btnContinuar.addEventListener('click', () => {
    if (datos.pago === 'credito' && !datos.cuotas) {
      datos.cuotas = '1';
      guardarCheckout(datos);
    }
    registrarEvento('paso_pago_completado', `${datos.pago} - ${datos.cuotas || '1'} cuotas`);
    window.location.hash = '#/checkout/revision';
  });
}

function renderCheckoutRevision() {
  const vista = document.getElementById('vista-principal');
  const carrito = obtenerCarrito();
  if (carrito.length === 0) {
    window.location.hash = '#/carrito';
    return;
  }

  const datos = obtenerCheckout();
  const cupon = obtenerCupon();
  const ajustes = obtenerAjustes();

  const subtotal = calcularSubtotal(carrito);
  const descuento = calcularDescuento(subtotal, cupon);
  const costoEnvio = obtenerCostoEnvio(datos.envio);
  const total = subtotal - descuento + costoEnvio;

  const metodoEnvioObj = METODOS_ENVIO.find(m => m.id === datos.envio) || METODOS_ENVIO[0];

  let textoPago = 'Tarjeta de débito (1 pago)';
  if (datos.pago === 'credito') {
    if (datos.cuotas && datos.cuotas !== '1') {
      textoPago = `Tarjeta de crédito (${datos.cuotas} cuotas sin interés)`;
    } else {
      textoPago = 'Tarjeta de crédito (1 pago)';
    }
  } else if (datos.pago === 'transferencia') {
    textoPago = 'Transferencia bancaria';
  }

  let campoEmailConfirmacionHtml = '';
  if (ajustes.k11) {
    campoEmailConfirmacionHtml = `
      <div class="grupo-campo" style="margin-top: 16px;">
        <label class="grupo-etiqueta" for="input-confirmar-email">Confirmá tu correo para el comprobante de compra</label>
        <input type="email" id="input-confirmar-email" class="campo-control" required placeholder="nombre@correo.com">
      </div>
    `;
  }

  vista.innerHTML = `
    <div class="contenedor">
      ${renderBarraPasos(4)}
      ${renderIndicadorTemporizador()}
      <div style="max-width: 680px; margin: 0 auto;">
        <h1 class="detalle-titulo" style="margin-bottom: 20px;">Revisión final</h1>
        <div class="formulario-caja" style="gap: 24px;">
          <div>
            <h2 class="resumen-titulo" style="font-size: 15px; margin-bottom: 12px;">Artículos seleccionados</h2>
            <div class="resumen-prendas-carrusel-horizontal" role="region" aria-label="Prendas seleccionadas">
              ${carrito.map(item => {
                const prod = CATALOGO.find(p => p.id === item.id);
                if (!prod) return '';
                return `
                  <div class="tarjeta-prenda-mini-scroll">
                    <div class="tarjeta-prenda-mini-img">${prod.svg}</div>
                    <div class="tarjeta-prenda-mini-nombre" title="${prod.nombre}">${prod.nombre}</div>
                    <div class="tarjeta-prenda-mini-meta">Talle ${item.talle} · ×${item.cantidad}</div>
                    <div class="tarjeta-prenda-mini-precio">${formatearMoneda(prod.precio * item.cantidad)}</div>
                  </div>
                `;
              }).join('')}
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${carrito.map(item => {
                const prod = CATALOGO.find(p => p.id === item.id);
                return `
                  <div style="display: flex; justify-content: space-between; font-size: 14px;">
                    <span>${prod.nombre} (Talle ${item.talle}) × ${item.cantidad}</span>
                    <span>${formatearMoneda(prod.precio * item.cantidad)}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <div style="border-top: 1px solid var(--color-borde); padding-top: 16px;">
            <h2 class="resumen-titulo" style="font-size: 15px; margin-bottom: 8px;">Entrega y facturación</h2>
            <div style="font-size: 14px; color: var(--color-secundario); line-height: 1.6;">
              <div><strong>Destinatario:</strong> ${datos.nombre}</div>
              <div><strong>Correo inicial:</strong> ${datos.email}</div>
              <div><strong>Dirección:</strong> ${datos.direccion}, ${datos.ciudad} (CP ${datos.cp})</div>
              <div><strong>Método:</strong> ${metodoEnvioObj.nombre} (${formatearMoneda(metodoEnvioObj.costo)})</div>
              <div><strong>Pago:</strong> ${textoPago}</div>
            </div>
          </div>

          ${campoEmailConfirmacionHtml}

          <div style="border-top: 1px solid var(--color-borde); padding-top: 16px;">
            <div class="resumen-linea">
              <span>Subtotal</span>
              <span>${formatearMoneda(subtotal)}</span>
            </div>
            ${cupon ? `
              <div class="resumen-linea resumen-descuento">
                <span>Descuento aplicado</span>
                <span>- ${formatearMoneda(descuento)}</span>
              </div>
            ` : ''}
            <div class="resumen-linea">
              <span>Costo de envío</span>
              <span>${metodoEnvioObj.costo === 0 ? 'Gratis' : formatearMoneda(metodoEnvioObj.costo)}</span>
            </div>
            <div class="resumen-linea total">
              <span>Total final</span>
              <span>${formatearMoneda(total)}</span>
            </div>
          </div>

          <div id="alerta-revision"></div>

          <div class="contenedor-acciones-revision">
            <div style="display: flex; flex-direction: column; align-items: center; gap: 14px;">
              <a href="#/" class="btn-seguir-comprando-destacado" id="btn-seguir-comprando">
                Seguir comprando
              </a>
              <button type="button" class="enlace-confirmar-subrayado" id="btn-confirmar-pedido">
                Confirmar pedido
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="aviso-cookies-panel-inferior" id="panel-cookies-inferior" role="dialog" aria-label="Aviso de cookies">
      <div class="aviso-cookies-contenido">
        <div class="aviso-cookies-titulo">Política de privacidad y cookies</div>
        <p class="aviso-cookies-descripcion">Utilizamos cookies técnicas y de sesión necesarias para el procesamiento seguro de pagos, la validación de transacciones y el correcto funcionamiento de la plataforma comercial.</p>
        <button type="button" class="btn btn-primary" id="btn-aceptar-cookies-panel">Aceptar cookies</button>
      </div>
    </div>
  `;

  if (ajustes.k11) {
    const inputEmailConf = document.getElementById('input-confirmar-email');
    if (inputEmailConf) observarExposicion(inputEmailConf, 'k11', 'Campo de confirmación de correo electrónico');
  }

  const btnSeguir = document.getElementById('btn-seguir-comprando');
  if (btnSeguir) observarExposicion(btnSeguir, 'k17', 'Jerarquía invertida en botones de revisión');

  const btnConf = document.getElementById('btn-confirmar-pedido');
  if (btnConf && ajustes.k26) {
    observarExposicion(btnConf, 'k26', 'Botón confirmar pedido con estilo atenuado');
  }

  const panelCookies = document.getElementById('panel-cookies-inferior');
  const btnAceptarCookies = document.getElementById('btn-aceptar-cookies-panel');
  if (panelCookies && btnAceptarCookies) {
    observarExposicion(panelCookies, 'k25', 'Visualización de aviso de cookies');
    btnAceptarCookies.addEventListener('click', () => {
      panelCookies.style.display = 'none';
      registrarExposicion('k25', 'Cierre de aviso de cookies');
    });
  }

  const btnVolver = document.getElementById('btn-volver-catalogo');
  if (btnVolver) {
    btnVolver.addEventListener('click', () => {
      registrarEvento('navegacion_volver', 'Regreso desde revision a catalogo', 'k32');
      window.location.hash = '#/';
    });
  }

  btnConf.addEventListener('click', () => {
    const panelActivo = document.getElementById('panel-cookies-inferior');
    if (panelActivo && panelActivo.style.display !== 'none') {
      return;
    }

    if (ajustes.k11) {
      const emailConf = document.getElementById('input-confirmar-email').value.trim();
      if (!emailConf) {
        document.getElementById('alerta-revision').innerHTML = '<div class="alerta-mensaje" role="alert">Por favor confirmá tu correo para el comprobante de compra.</div>';
        return;
      }
    }

    registrarEvento('compra_completada', `Total: ${total}`);

    const sesion = obtenerSesion();
    const historial = leerStorage(CLAVE_HISTORIAL, []);
    historial.push({
      id: sesion.id,
      perfil: sesion.perfil,
      preset: sesion.preset,
      inicio: sesion.inicio,
      fin: Date.now(),
      duracionSegundos: Math.round((Date.now() - sesion.inicio) / 1000),
      resultado: 'completada',
      total: total
    });
    escribirStorage(CLAVE_HISTORIAL, historial);

    escribirStorage(CLAVE_CARRITO, []);
    escribirStorage(CLAVE_CUPON, null);
    actualizarContadorBolsa();

    window.location.hash = '#/confirmacion';
  });
}

function renderConfirmacion() {
  const vista = document.getElementById('vista-principal');
  vista.innerHTML = `
    <div class="contenedor">
      <div class="pantalla-centrada">
        <div class="icono-resultado">✓</div>
        <h1 class="detalle-titulo">¡Gracias por tu compra!</h1>
        <p class="hero-bajada">Tu pedido ha sido procesado con éxito bajo el identificador <strong>#CP-${Math.floor(10000 + Math.random() * 90000)}</strong>.</p>
        <p style="font-size: 14px; color: var(--color-secundario);">Te enviamos los detalles de la compra y el enlace de seguimiento a tu correo electrónico.</p>
        <a href="#/" class="btn btn-primary" style="margin-top: 16px;">Volver a la colección</a>
      </div>
    </div>
  `;
}

function renderFin() {
  const vista = document.getElementById('vista-principal');
  vista.innerHTML = `
    <div class="contenedor">
      <div class="pantalla-centrada">
        <h1 class="detalle-titulo">Gracias por tu tiempo</h1>
        <p class="hero-bajada">La sesión ha finalizado correctamente. Podés cerrar esta ventana.</p>
        <a href="#/" class="btn btn-secondary" style="margin-top: 16px;">Ir al inicio</a>
      </div>
    </div>
  `;
}

function renderInfo(tipo) {
  const vista = document.getElementById('vista-principal');
  let titulo = '';
  let contenido = '';

  if (tipo === 'envios') {
    titulo = 'Política de Envíos';
    contenido = `
      <p>Realizamos envíos a todo el territorio nacional a través de servicios de logística de primer nivel.</p>
      <p><strong>Envío a domicilio estándar:</strong> entrega estimada entre 3 y 5 días hábiles a partir de la confirmación de la compra.</p>
      <p><strong>Envío express:</strong> entregas prioritarias en 24 a 48 horas en áreas metropolitanas.</p>
      <p><strong>Retiro en sucursal:</strong> podés retirar tu pedido sin costo adicional transcurridas 48 horas hábiles de realizada la orden.</p>
    `;
  } else if (tipo === 'cambios') {
    titulo = 'Cambios y Devoluciones';
    contenido = `
      <p>Todas las prendas de la colección cuentan con cambio sin cargo dentro de los 30 días corridos posteriores a la recepción del pedido.</p>
      <p>Las prendas deben encontrarse sin uso, con sus etiquetas originales intactas y en su embalaje correspondiente.</p>
      <p>Para gestionar un cambio o devolución, podés comunicarte con nuestro equipo indicando tu número de orden.</p>
    `;
  } else if (tipo === 'contacto') {
    titulo = 'Atención al Cliente';
    contenido = `
      <p>Estamos disponibles para resolver consultas sobre talles, pedidos y despachos.</p>
      <p><strong>Horario de atención:</strong> Lunes a viernes de 9:00 a 18:00 hs.</p>
      <p><strong>Canal de contacto:</strong> atencion@estudiocapsula.com</p>
    `;
  } else if (tipo === 'medios-pago') {
    titulo = 'Medios de Pago';
    contenido = `
      <p>Aceptamos tarjetas de crédito, débito y transferencia bancaria.</p>
      <p>Contamos con opciones de financiamiento y promociones vigentes según el medio de pago seleccionado durante el paso de compra.</p>
    `;
  }

  vista.innerHTML = `
    <div class="contenedor">
      <div style="max-width: 680px; margin: 20px auto;">
        <h1 class="detalle-titulo" style="margin-bottom: 24px;">${titulo}</h1>
        <div style="font-size: 15px; color: var(--color-secundario); line-height: 1.8; display: flex; flex-direction: column; gap: 16px;">
          ${contenido}
        </div>
        <div style="margin-top: 32px;">
          <a href="#/" class="btn btn-secondary">Volver al inicio</a>
        </div>
      </div>
    </div>
  `;
}

function renderAdmin() {
  const vista = document.getElementById('vista-principal');
  const ajustes = obtenerAjustes();
  const sesionActual = obtenerSesion();
  const eventos = leerStorage(CLAVE_EVENTOS, []);
  const historial = leerStorage(CLAVE_HISTORIAL, []);

  const totalSesiones = historial.length + 1;
  const completadas = historial.filter(h => h.resultado === 'completada').length;
  const abandonos = historial.filter(h => h.resultado === 'salida').length;
  const tasaExito = totalSesiones > 0 ? Math.round((completadas / totalSesiones) * 100) : 0;

  let sumaTiempos = historial.reduce((acc, h) => acc + (h.duracionSegundos || 0), 0);
  const promedioTiempo = historial.length > 0 ? Math.round(sumaTiempos / historial.length) : 0;

  const totalClics = eventos.filter(ev => ev.tipo === 'click').length;
  const clicsPorSesion = totalSesiones > 0 ? (totalClics / totalSesiones).toFixed(1) : 0;

  const totalRetrocesos = eventos.filter(ev => ev.tipo === 'retroceso').length;
  const retrocesosPorSesion = totalSesiones > 0 ? (totalRetrocesos / totalSesiones).toFixed(1) : 0;

  const embudoRutas = [
    { ruta: '#/', nombre: 'Inicio' },
    { ruta: '#/producto', nombre: 'Producto' },
    { ruta: '#/carrito', nombre: 'Bolsa' },
    { ruta: '#/checkout/datos', nombre: 'Datos' },
    { ruta: '#/checkout/envio', nombre: 'Envío' },
    { ruta: '#/checkout/pago', nombre: 'Pago' },
    { ruta: '#/checkout/revision', nombre: 'Revisión' },
    { ruta: '#/confirmacion', nombre: 'Confirmación' }
  ];

  const embudoConteos = embudoRutas.map(p => {
    const sesIds = new Set();
    eventos.forEach(ev => {
      if (ev.p && ev.p.startsWith(p.ruta)) sesIds.add(ev.s);
    });
    return {
      nombre: p.nombre,
      conteo: sesIds.size,
      pct: totalSesiones > 0 ? Math.round((sesIds.size / totalSesiones) * 100) : 0
    };
  });

  const exposicionesPorCodigo = {};
  CODIGOS.forEach(k => { exposicionesPorCodigo[k] = 0; });
  eventos.forEach(ev => {
    if (ev.tipo === 'exposicion' && ev.ref && exposicionesPorCodigo[ev.ref] !== undefined) {
      exposicionesPorCodigo[ev.ref] += 1;
    }
  });

  const cuponOk = eventos.filter(ev => ev.tipo === 'cupon_aplicado').length;
  const cuponRechazado = eventos.filter(ev => ev.tipo === 'cupon_rechazado').length;

  vista.innerHTML = `
    <div class="contenedor">
      <div class="panel-admin">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-borde); padding-bottom: 16px;">
          <div>
            <h1 class="detalle-titulo">Panel de Administración</h1>
            <div class="tarjeta-promo">Sesión activa: <strong>${sesionActual.id}</strong> (${sesionActual.perfil}) · Preset: <strong>${sesionActual.preset}</strong></div>
          </div>
          <a href="#/" class="btn btn-secondary btn-sm">Ver tienda</a>
        </div>

        <div class="admin-seccion">
          <h2 class="admin-titulo">Configuración de sesión</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 20px; align-items: center;">
            <div class="grupo-campo" style="min-width: 200px;">
              <label class="grupo-etiqueta" for="selector-preset-admin">Preset</label>
              <select id="selector-preset-admin" class="campo-control">
                <option value="activo" ${ajustes.preset === 'activo' ? 'selected' : ''}>Configuración activa (todos)</option>
                <option value="s0" ${ajustes.preset === 's0' ? 'selected' : ''}>A: Control (sin modificaciones)</option>
                <option value="s1" ${ajustes.preset === 's1' ? 'selected' : ''}>B: Información secundaria</option>
                <option value="s2" ${ajustes.preset === 's2' ? 'selected' : ''}>C: Fricción y pasos</option>
                <option value="s3" ${ajustes.preset === 's3' ? 'selected' : ''}>D: Jerarquía y estados</option>
                <option value="s4" ${ajustes.preset === 's4' ? 'selected' : ''}>E: Cupón y cuotas</option>
                <option value="personalizado" ${ajustes.preset === 'personalizado' ? 'selected' : ''}>Personalizado</option>
              </select>
            </div>

            <div class="grupo-campo" style="min-width: 200px;">
              <label class="grupo-etiqueta" for="selector-perfil-admin">Perfil de usuario</label>
              <select id="selector-perfil-admin" class="campo-control">
                <option value="humano" ${ajustes.perfil === 'humano' ? 'selected' : ''}>Persona</option>
                <option value="dom" ${ajustes.perfil === 'dom' ? 'selected' : ''}>Agente DOM</option>
                <option value="visual" ${ajustes.perfil === 'visual' ? 'selected' : ''}>Agente capturas</option>
              </select>
            </div>

            <div style="margin-top: 24px;">
              <button type="button" class="btn btn-primary" id="btn-iniciar-sesion-nueva">Iniciar sesión nueva</button>
            </div>
          </div>

          <div style="margin-top: 16px;">
            <label class="grupo-etiqueta" style="margin-bottom: 12px;">Comportamientos individuales</label>
            <div class="admin-grid-toggles">
              ${CODIGOS.map(k => `
                <label class="admin-toggle-item">
                  <input type="checkbox" class="toggle-codigo" data-codigo="${k}" ${ajustes[k] ? 'checked' : ''}>
                  <div>
                    <strong>${k}</strong>: ${ETIQUETAS_CODIGOS[k]}
                  </div>
                </label>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="admin-seccion">
          <h2 class="admin-titulo">Métricas de rendimiento</h2>
          <div class="metricas-grid">
            <div class="metrica-card">
              <span class="metrica-numero">${totalSesiones}</span>
              <span class="metrica-etiqueta">Sesiones totales</span>
            </div>
            <div class="metrica-card">
              <span class="metrica-numero">${completadas}</span>
              <span class="metrica-etiqueta">Completadas</span>
            </div>
            <div class="metrica-card">
              <span class="metrica-numero">${abandonos}</span>
              <span class="metrica-etiqueta">Finalizadas sin compra</span>
            </div>
            <div class="metrica-card">
              <span class="metrica-numero">${tasaExito}%</span>
              <span class="metrica-etiqueta">Tasa de éxito</span>
            </div>
            <div class="metrica-card">
              <span class="metrica-numero">${promedioTiempo}s</span>
              <span class="metrica-etiqueta">Tiempo medio</span>
            </div>
            <div class="metrica-card">
              <span class="metrica-numero">${clicsPorSesion}</span>
              <span class="metrica-etiqueta">Clics promedio</span>
            </div>
            <div class="metrica-card">
              <span class="metrica-numero">${retrocesosPorSesion}</span>
              <span class="metrica-etiqueta">Retrocesos promedio</span>
            </div>
            <div class="metrica-card">
              <span class="metrica-numero">${cuponOk} / ${cuponRechazado}</span>
              <span class="metrica-etiqueta">Cupón: aceptado / rechazado</span>
            </div>
          </div>
        </div>

        <div class="admin-seccion">
          <h2 class="admin-titulo">Embudo de navegación</h2>
          <div class="embudo-barras">
            ${embudoConteos.map(e => `
              <div class="embudo-fila">
                <span>${e.nombre}</span>
                <div class="embudo-riel">
                  <div class="embudo-progreso" style="width: ${e.pct}%;"></div>
                </div>
                <span style="text-align: right;">${e.conteo} (${e.pct}%)</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="admin-seccion">
          <h2 class="admin-titulo">Registro de exposición por código</h2>
          <table class="tabla-admin">
            <thead>
              <tr>
                <th>Código</th>
                <th>Descripción</th>
                <th>Activo en sesión</th>
                <th>Exposiciones registradas</th>
              </tr>
            </thead>
            <tbody>
              ${CODIGOS.map(k => `
                <tr>
                  <td><strong>${k}</strong></td>
                  <td>${ETIQUETAS_CODIGOS[k]}</td>
                  <td>${ajustes[k] ? 'Sí' : 'No'}</td>
                  <td>${exposicionesPorCodigo[k]}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="admin-seccion">
          <h2 class="admin-titulo">Gestión de datos y exportación</h2>
          <div class="fila-acciones">
            <button type="button" class="btn btn-secondary btn-sm" id="btn-exportar-json">Exportar JSON</button>
            <button type="button" class="btn btn-secondary btn-sm" id="btn-exportar-csv">Exportar CSV</button>
            <label class="btn btn-secondary btn-sm" style="margin: 0; cursor: pointer;">
              Importar JSON <input type="file" id="input-importar-json" accept=".json" style="display: none;">
            </label>
            <label class="btn btn-secondary btn-sm" style="margin: 0; cursor: pointer;">
              Importar CSV <input type="file" id="input-importar-csv" accept=".csv" style="display: none;">
            </label>
          </div>
          <div class="fila-acciones" style="margin-top: 12px;">
            <button type="button" class="btn btn-secondary btn-sm" id="btn-limpiar-carrito">Vaciar carrito actual</button>
            <button type="button" class="btn btn-secondary btn-sm" id="btn-limpiar-sesion">Reiniciar sesión actual</button>
            <button type="button" class="btn btn-secondary btn-sm" id="btn-limpiar-eventos">Borrar eventos y sesiones</button>
            <button type="button" class="btn btn-secondary btn-sm" id="btn-restablecer-todo">Restablecer todo a inicial</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const selPreset = document.getElementById('selector-preset-admin');
  const selPerfil = document.getElementById('selector-perfil-admin');
  const toggles = vista.querySelectorAll('.toggle-codigo');

  selPreset.addEventListener('change', () => {
    const p = selPreset.value;
    if (PRESETS[p]) {
      toggles.forEach(t => {
        const k = t.getAttribute('data-codigo');
        t.checked = PRESETS[p].includes(k);
      });
    }
  });

  document.getElementById('btn-iniciar-sesion-nueva').addEventListener('click', () => {
    const p = selPreset.value;
    const perfil = selPerfil.value;
    const codigosMarcados = [];
    toggles.forEach(t => {
      if (t.checked) codigosMarcados.push(t.getAttribute('data-codigo'));
    });

    iniciarNuevaSesion(p, perfil, codigosMarcados);
    actualizarBannerSuperior();
    alert('Nueva sesión iniciada con los ajustes seleccionados.');
    window.location.hash = '#/';
  });

  document.getElementById('btn-limpiar-carrito').addEventListener('click', () => {
    if (confirm('¿Vaciar el carrito de la sesión actual?')) {
      escribirStorage(CLAVE_CARRITO, []);
      actualizarContadorBolsa();
      alert('Carrito vaciado.');
    }
  });

  document.getElementById('btn-limpiar-sesion').addEventListener('click', () => {
    if (confirm('¿Reiniciar la sesión actual y sus registros?')) {
      const ajustesAct = obtenerAjustes();
      iniciarNuevaSesion(ajustesAct.preset, ajustesAct.perfil);
      actualizarBannerSuperior();
      renderAdmin();
    }
  });

  document.getElementById('btn-limpiar-eventos').addEventListener('click', () => {
    if (confirm('¿Borrar todos los eventos y sesiones guardados?')) {
      escribirStorage(CLAVE_EVENTOS, []);
      escribirStorage(CLAVE_HISTORIAL, []);
      renderAdmin();
    }
  });

  document.getElementById('btn-restablecer-todo').addEventListener('click', () => {
    if (confirm('¿Restablecer todo el sistema a valores iniciales y limpiar datos?')) {
      iniciarNuevaSesion('activo', 'humano');
      escribirStorage(CLAVE_EVENTOS, []);
      escribirStorage(CLAVE_HISTORIAL, []);
      actualizarBannerSuperior();
      renderAdmin();
    }
  });

  document.getElementById('btn-exportar-json').addEventListener('click', () => {
    const payload = {
      sesionActual: obtenerSesion(),
      ajustes: obtenerAjustes(),
      historial: leerStorage(CLAVE_HISTORIAL, []),
      eventos: leerStorage(CLAVE_EVENTOS, [])
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sesiones_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('btn-exportar-csv').addEventListener('click', () => {
    const evs = leerStorage(CLAVE_EVENTOS, []);
    let csv = 'sesion,timestamp,pantalla,tipo,detalle,ref\n';
    evs.forEach(ev => {
      const det = (ev.d || '').replace(/"/g, '""');
      csv += `"${ev.s}",${ev.t},"${ev.p}","${ev.tipo}","${det}","${ev.ref || ''}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eventos_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('input-importar-json').addEventListener('change', (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    const lector = new FileReader();
    lector.onload = (ev) => {
      try {
        const datos = JSON.parse(ev.target.result);
        if (datos.historial) escribirStorage(CLAVE_HISTORIAL, datos.historial);
        if (datos.eventos) escribirStorage(CLAVE_EVENTOS, datos.eventos);
        if (datos.ajustes) escribirStorage(CLAVE_AJUSTES, datos.ajustes);
        alert('Datos importados correctamente.');
        renderAdmin();
      } catch (err) {
        alert('No se pudo procesar el archivo JSON.');
      }
    };
    lector.readAsText(archivo);
  });

  document.getElementById('input-importar-csv').addEventListener('change', (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    const lector = new FileReader();
    lector.onload = (ev) => {
      try {
        const lineas = ev.target.result.split('\n');
        const evs = [];
        for (let i = 1; i < lineas.length; i++) {
          const l = lineas[i].trim();
          if (!l) continue;
          const partes = l.split(',');
          if (partes.length >= 4) {
            evs.push({
              s: partes[0].replace(/"/g, ''),
              t: Number(partes[1]),
              p: partes[2].replace(/"/g, ''),
              tipo: partes[3].replace(/"/g, ''),
              d: partes[4] ? partes[4].replace(/"/g, '') : '',
              ref: partes[5] ? partes[5].replace(/"/g, '') : ''
            });
          }
        }
        escribirStorage(CLAVE_EVENTOS, evs);
        alert('Eventos importados desde CSV.');
        renderAdmin();
      } catch (err) {
        alert('No se pudo procesar el archivo CSV.');
      }
    };
    lector.readAsText(archivo);
  });
}

function router() {
  const hash = window.location.hash || '#/';
  const tiempoEnRuta = Math.round((Date.now() - timestampUltimaRuta) / 1000);

  if (ultimaRuta && ultimaRuta !== hash) {
    registrarEvento('tiempo_pantalla', `${tiempoEnRuta}s en ${ultimaRuta}`);

    const pasosCheckout = ['#/carrito', '#/checkout/datos', '#/checkout/sugerencias', '#/sugerencias', '#/checkout/envio', '#/checkout/pago', '#/checkout/revision'];
    const idxPrev = pasosCheckout.indexOf(ultimaRuta);
    const idxAct = pasosCheckout.indexOf(hash);
    if (idxPrev !== -1 && idxAct !== -1 && idxAct < idxPrev) {
      registrarEvento('retroceso', `De ${ultimaRuta} a ${hash}`);
      const ajustes = obtenerAjustes();
      if (ajustes.k13) {
        guardarCupon(null);
        registrarEvento('reinicio_cupon_retroceso', 'Cupón eliminado por retroceso', 'k13');
      }
    }
  }

  ultimaRuta = hash;
  timestampUltimaRuta = Date.now();
  window.scrollTo(0, 0);

  const bannerPie = document.getElementById('banner-promocion-pie');
  if (bannerPie) {
    if (hash === '#/' || hash === '') {
      bannerPie.innerHTML = '<div class="banner-pie-promocion-fijo">Beneficio exclusivo online: 15% de descuento con el código Capsula 15</div>';
      bannerPie.style.display = 'block';
    } else {
      bannerPie.innerHTML = '';
      bannerPie.style.display = 'none';
    }
  }

  if (hash === RUTA_ADMIN) {
    renderAdmin();
    return;
  }

  if (hash === '#/' || hash === '') {
    renderCatalogo();
  } else if (hash.startsWith('#/producto/')) {
    const id = hash.replace('#/producto/', '');
    renderDetalle(id);
  } else if (hash === '#/carrito') {
    renderCarrito();
  } else if (hash === '#/checkout/sugerencias' || hash === '#/sugerencias') {
    renderSugerencias();
  } else if (hash === '#/checkout/datos') {
    renderCheckoutDatos();
  } else if (hash === '#/checkout/envio') {
    renderCheckoutEnvio();
  } else if (hash === '#/checkout/pago') {
    renderCheckoutPago();
  } else if (hash === '#/checkout/revision') {
    renderCheckoutRevision();
  } else if (hash === '#/confirmacion') {
    renderConfirmacion();
  } else if (hash === '#/fin') {
    renderFin();
  } else if (hash === '#/envios') {
    renderInfo('envios');
  } else if (hash === '#/cambios') {
    renderInfo('cambios');
  } else if (hash === '#/contacto') {
    renderInfo('contacto');
  } else if (hash === '#/medios-pago') {
    renderInfo('medios-pago');
  } else {
    window.location.hash = '#/';
  }
}

function inicializarSalidas() {
  const enlaceHumano = document.getElementById('enlace-salida');
  if (enlaceHumano) {
    enlaceHumano.addEventListener('click', (e) => {
      e.preventDefault();
      registrarEvento('salida_usuario', 'Salida voluntaria por pie');
      const sesion = obtenerSesion();
      const historial = leerStorage(CLAVE_HISTORIAL, []);
      historial.push({
        id: sesion.id,
        perfil: sesion.perfil,
        preset: sesion.preset,
        inicio: sesion.inicio,
        fin: Date.now(),
        duracionSegundos: Math.round((Date.now() - sesion.inicio) / 1000),
        resultado: 'salida'
      });
      escribirStorage(CLAVE_HISTORIAL, historial);
      window.location.hash = '#/fin';
    });
  }

  const btnDom = document.getElementById('btn-salida-directa');
  if (btnDom) {
    btnDom.addEventListener('click', () => {
      registrarEvento('salida_directa', 'Salida asistida por DOM');
      const sesion = obtenerSesion();
      const historial = leerStorage(CLAVE_HISTORIAL, []);
      historial.push({
        id: sesion.id,
        perfil: sesion.perfil,
        preset: sesion.preset,
        inicio: sesion.inicio,
        fin: Date.now(),
        duracionSegundos: Math.round((Date.now() - sesion.inicio) / 1000),
        resultado: 'salida'
      });
      escribirStorage(CLAVE_HISTORIAL, historial);
      window.location.hash = '#/fin';
    });
  }
}

function inicializarCapturaClics() {
  document.addEventListener('click', (e) => {
    const el = e.target.closest('button, a, input[type="radio"], input[type="checkbox"]');
    if (el) {
      const etiqueta = el.innerText || el.getAttribute('aria-label') || el.id || el.name || 'elemento';
      const limpia = etiqueta.replace(/\s+/g, ' ').trim().substring(0, 40);
      registrarEvento('click', limpia);
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  verificarParametroUrl();
  actualizarBannerSuperior();
  actualizarContadorBolsa();
  inicializarSalidas();
  inicializarCapturaClics();
  iniciarTemporizadorReserva();
  router();
});

window.addEventListener('hashchange', router);
