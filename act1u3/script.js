// --- SIMULACIÓN DE BASE DE DATOS (LocalStorage) ---

const DB = {
    getUsers: () => JSON.parse(localStorage.getItem('chat_users')) || [],
    setUsers: (users) => localStorage.setItem('chat_users', JSON.stringify(users)),
    
    getMessages: () => JSON.parse(localStorage.getItem('chat_messages')) || [],
    setMessages: (msgs) => localStorage.setItem('chat_messages', JSON.stringify(msgs)),
    
    getGroups: () => JSON.parse(localStorage.getItem('chat_groups')) || [],
    setGroups: (groups) => localStorage.setItem('chat_groups', JSON.stringify(groups)),
    
    getCurrentUser: () => JSON.parse(sessionStorage.getItem('currentUser')),
    setCurrentUser: (user) => sessionStorage.setItem('currentUser', JSON.stringify(user)),
    logout: () => sessionStorage.removeItem('currentUser')
};

// Estado actual del chat
let currentChat = {
    type: 'global',
    id: 0,
    name: 'Chat Global'
};

// --- INICIALIZACIÓN ---

$(document).ready(function() {
    checkAuth();

    // Inicializar datos de prueba si está vacío
    if (DB.getUsers().length === 0) {
        DB.setUsers([
            { id: 1, username: 'Admin', password: '123' }, 
            { id: 2, username: 'Invitado', password: '123' }
        ]);
    }
});

function checkAuth() {
    const user = DB.getCurrentUser();
    if (user) {
        showChatScreen(user);
    } else {
        showLoginScreen();
    }
}

// --- NAVEGACIÓN ENTRE PANTALLAS ---

function showLoginScreen() {
    $('#login-screen').show();
    $('#register-screen').hide();
    $('#chat-app').hide();
}

function showRegisterScreen() {
    $('#login-screen').hide();
    $('#register-screen').show();
    $('#chat-app').hide();
}

function showChatScreen(user) {
    $('#login-screen').hide();
    $('#register-screen').hide();
    $('#chat-app').css('display', 'flex'); // Flex para mantener el diseño
    
    $('#current-username-display').text(user.username);
    renderSidebar();
    loadMessages();
    
    // Auto-scroll
    scrollToBottom();
}

// --- LÓGICA DE LOGIN / REGISTER ---

$('#link-to-register').click(e => { e.preventDefault(); showRegisterScreen(); });
$('#link-to-login').click(e => { e.preventDefault(); showLoginScreen(); });

$('#btn-login').click(function() {
    const username = $('#login-username').val();
    const password = $('#login-password').val();
    
    const users = DB.getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        DB.setCurrentUser(user);
        showChatScreen(user);
        $('#login-username').val('');
        $('#login-password').val('');
    } else {
        $('#login-error').text('Usuario o contraseña incorrectos').show();
    }
});

$('#btn-register').click(function() {
    const username = $('#reg-username').val();
    const password = $('#reg-password').val();
    
    if (username.length < 3 || password.length < 3) {
        $('#register-error').text('Datos muy cortos').show();
        return;
    }

    const users = DB.getUsers();
    if (users.find(u => u.username === username)) {
        $('#register-error').text('El usuario ya existe').show();
        return;
    }

    const newUser = {
        id: Date.now(), // ID único basado en tiempo
        username: username,
        password: password
    };
    
    users.push(newUser);
    DB.setUsers(users);
    
    $('#register-success').text('Cuenta creada. Inicia sesión.').show();
    setTimeout(() => showLoginScreen(), 1500);
});

$('#btn-logout').click(function() {
    DB.logout();
    location.reload();
});

// --- LÓGICA DEL CHAT ---

