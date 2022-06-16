import Explosion from "../effects/Explosion";
import ExpUp from "../items/ExpUp";

export default class Mob extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, animKey, initHp, dropRate) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.scale = 2;
    this.m_speed = 50;
    this.m_hp = initHp;
    this.m_dropRate = dropRate;

    if (animKey) {
      this.play(animKey);
    }

    this.on("overlapstart", (projectile) => {
      this.hit(projectile, 10);
    });

    // 계속해서(0.1초마다) player 방향으로 움직이도록 해줍니다.
    this.m_events = [];
    this.m_events.push(
      this.scene.time.addEvent({
        delay: 100,
        callback: () => {
          scene.physics.moveToObject(this, scene.m_player, this.m_speed);
        },
        loop: true,
      })
    );

    // Ref: https://github.com/photonstorm/phaser/issues/3378
    scene.events.on("update", (time, delta) => {
      this.update(time, delta);
    });
  }

  update(time, delta) {
    if (!this.body) return;

    // 오른쪽으로 향할 때는 오른쪽을, 왼쪽으로 향할 때는 왼쪽을 바라보도록 해줍니다.
    if (this.body.velocity.x > 0) this.flipX = true;
    else this.flipX = false;
  }

  // mob이 공격에 맞을 경우 실행되는 함수
  hit(projectile, damage) {
    this.m_hp -= damage;

    // TODO: 관통 무기
    projectile.destroy();
    this.scene.m_hitMobSound.play();

    // HP가 0 이하가 되는 경우
    if (this.m_hp <= 0) {
      // 폭발 효과를 발생시킨다.
      new Explosion(this.scene, this.x, this.y);
      this.scene.m_explosionSound.play();

      // dropRate의 확률로 item을 떨어뜨린다.
      if (Math.random() < this.m_dropRate) {
        const expUp = new ExpUp(this.scene, this);
        this.scene.m_expUps.add(expUp);
      }

      // score(mobs killed)에 1을 더해준다.
      this.scene.m_topBar.gainScore();

      // player 쪽으로 움직이게 만들었던 event를 제거한다.
      this.scene.time.removeEvent(this.m_events);
      // mob 객체를 제거한다.
      this.destroy();
    }
  }
}
