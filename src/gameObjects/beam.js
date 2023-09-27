import Phaser from "phaser";

class Beam extends Phaser.GameObjects.Sprite {
	constructor(scene) {
		const x = scene.player.x;
		const y = scene.player.y;
		super(scene, x, y, "beam");
		scene.add.existing(this);

		this.play("beam_anim");
		scene.physics.world.enableBody(this);
		this.body.velocity.y = - 250;

		scene.projectiles.add(this);
	}

	update() {
		if (this.y < 32) {
			this.destroy();
		}
	}
}

export default Beam;