function renderSidebar() {
    const currentUser = DB.getCurrentUser();
    const users = DB.getUsers();
    const groups = DB.getGroups();
    
    // Render Usuarios
    let usersHtml = '';
    users.forEach(u => {
        if (u.id !== currentUser.id) {
            usersHtml += `
                <div class="chat-item" data-type="private" data-id="${u.id}" data-name="${u.username}">
                    <span>👤 ${u.username}</span>
                </div>
            `;
        }
    });
    $('#user-list').html(usersHtml);
    
    // Render Grupos
    let groupsHtml = '';
    groups.forEach(g => {
        groupsHtml += `
            <div class="chat-item" data-type="group" data-id="${g.id}" data-name="${g.name}">
                <span>👥 ${g.name}</span>
            </div>
        `;
    });
    $('#group-list').html(groupsHtml);
}

// Click en items del sidebar
$(document).on('click', '.chat-item', function() {
    $('.chat-item').removeClass('active');
    $(this).addClass('active');
    
    currentChat.type = $(this).data('type');
    currentChat.id = $(this).data('id');
    currentChat.name = $(this).find('span').text().replace(/^[🌍👤👥]\s/, ''); // Quitar icono
    
    // Si es privado, guardamos el nombre limpio del usuario
    if(currentChat.type === 'private') {
         currentChat.name = $(this).data('name');
    }

    $('#chat-title').text(currentChat.name);
    loadMessages();
});

function sendMessage() {
    const text = $('#msg').val().trim();
    if (!text) return;
    
    const currentUser = DB.getCurrentUser();
    const allMessages = DB.getMessages();
    
    const newMessage = {
        id: Date.now(),
        sender_id: currentUser.id,
        sender_name: currentUser.username,
        text: text,
        type: currentChat.type,
        target_id: currentChat.id, // ID del grupo o del usuario receptor
        created_at: new Date().toISOString()
    };
    
    allMessages.push(newMessage);
    DB.setMessages(allMessages);
    
    $('#msg').val('');
    loadMessages();
}

$('#send').click(sendMessage);
$('#msg').keypress(function(e) {
    if (e.which === 13) sendMessage();
});

function loadMessages() {
    const currentUser = DB.getCurrentUser();
    const allMessages = DB.getMessages();
    let filteredMessages = [];
    
    if (currentChat.type === 'global') {
        filteredMessages = allMessages.filter(m => m.type === 'global');
    } else if (currentChat.type === 'private') {
        // Mensajes donde YO soy emisor Y el otro es receptor, O viceversa
        filteredMessages = allMessages.filter(m => 
            m.type === 'private' && 
            ((m.sender_id === currentUser.id && m.target_id === currentChat.id) ||
             (m.sender_id === currentChat.id && m.target_id === currentUser.id))
        );
    } else if (currentChat.type === 'group') {
        filteredMessages = allMessages.filter(m => m.type === 'group' && m.target_id === currentChat.id);
    }
    
    displayMessages(filteredMessages, currentUser.id);
}

function displayMessages(messages, currentUserId) {
    let html = '';
    messages.forEach(msg => {
        const isMine = msg.sender_id === currentUserId;
        const msgClass = isMine ? 'message-mine' : 'message-other';
        const time = new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        html += `
            <div class="message ${msgClass}">
                <div class="message-header">
                    <strong>${msg.sender_name}</strong>
                    <span class="message-time">${time}</span>
                </div>
                <div class="message-text">${escapeHtml(msg.text)}</div>
            </div>
        `;
    });
    
    const chatBox = $('#chat-messages');
    chatBox.html(html);
    scrollToBottom();
}

function scrollToBottom() {
    const chatBox = $('#chat-messages');
    chatBox.scrollTop(chatBox[0].scrollHeight);
}

// --- GRUPOS ---

$('#btn-create-group-modal').click(() => $('#modal-create-group').show());
$('.close').click(() => $('.modal').hide());

$('#create-group-btn').click(function() {
    const name = $('#group-name').val();
    if (!name) return alert('Ponle nombre');
    
    const groups = DB.getGroups();
    groups.push({ id: Date.now(), name: name });
    DB.setGroups(groups);
    
    $('#modal-create-group').hide();
    $('#group-name').val('');
    renderSidebar();
    alert('Grupo creado');
});

// Utilidad
function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Recargar mensajes cada 2 segundos (simulación de tiempo real)
setInterval(() => {
    if ($('#chat-app').is(':visible')) {
        loadMessages();
    }
}, 2000);