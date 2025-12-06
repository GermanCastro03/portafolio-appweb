function generarTabla() {

    var numeroInput = document.getElementById("numero");
    var limiteInput = document.getElementById("limite");
    
    var numero = parseInt(numeroInput.value);
    var limite = parseInt(limiteInput.value);


    var tablaHTML = "<table>";
    
    tablaHTML += "<thead>";
    tablaHTML += "<tr>";
    tablaHTML += "<th>Numero</th>";
    tablaHTML += "<th>Multiplicador</th>";
    tablaHTML += "<th>Resultado</th>";
    tablaHTML += "</tr>";
    tablaHTML += "</thead>";
    
    // eto e un buvle for
    tablaHTML += '<tbody>';
    for (var i = 1; i <= limite; i++) {
        var resultado = numero * i;
        
        
        tablaHTML += "<tr>";
        tablaHTML += "<td>" + numero + "</td>";
        tablaHTML += "<td>" + i + "</td>";
        tablaHTML += "<td>" + resultado + "</td>";
        tablaHTML += "</tr>";
    }
    tablaHTML += "</tbody></table>";

    var tablaContenedor = document.getElementById("tablaContenedor");
    tablaContenedor.innerHTML = tablaHTML;
}