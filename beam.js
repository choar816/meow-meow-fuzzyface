class Beam extends Phaser.GameObjects.Sprite {
    constructor(scene) {
        let x = scene.player.x;
        let y = scene.player.y - 16;
        super(scene, x, y, "beam");
        scene.add.existing(this);
        this.play("beam_anim");
        scene.physics.world.enableBody(this);
        this.body.velocity.y = -250;
        scene.projectiles.add(this);
    }

    update() {
        if (this.y < 16) {
            this.destroy();
        }
    }
}