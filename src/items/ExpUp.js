import Phaser from "phaser";

export default class ExpUp extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, enemy) {
    const x = enemy.x;
    const y = enemy.y;

    // TODO : enemy 종류에 따라 다른 expup 아이템
    this.getItemType(enemy.texture.key);
    super(scene, x, y, "exp-up"); // exp-up -> this.m_texture
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

  getItemType(enemyKey) {
    // m_exp : 경험치 상승량
    // m_texture : 아이템 이미지 texture (추가예정)
    switch (enemyKey) {
      case 'bat':
        this.m_exp = 10;
        break;
      case 'dog':
        this.m_exp = 20;
        break;
      case 'eyeball':
        this.m_exp = 30;
        break;
      default:
        this.m_exp = 10;
    }
  }
}
