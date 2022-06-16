import Phaser from "phaser";
import Config from "../Config";
import TopBar from "../ui/TopBar";
import ExpBar from "../ui/ExpBar";
import Player, { Direction } from "../characters/Player";
import Mob from "../characters/Mob";
import global_pause from "../utils/pause";
import level_pause from "../utils/levelup";
import { getTimeString } from "../utils/time";
import { getRandomPosition } from "../utils/math";

export default class PlayingScene extends Phaser.Scene {
  constructor() {
    super("playGame");
  }

  create() {
    // pause
    // 일시정지 또는 레벨업 했을 시 보여줄 화면을 만들어놓는 부분
    this.createVeil();
    this.createPauseScreen();
    this.createLevelScreen();

    // sound
    // 사용할 sound들을 추가해놓는 부분
    this.sound.pauseOnBlur = false;
    this.m_beamSound = this.sound.add("audio_beam");
    this.m_explosionSound = this.sound.add("audio_explosion");
    this.m_pickupSound = this.sound.add("audio_pickup");
    this.m_hurtSound = this.sound.add("audio_hurt");
    this.m_gameoverSound = this.sound.add("audio_gameover");
    this.m_pauseInSound = this.sound.add("pause_in");
    this.m_pauseOutSound = this.sound.add("pause_out");
    this.m_hitMobSound = this.sound.add("hit_mob");

    this.m_music = this.sound.add("music");
    const musicConfig = {
      mute: true,
      // mute: false,
      volume: 0.7,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0,
    };
    this.m_music.play(musicConfig);

    // background
    this.m_background = this.add.tileSprite(
      0,
      0,
      Config.width,
      Config.height,
      "background"
    );
    this.m_background.setOrigin(0, 0);

    // topBar, expBar
    this.m_topBar = new TopBar(this);
    this.m_expBar = new ExpBar(this, 50);

    // mobs
    this.m_mobs = this.physics.add.group();
    // 맨 처음 mob 하나 추가 (안 추가하면 closest mob 찾는 부분에서 에러 발생)
    this.m_mobs.add(
      new Mob(
        this,
        Config.width / 2 - 200,
        Config.height / 2 - 200,
        "bat",
        "bat_anim",
        10
      )
    );

    // projectiles
    this.m_projectiles = this.add.group();

    // exp up item
    this.m_expUps = this.physics.add.group();

    // player
    this.m_player = new Player(this);
    this.cameras.main.startFollow(this.m_player);

    // keys
    this.m_cursorKeys = this.input.keyboard.createCursorKeys();
    this.m_wasdKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    // collisions
    // collider : 충돌 -> 바운스 O
    // overlap : 접촉 -> 바운스 X

    /**
     * overlap : Creates a new Arcade Physics Collider Overlap object.
     * @param object1 The first object to check for overlap.
     * @param object2 The second object to check for overlap.
     * @param collideCallback The callback to invoke when the two objects collide.
     * @param processCallback The callback to invoke when the two objects collide. Must return a boolean.
     * @param callbackContext The scope in which to call the callbacks.
     */
    this.physics.add.overlap(
      this.m_player,
      this.m_expUps,
      this.pickExpUp,
      null,
      this
    );
    this.physics.add.overlap(
      this.m_player,
      this.m_mobs,
      () => this.m_player.hitByMob(10),
      null,
      this
    );
    this.physics.add.overlap(
      this.m_projectiles,
      this.m_mobs,
      (projectile, mob) => {
        mob.hit(projectile, 10);
      },
      null,
      this
    );
    this.physics.add.overlap(this.m_projectiles, this.m_mobs, null, null, this);

    // event handler
    // ESC 키를 눌러 일시정지 할 수 있습니다.
    this.input.keyboard.on(
      "keydown-ESC",
      () => {
        global_pause("playGame");
      },
      this
    );

    // runtime
    this.m_secondElapsed = 0;
    this.m_timeText = this.add
      .text(Config.width / 2, 100, "00:00:00", { fontSize: 30 })
      .setOrigin(0.5)
      .setDepth(105)
      .setScrollFactor(0);
    this.time.addEvent({
      callback: () => {
        this.m_secondElapsed += 1;
        this.m_timeText.setText(getTimeString(this.m_secondElapsed));
      },
      delay: 1000,
      loop: true,
    });

    // 처음에 나타날 mob을 추가해줍니다.
    this.addMob("bat", "bat_anim", 10, 0.9);
  }
  //////////////////////////// END OF create() ////////////////////////////

