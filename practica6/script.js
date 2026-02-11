const API_URL = "https://api.fbi.gov/wanted/v1/list";

const wantedContainer = document.getElementById("wantedContainer");
const totalRecords = document.getElementById("totalRecords");
const loading = document.getElementById("loading");
const pagination = document.getElementById("pagination");
const searchInput = document.getElementById("searchInput");
const pageSizeSelect = document.getElementById("pageSizeSelect");

const modal = new bootstrap.Modal(document.getElementById("detailModal"));
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");

let currentPage = 1;
let pageSize = 20;
let totalPages = 0;
let currentSearch = "";
let currentItems = [];

async function cargarDatos(page = 1) {
    loading.style.display = "block";
    wantedContainer.innerHTML = "";

    let url = `${API_URL}?page=${page}&pageSize=${pageSize}`;
    if (currentSearch.trim() !== "") {
        url += `&title=${encodeURIComponent(currentSearch)}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    currentItems = data.items;
    totalRecords.textContent = data.total;
    currentPage = page;
    totalPages = Math.ceil(data.total / pageSize);

    renderCards();
    renderPagination();

    loading.style.display = "none";
}

function renderCards() {
    wantedContainer.innerHTML = "";

    currentItems.forEach((item, index) => {

        const imagen = item.images && item.images.length > 0
            ? item.images[0].thumb
            : "https://via.placeholder.com/300x200?text=Sin+Imagen";

        const col = document.createElement("div");
        col.className = "col-md-4 mb-4";

        col.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${imagen}" class="card-img-top">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text">
                        ${item.description ? item.description.substring(0, 100) + "..." : "Sin descripción"}
                    </p>
                    <button class="btn btn-outline-dark mt-auto" data-index="${index}">
                        Ver detalles
                    </button>
                </div>
            </div>
        `;

        wantedContainer.appendChild(col);
    });

    document.querySelectorAll("[data-index]").forEach(btn => {
        btn.addEventListener("click", e => {
            const index = e.target.getAttribute("data-index");
            mostrarDetalle(currentItems[index]);
        });
    });
}

function renderPagination() {
    pagination.innerHTML = "";

    const prev = document.createElement("li");
    prev.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
    prev.innerHTML = `<button class="page-link">Anterior</button>`;
    prev.addEventListener("click", () => {
        if (currentPage > 1) cargarDatos(currentPage - 1);
    });
    pagination.appendChild(prev);

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) {
        const li = document.createElement("li");
        li.className = `page-item ${i === currentPage ? "active" : ""}`;
        li.innerHTML = `<button class="page-link">${i}</button>`;
        li.addEventListener("click", () => cargarDatos(i));
        pagination.appendChild(li);
    }

    const next = document.createElement("li");
    next.className = `page-item ${currentPage === totalPages ? "disabled" : ""}`;
    next.innerHTML = `<button class="page-link">Siguiente</button>`;
    next.addEventListener("click", () => {
        if (currentPage < totalPages) cargarDatos(currentPage + 1);
    });
    pagination.appendChild(next);
}

function mostrarDetalle(item) {
    modalTitle.textContent = item.title;

    modalBody.innerHTML = `
        <img src="${item.images && item.images.length > 0 ? item.images[0].original : ""}" class="img-fluid mb-3">
        <p><strong>Descripción:</strong></p>
        <p>${item.description || "No disponible"}</p>
        <p><strong>Oficina:</strong> ${item.field_offices ? item.field_offices.join(", ") : "No disponible"}</p>
        <p><strong>Fecha de publicación:</strong> ${item.publication}</p>
        <p><strong>Alias:</strong> ${item.aliases ? item.aliases.join(", ") : "No disponible"}</p>
        <p><strong>Recompensa:</strong> ${item.reward_text || "No especificada"}</p>
    `;

    modal.show();
}

searchInput.addEventListener("keyup", e => {
    currentSearch = e.target.value;
    cargarDatos(1);
});

pageSizeSelect.addEventListener("change", e => {
    pageSize = parseInt(e.target.value);
    cargarDatos(1);
});

document.addEventListener("DOMContentLoaded", () => cargarDatos(1));
