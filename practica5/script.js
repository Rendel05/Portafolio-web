const urlApi = "https://api.github.com/users/rendel05";

document.addEventListener("DOMContentLoaded", () => {
    cargarUsuario();
	cargarRepos();
	cargarFollowers();
});

const cargarUsuario = () => {
    fetch(urlApi)
    .then(res => res.json())
    .then(data => {
        generarUsuario(data);
    })
    .catch(() => {
        alert("error al generar usuario");
    });
};

const generarUsuario = (data) => {

    const fecha = new Date(data.created_at);

    const formateada = fecha.toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long"
    });

    const años = new Date().getFullYear() - fecha.getFullYear();

    document.getElementById("login").textContent = data.login;
    document.getElementById("name").textContent = data.name;
    document.getElementById("bio").textContent = data.bio;
    document.getElementById("avatar").src = data.avatar_url;
    document.getElementById("url").href = data.html_url + "?tab=repositories";
    document.getElementById("date").textContent =
        	"		Miembro desde " + formateada + " (hace " +
			(años === 0 ? "menos de un año" :
			 años === 1 ? "1 año" :
			 años + " años") + ")";

};


const cargarRepos= () =>{
	fetch(`${urlApi}/repos?sort=updated&per_page=6&type=owner`)
	.then(res => res.json())
	.then(data =>{
		generarRepos(data);
	});
};

const generarRepos = (data) => {
    const contenedor = document.getElementById("repos");

    let html = "";

    data.forEach(repo => {
        html += `
            <div class="col-md-4 mb-4">
                <div class="card h-100 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">${repo.name}</h5>
                        <p class="card-text">${repo.description ?? "Sin descripción"}</p>
                        <a href="${repo.html_url}" target="_blank" class="btn btn-dark btn-sm">Ver repositorio en Github	 <i class="bi bi-github"></i></a>
                    </div>
                </div>
            </div>
        `;
    });

    contenedor.innerHTML = html;
};


const cargarFollowers = ()=>{
	fetch(`${urlApi}/followers?per_page=5`)
	.then(res =>res.json())
	.then(data =>{
		generarFollowers(data);
	});
};

const generarFollowers=(data)=>{
	let html ="";
	const contenedor = document.getElementById("followers");
	
	
	data.forEach(follow =>{
		html+= `
		<div class="col-md-2 col-4 text-center mb-3">
                <a class="text-decoration-none" href="${follow.html_url}">
					<div class="card shadow-sm p-2">
						<img src="${follow.avatar_url}" class="rounded-circle mx-auto" width="60">
						<small class="mt-2">${follow.login}</small>
					</div>
				</a>	
			</div>
		`
	});
	
	contenedor.innerHTML = html;
};