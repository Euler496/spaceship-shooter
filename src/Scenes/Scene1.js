import Phaser from "phaser";

class Scene1 extends Phaser.Scene {
	constructor() {
		super("bootGame");
	}
	
    preload() {
    	this.load.image("desertBackground", "./src/assets/images/desert-backgorund.png");

	    this.load.spritesheet("player", "./src/assets/spritesheets/player.png", {
	    	frameWidth: 16,
	    	frameHeight: 24,
	    });
	    this.load.spritesheet("beam", "./src/assets/spritesheets/beam.png", {
	    	frameWidth: 16,
	    	frameHeight: 16,
	    });
	    this.load.spritesheet("small", "./src/assets/spritesheets/enemy-small.png", {
	    	frameWidth: 16,
	    	frameHeight: 16,
	    });
	    this.load.spritesheet("medium", "./src/assets/spritesheets/enemy-medium.png", {
	    	frameWidth: 32,
	    	frameHeight: 16,
	    });
	    this.load.spritesheet("big", "./src/assets/spritesheets/enemy-big.png", {
	    	frameWidth: 32,
	    	frameHeight: 32,
	    });
	    this.load.spritesheet("explosion", "./src/assets/spritesheets/explosion.png", {
	    	frameWidth: 16,
	    	frameHeight: 16,
	    });
	    this.load.spritesheet("power-up", "./src/assets/spritesheets/power-up.png", {
	    	frameWidth: 16, 
	    	frameHeight: 16,
	    });

	    this.load.bitmapFont("pixelFont", "./src/assets/font/font.png", "./src/assets/font/font.xml");

    	this.load.audio("audio_beam", ["./src/assets/sounds/beam.ogg", "./src/assets/sounds/beam.mp3"]);
	    this.load.audio("audio_explosion", ["./src/assets/sounds/explosion.ogg", "./src/assets/sounds/explosion.mp3"]);
	    this.load.audio("audio_pickup", ["./src/assets/sounds/pickup.ogg", "./src/assets/sounds/pickup.mp3"]);
	    this.load.audio("music", ["./src/assets/sounds/sci-fi_platformer12.ogg", "./src/assets/sounds/sci-fi_platforme.mp3"]);

	}

    create() {
        this.add.text(20, 20, "Loading game...");
        this.scene.start("playGame");;

        this.anims.create({
        	key: "thrust",
        	frames: this.anims.generateFrameNumbers("player"),
        	frameRate: 20,
        	repeat: -1,
        });
        this.anims.create({
        	key: "beam_anim",
        	frames: this.anims.generateFrameNumbers("beam"),
        	frameRate: 20,
        	repeat: -1,
        });
        this.anims.create({
			key: "small_anim",
			frames: this.anims.generateFrameNumbers("small"),
			frameRate: 20,
			repeat: -1,
		});
		this.anims.create({
			key: "medium_anim",
			frames: this.anims.generateFrameNumbers("medium"),
			frameRate: 20,
			repeat: -1,
		});
		this.anims.create({
			key: "big_anim",
			frames: this.anims.generateFrameNumbers("big"),
			frameRate: 20,
			repeat: -1,
		});
		this.anims.create({
			key: "explode",
			frames: this.anims.generateFrameNumbers("explosion"),
			frameRate: 20,
			repeat: 0,
			hideOnComplete: true,
		});
		this.anims.create({
			key: "red",
			frames: this.anims.generateFrameNumbers("power-up", {
				start: 0,
				end: 1,
			}),
			frameRate: 20,
			repeat: -1,
		});
		this.anims.create({
			key: "gray",
			frames: this.anims.generateFrameNumbers("power-up", {
				start: 2,
				end: 3,
			}),
			frameRate: 20,
			repeat: -1,
		});
    }
}

export default Scene1;