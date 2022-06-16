import Phaser from "phaser";
import Config from "../Config";

export default class TopBar extends Phaser.GameObjects.Graphics {
  constructor(scene) {
    super(scene);

    // score, level 들어가는 배경
    this.fillStyle(0x28288c)
      .fillRect(0, 0, Config.width, 30)
      .setDepth(90)
      .setScrollFactor(0);

    this.m_score = 0;
    this.m_scoreLabel = scene.add
      .bitmapText(
        5,
        1,
        "pixelFont",
        `MOBS KILLED ${this.m_score.toString().padStart(6, "0")}`,
        40
      )
      .setScrollFactor(0)
      .setDepth(100);

    this.m_level = 1;
    this.m_levelLabel = scene.add
      .bitmapText(
        650,
        1,
        "pixelFont",
        `LEVEL ${this.m_level.toString().padStart(3, "0")}`,
        40
      )
      .setScrollFactor(0)
      .setDepth(100);

    scene.add.existing(this);
  }

  gainScore() {
    this.m_score += 1;
    this.m_scoreLabel.text = `MOBS KILLED ${this.m_score
      .toString()
      .padStart(6, "0")}`;
  }

  gainLevel() {
    this.m_level += 1;
    this.m_levelLabel.text = `LEVEL ${this.m_level
      .toString()
      .padStart(3, "0")}`;
    
    // 레벨업 할 때마다 max 경험치가 10씩 증가합니다.
    this.scene.m_expBar.m_maxExp += 10;
    this.scene.m_expBar.reset();
  }
}
