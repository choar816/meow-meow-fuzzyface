import HpBar from "../ui/HpBar";
import Beam from "../effects/Beam";
import Explosion from "../effects/Explosion";

export const Direction = Object.freeze({
    Up: 'Up',
    Down: 'Down',
    Left: 'Left',
    Right: 'Right'
});

export default class Player extends Phaser.Physics.Arcade.Image {
    static PLAYER_SPEED = 5;

    constructor(scene) {
        let x = 250;
        let y = 250;
        super(scene, x, y, "cat");
        this.scale = 0.2;
        this.alpha = 1;
        this.hp = new HpBar(scene, this);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // physics
        this.setCollideWorldBounds(true);

        this.m_intervals = new Set();
        this.m_intervals.add(setInterval(this.shootBeam.bind(this), 1000));
    }

    update() {

    }

    hitByEnemy(damage) {
        // this.resetShipPos(enemy);

        if (this.alpha < 1)
            return;

        this.scene.m_hurtSound.play();
        console.log(`HIT! damage: ${damage}`);
        this.hp.decrease(damage);
        if (this.hp.m_value <= 0) {
            // 게임오버!
            this.scene.m_gameoverSound.play();
            this.scene.scene.start("mainScene");  // 이거 맞냐?
            this.m_intervals.forEach(id => clearInterval(id));
        }

        const explosion = new Explosion(this.scene, this.x, this.y);
        this.disableBody(true, false);
        this.alpha = 0.5;
        // 공격받은 후 1초 쿨타임
        this.scene.time.addEvent({
            delay: 1000,
            callback: this.resetPlayer,
            callbackScope: this,
            loop: false
        });
    }

    resetPlayer() {
        this.enableBody(true, this.x, this.y, true, true);

        const tween = this.scene.tweens.add({
            targets: this,
            ease: 'Power1',
            duration: 1500,
            repeat: 0,
            onComplete: function() {
                this.alpha = 1;
            },
            callbackScope: this
        });
    }

    move(direction) {
        switch (direction) {
            case Direction.Up:
                this.y -= Player.PLAYER_SPEED;
                break;

            case Direction.Down:
                this.y += Player.PLAYER_SPEED;
                break;

            case Direction.Left:
                this.x -= Player.PLAYER_SPEED;
                this.flipX = true;
                break;

            case Direction.Right:
                this.x += Player.PLAYER_SPEED;
                this.flipX = false;
                break;
        }
    }

    shootBeam() {
        const beam = new Beam(this.scene, this);
    }

    gainPower(amount) {
        this.hp.increase(amount);
    }
}