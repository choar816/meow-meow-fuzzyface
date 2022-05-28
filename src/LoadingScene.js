import Phaser from 'phaser';
import bgImg from './assets/images/background.png';
import ship1Img from './assets/spritesheets/ship.png';
import ship2Img from './assets/spritesheets/ship2.png';
import ship3Img from './assets/spritesheets/ship3.png';
import explosionImg from './assets/spritesheets/explosion.png';
import powerUpImg from './assets/spritesheets/power-up.png';
import catImg from './assets/images/cat-rainbow.png';
import beamImg from './assets/spritesheets/beam.png';
import fontPng from "./assets/font/font.png";
import fontXml from "./assets/font/font.xml";
import hitOgg from "./assets/sounds/hit.ogg";
import hitMp3 from  "./assets/sounds/hit.mp3";
import popOgg from "./assets/sounds/pop.ogg";
import popMp3 from "./assets/sounds/pop.mp3";
import pickOgg from "./assets/sounds/pickPowerUp.ogg";
import pickMp3 from "./assets/sounds/pickPowerUp.mp3";
import hurtOgg from "./assets/sounds/hurt.ogg";
import hurtMp3 from "./assets/sounds/hurt.mp3";
import gameoverOgg from "./assets/sounds/gameover.ogg";
import gameoverMp3 from "./assets/sounds/gameover.mp3";
import bgmOgg from "./assets/sounds/lofi-bgm.ogg";
import bgmMp3 from "./assets/sounds/lofi-bgm.mp3";

export default class LoadingScene extends Phaser.Scene {
    constructor() {
        super("bootGame");
        // bootGame : 이 scene의 identifier
    }

    preload() {
        this.load.image("background", bgImg);
        this.load.spritesheet("ship", ship1Img, {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet("ship2", ship2Img, {
            frameWidth: 32,
            frameHeight: 16
        });
        this.load.spritesheet("ship3", ship3Img, {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("explosion", explosionImg, {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet("power-up", powerUpImg, {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.image("cat", catImg);

        this.load.spritesheet("beam", beamImg, {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.bitmapFont("pixelFont", fontPng, fontXml);
        this.load.audio("audio_beam", [hitOgg, hitMp3]);
        this.load.audio("audio_explosion", [popOgg, popMp3]);
        this.load.audio("audio_pickup", [pickOgg, pickMp3]);
        this.load.audio("audio_hurt", [hurtOgg, hurtMp3]);
        this.load.audio("audio_gameover", [gameoverOgg, gameoverMp3]);
        this.load.audio("music", [bgmOgg, bgmMp3]);
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