class Scene2 extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    create() {
        var graphics = this.add.graphics();
        graphics.fillStyle("Black");
        graphics.fillRect(0, 0, config.width, 20);

        this.score = 0;
        this.scoreLabel = this.add.bitmapText(10, 5, "pixelFont", "SCORE ", 16);

        this.beamSound = this.sound.add("audio_beam");
        this.explosionSound = this.sound.add("audio_explosion");
        this.pickupSound = this.sound.add("audio_pickup");

        this.music = this.sound.add("music");
        var musicConfig = {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: false,
            delay: 0
        };
        this.music.play(musicConfig);

        var camera = this.cameras.main;
        this.cameras.addExisting(camera);
        this.cameras.main.setZoom(2);
        // console.log(camera.x, camera.y);

        // this.background = this.add.image(0,0, "background");
        this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
        this.background.setOrigin(0,0);

        this.ship1 = this.add.sprite(config.width/2 - 50, config.height/2, "ship");
        this.ship2 = this.add.sprite(config.width/2, config.height/2, "ship2");
        this.ship3 = this.add.sprite(config.width/2 + 50, config.height/2, "ship3");

        this.enemies = this.physics.add.group();
        this.enemies.add(this.ship1);
        this.enemies.add(this.ship2);
        this.enemies.add(this.ship3);

        this.ship1.play("ship1_anim");
        this.ship2.play("ship2_anim");
        this.ship3.play("ship3_anim");

        this.ship1.setInteractive();
        this.ship2.setInteractive();
        this.ship3.setInteractive();

        this.input.on('gameobjectdown', this.destroyShip, this);

        this.powerUps = this.physics.add.group();

        var maxObjects = 4;
        for (var i=0; i<=maxObjects; i++) {
            var powerUp = this.physics.add.sprite(16, 16, "power-up");
            this.powerUps.add(powerUp);
            powerUp.setRandomPosition(0, 0, game.config.width, game.config.height);

            if (Math.random() > 0.5) {
                powerUp.play("red");
            } else {
                powerUp.play("gray");
            }
            powerUp.setVelocity(100, 100);
            powerUp.setCollideWorldBounds(true);
            powerUp.setBounce(1);
        }

        // this.player = this.physics.add.sprite(250, 250, "player");
        this.player = this.physics.add.image(250, 250, "player");
        this.player.scale = 0.2;
        // this.player.play("thrust");
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.player.setCollideWorldBounds(true);

        camera.startFollow(this.player);

        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.projectiles = this.add.group();

        // collider : 충돌 -> 바운스
        this.physics.add.collider(this.projectiles, this.powerUps, function(projectile, powerUp) {
            projectile.destroy();
        });

        // overlap : 접촉 -> 바운스 X
        this.physics.add.overlap(this.player, this.powerUps, this.pickPowerUp, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.hurtPlayer, null, this);
        this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, null, this);
    }

    moveShip(ship, speed) {
        ship.y += speed;
        if (ship.y > config.height) {
            this.resetShipPos(ship);
        }
    }

    resetShipPos(ship) {
        ship.y = 0;
        var randomX = Phaser.Math.Between(0, config.width);
        ship.x = randomX;
    }

    destroyShip(pointer, gameObject) {
        gameObject.setTexture("explosion");
        gameObject.play("explode");
    }

    pickPowerUp(player, powerUp) {
        // parameter 1 : make it inactive
        // parameter 2 : hide it from the display list
        powerUp.disableBody(true, true);
        this.pickupSound.play();
    }

    hurtPlayer(player, enemy) {
        this.resetShipPos(enemy);

        if (this.player.alpha < 1)
            return;

        var explosion = new Explosion(this, player.x, player.y);
        player.disableBody(true, true);
        this.time.addEvent({
            delay: 1000,
            callback: this.resetPlayer,
            callbackScope: this,
            loop: false
        });
    }

    resetPlayer() {
        var x = config.width / 2 - 8;
        var y = config.height - 64;
        this.player.enableBody(true, x, y, true, true);
        this.player.alpha = 0.5;

        var tween = this.tweens.add({
            targets: this.player,
            y: config.height - 64,
            ease: 'Power1',
            duration: 1500,
            repeat: 0,
            onComplete: function() {
                this.player.alpha = 1;
            },
            callbackScope: this
        });
    }

    hitEnemy(projectile, enemy) {
        var explosion = new Explosion(this, enemy.x, enemy.y);

        projectile.destroy();
        this.resetShipPos(enemy);
        this.score += 15;
        var scoreFormated = this.zeroPad(this.score, 6);
        this.scoreLabel.text = "SCORE " + scoreFormated;
        console.log(this.score);
        this.explosionSound.play();
    }

    zeroPad(number, size) {
        var stringNumber = String(number);
        while (stringNumber < (size || 2)) {
            stringNumber += "0" + stringNumber;
        }
        return stringNumber;
    }

    update() {
        // 매 프레임마다 ?
        this.moveShip(this.ship1, 1);
        this.moveShip(this.ship2, 2);
        this.moveShip(this.ship3, 3);

        // this.background.tilePositionX -= 0.5;
        this.movePlayerManager();
        if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
            if (this.player.active) {
                this.shootBeam();
            }
        }

        for (var i=0; i<this.projectiles.getChildren().length; ++i) {
            var beam = this.projectiles.getChildren()[i];
            beam.update();
        }
    }

    movePlayerManager() {
        // console.log(this.player.x, this.player.y);
        if (this.cursorKeys.left.isDown) {
            this.player.x -= gameSettings.playerSpeed;
        } else if (this.cursorKeys.right.isDown) {
            this.player.x += gameSettings.playerSpeed;
        }

        if (this.cursorKeys.up.isDown) {
            this.player.y -= gameSettings.playerSpeed;
        } else if (this.cursorKeys.down.isDown) {
            this.player.y += gameSettings.playerSpeed;
        }
    }

    shootBeam() {
        var beam = new Beam(this);
        this.beamSound.play();
    }
}