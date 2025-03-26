// Productos en stock

const productos = [
    { nombre: "Anillos de Akatsuki", precio: 2.00 },
    { nombre: "Collar de Naruto", precio: 1.75 },
    { nombre: "Lámpara de Naruto", precio: 20 },
    { nombre: "Lámpara de Goku", precio: 15.75 },
    { nombre: "Llaveros de Cápsulas", precio: 7.25 },
    { nombre: "Llaveros de Esferas", precio: 5.5 }
];

let carrito = [];
let total = 0;
let seguirComprando = true;

function iniciarCompra() {


    // Bucle para realizar el llenado del carro y el calculo del total
    while (seguirComprando === true) {
        let listaProductos = "¿Qué producto deseas comprar?\n";
        productos.forEach((producto, index) => {
            listaProductos += `${index + 1}. ${producto.nombre} - ${producto.precio}$\n`;
        });

        let opcion = prompt(listaProductos) - 1;

        if (opcion >= 0 && opcion < productos.length) {
            let cantidad = prompt(`¿Cuántos ${productos[opcion].nombre} deseas comprar?`);
            if (isNaN(cantidad) || cantidad <= 0) {
                alert("Por favor, ingresa una cantidad válida.");
            } else {
                let subtotal = productos[opcion].precio * cantidad;
                carrito.push({
                    producto: productos[opcion].nombre,
                    cantidad: cantidad,
                    subtotal: subtotal
                });
                total += subtotal;
                alert(`Has agregado ${cantidad} ${productos[opcion].nombre} por $${subtotal}`);
            }
        } else {
            alert("Opción no válida. Intenta de nuevo.");
        }

        let continuarComprando = prompt(`tu monto a pagar es de ${total}$ \n ¿Deseas seguir comprando?\n si/no`);

        switch (continuarComprando) {
            case "si":
                seguirComprando = true;
                break;
            case "no":
                seguirComprando = false;
                break;
            default:
                alert(`Opcion no valida. Intenta de nuevo`);
                break;
        }

    }
    
    //Productos adquiridos y total a pagar
    if (carrito.length > 0) {
        let detalleCompra = "Resumen de tu compra:\n";
        carrito.forEach(item => {
            detalleCompra += `${item.cantidad} x ${item.producto} - $${item.subtotal}\n`;
        });
        detalleCompra += `Total a pagar: $${total}`;
        alert(detalleCompra);
    } else {
        alert("Carrito vacio");
    }

    // Cashearlo

    // Cashea es una aplicacion venezolana por la cual se obtienen productos a credito y la compra minima para su uso son 25$
    switch (total >= 25){
        case true:
            alert(`tu total es de ${total}$ puedes usar Cashea y pagarlo a cuotas`);
            break;
        case false:
            alert(`tu total no es de ${total}$ NO puedes usar Cashea y pagarlo a cuotas`);
            break;
            default:
        }
    }


// Llamada a la funcion para iniciar el carrito
iniciarCompra();