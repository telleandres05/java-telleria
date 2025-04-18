// Productos en stock 
const prodNaruto = [
    { nombre: "Anillos de Akatsuki", precio: 2.00, id: 1 },
    { nombre: "Collar de Naruto", precio: 1.75, id: 2 },
    { nombre: "Lámpara de Naruto", precio: 20, id: 3 }
];

const prodDbz = [
    { nombre: "Lámpara de Goku", precio: 15.75, id: 4 },
    { nombre: "Llaveros de Cápsulas", precio: 7.25, id: 5 },
    { nombre: "Llaveros de Esferas", precio: 5.5, id: 6 }
];

// Variable
let carrito = [];

// Mostrar productos en HTML
function mostrarProductos(productos, section) {
    section.innerHTML = productos.map(producto => 
    `<div class="grupo">
        <div class="img">
            <img src="./img/${producto.id}.jpg" alt="${producto.nombre}" />
            <div class="desc">
                <p>${producto.nombre} <br><strong>$ ${producto.precio}</strong></p>
                <div class="botton">
                    <div class="botton1">
                        <button class="agregar-carrito" data-id="${producto.id}">Agregar al Carrito</button>
                    </div>
                    <div class="botton2">
                        <a href="#">Cashealo!</a>
                    </div>
                </div>
            </div>
        </div>
    </div>`
).join('');
}

// Agregar en el codigo HTML en las secciones correspondientes
const sectionNaruto = document.querySelector("#naruto");
const sectionDbz = document.querySelector("#dbz");

mostrarProductos(prodNaruto, sectionNaruto);
mostrarProductos(prodDbz, sectionDbz);

// Anexar productos el carrito
function actualizarCarrito() {
    const carritoContainer = document.querySelector("#carrito-container");
    carritoContainer.innerHTML = ""; 

    if (carrito.length === 0) {
        carritoContainer.innerHTML = "<p>Tu carrito está vacío.</p>";
    } else {
        carrito.forEach(item => {
            const itemHTML = `
                <div class="item-carrito">
                    <p>${item.nombre} - ${item.cantidad} x $${item.precio}</p>
                    <button class="retirar" data-id="${item.id}">Retirar</button>
                </div>
            `;
            carritoContainer.innerHTML += itemHTML;
        });
    }
}

// Agregar al carrito

document.querySelectorAll(".agregar-carrito").forEach(button => {
    button.addEventListener("click", function() {
        const idProducto = parseInt(this.getAttribute("data-id"));
        
        // Buscar el producto en los dos arrays (Naruto y DBZ)
        let producto = prodNaruto.find(p => p.id === idProducto) || prodDbz.find(p => p.id === idProducto);
        
        const productoEnCarrito = carrito.find(p => p.id === producto.id);

        if (productoEnCarrito) {
            productoEnCarrito.cantidad += 1; 
        } else {
            carrito.push({
                ...producto,
                cantidad: 1
            });
        }

        // Actualizamos el carrito
        actualizarCarrito();
    });
});

// Retirar articulos del carrito
document.addEventListener("click", function(event) {
    if (event.target && event.target.classList.contains("retirar")) {
        const idProducto = parseInt(event.target.getAttribute("data-id"));
        carrito = carrito.filter(item => item.id !== idProducto);
        actualizarCarrito();
    }
});

// Finalizar la compra
function finalizarCompra() {
    const mensajeCompra = document.querySelector("#mensaje-compra");
    const nuevaCompraBtn = document.querySelector("#nueva-compra");
    const carritoContainer = document.querySelector("#carrito-container");
    const finalizarBtn = document.querySelector("#finalizar-compra");
    mensajeCompra.innerHTML = "";

    if (carrito.length === 0) {
        mensajeCompra.innerHTML = "<p>Tu carrito está vacío.</p>";
        return; 
    }

    let detalleCompra = "Resumen de tu compra:<br>";
    let total = 0;

    carrito.forEach(item => {
        const subtotal = item.cantidad * item.precio;
        detalleCompra += `${item.cantidad} x ${item.nombre} - $${subtotal}<br>`;
        total += subtotal;
    });

    detalleCompra += `Total a pagar: $${total}<br>`;

    // Resumen de compra
    mensajeCompra.innerHTML += `<p>${detalleCompra}</p>`;

    // Cashealo: solo se puede usar si el total es mayor o igual a 25
    if (total >= 25) {
        mensajeCompra.innerHTML += `<p>Tu total es de $${total}. Puedes usar Cashea y pagarlo en cuotas.</p>`;
    } else {
        mensajeCompra.innerHTML += `<p>Tu total es de $${total}. No puedes usar Cashea ya que el total es menor a $25.</p>`;
    }

    // Ocultamos los productos, el botón de finalizar
    carritoContainer.style.display = "none";
    finalizarBtn.style.display = "none";

    // Mostrar el botón "Nueva compra" después de finalizar la compra
    nuevaCompraBtn.style.display = "inline-block";
}

// Función para reiniciar el carrito
document.querySelector("#nueva-compra").addEventListener("click", function() {
    carrito = []; 
    actualizarCarrito(); 
    document.querySelector("#mensaje-compra").innerHTML = "";

    document.querySelector("#nueva-compra").style.display = "none"; 

    // Mostramos los productos y el botón "Finalizar compra"
    document.querySelector("#carrito-container").style.display = "block";
    document.querySelector("#finalizar-compra").style.display = "inline-block";
});

// Botón para finalizar la compra
const finalizarBtn = document.querySelector("#finalizar-compra");
if (finalizarBtn) {
    finalizarBtn.addEventListener("click", finalizarCompra);
}