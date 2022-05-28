import Phaser from 'phaser';
import bgImg from './assets/images/background.png';
import shipImg from './assets/spritesheets/ship.png';

export default class LoadingScene extends Phaser.Scene {
    constructor() {
        super("bootGame");
        // bootGame : 이 scene의 identifier
    }

    preload() {
        this.load.image("background", bgImg);
        this.load.spritesheet("ship", shipImg, {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet("ship2", "assets/spritesheets/ship2.png", {
            frameWidth: 32,
            frameHeight: 16
        });
        this.load.spritesheet("ship3", "assets/spritesheets/ship3.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("explosion", "assets/spritesheets/explosion.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet("power-up", "assets/spritesheets/power-up.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.image("cat", "assets/images/cat-rainbow.png");

        this.load.spritesheet("beam", "assets/spritesheets/beam.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.bitmapFont("pixelFont", "assets/font/font.png", "assets/font/font.xml");
        this.load.audio("audio_beam", ["assets/sounds/hit.ogg", "assets/sounds/hit.mp3"]);
        this.load.audio("audio_explosion", ["assets/sounds/pop.ogg", "assets/sounds/pop.mp3"]);
        this.load.audio("audio_pickup", ["assets/sounds/pickPowerUp.ogg", "assets/sounds/pickPowerUp.mp3"]);
        this.load.audio("audio_hurt", ["assets/sounds/hurt.ogg", "assets/sounds/hurt.mp3"]);
        this.load.audio("audio_gameover", ["assets/sounds/gameover.ogg", "assets/sounds/gameover.mp3"]);
        this.load.audio("music", ["assets/sounds/lofi-bgm.ogg", "assets/sounds/lofi-bgm.mp3"]);
    }

    create() {
        this.add.text(20, 20, "Loading game...");
        this.scene.start("mainScene");

        this.anims.create({
            key: "ship1_anim",
            frames: this.anims.generateFrameNumbers("ship"),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: "ship2_anim",
            frames: this.anims.generateFrameNumbers("ship2"),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: "ship3_anim",
            frames: this.anims.generateFrameNumbers("ship3"),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: "explode",
            frames: this.anims.generateFrameNumbers("explosion"),
            frameRate: 20,
            repeat: 0,
            hideOnComplete: true
        });

        this.anims.create({
            key: "red",
            frames: this.anims.generateFrameNumbers("power-up", {
                start: 0,
                end: 1
            }),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: "gray",
            frames: this.anims.generateFrameNumbers("power-up", {
                start: 2,
                end: 3
            }),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: "beam_anim",
            frames: this.anims.generateFrameNumbers("beam"),
            frameRate: 20,
            repeat: -1
        });
    }
}