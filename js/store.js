async function cargarProductos() {

    let productos;
    try {
            // const response = await fetch("js/productos.json");/*ruta GitHub*/
        const response = await fetch("/js/productos.json"); /*ruta live server*/
        const data = await response.json();
        productos = data;
    } catch (error) {
        console.error("Error al cargar el archivo JSON", error);
    }
    setTimeout(() => {
        renderizarTarjetas(productos);
        document.getElementById("loader-productos").style.display = "none";
    }, 2000);/*Agrego un timeOut() para que las tarjetas se rendericen a los 2 segundos
sólo para que sea visible si la carga del JSON es rápida*/
};

// Armado de tarjetas en el HTML - Creo una función para poder trabajar mejor el async await 
// para renderizar las tarjetas de productos una vez resuelta la promesa del fetch()
function renderizarTarjetas(productos) {
    for (let producto of productos) {
        let contenedor = document.getElementById("contenedor-productos");
        let elemento = document.createElement("div");
        elemento.classList.add("col-6", "col-md-4", "col-lg-3", "col-xl-2");
        let unidades = '<select class="cantidad-producto">';
        for (let i = 1; i <= 20; i++) {
            unidades += `<option value="${i}">${i}</option>`;
        }
        unidades += '</select>';
        elemento.innerHTML = `
                <div class="cards__element">
                <div class="cards__element__img__container">
                    <img src=${producto.imagen}
                    class="cards__element__image" id="myImg">
                    <div id="myModal" class="modal">
                    <span class="close">&times;</span>
                    <img class="modal-content" id="img01">
                    <div id="caption"></div>
                    </div>
                    </div>
                <h3 class="cards__element__name" id="nombre">${producto.nombre}</h3>
                <h5 class="cards__element__price" id="precio">$ ${parseFloat(producto.precio).toFixed(2)}</h5>
                <p class="cards__element__codigo" id="codigo">Cód.${producto.codigo}</p>
                <p class="cards__element__cantidad d-inline" id="cantidad">Selecciona la cantidad ${unidades}</p>
                <btn class="cards__button agregar-btn" id="agregar${producto.codigo}">
                    Agregar al carrito
                    <i class="bi bi-cart2"></i>
                </btn>
                </div>
    `;
        let btnAgregar = elemento.getElementsByClassName("agregar-btn")[0];
        btnAgregar.addEventListener("click", function () {
            carrito.agregarProducto(
                producto.codigo,
                producto.nombre,
                producto.precio,
                parseInt(elemento.getElementsByClassName("cantidad-producto")[0].value)
            );
            Toastify({
                text: "Agregado al Carrito",
                duration: 3000,
                position: "left",
                gravity: "bottom",
                className: "mensaje-producto-agregado",
                style: {
                    background: "#264653",
                    color: "#74C69D",
                }
            }).showToast();
        });

        contenedor.appendChild(elemento);
    };
}
cargarProductos();

// Funcion para cambiar icono de carrito según esté lleno o vacío
function cambiarImagenCarrito() {
    const imagenCarrito = document.getElementById("imagen-carrito");
    if (carrito.productos.length === 0) {
        imagenCarrito.src = "../img/bag.svg";
    } else {
        imagenCarrito.src = "../img/bag-heart.svg";
    }
};

const carrito = {
    productos: [],
    // Funcion para agregar productos al carrito
    agregarProducto: function (codigo, nombre, precio, cantidad) {
        let productoExistente = this.productos.find(producto => producto.codigo === codigo);
        if (productoExistente) {
            let index = this.productos.indexOf(productoExistente);
            this.productos[index].cantidad += cantidad;
        } else {
            this.productos.push({ codigo, nombre, precio, cantidad });
        }
        cambiarImagenCarrito();
        this.guardarLocalStorage();

    },
    // Funcion para guardar el carrito y la imagen en LocalStorage
    guardarLocalStorage: function () {
        localStorage.setItem("carrito", JSON.stringify(this.productos));
        const imagenCarrito = document.getElementById("imagen-carrito");
        localStorage.setItem("imagenCarrito", imagenCarrito.src);
    },
    // Funcion para recuperar el carrito de LocalStorage
    recuperarLocalStorage: function () {
        if (localStorage.getItem("carrito")) {
            this.productos = JSON.parse(localStorage.getItem("carrito"));
        }
        if (localStorage.getItem("imagenCarrito")) {
            const imagenCarrito = document.getElementById("imagen-carrito");
            imagenCarrito.src = localStorage.getItem("imagenCarrito");
        }
    }
};
let botones = document.getElementsByClassName("agregar-btn");
for (let boton of botones) {
    boton.addEventListener("click", function () {
        let nombre = this.parentNode.querySelector("#nombre").textContent;
        let precio = parseFloat(this.parentNode.querySelector("#precio").textContent.split("$ ")[1]);
        let codigo = parseInt(this.parentNode.querySelector("#codigo").textContent.split("Cód.")[1]);
        let cantidad = parseInt(this.parentNode.querySelector(".cantidad-producto").value);
        carrito.agregarProducto(codigo, nombre, precio, cantidad);
    });
}

