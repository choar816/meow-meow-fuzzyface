import Phaser from "phaser";
import { clamp } from "../utils/math";

export default class HpBar extends Phaser.GameObjects.Graphics {
  static WIDTH = 80;
  static HEIGHT = 12;
  static BORDER = 2;

  constructor(scene, player, maxHp) {
    super(scene);

    this.m_x = player.x - HpBar.WIDTH / 2;
    this.m_y = player.y + 30;

    this.m_maxHp = maxHp;
    this.m_currentHp = maxHp;
    this.draw();
    this.setScrollFactor(0);

    scene.add.existing(this);
  }

  increase(amount) {
    this.m_currentHp = clamp(this.m_currentHp + amount, 0, this.m_maxHp);
    this.draw();
  }

  decrease(amount) {
    this.m_currentHp = clamp(this.m_currentHp - amount, 0, this.m_maxHp);
    this.draw();
  }

  draw() {
    this.clear();

    // BG
    this.fillStyle(0x000000);
    this.fillRect(this.m_x, this.m_y, HpBar.WIDTH, HpBar.HEIGHT);

    // Health
    this.fillStyle(0xffffff);
    this.fillRect(
      this.m_x + HpBar.BORDER,
      this.m_y + HpBar.BORDER,
      HpBar.WIDTH - 2 * HpBar.BORDER,
      HpBar.HEIGHT - 2 * HpBar.BORDER
    );

    if (this.m_currentHp < 30) {
      this.fillStyle(0xff0000);
    } else {
      this.fillStyle(0x00ff00);
    }

    let d = Math.floor(
      ((HpBar.WIDTH - 2 * HpBar.BORDER) / this.m_maxHp) * this.m_currentHp
    );

    this.fillRect(
      this.m_x + HpBar.BORDER,
      this.m_y + HpBar.BORDER,
      d,
      HpBar.HEIGHT - 2 * HpBar.BORDER
    );
  }
}
