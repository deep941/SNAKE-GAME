const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 400;

let snake = [
    { x: 160, y: 160 },
    { x: 140, y: 160 },
    { x: 120, y: 160 },
    { x: 100, y: 160 }
];

let dx = 20;
let dy = 0;
let foodX, foodY;
let score = 0;
let speed = 100;  // Initial speed of snake
let highScore = localStorage.getItem('highScore') || 0;
let wallPass = false;  // Wall pass toggle
let snakeColor = document.getElementById('snakeColor').value;

const eatSound = document.getElementById('eatSound');
const gameOverSound = document.getElementById('gameOverSound');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');

document.getElementById('highScore').textContent = highScore;
document.addEventListener('keydown', changeDirection);
document.getElementById('wallPassToggle').addEventListener('change', toggleWallPass);
document.getElementById('snakeColor').addEventListener('input', updateSnakeColor);

document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('restartButton').addEventListener('click', restartGame);

function startGame() {
    startScreen.style.display = 'none';
    resetGame();
    main();
}

function restartGame() {
    gameOverScreen.style.display = 'none';
    resetGame();
    main();
}

function main() {
    if (didGameEnd()) return;

    setTimeout(() => {
        clearCanvas();
        moveSnake();
        drawSnake();
        drawFood();
        main();
    }, speed);  // Speed of the game, adjusted by score
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    snake.forEach(part => {
        ctx.fillStyle = snakeColor;
        ctx.fillRect(part.x, part.y, 20, 20);
        ctx.strokeRect(part.x, part.y, 20, 20);
    });
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Wall pass logic
    if (wallPass) {
        if (head.x >= canvas.width) head.x = 0;
        if (head.x < 0) head.x = canvas.width - 20;
        if (head.y >= canvas.height) head.y = 0;
        if (head.y < 0) head.y = canvas.height - 20;
    }

    snake.unshift(head);

    if (head.x === foodX && head.y === foodY) {
        score += 10;
        eatSound.play();  // Play sound when food is eaten
        document.getElementById('score').textContent = score;
        generateFood();
    } else {
        snake.pop();
    }
}

function generateFood() {
    foodX = Math.floor(Math.random() * (canvas.width / 20)) * 20;
    foodY = Math.floor(Math.random() * (canvas.height / 20)) * 20;

    // Ensure food does not generate on the snake
    if (snake.some(part => part.x === foodX && part.y === foodY)) {
        generateFood();
    }
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(foodX, foodY, 20, 20);
    ctx.strokeRect(foodX, foodY, 20, 20);
}

function didGameEnd() {
    // Check for self-collision
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            endGame();
            return true;
        }
    }

    // Check for wall collisions if wall pass is disabled
    const hitLeftWall = snake[0].x < 0 && !wallPass;
    const hitRightWall = snake[0].x >= canvas.width && !wallPass;
    const hitTopWall = snake[0].y < 0 && !wallPass;
    const hitBottomWall = snake[0].y >= canvas.height && !wallPass;

    if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall) {
        endGame();
        return true;
    }

    return false;
}

function endGame() {
    gameOverSound.play();  // Play sound when game ends
    document.getElementById('finalScore').textContent = score;
    document.getElementById('highScoreDisplay').textContent = highScore;

    // Update high score if the current score is higher
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        document.getElementById('highScore').textContent = highScore;
    }

    gameOverScreen.style.display = 'block';  // Display Game Over screen
}

function resetGame() {
    snake = [
        { x: 160, y: 160 },
        { x: 140, y: 160 },
        { x: 120, y: 160 },
        { x: 100, y: 160 }
    ];
    dx = 20;
    dy = 0;
    score = 0;
    speed = 100;  // Reset speed
    document.getElementById('score').textContent = score;
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const goingUp = dy === -20;
    const goingDown = dy === 20;
    const goingRight = dx === 20;
    const goingLeft = dx === -20;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -20;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -20;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 20;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 20;
    }
}

function toggleWallPass() {
    wallPass = document.getElementById('wallPassToggle').checked;
}

function updateSnakeColor() {
    snakeColor = document.getElementById('snakeColor').value;
}
