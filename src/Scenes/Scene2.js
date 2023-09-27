import Phaser from "phaser";
import config from "../config";
import Beam from "../gameObjects/beam";
import Explosion from "../gameObjects/explosion"

const gameSettings = {
	playerSpeed: 200,
}

class Scene2 extends Phaser.Scene {
	constructor() {
		super("playGame");
	}

	create() {
		this.background = this.add.tileSprite(0, 0, config.width, config.height, "desertBackground");
		this.background.setOrigin(0, 0);

		const graphics = this.add.graphics();
		graphics.fillStyle(0x000000, 1);
		graphics.beginPath();
		graphics.moveTo(0, 0);
		graphics.lineTo(config.width, 0);
		graphics.lineTo(config.width, 20);
		graphics.lineTo(0, 20);
		graphics.lineTo(0, 0);
		graphics.closePath();
		graphics.fillPath();

		this.score = 0;
        this.scoreLabel = this.add.bitmapText(10, 5, "pixelFont", "SCORE ", 16);

        this.beamSound = this.sound.add("audio_beam");
        this.explosionSound = this.sound.add("audio_explosion");
        this.pickupSound = this.sound.add("audio_pickup");

        this.music = this.sound.add("music");

        const musicConfig = {
        	mute: false,
        	volume: 1,
        	rate: 1,
        	detune: 0,
        	seek: 0,
        	loop: false,
        	delay: 0,
        };
        this.music.play(musicConfig);

		this.cursorKeys = this.input.keyboard.createCursorKeys();
		this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

		this.player = this.physics.add.sprite(config.width / 2 - 8, config.height - 64, "player");
		this.player.play("thrust");
		this.player.setCollideWorldBounds(true);

		this.small = this.add.sprite(config.width / 2 - 50, config.height / 2, "small");
		this.medium = this.add.sprite(config.width / 2, config.height / 2, "medium");
		this.big = this.add.sprite(config.width / 2 + 50, config.height / 2, "big");

		this.small.play("small_anim");
		this.medium.play("medium_anim");
		this.big.play("big_anim");

		this.projectiles = this.add.group();
		this.powerUps = this.physics.add.group();
		this.enemies = this.physics.add.group();

		this.enemies.add(this.small);
		this.enemies.add(this.medium);
		this.enemies.add(this.big);

		this.physics.add.collider(this.projectiles, this.powerUps, function(projectile, powerUp) {
			projectile.destroy();
		});

		this.physics.add.overlap(this.player, this.powerUps, this.pickPowerUp, null, this);
		this.physics.add.overlap(this.player, this.enemies, this.hurtPlayer, null, this);
		this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, null, this);

		const maxObject = 4;
		for (let i = 0; i <= maxObject; i++) {
			const powerUp = this.physics.add.sprite(16, 16, "power-up");
			this.powerUps.add(powerUp);
			powerUp.setRandomPosition(0, 0, config.width, config.height);

			if (Math.random() > 0.5) {
				powerUp.play("red");
			} else {
				powerUp.play("gray");
			}

			powerUp.setVelocity(100, 100);
			powerUp.setCollideWorldBounds(true);
			powerUp.setBounce(1);
		}
	}

	zeroPad(number, size) {
		let stringNumber = String(number);
		while (stringNumber.length < (size || 2)) {
			stringNumber = "0" + stringNumber;
		}
		return stringNumber;
	}

	resetShipPos(ship) {
		ship.y = 0;
		const randomX = Phaser.Math.Between(0, config.width);
		ship.x = randomX;
	}

	moveShip(ship, speed) {
		ship.y += speed;
		if (ship.y > config.height) {
			this.resetShipPos(ship);
		}
	}

	pickPowerUp(player, powerUp) {
		powerUp.disableBody(true, true);
		this.pickupSound.play();
	}

	hitEnemy(projectile, enemy) {
		const explosion = new Explosion(this, enemy.x, enemy.y);

		projectile.destroy();
		this.resetShipPos(enemy);
		this.score += 15;
		let scoreFormated = this.zeroPad(this.score, 6);
		this.scoreLabel.text = "SCORE " + scoreFormated;

		this.explosionSound.play();
	}

	hurtPlayer(player, enemy) {
		this.resetShipPos(enemy);

		if (this.player.alpha < 1) {
			return;
		}

		const explosion = new Explosion(this, player.x, player.y);
		player.disableBody(true, true);

		this.time.addEvent({
			delay: 1000,
			callback: this.resetPlayer,
			callbackScope: this,
			loop: false,
		});
	}

	resetPlayer() {
		const x = config.width / 2 - 8;
		const y = config.height + 64;
		this.player.enableBody(true, x, y, true, true);

		this.player.alpha = 0.5;

		const tween = this.tweens.add({
			targets: this.player,
			y: config.height - 64,
			ease: "Power1",
			duration: 1500,
			repeat: 0,
			onComplete: function() {
				this.player.alpha = 1;
			},
			callbackScope: this,
		});
	}

	update() {
		this.background.tilePositionY -= 0.5;

		this.movePlayerManager();

		if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
			if (this.player.active) {
				this.shootBeam();
			}
		}

		for (let i = 0; i < this.projectiles.getChildren().length; i++) {
			const beam = this.projectiles.getChildren()[i];
			beam.update();
		}

		this.moveShip(this.small, 1);
		this.moveShip(this.medium, 2);
		this.moveShip(this.big, 3);
	}

	movePlayerManager() {
		if(this.cursorKeys.left.isDown) {
			this.player.setVelocityX(- gameSettings.playerSpeed);
		} else if (this.cursorKeys.right.isDown) {
			this.player.setVelocityX(gameSettings.playerSpeed);
		} else {
			this.player.setVelocityX(0);
		}

		if(this.cursorKeys.up.isDown) {
			this.player.setVelocityY(- gameSettings.playerSpeed);
		} else if (this.cursorKeys.down.isDown) {
			this.player.setVelocityY(gameSettings.playerSpeed);
		} else {
			this.player.setVelocityY(0);
		}
	}

	shootBeam() {
		const beam = new Beam(this);
		this.beamSound.play();
	}
}

export default Scene2;