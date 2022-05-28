export default class HpBar extends Phaser.GameObjects.Graphics {
    constructor(scene, player) {
        super(scene);

        this.m_x = player.x + 105;
        this.m_y = player.y + 70;
        this.m_value = 100;
        this.m_p = 76 / 100;
        this.draw();
        this.setScrollFactor(0);

        scene.add.existing(this);
    }

    increase(amount) {
        this.m_value += amount;
        if (this.m_value > 100) {
            this.m_value = 100;
        }
        this.draw();
    }

    decrease(amount) {
        this.m_value -= amount;
        if (this.m_value < 0) {
            this.m_value = 0;
        }
        this.draw();

        return (this.m_value === 0);
    }

    draw() {
        this.clear();

        // BG
        this.fillStyle(0x000000);
        this.fillRect(this.m_x, this.m_y, 80, 12);

        // Health
        this.fillStyle(0xffffff);
        this.fillRect(this.m_x + 2, this.m_y + 2, 76, 8);

        if (this.m_value < 30) {
            this.fillStyle(0xff0000);
        } else {
            this.fillStyle(0x00ff00);
        }

        let d = Math.floor(this.m_p * this.m_value);

        this.fillRect(this.m_x + 2, this.m_y + 2, d, 8);
    }
}