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

// Variable para el carrito
let carrito = JSON.parse(localStorage.getItem('carrito')) || []; // Cargar desde LocalStorage si existe

// Mostrar productos en HTML
function mostrarProductos(productos, section) {
    section.innerHTML = productos.map(producto => 
    `<div class="grupo">
        <div class="img">
            <img src="./img/${producto.id}.jpg" alt="${producto.nombre}" />
            <div class="desc">
                <p>${producto.nombre} <br><strong>$ ${producto.precio}</strong></p>
                <div class="botton" data-id="${producto.id}">
                    <div class="botton1">
                        <button class="agregar-carrito" data-id="${producto.id}">Agregar al Carrito</button>
                    </div>
                    <div class="botton3" style="display:none;">
                        <button class="bottonReduce bottonCarro" data-id="${producto.id}"> - </button>
                        <input type="text" class="cantidad" data-id="${producto.id}" value="1" min="0">
                        <button class="bottonIncrease bottonCarro" data-id="${producto.id}"> + </button>
                    </div>
                    <div class="botton2">
                    <a href="">Cashealo!</a>
                </div>
                </div>
            </div>
        </div>
    </div>`).join('');
}

// Agregar en el código HTML en las secciones correspondientes
const sectionNaruto = document.querySelector("#naruto");
const sectionDbz = document.querySelector("#dbz");

mostrarProductos(prodNaruto, sectionNaruto);
mostrarProductos(prodDbz, sectionDbz);

// Función para actualizar el carrito en la UI
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

    // Guardar el carrito en LocalStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función para agregar productos al carrito
document.querySelectorAll(".agregar-carrito").forEach(button => {
    button.addEventListener("click", function() {
        const idProducto = parseInt(this.getAttribute("data-id"));
        
        // Buscar el producto en los arrays
        let producto = prodNaruto.find(p => p.id === idProducto) || prodDbz.find(p => p.id === idProducto);
        
        const productoEnCarrito = carrito.find(p => p.id === producto.id);

        if (productoEnCarrito) {
            productoEnCarrito.cantidad += 1; // Si ya está en el carrito, aumentar la cantidad
        } else {
            carrito.push({
                ...producto,
                cantidad: 1
            });
        }

        // Actualizamos la UI del carrito
        actualizarCarrito();

        // Cambiar a la vista de cantidad
        const botonAgregar = this.closest('.botton').querySelector('.botton1');
        const botonCantidad = this.closest('.botton').querySelector('.botton3');
        botonAgregar.style.display = "none";
        botonCantidad.style.display = "block";
        this.closest('.botton').querySelector('.cantidad').value = 1; // Establecer cantidad a 1
    });
});

// Función para actualizar la cantidad de un producto en el carrito con los botones + y - 
document.addEventListener("click", function(event) {
    if (event.target && event.target.classList.contains("bottonReduce")) {
        const idProducto = parseInt(event.target.getAttribute("data-id"));
        const productoEnCarrito = carrito.find(p => p.id === idProducto);
        if (productoEnCarrito && productoEnCarrito.cantidad > 1) {
            productoEnCarrito.cantidad -= 1;
        }
        // Actualizar el valor en el input
        const cantidadInput = event.target.closest('.botton3').querySelector('.cantidad');
        cantidadInput.value = productoEnCarrito.cantidad;
        actualizarCarrito();
    }

    if (event.target && event.target.classList.contains("bottonIncrease")) {
        const idProducto = parseInt(event.target.getAttribute("data-id"));
        const productoEnCarrito = carrito.find(p => p.id === idProducto);
        if (productoEnCarrito) {
            productoEnCarrito.cantidad += 1;
        }
        // Actualizar el valor en el input
        const cantidadInput = event.target.closest('.botton3').querySelector('.cantidad');
        cantidadInput.value = productoEnCarrito.cantidad;
        actualizarCarrito();
    }

    // Retirar producto del carrito
    if (event.target && event.target.classList.contains("retirar")) {
        const idProducto = parseInt(event.target.getAttribute("data-id"));
        carrito = carrito.filter(item => item.id !== idProducto);
        actualizarCarrito();

        // Mostrar de nuevo el botón de agregar y ocultar el de cantidad
        const productoRetirado = prodNaruto.find(p => p.id === idProducto) || prodDbz.find(p => p.id === idProducto);
        const botonAgregar = document.querySelector(`.botton[data-id="${productoRetirado.id}"] .botton1`);
        const botonCantidad = document.querySelector(`.botton[data-id="${productoRetirado.id}"] .botton3`);

        // Mostrar el botón de agregar y ocultar el de cantidad
        botonAgregar.style.display = "block";
        botonCantidad.style.display = "none";
        
        // Limpiar el valor del input (restablecer a 1)
        botonCantidad.querySelector('.cantidad').value = 1;
    }
});

// Función para finalizar la compra
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

    mensajeCompra.innerHTML += `<p>${detalleCompra}</p>`;

    if (total >= 25) {
        mensajeCompra.innerHTML += `<p>Tu total es de $${total}. Puedes usar Cashea y pagarlo en cuotas.</p>`;
    } else {
        mensajeCompra.innerHTML += `<p>Tu total es de $${total}. No puedes usar Cashea ya que el total es menor a $25.</p>`;
    }

    carritoContainer.style.display = "none";
    finalizarBtn.style.display = "none";
    nuevaCompraBtn.style.display = "inline-block";
}

// Reiniciar el carrito y mostrar productos
document.querySelector("#nueva-compra").addEventListener("click", function() {
    carrito = [];  // Limpiar el carrito
    actualizarCarrito();  // Actualizar el contenido del carrito

    // Limpiar la UI del carrito y la vista de productos
    document.querySelector("#mensaje-compra").innerHTML = "";
    document.querySelector("#nueva-compra").style.display = "none";
    document.querySelector("#carrito-container").style.display = "block";
    document.querySelector("#finalizar-compra").style.display = "inline-block";

    // Volver a mostrar los botones de agregar y ocultar los de cantidad
    prodNaruto.concat(prodDbz).forEach(producto => {
        const botonAgregar = document.querySelector(`.botton[data-id="${producto.id}"] .botton1`);
        const botonCantidad = document.querySelector(`.botton[data-id="${producto.id}"] .botton3`);

        if (botonAgregar) {
            botonAgregar.style.display = "block";  // Mostrar el botón de agregar
        }
        if (botonCantidad) {
            botonCantidad.style.display = "none";  // Ocultar el botón de cantidad
        }
    });
});

// Botón para finalizar la compra
const finalizarBtn = document.querySelector("#finalizar-compra");
if (finalizarBtn) {
    finalizarBtn.addEventListener("click", finalizarCompra);
}

// Verificar si el carrito tiene productos al cargar la página y actualizar los botones
window.addEventListener("load", function() {
    // Mostrar productos en el carrito
    actualizarCarrito();

    carrito.forEach(item => {
        const botonAgregar = document.querySelector(`.botton[data-id="${item.id}"] .botton1`);
        const botonCantidad = document.querySelector(`.botton[data-id="${item.id}"] .botton3`);

        if (botonAgregar && botonCantidad) {
            botonAgregar.style.display = "none";  // Ocultar el botón de agregar
            botonCantidad.style.display = "block";  // Mostrar el botón de cantidad
            botonCantidad.querySelector('.cantidad').value = item.cantidad;  // Establecer la cantidad en el input
        }
    });
});
