// Variables globales
let prodNaruto = [];
let prodDbz = [];
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Referencias al DOM
const sectionNaruto = document.querySelector("#naruto");
const sectionDbz = document.querySelector("#dbz");

// Cargar productos desde JSON con try/catch
async function cargarProductos() {
  try {
    const res = await fetch('./json/productos.json');
    const data = await res.json();
    prodNaruto = data.naruto;
    prodDbz = data.dbz;

    mostrarProductos(prodNaruto, sectionNaruto);
    mostrarProductos(prodDbz, sectionDbz);

    cargarListeners();
    restaurarEstadoBotones();
    actualizarCarrito();
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error al cargar productos',
      text: 'Intenta recargar la página.',
    });
  }
}

cargarProductos();

// Mostrar productos en el HTML
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
                        <input type="text" class="cantidad" data-id="${producto.id}" value="1" min="1" pattern="[0-9]+">
                        <button class="bottonIncrease bottonCarro" data-id="${producto.id}"> + </button>
                    </div>
                    <div class="botton2">
                        <a href="">Cashealo!</a>
                    </div>
                </div>
            </div>
        </div>
    </div>`
  ).join('');
}

// Agregar eventos a los botones luego de renderizar productos
function cargarListeners() {
  document.querySelectorAll(".agregar-carrito").forEach(button => {
    button.addEventListener("click", function () {
      const idProducto = parseInt(this.getAttribute("data-id"));
      let producto = prodNaruto.find(p => p.id === idProducto) || prodDbz.find(p => p.id === idProducto);
      const productoEnCarrito = carrito.find(p => p.id === producto.id);

      if (productoEnCarrito) {
        productoEnCarrito.cantidad += 1;
      } else {
        carrito.push({ ...producto, cantidad: 1 });
      }

      actualizarCarrito();

      const botonAgregar = this.closest('.botton').querySelector('.botton1');
      const botonCantidad = this.closest('.botton').querySelector('.botton3');
      botonAgregar.style.display = "none";
      botonCantidad.style.display = "block";
      botonCantidad.querySelector('.cantidad').value = 1;

      // Escuchar cambios manuales
      botonCantidad.querySelector('.cantidad').addEventListener("input", actualizarCantidadManual);
    });
  });
}

// Actualizar carrito en la interfaz
function actualizarCarrito() {
  const carritoContainer = document.querySelector("#carrito-container");
  carritoContainer.innerHTML = "";

  if (carrito.length === 0) {
    carritoContainer.innerHTML = "<p>Tu carrito está vacío.</p>";
  } else {
    carrito.forEach(item => {
      carritoContainer.innerHTML += `
        <div class="item-carrito">
          <p>${item.nombre} - ${item.cantidad} x $${item.precio}</p>
          <button class="retirar" data-id="${item.id}">Retirar</button>
        </div>`;
    });
  }

  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Escuchar eventos
document.addEventListener("click", function (event) {
  const idProducto = parseInt(event.target.getAttribute("data-id"));

  if (event.target.classList.contains("bottonReduce")) {
    const productoEnCarrito = carrito.find(p => p.id === idProducto);
    if (productoEnCarrito && productoEnCarrito.cantidad > 1) {
      productoEnCarrito.cantidad -= 1;
      actualizarInputCantidad(idProducto, productoEnCarrito.cantidad);
    }
    actualizarCarrito();
  }

  if (event.target.classList.contains("bottonIncrease")) {
    const productoEnCarrito = carrito.find(p => p.id === idProducto);
    if (productoEnCarrito) {
      productoEnCarrito.cantidad += 1;
      actualizarInputCantidad(idProducto, productoEnCarrito.cantidad);
    }
    actualizarCarrito();
  }

  if (event.target.classList.contains("retirar")) {
    carrito = carrito.filter(item => item.id !== idProducto);
    actualizarCarrito();

    const botonAgregar = document.querySelector(`.botton[data-id="${idProducto}"] .botton1`);
    const botonCantidad = document.querySelector(`.botton[data-id="${idProducto}"] .botton3`);

    if (botonAgregar && botonCantidad) {
      botonAgregar.style.display = "block";
      botonCantidad.style.display = "none";
      botonCantidad.querySelector('.cantidad').value = 1;
    }
  }
});

// Actualizar cantidad manualmente
function actualizarCantidadManual(e) {
  const input = e.target;
  const idProducto = parseInt(input.getAttribute("data-id"));
  let cantidad = parseInt(input.value);

  if (isNaN(cantidad) || cantidad < 1) {
    cantidad = 1;
    input.value = cantidad;
  }

  const productoEnCarrito = carrito.find(p => p.id === idProducto);
  if (productoEnCarrito) {
    productoEnCarrito.cantidad = cantidad;
    actualizarCarrito();
  }
}

// Actualizar input cantidad
function actualizarInputCantidad(id, valor) {
  const input = document.querySelector(`.cantidad[data-id="${id}"]`);
  if (input) input.value = valor;
}

// Finalizar compra
function finalizarCompra() {
  const mensajeCompra = document.querySelector("#mensaje-compra");
  const nuevaCompraBtn = document.querySelector("#nueva-compra");
  const carritoContainer = document.querySelector("#carrito-container");
  const finalizarBtn = document.querySelector("#finalizar-compra");

  if (carrito.length === 0) {
    Swal.fire({
      icon: 'info',
      title: 'Carrito vacío',
      text: 'Agrega productos antes de finalizar la compra.',
    });
    return;
  }

  let detalleCompra = "";
  let total = 0;

  carrito.forEach(item => {
    const subtotal = item.cantidad * item.precio;
    detalleCompra += `${item.cantidad} x ${item.nombre} - $${subtotal}<br>`;
    total += subtotal;
  });

  detalleCompra += `<br><strong>Total a pagar: $${total}</strong><br>`;

  const mensajeCashea = total >= 25
    ? `<p>Puedes usar <strong>Cashea</strong> y pagarlo en cuotas.</p>`
    : `<p>No puedes usar <strong>Cashea</strong> ya que el total es menor a $25.</p>`;

  Swal.fire({
    title: 'Resumen de tu compra',
    html: `${detalleCompra}${mensajeCashea}`,
    icon: 'success',
    confirmButtonText: 'Aceptar'
  });

  carritoContainer.style.display = "none";
  finalizarBtn.style.display = "none";
  nuevaCompraBtn.style.display = "inline-block";

  // Desactivar botones
  document.querySelectorAll(".agregar-carrito, .bottonReduce, .bottonIncrease, .cantidad").forEach(el => {
    el.disabled = true;
  });
}

// Botón para finalizar compra
document.querySelector("#finalizar-compra").addEventListener("click", finalizarCompra);

// Botón para reiniciar compra
document.querySelector("#nueva-compra").addEventListener("click", function () {
  carrito = [];
  actualizarCarrito();

  document.querySelector("#mensaje-compra").innerHTML = "";
  document.querySelector("#nueva-compra").style.display = "none";
  document.querySelector("#carrito-container").style.display = "block";
  document.querySelector("#finalizar-compra").style.display = "inline-block";

  prodNaruto.concat(prodDbz).forEach(producto => {
    const botonAgregar = document.querySelector(`.botton[data-id="${producto.id}"] .botton1`);
    const botonCantidad = document.querySelector(`.botton[data-id="${producto.id}"] .botton3`);

    if (botonAgregar) botonAgregar.style.display = "block";
    if (botonCantidad) {
      botonCantidad.style.display = "none";
      botonCantidad.querySelector('.cantidad').value = 1;
    }
  });

  // Reactivar botones
  document.querySelectorAll(".agregar-carrito, .bottonReduce, .bottonIncrease, .cantidad").forEach(el => {
    el.disabled = false;
  });
});

// Restaurar botones si ya hay productos en el carrito
function restaurarEstadoBotones() {
  carrito.forEach(item => {
    const botonAgregar = document.querySelector(`.botton[data-id="${item.id}"] .botton1`);
    const botonCantidad = document.querySelector(`.botton[data-id="${item.id}"] .botton3`);

    if (botonAgregar && botonCantidad) {
      botonAgregar.style.display = "none";
      botonCantidad.style.display = "block";
      botonCantidad.querySelector('.cantidad').value = item.cantidad;

      // Escuchar cambios manuales
      botonCantidad.querySelector('.cantidad').addEventListener("input", actualizarCantidadManual);
    }
  });
}
