import Phaser from "phaser";

export default class ExpUp extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, enemy) {
    const x = enemy.x;
    const y = enemy.y;
    super(scene, x, y, "exp-up");
    this.scale = 1.5;

    // 반반 확률로 색깔 결정 (삭제 예정)
    if (Math.random() < 0.5) {
      this.play("red");
    } else {
      this.play("gray");
    }

    scene.add.existing(this);
    scene.physics.world.enableBody(this);
  }
}
