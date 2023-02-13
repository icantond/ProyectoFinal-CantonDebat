// const productos = [
//     { codigo: 1, nombre: "Sahumerio de Palo Santo", precio: 250, imagen: "../img/cod1.jpg" },
//     { codigo: 2, nombre: "Sahumerio de Incienso", precio: 250, imagen: "../img/cod2.jpg" },
//     { codigo: 3, nombre: "Sahumerio de Ruda y Romero", precio: 250, imagen: "../img/cod3.jpg" },
//     { codigo: 4, nombre: "Sahumerio de Copal", precio: 350, imagen: "../img/cod4.jpg" },
//     { codigo: 5, nombre: "Sahumerio de Sándalo Olíbano", precio: 350, imagen: "../img/cod5.jpg" },
//     { codigo: 6, nombre: "Sahumerio Botánico Té Verde y Champa", precio: 350, imagen: "../img/cod6.jpg" },
//     { codigo: 7, nombre: "Bombas defumadoras Defum. Completa", precio: 800, imagen: "../img/cod7.jpg" },
//     { codigo: 8, nombre: "Bombas defumadoras 7 Hierbas Copal", precio: 800, imagen: "../img/cod8.jpg" },
//     { codigo: 9, nombre: "Bombas defumadoras 7 Elementos Puros", precio: 800, imagen: "../img/cod9.jpg" },
//     { codigo: 10, nombre: "Óleo Esencial Oleum Revitalizante", precio: 1200, imagen: "../img/cod10.jpg" },
//     { codigo: 11, nombre: "Óleo Esencial Oleum Afrodisíaco", precio: 1200, imagen: "../img/cod11.jpg" },
//     { codigo: 12, nombre: "Óleo Esencial Oleum Concentración", precio: 1200, imagen: "../img/cod12.jpg" }
// ];

// // const productos = [];
// fetch('/js/productos.json')
//     .then(response => response.json())
//     .then(data => {
//         productos = data.productos;
//     })
//     .catch(error => {
//         console.error('Error al cargar el archivo JSON: ', error);
//     });

// Uso de método fetch() para traer el array de productos desde el archivo JSON:
// fetch("/js/productos.json")
//     .then(response => response.json())
//     .then(data => {
//         productos = data;
//     })
//     .catch(error => {
//         console.error("Error al cargar el archivo JSON", error);
//     });


async function cargarProductos() {

    let productos;
    try {
        const response = await fetch("js/productos.json");
        const data = await response.json();
        productos = data;
    } catch (error) {
        console.error("Error al cargar el archivo JSON", error);
    }
    setTimeout(() => {
        renderizarTarjetas(productos);
        document.getElementById("loader-productos").style.display = "none";
    }, 2000);/*Agrego un timeOUt() para que las tarjetas se rendericen a los 2 segundos
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
                    class="cards__element__image">
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
            // this.productos.splice(index, 0, { codigo, nombre, precio, cantidad });
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
            <button id="vaciar-carrito">Vaciar carrito</button>
            <button id="comprar">Comprar</button>
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
    Swal.fire('Carrito vaciado con éxito!')
    modal.style.display = "none";
}
// comprar estará disponible en entrega final
function efectuarCompra() {
    Swal.fire('Próximamente')
}

document.getElementById("vaciar-carrito").addEventListener("click", vaciarCarrito);
document.getElementById("comprar").addEventListener("click", efectuarCompra);

