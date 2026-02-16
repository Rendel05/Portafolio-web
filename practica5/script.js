const urlApi = "https://api.github.com/users/rendel05";
const urlApiRep = "https://api.github.com/repos/rendel05";

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
					<div class="card-footer" id="${repo.name}"></div>
                </div>
            </div>
        `;
		
		cargarLenguajes(repo.name);
    });
	contenedor.innerHTML = html;
		
};

const cargarLenguajes = (nombre) => {
	fetch(`https://api.github.com/repos/Rendel05/${nombre}/languages`)
	.then(res => res.json())
	.then(data => {
		generarLenguajes(data,nombre);
	//})
	//.catch(() => {
		//alert("error al cargar los lenguajes");
	});
};

const generarLenguajes = (data,nombre) => {
	const div = document.getElementById(`${nombre}`);
	let html = "";
	let total = sum(data);
	let percent = porcentajes(data,total);
	console.log(percent);
	
	let barra = `
		<div style="
			display:flex;
			width:90%;
			height:15px;
			margin-left:5%;
			border-radius:1rem;
			overflow:hidden;
			background:#e9ecef;
		">
		`;

		Object.entries(data).forEach(([clave, valor]) => {
			let p = porcentaje(valor,total);

			barra += `
			<div style="
				width:${p}%;
				background:${colorLenguaje(clave)};
			">
			</div>
			`;
		});

		barra += `</div>`;
	html+=barra;
	Object.entries(data).forEach(([clave, valor]) => {
		html += `
		<span class="${clave.toLowerCase()}" style="font-size:small; margin-right:1rem;"> <i class="bi bi-record-fill"></i>${clave}: ${porcentaje(valor,total)}</span>
		`;
	});
	
	//generarBarra
	div.innerHTML = html;
};

const porcentajes = (data,total) => {
	let percent = [];
	Object.entries(data).forEach(([clave, valor]) => {
		percent.push(porcentaje(valor,total));
	});
	return percent;
};

const colorLenguaje = (nombre) => {
	const colores = {
		HTML: "#E34F26",
		CSS: "#1572B6",
		JavaScript: "#F7DF1E"
	};

	return colores[nombre] || "#6c757d";
};



const sum = (data) => {
	let total = 0;
	
	Object.entries(data).forEach(([clave, valor])=> {
		total += valor;
	});
	
	return total;
};

const porcentaje = (valor,total) =>{
	let porcentaje=0;
	porcentaje= valor*100/total;
	return porcentaje.toFixed(2);
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