  update() {
    this.movePlayerManager();

    // 무한 배경 구현
    this.m_background.setX(this.m_player.x - 400);
    this.m_background.setY(this.m_player.y - 300);
    this.m_background.tilePositionX = this.m_player.x - 400;
    this.m_background.tilePositionY = this.m_player.y - 300;

    /// player로부터 가장 가까운 mob으ㄹ 구합니다.
    const closest = this.physics.closest(
      this.m_player,
      this.m_mobs.getChildren()
    );
    this.m_closest = closest;
  }

  //////////////////////// FUNCTIONS ////////////////////////

  pickExpUp(player, expUp) {
    /*
    disableBody
    param 1 : 오브젝트를 비활성화합니다.
    param 2 : 오브젝트를 화면에 보이지 않게 합니다.
    */
    expUp.disableBody(true, true);
    expUp.destroy();

    this.m_pickupSound.play();
    this.m_expBar.increase(expUp.m_exp);
    if (this.m_expBar.m_currentExp >= this.m_expBar.m_maxExp) {
      level_pause(this);
    }
  }

  afterLevelUp() {
    this.m_topBar.gainLevel();

    // TODO : 노가다 -> brilliant way
    // 지금 방식 = 레벨업 할 때마다 mob 종류 추가 (없어지진 않음 ㅋ)
    if (this.m_topBar.m_level == 2) {
      this.addMob("dog", "dog_anim", 20, 0.6);
    } else if (this.m_topBar.m_level == 3) {
      this.addMob("eyeball", "eyeball_anim", 30, 0.3);
    }
  }

  // mob이 1초마다 생성되도록 event를 생성해줍니다.
  addMob(mobTexture, mobAnim, mobHp, mobDropRate) {
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        // 화면 바깥에서 나타나도록 해줍니다.
        const r =
          Math.sqrt(
            Config.width * Config.width + Config.height * Config.height
          ) / 2;
        let [x, y] = getRandomPosition(this.m_player.x, this.m_player.y, r);
        this.m_mobs.add(
          new Mob(this, x, y, mobTexture, mobAnim, mobHp, mobDropRate)
        );
      },
      loop: true,
    });
  }

  movePlayerManager() {
    if (this.m_cursorKeys.left.isDown || this.m_wasdKeys.left.isDown) {
      this.m_player.move(Direction.Left);
    } else if (this.m_cursorKeys.right.isDown || this.m_wasdKeys.right.isDown) {
      this.m_player.move(Direction.Right);
    }

    if (this.m_cursorKeys.up.isDown || this.m_wasdKeys.up.isDown) {
      this.m_player.move(Direction.Up);
    } else if (this.m_cursorKeys.down.isDown || this.m_wasdKeys.down.isDown) {
      this.m_player.move(Direction.Down);
    }
  }

  // 반투명 검은 veil 화면을 만들어줍니다.
  createVeil() {
    this.m_veil = this.add.graphics({ x: 0, y: 0 });
    this.m_veil.fillStyle(0x000000, 0.3);
    this.m_veil.fillRect(0, 0, Config.width, Config.height);
    this.m_veil.setDepth(110);
    this.m_veil.setScrollFactor(0);
  }

  // level up 했을 때의 화면을 만들어줍니다.
  createLevelScreen() {
    const texts = [
      "You're on the Next Level!",
      "",
      "Press Enter to Keep Going",
    ];
    this.m_textLevel = this.add
      .text(Config.width / 2, Config.height / 2, texts, { fontSize: 40 })
      .setOrigin(0.5)
      .setDepth(120)
      .setScrollFactor(0);

    // 처음에는 보이지 않게 감춰줍니다.
    this.toggleLevelScreen(false);
  }

  toggleLevelScreen(isVisible) {
    this.m_veil.setVisible(isVisible);
    this.m_textLevel.setVisible(isVisible);
  }

  // 일시정지 했을 때의 화면을 만들어줍니다.
  createPauseScreen() {
    this.m_textPause = this.add
      .text(Config.width / 2, Config.height / 2, "Pause", { fontSize: 50 })
      .setOrigin(0.5)
      .setDepth(120)
      .setScrollFactor(0);

    // 처음에는 보이지 않게 감춰줍니다.
    this.togglePauseScreen(false);
  }

  togglePauseScreen(isVisible) {
    this.m_veil.setVisible(isVisible);
    this.m_textPause.setVisible(isVisible);
  }
}
