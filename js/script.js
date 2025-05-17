// Variables globales
let prodNaruto = [];
let prodDbz = [];
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Referencias al DOM
const sectionNaruto = document.querySelector("#naruto");
const sectionDbz = document.querySelector("#dbz");

// Cargar productos desde JSON
fetch('./json/productos.json')
  .then(res => res.json())
  .then(data => {
    prodNaruto = data.naruto;
    prodDbz = data.dbz;

    mostrarProductos(prodNaruto, sectionNaruto);
    mostrarProductos(prodDbz, sectionDbz);

    cargarListeners();
    restaurarEstadoBotones();
    actualizarCarrito();
  })
  .catch(error => console.error('Error al cargar productos:', error));

// Mostrar productos
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
                        <input type="text" class="cantidad" data-id="${producto.id}" value="1" min="1">
                        <button class="bottonIncrease bottonCarro" data-id="${producto.id}"> + </button>
                    </div>
                    <div class="botton2">
                        <a href="#">Cashealo!</a>
                    </div>
                </div>
            </div>
        </div>
    </div>`).join('');
}

// Agregar eventos
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
    });
  });

  // Escuchar cambios manuales en inputs
  document.addEventListener("input", function (event) {
    if (event.target.classList.contains("cantidad")) {
      let valor = parseInt(event.target.value);
      const idProducto = parseInt(event.target.getAttribute("data-id"));
      const producto = carrito.find(p => p.id === idProducto);
      if (!isNaN(valor) && valor > 0) {
        producto.cantidad = valor;
      } else {
        producto.cantidad = 1;
        event.target.value = 1;
      }
      actualizarCarrito();
    }
  });

  // Validar solo números enteros positivos
  document.addEventListener("keydown", function (event) {
    if (event.target.classList.contains("cantidad")) {
      if (!/^[0-9]$/.test(event.key) && event.key !== "Backspace" && event.key !== "Delete" && event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
        event.preventDefault();
      }
    }
  });
}

// Actualizar carrito
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

// Controlar botones de cantidad y retiro
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("bottonReduce")) {
    const idProducto = parseInt(event.target.getAttribute("data-id"));
    const productoEnCarrito = carrito.find(p => p.id === idProducto);
    if (productoEnCarrito && productoEnCarrito.cantidad > 1) {
      productoEnCarrito.cantidad -= 1;
      event.target.closest('.botton3').querySelector('.cantidad').value = productoEnCarrito.cantidad;
    }
    actualizarCarrito();
  }

  if (event.target.classList.contains("bottonIncrease")) {
    const idProducto = parseInt(event.target.getAttribute("data-id"));
    const productoEnCarrito = carrito.find(p => p.id === idProducto);
    if (productoEnCarrito) {
      productoEnCarrito.cantidad += 1;
      event.target.closest('.botton3').querySelector('.cantidad').value = productoEnCarrito.cantidad;
    }
    actualizarCarrito();
  }

  if (event.target.classList.contains("retirar")) {
    const idProducto = parseInt(event.target.getAttribute("data-id"));
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

// Finalizar compra
function finalizarCompra() {
  const carritoContainer = document.querySelector("#carrito-container");
  const finalizarBtn = document.querySelector("#finalizar-compra");
  const nuevaCompraBtn = document.querySelector("#nueva-compra");

  if (carrito.length === 0) {
    Swal.fire({
      title: 'Carrito vacío',
      text: 'Agrega productos antes de finalizar la compra.',
      icon: 'info',
      confirmButtonText: 'OK'
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

  detalleCompra += `<br><strong>Total a pagar: $${total}</strong><br><br>`;

  if (total >= 25) {
    detalleCompra += `<span style="color:green;">Puedes usar <strong>Cashea</strong> y pagarlo en cuotas.</span>`;
  } else {
    detalleCompra += `<span style="color:red;">No puedes usar <strong>Cashea</strong>, el total debe ser mayor a $25.</span>`;
  }

  Swal.fire({
    title: 'Resumen de tu compra',
    html: detalleCompra,
    icon: 'success',
    confirmButtonText: 'Aceptar'
  });

  carritoContainer.style.display = "none";
  finalizarBtn.style.display = "none";
  nuevaCompraBtn.style.display = "inline-block";

  // Desactivar todos los botones después de finalizar
  document.querySelectorAll(".agregar-carrito, .bottonReduce, .bottonIncrease, .cantidad").forEach(el => {
    el.disabled = true;
  });
}

// Botón finalizar
document.querySelector("#finalizar-compra").addEventListener("click", finalizarCompra);

// Botón nueva compra
document.querySelector("#nueva-compra").addEventListener("click", function () {
  carrito = [];
  actualizarCarrito();

  document.querySelector("#carrito-container").style.display = "block";
  document.querySelector("#finalizar-compra").style.display = "inline-block";
  document.querySelector("#nueva-compra").style.display = "none";

  prodNaruto.concat(prodDbz).forEach(producto => {
    const botonAgregar = document.querySelector(`.botton[data-id="${producto.id}"] .botton1`);
    const botonCantidad = document.querySelector(`.botton[data-id="${producto.id}"] .botton3`);

    if (botonAgregar && botonCantidad) {
      botonAgregar.style.display = "block";
      botonCantidad.style.display = "none";
      botonCantidad.querySelector('.cantidad').value = 1;
    }
  });

  // Reactivar todos los botones
  document.querySelectorAll(".agregar-carrito, .bottonReduce, .bottonIncrease, .cantidad").forEach(el => {
    el.disabled = false;
  });
});

// Restaurar botones si hay productos
function restaurarEstadoBotones() {
  carrito.forEach(item => {
    const botonAgregar = document.querySelector(`.botton[data-id="${item.id}"] .botton1`);
    const botonCantidad = document.querySelector(`.botton[data-id="${item.id}"] .botton3`);

    if (botonAgregar && botonCantidad) {
      botonAgregar.style.display = "none";
      botonCantidad.style.display = "block";
      botonCantidad.querySelector('.cantidad').value = item.cantidad;
    }
  });
}
