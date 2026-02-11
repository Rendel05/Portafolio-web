const urlApi = "https://dragonball-api.com/api/characters";

const cargarPersonajes = () => {
    fetch(urlApi)
        .then(respuesta => respuesta.json())
        .then(data => {
            const personajes = data.items;
            mostrarPersonajes(personajes);
        })
        .catch(error => {
            alert("Hubo un error al cargar los datos");
        });
};

const mostrarPersonajes = (personajes) => {
    const contenedorPersonajes = document.getElementById("contenedor-personajes");
    contenedorPersonajes.innerHTML = "";

    personajes.forEach(personaje => {
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("practice-card");

        tarjeta.innerHTML = `
            <img src="${personaje.image}" alt="${personaje.name}" width="100%" style="object-fit: contain; height: 300px;">
            <h3 class="practice-title">${personaje.name}</h3>
            <p>${personaje.description}</p>
            <p><strong>Ki:</strong> ${personaje.ki}</p>
			<p><strong>Raza:</strong> ${personaje.race}</p>
			<p><strong>Género:</strong> ${personaje.gender}</p>
        `;

        contenedorPersonajes.appendChild(tarjeta);
    });
};
