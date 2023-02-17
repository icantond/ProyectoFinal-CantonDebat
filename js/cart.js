/*Recuperar productos en carrito de localStorage*/
let productosGuardados = JSON.parse(localStorage.getItem("carrito")) || [];

/*Renderizar productos en el carrito para mostrar un resumen de la compra*/
function renderizarProductosGuardados() {
    let contenedor = document.getElementById("contenedor-productos-guardados");
    let total = 0;
    for (let producto of productosGuardados) {
        let subtotal = parseFloat(producto.precio) * producto.cantidad;
        total += subtotal;
        let elemento = document.createElement("div");
        elemento.classList.add("container");
        elemento.innerHTML = `
        <div class="producto-carrito row">
        <img class="producto-carrito-imagen col-2" src="../img/cod${producto.codigo}.jpg">
        <h3 class="producto-carrito-nombre col 3" id="nombre">${producto.nombre}</h3> 
        <h5 class="producto-carrito-precio col-3" id="precio">$ ${parseFloat(producto.precio).toFixed(2)}</h5> 
        <select class="producto-carrito-cantidad col-1 d-inline" id="cantidad-${producto.codigo}">
            ${generarOpcionesCantidad(producto.cantidad)}
        </select> 
        <h5 class="producto-carrito-subtotal col-3" id="subtotal-${producto.codigo}">Subtotal $ ${subtotal.toFixed(2)}</h5> 
        </div>`;
        contenedor.appendChild(elemento);

        let select = document.getElementById(`cantidad-${producto.codigo}`);

        select.addEventListener("change", () => {
            let cantidadSeleccionada = parseInt(select.value);
            producto.cantidad = cantidadSeleccionada;
            localStorage.setItem("carrito", JSON.stringify(productosGuardados));
            subtotal = parseFloat(producto.precio) * cantidadSeleccionada;
            document.getElementById(`subtotal-${producto.codigo}`).innerHTML = `Subtotal $ ${subtotal.toFixed(2)}`;

            // Calcular el nuevo total de la compra
            let nuevoTotal = 0;
            for (let p of productosGuardados) {
                nuevoTotal += parseFloat(p.precio) * p.cantidad;
            }
            // Actualizar el texto del elemento HTML que muestra el total de la compra
            document.querySelector(".total-carrito-texto").innerHTML = `Total: $${nuevoTotal.toFixed(2)}`;
        });
    };

    let contenedorTotalElemento = document.createElement("div");
    contenedorTotalElemento.classList.add("total-carrito");
    contenedor.appendChild(contenedorTotalElemento);
    let totalElemento = document.createElement("h2");
    totalElemento.classList.add("total-carrito-texto");
    totalElemento.innerHTML = `Total de la compra: $${total.toFixed(2)}`;
    contenedorTotalElemento.appendChild(totalElemento);
}

function generarOpcionesCantidad(cantidadSeleccionada) {
    let opciones = "";
    for (let i = 0; i <= 20; i++) {
        if (i == cantidadSeleccionada) {
            opciones += `<option value="${i}" selected>${i}</option>`;
        } else {
            opciones += `<option value="${i}">${i}</option>`;
        }
    }
    return opciones;
}

renderizarProductosGuardados();


// Crear elemento modal
let modalPago = document.createElement("div");
modalPago.id = "modal-pago";
modalPago.className = "modal";
modalPago.classList.add("container-fluid");
modalPago.innerHTML = `
    <div class="modal-content">
        <div class="modal-header">
            <h2>Confirmación de Compra</h2>
            <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
            <div id="div-form-pago" class="form-pago form-group"></div>
            <div id="total-compra"></div>
        </div>
        <div class="modal-footer">
        </div>
    </div>
`;

// // Agregar modal al documento
document.body.appendChild(modalPago);

// // Abrir modal al hacer click en el boton comprar
let irAPagar = document.getElementById("pagar");
    irAPagar.addEventListener("click", async function () {
    modalPago.style.display = "block";

    let divFormPago = document.getElementById("div-form-pago");

    let verificarFormPago = document.querySelector("#form-pago");
        if (!verificarFormPago) { /*Verifica que no exista un form en el modal, para evitar que se creen elementos form nuevamente cada vez que el usuario cierra
        y vuelva a hacer click en el boton, si no existe, realiza la función*/
        let formPago = document.createElement("form");
        formPago.id = "form-pago";
        formPago.innerHTML = `
        <p class="form-pago-text">Para realizar el pago, necesitamos confirmar los siguientes datos:</p>
        <input type="text" name="nombre" class="input-pago form-control" placeholder="Nombre"></input>
        <input type="text" name="apellido" class="input-pago form-control" placeholder="Apellido"></input>
        <input type="email" name="email" class="input-pago form-control" placeholder="alguien@ejemplo.com"></input>
        <p class="form-pago-text">Datos de envío:</p>
        <select id="select-provincia" class="select-pago form-control"></select>
        <select id="select-localidad" class="select-pago form-control"></select>
        <input type="text" id="input-calle" name="calle" class="input-pago form-control" placeholder="Ingresa la calle">
        `
        divFormPago.appendChild(formPago);
    }
});

let selectProvincia = document.getElementById("select-provincia");
let selectLocalidad = document.getElementById("select-localidad");
fetch("https://apis.datos.gob.ar/georef/api/provincias")
    .then(response => response.json())
    .then(data => {
        data.provincias.forEach(provincia => {
            let option = document.createElement("option");
            option.value = provincia.id;
            option.text = provincia.nombre;
            selectProvincia.appendChild(option);
        });
    });


let closeModal = document.querySelector(".close-modal");

closeModal.addEventListener("click", function () {
    modalPago.style.display = "none";
});

document.addEventListener("mousedown", function (event) {
    if (event.target === modalPago) {
        modalPago.style.display = "none";
    }
});

function vaciarCarrito() {
    // Eliminar los productos del local storage
    localStorage.removeItem("carrito");
    // Mostrar la alerta swal
    Swal.fire({
        title: 'Estás seguro que deseas vaciar el carrito?',
        text: "Esta acción no se puede revertir",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#74C69D',
        cancelButtonColor: '#FFC727',
        confirmButtonText: 'Si, vaciar!'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                confirmButtonColor: '#74C69D',
                title: "Carrito Vaciado con éxito",
                text: "Serás redirigido a la tienda"
            }
            )
            // Redirigir al usuario a otra URL
            function redireccion() {
                window.location.href = "./tienda.html";
                localStorage.clear();
            }
            setTimeout(redireccion, 3000);
        }
    })
}

// Escuchar el evento click del elemento con ID "vaciar-carrito" y llamar a la función vaciarCarrito
document.getElementById("vaciar-carrito").addEventListener("click", vaciarCarrito);

