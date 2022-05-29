import Phaser from 'phaser';
import Config from "../Config";
import Button from "../ui/Button";

export default class GameoverScene extends Phaser.Scene {
    constructor() {
        super("gameoverScene");
    }

    create() {
        const bg = this.add.graphics();
        bg.fillStyle(0x5c6bc0);
        bg.fillRect(0, 0, Config.width, Config.height);
        bg.setScrollFactor(0);

        this.add.text(Config.width / 2, Config.height / 2 - 50, 'Game Over', { fontSize: 40, align: 'center' }).setOrigin(0.5);

        const startButton = new Button(Config.width / 2, Config.height / 2 + 50, 'Go to Main', this,
            () => this.scene.start("mainScene"),
        );
    }
}