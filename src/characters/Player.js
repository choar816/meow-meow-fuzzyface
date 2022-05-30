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
        super(scene, 400, 300, "cat");
        this.scale = 0.4;
        this.alpha = 1;
        this.m_hpBar = new HpBar(scene, this, 100);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // physics
        this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                this.shootBeam();
            },
            loop: true,
        });
    }

    update() {

    }

    hitByEnemy(damage) {
        if (this.alpha < 1)
            return;

        this.scene.m_hurtSound.play();
        this.m_hpBar.decrease(damage);
        if (this.m_hpBar.m_currentHp <= 0) {
            // 게임오버!
            this.scene.m_gameoverSound.play();
            this.scene.scene.start("gameoverScene", { enemyKilled: this.scene.m_score, level: this.scene.m_level });  // 이거 맞냐?
        }

        new Explosion(this.scene, this.x, this.y);

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
        new Beam(this.scene, this, 3000);
    }

    gainPower(amount) {
        this.m_hpBar.increase(amount);
    }
}