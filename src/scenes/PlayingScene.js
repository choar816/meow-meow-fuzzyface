import Phaser from 'phaser';
import ExpBar from "../ui/ExpBar";
import Player, {Direction} from "../characters/Player";
import Config from "../Config";
import Enemy from "../characters/Enemy";
import Button from "../ui/Button";
import global_pause from "../utils/pause";
import level_pause from "../utils/levelup";
import {getRandomPosition} from "../utils/math";

export default class PlayingScene extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    create() {
        // pause
        this.createVeil();
        this.createPauseScreen();
        this.createLevelScreen();

        // sound
        this.sound.pauseOnBlur = false;
        this.m_beamSound = this.sound.add("audio_beam");
        this.m_explosionSound = this.sound.add("audio_explosion");
        this.m_pickupSound = this.sound.add("audio_pickup");
        this.m_hurtSound = this.sound.add("audio_hurt");
        this.m_gameoverSound = this.sound.add("audio_gameover");
        this.m_pauseInSound = this.sound.add("pause_in");
        this.m_pauseOutSound = this.sound.add("pause_out");
        this.m_hitEnemySound = this.sound.add("hit_enemy");

        this.m_music = this.sound.add("music");
        const musicConfig = {
            mute: true,
            // mute: false,
            volume: 0.7,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        };
        this.m_music.play(musicConfig);

        // background
        this.m_background = this.add.tileSprite(0, 0, Config.width, Config.height, "background");
        this.m_background.setOrigin(0, 0);

        // score
        const graphics = this.add.graphics();
        graphics.fillStyle(0x28288C);
        graphics.fillRect(0, 0, Config.width, 30);
        graphics.setDepth(90);
        graphics.setScrollFactor(0);
        this.m_score = 0;
        this.m_scoreLabel = this.add.bitmapText(5, 1, "pixelFont", `ENEMY KILLED ${this.m_score.toString().padStart(6, '0')}`, 40);
        this.m_scoreLabel.setScrollFactor(0);
        this.m_scoreLabel.setDepth(100);

        this.m_expBar = new ExpBar(this, 50);

        // level
        this.m_level = 1;
        this.m_levelLabel = this.add.bitmapText(650, 1, "pixelFont", `LEVEL ${this.m_level.toString().padStart(3, '0')}`, 40);
        this.m_levelLabel.setScrollFactor(0);
        this.m_levelLabel.setDepth(100);

        // enemies
        this.m_enemies = this.physics.add.group();
        this.m_enemies.add(new Enemy(this, Config.width / 2 - 200, Config.height / 2 - 200, "bat", "bat_anim", 10));

        // projectiles
        this.m_projectiles = this.add.group();

        // powerUp
        this.m_powerUps = this.physics.add.group();

        let maxObjects = 4;
        for (let i = 0; i < maxObjects; i++) {
            const powerUp = this.physics.add.sprite(16, 16, "power-up");
            powerUp.scale = 1.5;
            this.m_powerUps.add(powerUp);
            powerUp.setRandomPosition(0, 0, Config.width, Config.height);

            if (Math.random() > 0.5) {
                powerUp.play("red");
            } else {
                powerUp.play("gray");
            }
            // powerUp.setCollideWorldBounds(true);
        }

        // player
        this.m_player = new Player(this);
        this.cameras.main.startFollow(this.m_player);

