const urlApi = "https://equipo6.grupoahost.com/Api/listaProductos.php";

const cargarProductos = () => {
    fetch(urlApi)
        .then(res => res.json())
        .then(data => {
            mostrarProductos(data);
        })
        .catch(() => {
            alert("Error al cargar los productos");
        });
};

const mostrarProductos = (productos) => {
    const contenedor = document.getElementById("contenedor-productos");
    contenedor.innerHTML = "";

    productos.forEach(producto => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
			<img src="https://equipo6.grupoahost.com/img/${producto.ImagenText}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>${producto.descripcion}</p>
            <p><strong>Precio:</strong> $${producto.precio_venta}</p>
            <p><strong>Stock:</strong> ${producto.stock}</p>
            <p><strong>Categoría:</strong> ${producto.categoria_nombre}</p>
        `;

        contenedor.appendChild(card);
    });
};
