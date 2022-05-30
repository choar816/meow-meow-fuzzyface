import Explosion from "../effects/Explosion";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, animKey, initHp) {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.scale = 2;
        this.m_speed = 50;
        this.m_hp = initHp;

        this.on("overlapstart", function(projectile) {
            this.hit(projectile, 10);
        }.bind(this));

        if (animKey) {
            this.play(animKey);
        }

        this.m_events = [];
        this.m_events.push(this.scene.time.addEvent({
            delay: 100,
            callback: () => {
                scene.physics.moveToObject(this, scene.m_player, this.m_speed);
            },
            loop: true,
        }));
    }

    hit(projectile, damage) {
        this.m_hp -= damage;

        // TODO: 관통 무기
        projectile.destroy();
        this.scene.m_hitEnemySound.play();

        if (this.m_hp <= 0) {
            const explosion = new Explosion(this.scene, this.x, this.y);

            // TODO: 이런건 scene에서?
            this.scene.m_score += 1;
            this.scene.m_scoreLabel.text = `ENEMY KILLED ${this.scene.m_score.toString().padStart(6, '0')}`;
            this.scene.m_explosionSound.play();

            this.scene.time.removeEvent(this.m_events);
            this.destroy();
        }
    }
}
