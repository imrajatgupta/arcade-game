// Enemies our player must avoid
var Enemy = function (x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.speed = speed;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + (this.speed * dt);
    if (this.x >= 505) {
        this.x = 0;
    }
    this.checkCollision();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// checks en enemy's collision with player
Enemy.prototype.checkCollision = function () {
    if ((player.y + 73) <= (this.y + 135) &&
        (player.y + 131) >= (this.y + 90) &&
        (player.x + 25) <= (this.x + 88) &&
        (player.x + 76) >= (this.x + 11)) {
        console.log('collision');
        resetGame();
    }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function (x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/char-boy.png';
};

// Update method for Player
Player.prototype.update = function () {};

// renders the player
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*
 * handles input for the player
 */
Player.prototype.handleInput = function (key) {
    if (key == 'left' || key == 'A' || key == 'a') {
        this.x = (this.x - this.speed + 505) % 505;
    } else if (key == 'right' || key == 'D' || key == 'd') {
        this.x = (this.x + this.speed) % 505;
    } else if (key == 'up' || key == 'W' || key =='w') {
        this.y = (this.y - this.speed + 606) % 606;
        // going to water
        if (this.y <= (83 - 48)) {
            gameOver();
            return;
        }
    } else if(key == 'down' || key == 'S' || key == 's') {
        this.y = (this.y + this.speed) % 606;
        if (this.y > 400) { // bottom limit
            this.y = 400;
        }
    }
    // x axis wrap
    if (this.x < 2.5) {
        this.x = 2.5;
    }
    if (this.x > 458) {
        this.x = 458;
    }
};

/*
 * reset the player to default position
 * when the player crosses the river or gets hit by the bugs (enemies).
 */
Player.prototype.resetPlayer = function () {
    this.x = 202.5;
    this.y = 383;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var player = new Player(0, 0, 50);
var scoreDiv = document.createElement('div');
resetGame(); // reset the game to default
var canvasDiv = document.getElementsByTagName('canvas')[0];
document.body.insertBefore(scoreDiv, canvasDiv);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
        // changes to the input from keyboard
        // add W- up, S- down, A- left, D- right.
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// custom
// increase enemies by score
var score = 0;

/*
 * resets the game in case of collision
 */
function resetGame() {
    player.resetPlayer();
    score = 0;
    updateScore();
    allEnemies = [];
    allEnemies.push(
        new Enemy(0, (Math.random() * 150) + 50, Math.random() * 100 + 40),
        new Enemy(0, (Math.random() * 150) + 70, Math.random() * 100 + 60)
    );
}

/*
 * game over successfully (reached water)
 */
function gameOver() {
    player.resetPlayer();
    score += 1;
    updateScore();
    if (score % 2 == 0 && allEnemies.length < 4) {
        allEnemies.push(new Enemy(0, (Math.random() * 160) + 50, (Math.random() * 90) + 70));
    }
}

/*
 * updates the on screen score display
 */
function updateScore() {
    scoreDiv.innerHTML = 'Score: ' + (score * 10);
}
