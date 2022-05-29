import Explosion from "../effects/Explosion";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, initHp) {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.m_hp = initHp;

        this.on("overlapstart", function(projectile) {
            console.log("overlapstart!!")
            this.hit(projectile, 10);
        }.bind(this));
    }

    hit(projectile, damage) {
        console.log("hit!")
        this.m_hp -= damage;

        // TODO: 관통 무기
        projectile.destroy();
        // this.resetShipPos(enemy);

        if (this.m_hp <= 0) {
            const explosion = new Explosion(this.scene, this.x, this.y);

            // TODO: 이런건 scene에서?
            this.scene.m_score += 15;
            this.scene.m_scoreLabel.text = "SCORE " + this.scene.m_score.toString().padStart(6, '0');
            this.scene.m_explosionSound.play();

            this.destroy();
        }
    }
}
