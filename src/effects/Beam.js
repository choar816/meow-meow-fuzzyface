import Phaser from "phaser";

export default class Beam extends Phaser.Physics.Arcade.Sprite {
  static SPEED = 100;
  static DURATION = 1000;

  constructor(scene, player) {
    const x = player.x;
    const y = player.y - 16;
    super(scene, x, y, "beam");
    this.scale = 0.2;
    
    scene.add.existing(this);
    scene.physics.world.enableBody(this);
    
    scene.m_projectiles.add(this);
    scene.m_beamSound.play();

    this.setCircle(30);
    this.setDepth(90);
    this.setVelocity();
    this.setAngle();

    scene.time.addEvent({
      delay: Beam.DURATION,
      callback: () => {
        this.destroy();
      },
      loop: false,
    });
  }

  update() {}

  setVelocity() {
    if (!this.scene.m_closest) {
      this.setVelocityY(-250);
      return;
    }
    const _x = this.scene.m_closest.x - this.x;
    const _y = this.scene.m_closest.y - this.y;
    const _r = Math.sqrt(_x * _x + _y * _y) / 2;
    this.body.velocity.x = (_x / _r) * Beam.SPEED;
    this.body.velocity.y = (_y / _r) * Beam.SPEED;
  }

  setAngle() {
    const angleToEnemy = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      this.scene.m_closest.x,
      this.scene.m_closest.y
    );
    this.rotation = angleToEnemy + Math.PI / 2;
    this.body.setAngularVelocity(0);
  }
}
