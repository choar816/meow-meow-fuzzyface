import Phaser from 'phaser';
import ExperienceBar from "./experienceBar";
import Player, {Direction} from "./player";
import Explosion from "./explosion";
import Config from "./Config";

export default class PlayingScene extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    create() {
        // sound
        this.sound.pauseOnBlur = false;
        this.m_beamSound = this.sound.add("audio_beam");
        this.m_explosionSound = this.sound.add("audio_explosion");
        this.m_pickupSound = this.sound.add("audio_pickup");
        this.m_hurtSound = this.sound.add("audio_hurt");
        this.m_gameoverSound = this.sound.add("audio_gameover");

        this.m_music = this.sound.add("music");
        const musicConfig = {
            mute: true, // edit later
            volume: 0.7,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        };
        this.m_music.play(musicConfig);

        // camera
        const m_camera = this.cameras.main;
        this.cameras.addExisting(m_camera);
        this.cameras.main.setZoom(1);

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
        this.m_scoreLabel = this.add.bitmapText(0, 0, "pixelFont", ` SCORE ${this.m_score.toString().padStart(6, '0')}`, 40);
        this.m_scoreLabel.setScrollFactor(0);
        this.m_scoreLabel.setDepth(100);

        new ExperienceBar(this);

        // enemies
        this.m_ships = this.physics.add.group();
        this.m_ships1 = this.add.sprite(10, 10, "ship");
        this.m_ships2 = this.add.sprite(10, 20, "ship");
        this.m_ships3 = this.add.sprite(20, 10, "ship");
        this.m_ships4 = this.add.sprite(20, 20, "ship");
        this.m_ships.add(this.m_ships1);
        this.m_ships.add(this.m_ships2);
        this.m_ships.add(this.m_ships3);
        this.m_ships.add(this.m_ships4);

        this.m_ship1 = this.add.sprite(Config.width / 2 - 50, Config.height / 2, "ship");
        this.m_ship2 = this.add.sprite(Config.width / 2, Config.height / 2, "ship2");
        this.m_ship3 = this.add.sprite(Config.width / 2 + 50, Config.height / 2, "ship3");

        this.m_enemies = this.physics.add.group();
        this.m_enemies.add(this.m_ship1);
        this.m_enemies.add(this.m_ship2);
        this.m_enemies.add(this.m_ship3);
        Phaser.Actions.Call(this.m_ships.getChildren(), (ship) => {
            this.m_enemies.add(ship);
        }, this);

        this.m_ship1.play("ship1_anim");
        this.m_ship2.play("ship2_anim");
        this.m_ship3.play("ship3_anim");
        // this.m_ships1.play("ship1_anim");

        this.m_ship1.setInteractive();
        this.m_ship2.setInteractive();
        this.m_ship3.setInteractive();
        Phaser.Actions.Call(this.m_ships.getChildren(), (ship) => {
            ship.setInteractive();
        }, this);

        this.input.on('gameobjectdown', this.destroyShip, this);
        this.m_projectiles = this.add.group();

        // powerUp
        this.m_powerUps = this.physics.add.group();

        let maxObjects = 4;
        for (let i = 0; i < maxObjects; i++) {
            const powerUp = this.physics.add.sprite(16, 16, "power-up");
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
        m_camera.startFollow(this.m_player);

        // keys
        this.m_spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.m_cursorKeys = this.input.keyboard.createCursorKeys();
        this.m_wasdKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });

        // collisions
        // collider : 충돌 -> 바운스
        this.physics.add.collider(this.m_projectiles, this.m_powerUps, function (projectile, powerUp) {
            projectile.destroy();
        });
        // overlap : 접촉 -> 바운스 X
        this.physics.add.overlap(this.m_player, this.m_powerUps, this.pickPowerUp, null, this);
        this.physics.add.overlap(this.m_player, this.m_enemies, () => this.m_player.hitByEnemy(10), null, this);
        this.physics.add.overlap(this.m_projectiles, this.m_enemies, this.hitEnemy, null, this);
    }

    moveShip(ship, speed) {
        ship.y += speed;
        if (ship.y > Config.height) {
            this.resetShipPos(ship);
        }
    }

    resetShipPos(ship) {
        ship.y = 0;
        ship.x = Phaser.Math.Between(0, Config.width);
    }

    destroyShip(pointer, gameObject) {
        gameObject.setTexture("explosion");
        gameObject.play("explode");
    }

    pickPowerUp(player, powerUp) {
        /*
        disableBody
        parameter 1 : make it inactive
        parameter 2 : hide it from the display list
        */
        powerUp.disableBody(true, true);
        player.gainPower(10);
        this.m_pickupSound.play();
        powerUp.destroy();
    }

    hitEnemy(projectile, enemy) {
        const explosion = new Explosion(this, enemy.x, enemy.y);

        projectile.destroy();
        this.resetShipPos(enemy);
        this.m_score += 15;
        this.m_scoreLabel.text = "SCORE " + this.m_score.toString().padStart(6, '0');
        this.m_explosionSound.play();
    }

    update() {
        // 매 프레임마다 ?
        this.moveShip(this.m_ship1, 1);
        this.moveShip(this.m_ship2, 2);
        this.moveShip(this.m_ship3, 3);

        Phaser.Actions.Call(this.m_ships.getChildren(), (ship) => {
            this.moveShip(ship, 0.5);
        }, this);

        // this.background.tilePositionX -= 0.5;
        this.movePlayerManager();

        for (let i = 0; i < this.m_projectiles.getChildren().length; ++i) {
            const beam = this.m_projectiles.getChildren()[i];
            beam.update();
        }
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
}