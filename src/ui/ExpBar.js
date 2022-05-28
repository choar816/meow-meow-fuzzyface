import Config from "../Config";

export default class ExpBar extends Phaser.GameObjects.Graphics {
    constructor(scene) {
        super(scene);

        this.m_value = 33;
        this.border = 4;
        this.m_p = (Config.width - 2*this.border) / 100;
        this.draw();
        this.setDepth(100);
        this.setScrollFactor(0);

        scene.add.existing(this);
    }

    draw() {
        this.clear();

        // borders
        this.fillStyle(0x000000);
        this.fillRect(0, 30, Config.width, 30);

        // Experience BG
        this.fillStyle(0xFFFFFF);
        this.fillRect(this.border, 30 + this.border, Config.width - 2*this.border, 30 - 2*this.border);

        // Experience value
        this.fillStyle(0xff0000);
        let d = Math.floor(this.m_p * this.m_value);
        this.fillRect(this.border, 30 + this.border, d, 30 - 2*this.border);
    }
}