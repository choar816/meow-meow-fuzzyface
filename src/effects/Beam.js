import Phaser from 'phaser';

export default class Beam extends Phaser.GameObjects.Sprite {
    constructor(scene, player, duration) {
        let x = player.x;
        let y = player.y - 16;
        super(scene, x, y, "beam");
        scene.add.existing(this);
        scene.physics.world.enableBody(this);
        scene.m_projectiles.add(this);
        scene.m_beamSound.play();
        this.play("beam_anim");
        this.body.velocity.y = -250;

        setTimeout(() => this.destroy(), duration);
    }

    update() {

    }
}