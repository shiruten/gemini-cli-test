const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Player
let player = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 30,
    width: 30,
    height: 30,
    color: 'white',
    speed: 5
};

// Bullets
let bullets = [];

// Enemies
let enemies = [];

// Game state
let score = 0;
let gameOver = false;

// Event listeners
document.addEventListener('keydown', handleKeyDown);

function handleKeyDown(e) {
    if (gameOver) {
        if (e.key === 'Enter') {
            resetGame();
        }
        return;
    }

    if (e.key === 'ArrowLeft' && player.x > 0) {
        player.x -= player.speed;
    } else if (e.key === 'ArrowRight' && player.x < canvas.width - player.width) {
        player.x += player.speed;
    } else if (e.key === ' ') {
        bullets.push({ x: player.x + player.width / 2 - 2.5, y: player.y, width: 5, height: 10, color: 'white' });
    }
}

function resetGame() {
    gameOver = false;
    score = 0;
    player.x = canvas.width / 2 - 15;
    player.y = canvas.height - 30;
    bullets = [];
    enemies = [];
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.moveTo(player.x, player.y + player.height);
    ctx.lineTo(player.x + player.width / 2, player.y);
    ctx.lineTo(player.x + player.width, player.y + player.height);
    ctx.closePath();
    ctx.fill();
}

function drawBullets() {
    for (let bullet of bullets) {
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }
}

function drawEnemies() {
    for (let enemy of enemies) {
        ctx.fillStyle = 'red';
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }
}

function update() {
    if (gameOver) return;

    // Move bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= 10;
        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
        }
    }

    // Move enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].y += 2;
        if (enemies[i].y > canvas.height) {
            enemies.splice(i, 1);
        }
    }

    // Create new enemies
    if (Math.random() < 0.02) {
        enemies.push({ x: Math.random() * (canvas.width - 20), y: 0, width: 20, height: 20 });
    }

    // Collision detection
    for (let i = enemies.length - 1; i >= 0; i--) {
        for (let j = bullets.length - 1; j >= 0; j--) {
            if (
                bullets[j].x < enemies[i].x + enemies[i].width &&
                bullets[j].x + bullets[j].width > enemies[i].x &&
                bullets[j].y < enemies[i].y + enemies[i].height &&
                bullets[j].y + bullets[j].height > enemies[i].y
            ) {
                enemies.splice(i, 1);
                bullets.splice(j, 1);
                score += 10;
                break;
            }
        }
    }

    // Game over
    for (let enemy of enemies) {
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            gameOver = true;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    drawBullets();
    drawEnemies();

    // Score
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 20);

    if (gameOver) {
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.font = '40px Arial';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);
        ctx.font = '20px Arial';
        ctx.fillText('Press Enter to Retry', canvas.width / 2, canvas.height / 2 + 20);
        ctx.textAlign = 'left';
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
