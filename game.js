// Game Constants
const GRID_WIDTH = 32;
const GRID_HEIGHT = 24;
const CELL_SIZE = 20;
const FPS = 10;
const FRAME_DURATION = 1000 / FPS; // 100ms per frame

// Colors (ctrl-qs Branding)
const COLORS = {
    DEEP_PURPLE: '#2A0229',
    PRIMARY_YELLOW: '#CBF831',
    YELLOW_DARK: '#A3C627',
    LIGHT_BLUE: '#CDE4F6',
    WHITE: '#FFFFFF'
};

// Direction Enum
const Direction = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 }
};

// Game State
let canvas, ctx;
let scoreDisplay, gameOverOverlay, finalScoreDisplay;
let snake = [];
let direction = Direction.RIGHT;
let nextDirection = Direction.RIGHT;
let food = null;
let score = 0;
let gameOver = false;
let growPending = false;
let lastFrameTime = 0;

// Initialize game
function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    scoreDisplay = document.getElementById('score');
    gameOverOverlay = document.getElementById('gameOverOverlay');
    finalScoreDisplay = document.getElementById('finalScore');

    // Event listeners
    document.addEventListener('keydown', handleKeyPress);

    // Start game
    resetGame();
    requestAnimationFrame(gameLoop);
}

// Reset game to initial state
function resetGame() {
    // Initialize snake at center (3 segments)
    snake = [
        { x: 16, y: 12 },
        { x: 15, y: 12 },
        { x: 14, y: 12 }
    ];

    direction = Direction.RIGHT;
    nextDirection = Direction.RIGHT;
    score = 0;
    gameOver = false;
    growPending = false;

    spawnFood();
    updateScore();
    hideGameOver();
}

// Spawn food at random position not on snake
function spawnFood() {
    let validPosition = false;
    let newFood;

    while (!validPosition) {
        newFood = {
            x: Math.floor(Math.random() * GRID_WIDTH),
            y: Math.floor(Math.random() * GRID_HEIGHT)
        };

        // Check if position is not on snake
        validPosition = !snake.some(segment =>
            segment.x === newFood.x && segment.y === newFood.y
        );
    }

    food = newFood;
}

// Handle keyboard input
function handleKeyPress(event) {
    if (gameOver) {
        if (event.code === 'Space') {
            resetGame();
        }
        return;
    }

    // Arrow keys or WASD
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            if (direction !== Direction.DOWN) {
                nextDirection = Direction.UP;
            }
            event.preventDefault();
            break;
        case 'ArrowDown':
        case 'KeyS':
            if (direction !== Direction.UP) {
                nextDirection = Direction.DOWN;
            }
            event.preventDefault();
            break;
        case 'ArrowLeft':
        case 'KeyA':
            if (direction !== Direction.RIGHT) {
                nextDirection = Direction.LEFT;
            }
            event.preventDefault();
            break;
        case 'ArrowRight':
        case 'KeyD':
            if (direction !== Direction.LEFT) {
                nextDirection = Direction.RIGHT;
            }
            event.preventDefault();
            break;
    }
}

// Update game state
function update() {
    if (gameOver) return;

    // Update direction
    direction = nextDirection;

    // Calculate new head position
    const head = snake[0];
    const newHead = {
        x: head.x + direction.x,
        y: head.y + direction.y
    };

    // Check wall collision
    if (newHead.x < 0 || newHead.x >= GRID_WIDTH ||
        newHead.y < 0 || newHead.y >= GRID_HEIGHT) {
        endGame();
        return;
    }

    // Check self collision
    if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        endGame();
        return;
    }

    // Add new head
    snake.unshift(newHead);

    // Check food collision
    if (newHead.x === food.x && newHead.y === food.y) {
        score += 10;
        updateScore();
        growPending = true;
        spawnFood();
    }

    // Remove tail if not growing
    if (growPending) {
        growPending = false;
    } else {
        snake.pop();
    }
}

// Render game
function render() {
    // Clear canvas
    ctx.fillStyle = COLORS.DEEP_PURPLE;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw food
    if (food) {
        ctx.fillStyle = COLORS.LIGHT_BLUE;
        ctx.strokeStyle = COLORS.WHITE;
        ctx.lineWidth = 1;

        const x = food.x * CELL_SIZE;
        const y = food.y * CELL_SIZE;

        roundRect(ctx, x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2, 3);
        ctx.fill();
        ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
        const isHead = index === 0;
        ctx.fillStyle = isHead ? COLORS.PRIMARY_YELLOW : COLORS.YELLOW_DARK;
        ctx.strokeStyle = COLORS.WHITE;
        ctx.lineWidth = 1;

        const x = segment.x * CELL_SIZE;
        const y = segment.y * CELL_SIZE;

        roundRect(ctx, x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2, 3);
        ctx.fill();
        ctx.stroke();
    });
}

// Helper function to draw rounded rectangles
function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

// Update score display
function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

// End game
function endGame() {
    gameOver = true;
    finalScoreDisplay.textContent = `Score: ${score}`;
    showGameOver();
}

// Show game over overlay
function showGameOver() {
    gameOverOverlay.classList.add('visible');
}

// Hide game over overlay
function hideGameOver() {
    gameOverOverlay.classList.remove('visible');
}

// Game loop with fixed timestep
function gameLoop(timestamp) {
    requestAnimationFrame(gameLoop);

    const elapsed = timestamp - lastFrameTime;

    if (elapsed >= FRAME_DURATION) {
        lastFrameTime = timestamp - (elapsed % FRAME_DURATION);
        update();
        render();
    }
}

// Start game when page loads
window.addEventListener('load', init);
