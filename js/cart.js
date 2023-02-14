let productosGuardados = JSON.parse(localStorage.getItem("carrito")) || [];
function renderizarProductosGuardados() {
    let contenedor = document.getElementById("contenedor-productos-guardados");
    for (let producto of productosGuardados) {
        let elemento = document.createElement("div");
        elemento.classList.add("container");
        elemento.innerHTML = `
        <div class="producto-carrito row">
        <img class="producto-carrito-imagen col-2" src="../img/cod${producto.codigo}.jpg">
        <h3 class="producto-carrito-nombre col 2" id="nombre">${producto.nombre}</h3> 
        <h5 class="producto-carrito-precio col-2" id="precio">$ ${parseFloat(producto.precio).toFixed(2)}</h5> 
        <p class="producto-carrito-codigo col-2" id="codigo">Cód.${producto.codigo}</p> 
        <p class="producto-carrito-cantidad col-1 d-inline" id="cantidad">Cantidad: ${producto.cantidad}</p> 
        </div>`;
        contenedor.appendChild(elemento);
    }
}
renderizarProductosGuardados();
