import Phaser from 'phaser';
import Button from "./Button";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super("mainScene");
    }

    create() {
        const bg = this.add.graphics();
        bg.fillStyle(0x00ff00);
        bg.fillRect(0, 0, 1000, 1000);
        bg.setScrollFactor(0);

        const startButton = new Button(0, 0, 'Start Game', this,
            () => this.scene.start("playGame"),
        );
    }
}