// Productos en stock
const prodNaruto = [
    { 
        nombre: "Anillos de Akatsuki",
        precio: 2.00,
        id: 1
    },
    {
        nombre: "Collar de Naruto",
        precio: 1.75,
        id: 2
    },
    {   
        nombre: "Lámpara de Naruto",
        precio: 20,
        id: 3
    },
];

// Variables globales
let carrito = [];

// Seleccionamos la sección de Naruto para insertar los productos
const section = document.querySelector("#index #acc #naruto");

// Mapeamos los productos a HTML
const arrayFromProdNaruto = prodNaruto.map(producto => `
    <div class="grupo">
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
    </div>
`);

// Insertamos los productos en el HTML
section.innerHTML = arrayFromProdNaruto.join("");

// Función para actualizar el carrito
function actualizarCarrito() {
    const carritoContainer = document.querySelector("#carrito-container");
    carritoContainer.innerHTML = ""; // Limpiamos el contenido actual

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
        const producto = prodNaruto.find(p => p.id === idProducto);

        const productoEnCarrito = carrito.find(p => p.id === producto.id);

        if (productoEnCarrito) {
            productoEnCarrito.cantidad += 1; // Si ya está en el carrito, aumentamos la cantidad
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

// Retirar un artículo del carrito
document.addEventListener("click", function(event) {
    if (event.target && event.target.classList.contains("retirar")) {
        const idProducto = parseInt(event.target.getAttribute("data-id"));
        carrito = carrito.filter(item => item.id !== idProducto); // Elimina el artículo del carrito

        // Actualizamos el carrito
        actualizarCarrito();
    }
});

// Función para finalizar la compra
function finalizarCompra() {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    let detalleCompra = "Resumen de tu compra:\n";
    let total = 0;

    carrito.forEach(item => {
        const subtotal = item.cantidad * item.precio;
        detalleCompra += `${item.cantidad} x ${item.nombre} - $${subtotal}\n`;
        total += subtotal;
    });

    detalleCompra += `Total a pagar: $${total}`;

    alert(detalleCompra);

    // Cashealo: solo se puede usar si el total es mayor o igual a 25
    if (total >= 25) {
        alert(`Tu total es de $${total}. Puedes usar Cashea y pagarlo en cuotas.`);
    } else {
        alert(`Tu total es de $${total}. No puedes usar Cashea ya que el total es menor a $25.`);
    }
}

// Botón para finalizar la compra
const finalizarBtn = document.querySelector("#finalizar-compra");
if (finalizarBtn) {
    finalizarBtn.addEventListener("click", finalizarCompra);
}