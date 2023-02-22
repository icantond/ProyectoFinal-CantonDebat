//Recuperar productos en carrito de localStorage
let productosGuardados = JSON.parse(localStorage.getItem("carrito")) || [];

//Renderizar productos en el carrito para mostrar un resumen de la compra
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
    
    // Generar el footer del modal
    let contenedorTotalElemento = document.createElement("div");
    contenedorTotalElemento.classList.add("total-carrito");
    contenedor.appendChild(contenedorTotalElemento);
    let totalElemento = document.createElement("h2");
    totalElemento.classList.add("total-carrito-texto");
    totalElemento.innerHTML = `Total de la compra: $${total.toFixed(2)}`;
    contenedorTotalElemento.appendChild(totalElemento);
}

//Funcion para generar las opciones de los select de cantidad
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
irAPagar.addEventListener("click", function () {
    modalPago.style.display = "block";

    let divFormPago = document.getElementById("div-form-pago");

    let verificarFormPago = document.querySelector("#form-pago");
    if (!verificarFormPago) { /*Verifica que no exista un form en el modal, para evitar que se creen elementos form nuevamente cada vez que el usuario cierra
        y vuelva a hacer click en el boton, si no existe, realiza la función*/
        let formPago = document.createElement("form");
        formPago.id = "form-pago";
        formPago.class = "containter";
        formPago.innerHTML = `
        <p class="form-pago-text">Para realizar el pago, necesitamos confirmar los siguientes datos:</p>
        <input type="text" name="nombre" class="input-pago form-control" placeholder="Nombre"></input>
        <input type="text" name="apellido" class="input-pago form-control" placeholder="Apellido"></input>
        <input type="email" name="email" class="input-pago form-control" placeholder="alguien@ejemplo.com"></input>
        <p class="form-pago-text row">Datos de envío:</p>
        <select id="select-provincia" class="select-pago form-control"> 
        </select>
        <select id="select-localidad" class="select-pago form-control"> 
        </select>
        <input id="input-calle" type="text" name="calle" class="input-pago form-control" placeholder="Ingresá la calle">
        </input>
        <input id="input-altura" type="number" name="altura" class="input-pago form-control" placeholder="Ingresá la altura">
        </input>
        <input id="input-piso" type="number" name="piso" class="input-pago form-control input-inline" placeholder="Piso">
        </input>
        <input id="input-depto" type="number" name="depto" class="input-pago form-control input-inline" placeholder="Depto">
        </input>
        <btn class="cards__button ir-a-pagar" id="ir-a-pagar">
            Finalizar compra
            <i class="bi bi-credit-card"></i>
        </btn>
        <a class="seguir-comprando" href="../pages/tienda.html"><btn class="cards__button finalizar-pago" id="finalizar-pago">
        Seguir comprando
        <i class="bi bi-back"></i>
    </btn></a>
        `
        divFormPago.appendChild(formPago);

    
    let botonIrAPagar = formPago.querySelector("#ir-a-pagar");
    botonIrAPagar.addEventListener("click", function () {
            Swal.fire({
                title: 'Serás redirigido al sitio de Mercado Pago para realizar el pago',
                text: "Pulsa aceptar para continuar",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#74C69D',
                cancelButtonColor: '#FFC727',
                confirmButtonText: 'Aceptar!'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        confirmButtonColor: '#74C69D',
                        title: "Redirigiendo a Mercado Pago",
                        text: "Gracias por tu compra!"
                    }
                    )
                    // Redirigir a Mercado Pago
                    function redireccion() {
                        window.location.href = "https://www.mercadopago.com";
                        localStorage.clear();
                    }
                    setTimeout(redireccion, 3000);
                }
            })
    })

    /*Se Crean las opciones de los select de provincia y localidad del formulario consumiento 
    datos de la API oficial GeoRef*/

        let selectProvincia = document.getElementById("select-provincia");
        let selectLocalidad = document.getElementById("select-localidad");
        let datalistCalle = document.getElementById("datalist-calle");

        function provincias() {
            fetch("https://apis.datos.gob.ar/georef/api/provincias")
                .then(res => res.ok ? res.json() : Promise.reject(res))
                .then(json => {
                    let options = `<option value="Eleji tu provincia">Elejí tu provincia</option>`;
                    json.provincias.forEach(el => options += `<option value="${el.nombre}">${el.nombre}</option>`);
                    selectProvincia.innerHTML = options;
                })
                .catch(error => {
                    let message = error.statusText || "Ocurrió un error al cargar las provicias";
                    selectProvincia.nextElementSibling.innerHTML = `Error: ${error.status}: ${message}`;
                })
        }
        provincias();

        function localidad(provincias) {
            fetch(`https://apis.datos.gob.ar/georef/api/localidades?provincia=${provincias}&max=1000`)
                .then(res => res.ok ? res.json() : Promise.reject(res))
                .then(json => {
                    let options = `<option value="Elejí tu localidad">Elejí tu localidad</option>`;

                    json.localidades.forEach(el => options += `<option value="${el.nombre}">${el.nombre}</option>`);

                    selectLocalidad.innerHTML = options;
                })
                .catch(error => {
                    let message = error.statusText || "Ocurrió un error al obtener las localidades";

                    selectLocalidad.nextElementSibling.innerHTML = `Error: ${error.status}: ${message}`;
                })
                
        }
        
        selectProvincia.addEventListener("change", e => {
            localidad(e.target.value);
        })
    }
});

// Cierre del modal al hacer click en la X o fuera del mismo modal
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

document.getElementById("vaciar-carrito").addEventListener("click", vaciarCarrito);


