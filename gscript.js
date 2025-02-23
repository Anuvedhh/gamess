const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const loginForm = document.getElementById("loginForm");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let score, gameOver, player, enemies, moveLeft, moveRight;
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('gameOverScreen');
const restartBtn = document.getElementById('restartBtn');
document.addEventListener("DOMContentLoaded", function () {
    const playerNameDisplay = document.getElementById("playerName");
    const enteredUsername = document.getElementById("username").value.trim();
    
    if (storedUsername) {
        playerNameDisplay.textContent = enteredUsername; // Set the username in the game UI
    } else {
        playerNameDisplay.textContent = "Guest"; // Default if no username is found
    }
});

function resetGame() {
    score = 0;
    gameOver = false;
    player = { x: canvas.width / 2, y: canvas.height - 120, width: 50, height: 50, color: 'blue', bullets: [] };
    enemies = [];
    moveLeft = false;
    moveRight = false;
    scoreDisplay.innerText = score;
    gameOverScreen.style.display = "none";
    update();
}

function createEnemy() {
    if (gameOver) return;
    const colors = [
        { color: 'red', points: 20 },
        { color: 'blue', points: 30 },
        { color: 'white', points: 10 }
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    enemies.push({
        x: Math.random() * (canvas.width - 50),
        y: 0,
        radius: 20,
        color: randomColor.color,
        speed: Math.random() *  3  +1,
        points: randomColor.points
    });
}

function shoot() {
    if (gameOver) return;
    player.bullets.push({ x: player.x + 25, y: player.y, radius: 5, color: 'yellow', speed: 7 });
}

function checkCollision(enemy) {
    return (
        enemy.x + enemy.radius > player.x &&
        enemy.x - enemy.radius < player.x + player.width &&
        enemy.y + enemy.radius > player.y &&
        enemy.y - enemy.radius < player.y + player.height
    );
}

function endGame() {
    gameOver = true;
    gameOverScreen.style.display = "block";
}

document.addEventListener('keydown', (event) => {
    if (gameOver) return;
    if (event.code === 'Space') shoot();
    if (event.code === 'ArrowLeft') moveLeft = true;
    if (event.code === 'ArrowRight') moveRight = true;
});

document.addEventListener('keyup', (event) => {
    if (event.code === 'ArrowLeft') moveLeft = false;
    if (event.code === 'ArrowRight') moveRight = false;
});

// Button Controls
document.getElementById('leftBtn').addEventListener('touchstart', () => moveLeft = true);
document.getElementById('leftBtn').addEventListener('touchend', () => moveLeft = false);
document.getElementById('rightBtn').addEventListener('touchstart', () => moveRight = true);
document.getElementById('rightBtn').addEventListener('touchend', () => moveRight = false);
document.getElementById('shootBtn').addEventListener('click', () => shoot());

restartBtn.addEventListener('click', resetGame);

function update() {
    if (gameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (moveLeft && player.x > 0) player.x -= 5;
    if (moveRight && player.x < canvas.width - player.width) player.x += 5;

    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillStyle = 'gray';
    ctx.fillRect(player.x + 20, player.y - 15, 10, 15);
    
    player.bullets.forEach((bullet, bIndex) => {
        bullet.y -= bullet.speed;
        ctx.fillStyle = bullet.color;
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fill();
        if (bullet.y < 0) player.bullets.splice(bIndex, 1);
    });
    
    enemies.forEach((enemy, eIndex) => {
        enemy.y += enemy.speed;
        ctx.fillStyle = enemy.color;
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
        ctx.fill();

        if (checkCollision(enemy)) {
            endGame();
            return;
        }

        player.bullets.forEach((bullet, bIndex) => {
            const dx = bullet.x - enemy.x;
            const dy = bullet.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < bullet.radius + enemy.radius) {
                player.bullets.splice(bIndex, 1);
                enemies.splice(eIndex, 1);
                score += enemy.points;
                scoreDisplay.innerText = score;
            }
        });

        if (enemy.y > canvas.height) enemies.splice(eIndex, 1);
    });

    requestAnimationFrame(update);
}

setInterval(createEnemy, 1000);
resetGame();