        // keys
        // this.m_spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.m_cursorKeys = this.input.keyboard.createCursorKeys();
        this.m_wasdKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });

        // collisions
        // collider : 충돌 -> 바운스
        // overlap : 접촉 -> 바운스 X
        this.physics.add.overlap(this.m_player, this.m_powerUps, this.pickPowerUp, null, this);
        this.physics.add.overlap(this.m_player, this.m_enemies, () => this.m_player.hitByEnemy(10), null, this);
        this.physics.add.overlap(this.m_projectiles, this.m_enemies, (projectile, enemy) => {
            enemy.hit(projectile, 10);
        }, null, this);
        this.physics.add.overlap(this.m_projectiles, this.m_enemies, null, null, this);

        // event handler
        // this.input.on('');
        this.input.keyboard.on('keydown-ESC', () => {
            global_pause("playGame");
        }, this);
        this.input.keyboard.on('keydown-L', () => {
            level_pause("playGame");
        }, this);

        // Timers
        this.addEnemy("bat", "bat_anim", 10);
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                // TODO: powerup 클래스 분리
                const r = Math.sqrt(Config.width*Config.width + Config.height*Config.height); // 좀 멀리 생기게 했음
                const [x, y] = getRandomPosition(this.m_player.x, this.m_player.y, r);
                const powerUp = this.physics.add.sprite(16, 16, "power-up");
                powerUp.scale = 1.5;
                this.m_powerUps.add(powerUp);
                powerUp.setPosition(x, y);

                if (Math.random() > 0.5) {
                    powerUp.play("red");
                } else {
                    powerUp.play("gray");
                }
            },
            loop: true,
        });

        /// TEMP AREA
        this.m_gfx = this.add.graphics();
    }
    //////////////////////////// END OF create() ////////////////////////////

    update() {
        this.movePlayerManager();

        for (let i = 0; i < this.m_projectiles.getChildren().length; ++i) {
            const beam = this.m_projectiles.getChildren()[i];
            beam.update();
        }

        this.m_background.setX(this.m_player.x - 400);
        this.m_background.setY(this.m_player.y - 300);

        this.m_background.tilePositionX = this.m_player.x - 400;
        this.m_background.tilePositionY = this.m_player.y - 300;

        /// TEMP - closest
        const closest = this.physics.closest(this.m_player, this.m_enemies.getChildren());
        const furthest = this.physics.furthest(this.m_player, this.m_enemies.getChildren());
        this.m_closest = closest;

        this.m_gfx.clear()
            .lineStyle(2, 0xff3300)
            .lineBetween(closest.x, closest.y, this.m_player.x, this.m_player.y)
            .lineStyle(2, 0x0099ff)
            .lineBetween(furthest.x, furthest.y, this.m_player.x, this.m_player.y);
    }


    //////////////////////// FUNCTIONS ////////////////////////

    pickPowerUp(player, powerUp) {
        /*
        disableBody
        parameter 1 : make it inactive
        parameter 2 : hide it from the display list
        */
        powerUp.disableBody(true, true);
        powerUp.destroy();
        // player.gainPower(10);
        this.m_pickupSound.play();
        this.m_expBar.increase(10);
        if (this.m_expBar.m_currentExp >= this.m_expBar.m_maxExp) {
            level_pause(this);
        }
    }

    afterLevelUp() {
        this.m_level += 1;
        this.m_levelLabel.text = `LEVEL ${this.m_level.toString().padStart(3, '0')}`;
        this.m_expBar.m_maxExp += 10;
        this.m_expBar.reset();

        // TODO : 노가다 -> brilliant way
        // 지금 방식 = 레벨업 할 때마다 enemy 종류 추가 (없어지진 않음 ㅋ)
        if (this.m_level == 2) {
            this.addEnemy("dog", "dog_anim", 20);
        } else if (this.m_level == 3) {
            this.addEnemy("eyeball", "eyeball_anim", 30);
        }
    }

    addEnemy(enemyTexture, enemyAnim, enemyHp) {
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                const r = Math.sqrt(Config.width * Config.width + Config.height * Config.height) / 2;
                let [x, y] = getRandomPosition(this.m_player.x, this.m_player.y, r);
                this.m_enemies.add(new Enemy(this, x, y, enemyTexture, enemyAnim, enemyHp));
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

    createVeil() {
        // Transparent dark veil
        this.m_veil = this.add.graphics({ x: 0, y: 0 });
        this.m_veil.fillStyle(0x000000, 0.3);
        this.m_veil.fillRect(0, 0, Config.width, Config.height);
        this.m_veil.setDepth(110);
        this.m_veil.setScrollFactor(0);
    }

    createLevelScreen() {
        // Pause text (level)
        const texts = ["You're on the Next Level", "", "Press 1 : Magic Wand", "Press 2 : Knife", "Press 3 : Hollow Heart"];
        this.m_textLevel = this.add.text(Config.width / 2, Config.height / 2, texts, { fontSize: 40 }).setOrigin(0.5);
        this.m_textLevel.setDepth(120);
        this.m_textLevel.setScrollFactor(0);

        // Hide at start
        this.toggleLevelScreen(false);
    }

    toggleLevelScreen(isVisible) {
        this.m_veil.setVisible(isVisible);
        this.m_textLevel.setVisible(isVisible);
    }

    createPauseScreen() {
        // Pause text
        this.m_textPause = this.add.text(Config.width / 2, Config.height / 2, 'Pause', { fontSize: 40 }).setOrigin(0.5);
        this.m_textPause.setDepth(120);
        this.m_textPause.setScrollFactor(0);

        // Hide at start
        this.togglePauseScreen(false);
    }

    togglePauseScreen(isVisible) {
        this.m_veil.setVisible(isVisible);
        this.m_textPause.setVisible(isVisible);
    }
}