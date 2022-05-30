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

        this.setVelocity();
        this.setAngle();
        setTimeout(() => this.destroy(), duration);
    }

    update() {
        // this.setVelocity();
    }

    setVelocity() {
        const _x = this.scene.m_closest.x - this.x;
        const _y = this.scene.m_closest.y - this.y;
        const _r = Math.sqrt(_x*_x + _y*_y) / 2;
        this.body.velocity.x = _x / _r * 40;
        this.body.velocity.y = _y / _r * 40;
    }

    setAngle() {
        const angleToEnemy = Phaser.Math.Angle.Between(this.x, this.y, this.scene.m_closest.x, this.scene.m_closest.y);
        this.rotation = angleToEnemy + Math.PI / 2;
        this.body.setAngularVelocity(0);
    }
}