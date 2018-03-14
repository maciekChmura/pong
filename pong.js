class Pong {
	constructor(canvas) {
		this._canvas = canvas;
		this._context = canvas.getContext('2d');

		this.ball = new Ball;

		this.players = [
			new Player,
			new Player
		];

		this.players[0].pos.x = 45;
		this.players[1].pos.x = this._canvas.width - 45;
		this.players.forEach(player => {
			player.pos.y = this._canvas.height / 2;
		});

		let lastTime;
		const callback = (milliSec) => {
			if (lastTime) {
				this.update((milliSec - lastTime) / 800);
			}
			lastTime = milliSec;
			requestAnimationFrame(callback);
		};
		callback();

		this.reset();
	}

	collide(player, ball) {
		if (player.left < ball.right && player.right > ball.left &&
			player.top < ball.bottom && player.bottom > ball.top) {
			ball.vel.len *= 1.05;
			ball.vel.x = -ball.vel.x;
		}
	}

	draw() {
		this._context.fillStyle = '#000';
		this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);

		this.drawRect(this.ball);
		this.players.forEach(player => this.drawRect(player));
	}

	drawRect(rect) {
		this._context.fillStyle = '#fff';
		this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
	}

	reset() {
		this.ball.pos.x = this._canvas.width / 2;
		this.ball.pos.y = this._canvas.height / 2;

		this.ball.vel.x = 0;
		this.ball.vel.y = 0;
	}

	start() {
		if (this.ball.vel.x === 0 && this.ball.vel.y === 0) {
			// randomize left/right direction
			this.ball.vel.x = 250 * (Math.random() > 0.5 ? 1 : -1);
			// randomize up/down direction
			this.ball.vel.y = 250 * (Math.random() * 2 - 1);

			this.ball.vel.len = 200;
		}
	}

	update(deltaTime) {
		this.ball.pos.x += this.ball.vel.x * deltaTime;
		this.ball.pos.y += this.ball.vel.y * deltaTime;

		if (this.ball.left < 0 || this.ball.right > this._canvas.width) {
			// trick with bitwise operator to get playerId
			const playerId = this.ball.vel.x < 0 | 0;
			// standard way to get playerId with if - else
			// let playerId;
			// if (this.ball.vel.x < 0){
			// 	playerId = 1;
			// } else {
			// 	playerId = 0;
			// }
			this.players[playerId].score++;
			console.log(this.players[1].score);
			this.ball.vel.x = -this.ball.vel.x;
			this.reset();
		}
		if (this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
			this.ball.vel.y = -this.ball.vel.y;
		}

		this.players[1].pos.y = this.ball.pos.y;

		this.players.forEach(player => this.collide(player, this.ball));

		this.draw();
	}
}

class Vec {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	// calculate Hypotenuse of a triangle - vector length
	get len() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	set len(value) {
		const factor = value / this.len;
		this.x *= factor;
		this.y *= factor;
	}
}

class Rect {
	constructor(w, h) {
		this.pos = new Vec;
		this.size = new Vec(w, h)
	}

	get left() {
		return this.pos.x - this.size.x / 2;
	}

	get right() {
		return this.pos.x + this.size.x / 2;
	}

	get top() {
		return this.pos.y - this.size.y / 2;
	}

	get bottom() {
		return this.pos.y + this.size.y / 2;
	}
}

class Ball extends Rect {
	constructor() {
		super(10, 10);
		this.vel = new Vec;
	}
}

class Player extends Rect {
	constructor() {
		super(20, 100);
		this.score = 0;
	}
}

const canvas = document.getElementById('pong');
const pong = new Pong(canvas);

canvas.addEventListener('mousemove', event => {
	pong.players[0].pos.y = event.offsetY;
});

canvas.addEventListener('click', event => {
	pong.start();
});