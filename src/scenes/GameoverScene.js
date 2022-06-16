import Phaser from "phaser";
import Config from "../Config";
import Button from "../ui/Button";

export default class GameoverScene extends Phaser.Scene {
  constructor() {
    super("gameoverScene");
  }

  init(data) {
    this.m_mobKilled = data.mobKilled;
    this.m_level = data.level;
  }

  create() {
    const bg = this.add.graphics();
    bg.fillStyle(0x5c6bc0);
    bg.fillRect(0, 0, Config.width, Config.height);
    bg.setScrollFactor(0);

    this.add
      .bitmapText(
        Config.width / 2,
        Config.height / 2 - 100,
        "pixelFont",
        "Game Over",
        40
      )
      .setOrigin(0.5);

    this.add
      .bitmapText(
        Config.width / 2,
        Config.height / 2,
        "pixelFont",
        `Mobs Killed : ${this.m_mobKilled}, Level : ${this.m_level}`,
        30
      )
      .setOrigin(0.5);

    new Button(
      Config.width / 2,
      Config.height / 2 + 100,
      "Go to Main",
      this,
      () => this.scene.start("mainScene")
    );
  }
}
