
let graficoVentas = null;
let graficoRendimiento = null;

function obtenerDatosVentasSimulados() {
    const labels = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    const data = labels.map(() => Math.floor(Math.random() * 5000) + 1000);

    return { labels: labels, data: data };
}

function obtenerDatosRendimientoSimulados() {
    const labels = ["Ana M.", "Juan P.", "Luis G.", "María C."];
    const data = labels.map(() => Math.floor(Math.random() * 20) + 80); 

    return { labels: labels, data: data };
}

function actualizarGraficas() {
    const datosVentas = obtenerDatosVentasSimulados();
    const datosRendimiento = obtenerDatosRendimientoSimulados();
    const now = new Date().toLocaleTimeString();

    if (graficoVentas) {
        graficoVentas.data.datasets[0].data = datosVentas.data;
        graficoVentas.update();
    } else {
        const ctxVentas = document.getElementById('graficoVentas').getContext('2d');
        graficoVentas = new Chart(ctxVentas, {
            type: 'bar',
            data: {
                labels: datosVentas.labels,
                datasets: [{
                    label: 'Ventas Totales (MXN)',
                    data: datosVentas.data,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)'
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }
    document.getElementById('ventas-timestamp').textContent = now;

    if (graficoRendimiento) {
        graficoRendimiento.data.datasets[0].data = datosRendimiento.data;
        graficoRendimiento.update();
    } else {
        const ctxRendimiento = document.getElementById('graficoRendimiento').getContext('2d');
        graficoRendimiento = new Chart(ctxRendimiento, {
            type: 'line', 
            data: {
                labels: datosRendimiento.labels,
                datasets: [{
                    label: 'Rendimiento (%)',
                    data: datosRendimiento.data,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    tension: 0.1
                }]
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: false, max: 100 } }
            }
        });
    }
    document.getElementById('rendimiento-timestamp').textContent = now;
}

actualizarGraficas(); 

setInterval(actualizarGraficas, 10000);