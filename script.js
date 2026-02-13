// 1. BASE DE DATOS
const productos = [
    { id: 1, nombre: "Runner Pro Max", precio: 1299, img: "img/zapatillas.jpg", cat: "Calzado" },
    { id: 2, nombre: "Smartwatch Series X", precio: 2199, img: "img/smartwatch.jpg", cat: "Accesorios" },
    { id: 3, nombre: "Zapatillas Ultra", precio: 1500, img: "img/zapatillas.jpg", cat: "Calzado" }
];

// 2. ESTADO GLOBAL
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
let tallaSeleccionada = "";

// --- FUNCIONES DE TIENDA (INDEX) ---
function renderizarTienda(lista = productos) {
    const grid = document.getElementById("grid");
    if (!grid) return;
    grid.innerHTML = "";
    lista.forEach(p => {
        const esFav = favoritos.includes(p.id) ? "active" : "";
        grid.innerHTML += `
            <div class="card" onclick="irAProducto(${p.id})">
                <button class="fav-btn ${esFav}" onclick="event.stopPropagation(); toggleFav(${p.id})">❤️</button>
                <img src="${p.img}" alt="${p.nombre}">
                <div class="card-info">
                    <small>${p.cat}</small>
                    <h4>${p.nombre}</h4>
                    <p class="precio">$${p.precio.toLocaleString()} MXN</p>
                </div>
            </div>`;
    });
}

function filtrarBusqueda() {
    const texto = document.getElementById("busqueda").value.toLowerCase();
    const filtrados = productos.filter(p => p.nombre.toLowerCase().includes(texto));
    renderizarTienda(filtrados);
}

// --- FUNCIONES DE PRODUCTO ---
function irAProducto(id) {
    const p = productos.find(x => x.id === id);
    localStorage.setItem("producto_actual", JSON.stringify(p));
    window.location.href = "producto.html";
}

function cargarDetalle() {
    const p = JSON.parse(localStorage.getItem("producto_actual"));
    if (!p) return window.location.href = "index.html";
    
    document.getElementById("p-img").src = p.img;
    document.getElementById("p-nombre").innerText = p.nombre;
    document.getElementById("p-cat").innerText = p.cat;
    document.getElementById("p-precio").innerText = `$${p.precio.toLocaleString()} MXN`;
    actualizarContador();
}

function setTalla(talla, btn) {
    tallaSeleccionada = talla;
    document.querySelectorAll('.talla-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function añadirAlCarrito() {
    if (!tallaSeleccionada) return alert("⚠️ Por favor, selecciona una talla.");
    const p = JSON.parse(localStorage.getItem("producto_actual"));
    carrito.push({ ...p, talla: tallaSeleccionada, cant: 1, uid: Date.now() });
    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert("✅ ¡Producto agregado al carrito!");
    actualizarContador();
}

function comprarYaWA() {
    if (!tallaSeleccionada) return alert("⚠️ Por favor, selecciona una talla.");
    const p = JSON.parse(localStorage.getItem("producto_actual"));
    const msg = `¡Hola! Me interesa comprar:\n\n*Producto:* ${p.nombre}\n*Talla:* ${tallaSeleccionada}\n*Precio:* $${p.precio.toLocaleString()} MXN\n\nQuedo en espera de su respuesta.`;
    window.open(`https://wa.me/5218131615365?text=${encodeURIComponent(msg)}`);
}

// --- FUNCIONES DE CARRITO (CARRITO.HTML) ---
function renderizarCarrito() {
    const lista = document.getElementById("lista-carrito");
    const resumen = document.getElementById("resumen-pago");
    const vacio = document.getElementById("carrito-vacio");
    if (!lista) return;

    if (carrito.length === 0) {
        lista.innerHTML = "";
        resumen.style.display = "none";
        vacio.style.display = "block";
    } else {
        vacio.style.display = "none";
        resumen.style.display = "block";
        lista.innerHTML = "";
        let total = 0;
        carrito.forEach((item, index) => {
            total += item.precio * item.cant;
            lista.innerHTML += `
                <div class="cart-item">
                    <img src="${item.img}">
                    <div class="info">
                        <h4>${item.nombre}</h4>
                        <small>Talla: ${item.talla}</small>
                        <p>$${(item.precio * item.cant).toLocaleString()} MXN</p>
                    </div>
                    <div class="btns">
                        <button onclick="borrarItem(${index})" style="color:red;">🗑️</button>
                    </div>
                </div>`;
        });
        document.getElementById("total-val").innerText = `$${total.toLocaleString()} MXN`;
    }
    actualizarContador();
}

function borrarItem(index) {
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderizarCarrito();
    actualizarContador();
}

// --- UTILIDADES ---
function toggleFav(id) {
    const idx = favoritos.indexOf(id);
    if (idx > -1) favoritos.splice(idx, 1);
    else favoritos.push(id);
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    renderizarTienda();
}

function verFavoritos() {
    const listaFavs = productos.filter(p => favoritos.includes(p.id));
    renderizarTienda(listaFavs);
    document.querySelector('.hero-banner h1').innerText = "Tus Favoritos ❤️";
    document.querySelector('.hero-banner p').innerText = "Los productos que más te gustan";
}

function actualizarContador() {
    const badge = document.getElementById("cart-count");
    if (badge) badge.innerText = carrito.length;
}

function finalizarWhatsApp() {
    if (carrito.length === 0) return alert("El carrito está vacío.");
    let msg = "¡Hola! Quiero realizar el siguiente pedido:\n\n";
    let total = 0;
    carrito.forEach(i => {
        msg += `• ${i.nombre} (Talla ${i.talla}) - $${i.precio.toLocaleString()}\n`;
        total += i.precio;
    });
    msg += `\n*Total a pagar: $${total.toLocaleString()} MXN*`;
    window.open(`https://wa.me/5218131615365?text=${encodeURIComponent(msg)}`);
}