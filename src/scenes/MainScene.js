import Phaser from 'phaser';
import Config from "../Config";
import Button from "../ui/Button";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super("mainScene");
    }

    create() {
        const bg = this.add.graphics();
        bg.fillStyle(0xbbdefb);
        bg.fillRect(0, 0, Config.width, Config.height);
        bg.setScrollFactor(0);

        const title = this.add.text(Config.width / 2, 200, 'Meow Meow Fuzzyface', { fontSize: 40, align: 'center' }).setOrigin(0.5);


        const startButton = new Button(Config.width / 2, Config.height / 2 + 50, 'Start Game', this,
            () => this.scene.start("playGame"),
        );
    }
}