// Recuperar el carrito al cargar la pagina
carrito.recuperarLocalStorage();

// Crear elemento modal
let modal = document.createElement("div");
modal.id = "modal-carrito";
modal.className = "modal";
modal.classList.add("container-fluid");
modal.innerHTML = `
    <div class="modal-content">
        <div class="modal-header">
            <h2>Detalles de compra</h2>
            <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
            <table id="tabla-carrito">
                <thead>
                    <tr>
                        <th></th>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody id="cuerpo-tabla"></tbody>
            </table>
            <div id="total-compra"></div>
        </div>
        <div class="modal-footer">
            <div id="vaciar-carrito" class="cards__button">Vaciar carrito</div>
            <a href="carrito.html"><div id="comprar" class="cards__button">Comprar</div></a>
        </div>
    </div>
`;

// Agregar modal al documento
document.body.appendChild(modal);


// Abrir modal al hacer click en el icono del carrito
let imagenCarrito = document.getElementById("imagen-carrito");
imagenCarrito.addEventListener("click", function () {
    if (carrito.productos.length > 0) {
        // Mostrar modal
        modal.style.display = "block";

        // Actualizar tabla de productos
        let cuerpoTabla = document.getElementById("cuerpo-tabla");
        cuerpoTabla.innerHTML = "";
        let totalCompra = 0;
        for (let producto of carrito.productos) {
            let fila = document.createElement("tr");
            fila.innerHTML = `
                <td><img src="../img/cod${producto.codigo}.jpg" width="50" height="50"></td>
                <td class="modal-nombre">${producto.nombre}</td>
                <td class="modal-precio">$ ${producto.precio}</td>
                <td class="modal-cantidad">${producto.cantidad}</td>
                <td class="modal-precio">$ ${producto.precio * producto.cantidad}</td>
            `;
            cuerpoTabla.appendChild(fila);
            totalCompra += producto.precio * producto.cantidad;
        }
        // Mostrar total de compra
        let totalCompraDiv = document.getElementById("total-compra");
        totalCompraDiv.innerHTML = `<h3 class="total-compra">Total de la compra: $ ${totalCompra}</h3>`;
    }
});

// cierre de modal al hacer click en X o fuera del mismo
const closeModal = document.querySelector(".close-modal");

closeModal.addEventListener("click", function () {
    modal.style.display = "none";
});

document.addEventListener("mousedown", function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// vaciar carrito
function vaciarCarrito() {
    carrito.productos = [];
    cambiarImagenCarrito();
    carrito.guardarLocalStorage();
    Swal.fire({
        confirmButtonColor: "#74C69D",
        title: "Carrito vaciado con éxito!"
        })

    modal.style.display = "none";
}
// comprar estará disponible en entrega final
// function efectuarCompra() {
//     Swal.fire('Próximamente')
// }

document.getElementById("vaciar-carrito").addEventListener("click", vaciarCarrito);
// document.getElementById("comprar").addEventListener("click", efectuarCompra);


// // Get the modal
// let imgModal = document.getElementById("myModal");

// // Get the image and insert it inside the modal - use its "alt" text as a caption
// let img = document.getElementById("myImg");
// let modalImg = document.getElementById("img01");
// let captionText = document.getElementById("caption");
// img.onclick = function () {
//     imgModal.style.display = "block";
//     modalImg.src = this.src;
//     captionText.innerHTML = this.alt;
// }

// // Get the <span> element that closes the modal
// let span = document.getElementsByClassName("close")[0];

// // When the user clicks on <span> (x), close the modal
// span.onclick = function () {
//     imgModal.style.display = "none";
// } 