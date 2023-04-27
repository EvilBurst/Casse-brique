const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.style.border = '3px solid black';
ctx.lineWidth = 2;

const SCORE_UNIT = 10;
const MAX_LEVEL = 10;


let leftArrow = false;
let rightArrow = false;
let life = 3;
let score = 0;
let level = 1;
let gameOver = false;


function Paddle(x, y, width, height, color, dx, margin_bottom) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.dx = dx;
    this.margin_bottom = margin_bottom;
}

Paddle.prototype.draw = function(ctx) {
    ctx.beginPath();
    ctx.fillStyle = 'yellow';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.closePath();
    this.y = canvas.height - this.height - this.margin_bottom;
};

Paddle.prototype.move = function() {
    if (leftArrow && this.x > 0) {
        this.x -= this.dx;
    } else if (rightArrow && this.x + this.width < canvas.width) {
        this.x += this.dx;
    }
};

//Mise en place des touches du clavier
document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') {
        leftArrow = true;
    } else if (event.key === 'ArrowRight') {
        rightArrow = true;
    }
});

document.addEventListener('keyup', function (event) {
    if (event.key === 'ArrowLeft') {
        leftArrow = false;
    } else if (event.key === 'ArrowRight') {
        rightArrow = false;
    }
});

Paddle.prototype.reset = function() {
    this.x = (canvas.width - this.width) / 2;
}


function Ball(x, y, radius, color, dx, dy, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.dx = dx;
    this.dy = dy;
    this.velocity = velocity;
}

Ball.prototype.draw = function(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
};

Ball.prototype.move = function(canvas) {
    this.x += this.dx;
    this.y += this.dy;
};


Ball.prototype.collisionDetection = function(Paddle) {
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
        this.dx = -this.dx;
    }
    if (this.y - this.radius < 0) {
        this.dy = -this.dy;
    }

    if (this.x + this.radius > Paddle.x &&
        this.x - this.radius < Paddle.x + Paddle.width &&
        this.y + this.radius > Paddle.y) {

        let collidePoint = this.x - (Paddle.x + Paddle.width / 2);
        collidePoint = collidePoint / (Paddle.width / 2);

        let angle = collidePoint * Math.PI / 3;

        this.dx = this.velocity * Math.sin(angle);
        this.dy = -this.velocity * Math.cos(angle);
    }
    if (this.y + this.radius > canvas.height) {
        life--;
        this.reset(canvas, Paddle);
    }
    bricks.forEach(column => {
        column.forEach(brick => {
            if (brick.status) {
                if (this.x + this.radius > brick.x &&
                    this.x - this.radius < brick.x + brick.width &&
                    this.y + this.radius > brick.y &&
                    this.y - this.radius < brick.y + brick.height) {
                    this.dy = -this.dy;
                    brick.status = false;
                    score += SCORE_UNIT;
                }
            }
        })

    })
};

Ball.prototype.reset = function (canvas , Paddle){
    this.x = canvas.width / 2;
    this.y = Paddle.y - this.radius;
    this.dx = 3 * (Math.random() * 2 - 1);
    this.dy = -3;
    this.velocity = 3;
};

const brick = {
    row: 2,
    column: 11,
    width: 55,
    height: 20,
    padding: 3,
    offsetX: 30,
    offsetY: 60,
    fillColor: 'red',
    strokeColor: 'black',
    visible: true,
}

//Création des briques
let bricks = [];

function createBricks() {
    for (let r = 0; r < brick.row; r++) {
        bricks[r] = [];
        for (let c = 0; c < brick.column; c++) {
            bricks[r][c] = {
                x: c * (brick.width + brick.padding) + brick.offsetX,
                y: r * (brick.height + brick.padding) + brick.offsetY,
                status: true,
                ...brick
            }
        }
    }
}

createBricks();

//Dessiner les briques
function drawBricks() {
    bricks.forEach(column => {
        column.forEach(brick => {
            if (brick.status) {
                ctx.beginPath();
                ctx.fillStyle = brick.fillColor;
                ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
                ctx.strokeStyle = brick.strokeColor;
                ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
                ctx.closePath();

            }

        })
    })

}


const paddle = new Paddle(canvas.width / 2 - 50, canvas.height - 20, 100, 20, 'red', 2, 20);
const ball = new Ball(canvas.width / 2, canvas.height / 1.5, 8, 'blue', 3 * (Math.random() * 2 - 1 ), -3, 3);

function showGameStats(img, iPosX, iPosY, text = "", tPosX = null, tPosY = null) {
    ctx.fillStyle = 'white';
    ctx.font = '25px Germania One';
    ctx.fillText(text, tPosX, tPosY);
    ctx.drawImage(img, iPosX, iPosY, width = 60, height = 30);
}

    function gameover() {
        if (life <= 0) {
            showEndInfo('lose');
            gameOver = true;
        }
    }

    function nextLevel() {
        let isLevelUp = true;

        for (let r = 0; r < brick.row; r++) {
            for (let c = 0; c < brick.column; c++) {
                isLevelUp = isLevelUp && !bricks[r][c].status;
            }
        }

        if (isLevelUp) {
            if (level => MAX_LEVEL) {
                showEndInfo();
                gameOver = true;
                return;
            }
            brick.row += 2;
            createBricks();
            ball.reset();
            paddle.reset();
            level++;

        }
    }

    function draw() {
        paddle.draw(ctx);
        ball.draw(ctx);
        showGameStats(SCORE_IMG, canvas.width - 125, 5, score, canvas.width - 55, 30);
        showGameStats(LIFE_IMG, canvas.width - 670, 5, life, canvas.width / 7, 27);
        showGameStats(LEVEL_IMG, canvas.width / 2.2, 5, level, canvas.width - 325, 27);

    }

    function update() {
        paddle.move(canvas);
        ball.move(canvas);
        ball.collisionDetection(paddle, canvas);
        drawBricks();
        gameover();
        nextLevel();
    }

    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        update();
        draw();

        if (!gameOver) {
            requestAnimationFrame(loop);
        }

    }

    loop();

    const game_over = document.getElementById('game-over');
    const youWon = document.getElementById('you-won');
    const youLose = document.getElementById('you-lose');
    const restart = document.getElementById('restart');


    function showEndInfo(type = 'win') {
        game_over.style.visibility = 'visible';
        game_over.style.opacity = '1';

        if (type === 'win') {
            youWon.style.visibility = 'visible';
            youLose.style.visibility = 'hidden';
            youLose.style.opacity = '0';
        } else {
            youWon.style.visibility = 'hidden';
            youLose.style.visibility = 'visible';
            youWon.style.opacity = '0';

        }
    }

    restart.addEventListener('click', function () {
        location.reload()
    });
