document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('startButton');
    const resetButton = document.getElementById('resetButton');

    let gameRunning = false; 
    let gameOver = false; 
    let animationFrameId; 

    let score = 0;

    const player1 = {
        x: canvas.width / 3,
        y: canvas.height - 30,
        radius: 10,
        color: '#007bff',
        speed: 25
    };

    const player2 = {
        x: 2 * canvas.width / 3,
        y: canvas.height - 30,
        radius: 10,
        color: '#28a745',
        speed: 25
    };

    function drawPlayer(p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.closePath();
    }

    function drawPlayers() {
        drawPlayer(player1);
        drawPlayer(player2);
    }

    class Block {
        constructor(x, y, width, height, dy, color) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.dy = dy;
            this.color = color;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        update() {
            this.y += this.dy;

            if (this.y > canvas.height) {
                this.y = -this.height; 
                this.x = Math.random() * (canvas.width - this.width); 
                this.dy = 1.5 + Math.random() * 2;

                score += 1;
            }
        }

        collides(player) {
            const collisionX = player.x + player.radius > this.x && player.x - player.radius < this.x + this.width;
            const collisionY = player.y + player.radius > this.y && player.y - player.radius < this.y + this.height;

            return collisionX && collisionY;
        }
    }

    const blocks = [];
    const blockCount = 10;

    function initializeBlocks() {
        blocks.length = 0;
        for (let i = 0; i < blockCount; i++) {
            const width =  Math.random() * 75 + 25;
            const height = 20;
            const x = Math.random() * (canvas.width - width);
            
            const y = -height - (i * 80); 
            const dy = 1.5 + Math.random() * 2;
            const color = `hsl(${i * 60 + 200}, 70%, 50%)`;

            blocks.push(new Block(x, y, width, height, dy, color));
        }
    }

    function gameLoop() {
        if (!gameRunning) return; 

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const block of blocks) {
            block.update();
            block.draw();

            if (block.collides(player1) || block.collides(player2)) {
                gameOver = true;
                gameRunning = false;
                cancelAnimationFrame(animationFrameId);
                startButton.disabled = true;
                alert('Juego terminado. Obtuviste: ' + score + ' puntos');
                return; 
            }
        }

        drawPlayers();

        ctx.fillStyle = '#333';
        ctx.font = '18px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Puntos: ' + score, 10, 25);

        animationFrameId = requestAnimationFrame(gameLoop);
    }

    document.addEventListener('keydown', (e) => {
        if (!gameRunning || gameOver) return; 

        if (e.key === 'a' || e.key === 'A') {
            player1.x -= player1.speed;
        } else if (e.key === 'd' || e.key === 'D') {
            player1.x += player1.speed;
        } else if (e.key === 'ArrowLeft') {
            player2.x -= player2.speed;
        } else if (e.key === 'ArrowRight') {
            player2.x += player2.speed;
        }

        player1.x = Math.max(player1.radius, Math.min(canvas.width - player1.radius, player1.x));
        player2.x = Math.max(player2.radius, Math.min(canvas.width - player2.radius, player2.x));
    });

    startButton.addEventListener('click', () => {
        if (!gameRunning && !gameOver) {
            gameRunning = true;
            startButton.disabled = true;
            gameLoop(); 
            
            ctx.clearRect(0, 0, canvas.width, canvas.height); 
        }
    });

    resetButton.addEventListener('click', () => {
        location.reload(); 
        score = 0;
    });

    function drawInitialScreen() {
        initializeBlocks();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPlayers();
        
        ctx.fillStyle = '#333';
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Pulsa "Iniciar Juego" para empezar', canvas.width / 2, canvas.height / 2 - 10);
        ctx.fillText('Player1: A/D  —  Player2: Flechas', canvas.width / 2, canvas.height / 2 + 18);
    }

    drawInitialScreen();

});