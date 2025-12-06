// --- BASE DE DATOS SIMULADA (EN JSON) ---
const datos = {
    paises: [
        { id: 1, nombre: "México" },
        { id: 2, nombre: "Estados Unidos" },
        { id: 3, nombre: "Canadá" }
    ],
    estados: [
        // Estados de México (id_pais: 1)
        { id: 1, id_pais: 1, nombre: "Tamaulipas" },
        { id: 2, id_pais: 1, nombre: "Nuevo León" },
        { id: 3, id_pais: 1, nombre: "Ciudad de México" },
        // Estados de USA (id_pais: 2)
        { id: 4, id_pais: 2, nombre: "Texas" },
        { id: 5, id_pais: 2, nombre: "California" },
        // Estados de Canadá (id_pais: 3)
        { id: 6, id_pais: 3, nombre: "Ontario" },
        { id: 7, id_pais: 3, nombre: "Quebec" }
    ],
    municipios: [
        // Tamaulipas (id_estado: 1)
        { id: 1, id_estado: 1, nombre: "Ciudad Victoria" },
        { id: 2, id_estado: 1, nombre: "Tampico" },
        { id: 3, id_estado: 1, nombre: "Reynosa" },
        // Nuevo León (id_estado: 2)
        { id: 4, id_estado: 2, nombre: "Monterrey" },
        { id: 5, id_estado: 2, nombre: "San Pedro" },
        // Texas (id_estado: 4)
        { id: 6, id_estado: 4, nombre: "Houston" },
        { id: 7, id_estado: 4, nombre: "Austin" },
        { id: 8, id_estado: 4, nombre: "San Antonio" }
    ]
};

// Iniciamos la carga
cargarContenidoAjax();

// 1. FUNCIÓN CARGAR PAÍSES (Al abrir la página)
function cargarContenidoAjax() {
    var contenido = document.getElementById("idP");
    contenido.innerHTML = ""; 

    // Opción por defecto
    let defaultOption = document.createElement("option");
    defaultOption.text = "Seleccione País...";
    defaultOption.value = "0";
    contenido.add(defaultOption);

    // Llenar desde el JSON local
    datos.paises.forEach(function(pais) {
        var option = document.createElement("option");
        option.text = pais.nombre;
        option.value = pais.id;
        contenido.add(option);
    });

    // Asignar evento y habilitar
    contenido.setAttribute("onchange", "cargarContenidoAjax1();");
    contenido.disabled = false;
}

// 2. FUNCIÓN CARGAR ESTADOS (Al cambiar País)
function cargarContenidoAjax1() {
    let idPais = document.getElementById("idP").value;
    var contenido = document.getElementById('idE');
    
    // Limpiar selects inferiores
    contenido.innerHTML = "";
    document.getElementById("idM").innerHTML = "<option value='0'>Seleccione...</option>";
    document.getElementById("idM").disabled = true;

    if (idPais != 0) {
        let defaultOption = document.createElement("option");
        defaultOption.text = "Seleccione Estado...";
        defaultOption.value = "0";
        contenido.add(defaultOption);

        // FILTRADO: Buscar estados que coincidan con el id_pais seleccionado
        let estadosFiltrados = datos.estados.filter(estado => estado.id_pais == idPais);

        estadosFiltrados.forEach(function(estado) {
            var option = document.createElement("option");
            option.text = estado.nombre;
            option.value = estado.id;
            contenido.add(option);
        });

        contenido.setAttribute("onchange", "cargarContenidoAjax2();");
        contenido.disabled = false;
    } else {
        contenido.innerHTML = "<option value='0'>Seleccione...</option>";
        contenido.disabled = true;
    }
}

// 3. FUNCIÓN CARGAR MUNICIPIOS (Al cambiar Estado)
function cargarContenidoAjax2() {
    let idEstado = document.getElementById("idE").value;
    var contenido = document.getElementById('idM');
    
    contenido.innerHTML = "";

    if (idEstado != 0) {
        let defaultOption = document.createElement("option");
        defaultOption.text = "Seleccione Municipio...";
        defaultOption.value = "0";
        contenido.add(defaultOption);

        // FILTRADO: Buscar municipios que coincidan con el id_estado seleccionado
        let municipiosFiltrados = datos.municipios.filter(muni => muni.id_estado == idEstado);

        municipiosFiltrados.forEach(function(muni) {
            var option = document.createElement("option");
            option.text = muni.nombre;
            option.value = muni.id;
            contenido.add(option);
        });

        contenido.disabled = false;
    } else {
        contenido.innerHTML = "<option value='0'>Seleccione...</option>";
        contenido.disabled = true;
    }
}