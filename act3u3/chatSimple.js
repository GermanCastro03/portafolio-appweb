
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
let historialMensajes = [];

function obtenerMensajes() {
    const nuevoMensaje = simularRecepcionServidor();
    if (nuevoMensaje) {
        historialMensajes.push(nuevoMensaje);
        renderizarMensajes();
    }
}

function simularRecepcionServidor() {
    if (Math.random() < 0.2) { 
        const mensajesPredefinidos = [
            { text: "El inventario de café de Colombia está bajo.", type: "receiver" },
            { text: "Revisado, haré el pedido antes de las 3PM.", type: "sender" },
            { text: "Necesito el reporte de horas extra del turno de noche.", type: "receiver" }
        ];
        const randIndex = Math.floor(Math.random() * mensajesPredefinidos.length);
        const mensaje = mensajesPredefinidos[randIndex];
        
        mensaje.type = mensaje.type === "receiver" ? "sender" : "receiver"; 
        
        return mensaje;
    }
    return null;
}

function enviarMensaje() {
    const text = chatInput.value.trim();
    if (text) {
        const newMessage = { text: text, type: "sender" };
        historialMensajes.push(newMessage);

        chatInput.value = '';
        renderizarMensajes();
        
        setTimeout(() => {
            historialMensajes.push({ text: "Mensaje recibido. Procesando...", type: "receiver" });
            renderizarMensajes();
        }, 1500);
    }
}

function renderizarMensajes() {
    chatMessages.innerHTML = '';
    historialMensajes.forEach(msg => {
        const div = document.createElement('div');
        div.className = 'chat-message ' + msg.type;
        div.textContent = msg.text;
        chatMessages.appendChild(div);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

chatInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        enviarMensaje();
    }
});


historialMensajes.push({ text: "¡Bienvenido al chat interno!", type: "receiver" });
historialMensajes.push({ text: "Soy el administrador, ¿en qué puedo ayudarte?", type: "receiver" });
renderizarMensajes();

setInterval(obtenerMensajes, 3000);