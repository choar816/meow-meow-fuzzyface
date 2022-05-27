class PlayingScene extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    create() {
        this.m_score = 0;

        this.sound.pauseOnBlur = false;
        this.m_beamSound = this.sound.add("audio_beam");
        this.m_explosionSound = this.sound.add("audio_explosion");
        this.m_pickupSound = this.sound.add("audio_pickup");

        this.m_music = this.sound.add("music");
        this.m_music.play({
            mute: false,
            volume: 0.7,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: false,
            delay: 0
        });

        const camera = this.cameras.main;
        this.cameras.addExisting(camera);
        this.cameras.main.setZoom(1);

        this.m_background = this.add.tileSprite(0, 0, config.width, config.height, "background");
        this.m_background.setOrigin(0,0);
        this.m_scoreLabel = this.add.bitmapText(0, 0, "pixelFont", "SCORE ", 16);
        this.m_scoreLabel.setScrollFactor(0);

        this.m_ship1 = this.add.sprite(config.width/2 - 50, config.height/2, "ship");
        this.m_ship2 = this.add.sprite(config.width/2, config.height/2, "ship2");
        this.m_ship3 = this.add.sprite(config.width/2 + 50, config.height/2, "ship3");

        this.m_enemies = this.physics.add.group();
        this.m_enemies.add(this.m_ship1);
        this.m_enemies.add(this.m_ship2);
        this.m_enemies.add(this.m_ship3);

        this.m_ship1.play("ship1_anim");
        this.m_ship2.play("ship2_anim");
        this.m_ship3.play("ship3_anim");

        this.m_ship1.setInteractive();
        this.m_ship2.setInteractive();
        this.m_ship3.setInteractive();

        this.input.on('gameobjectdown', this.destroyShip, this);

        this.m_powerUps = this.physics.add.group();

        var maxObjects = 4;
        for (var i=0; i<=maxObjects; i++) {
            const powerUp = this.physics.add.sprite(16, 16, "power-up");
            this.m_powerUps.add(powerUp);
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

        this.m_player = new Player(this, "player");

        this.m_cursorKeys = this.input.keyboard.createCursorKeys();
        this.m_wasdKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });
        // this.player.setCollideWorldBounds(true);

        camera.startFollow(this.m_player);

        this.m_spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.m_projectiles = this.add.group();

        // collider : 충돌 -> 바운스
        this.physics.add.collider(this.m_projectiles, this.m_powerUps, function(projectile, powerUp) {
            projectile.destroy();
        });

        // overlap : 접촉 -> 바운스 X
        this.physics.add.overlap(this.m_player, this.m_powerUps, this.pickPowerUp, null, this);
        this.physics.add.overlap(this.m_player, this.m_enemies, () => this.m_player.hitByEnemy(123), null, this);
        this.physics.add.overlap(this.m_projectiles, this.m_enemies, this.hitEnemy, null, this);
    }

    moveShip(ship, speed) {
        ship.y += speed;
        if (ship.y > config.height) {
            this.resetShipPos(ship);
        }
    }

    resetShipPos(ship) {
        ship.y = 0;
        ship.x = Phaser.Math.Between(0, config.width);
    }

    destroyShip(pointer, gameObject) {
        gameObject.setTexture("explosion");
        gameObject.play("explode");
    }

    pickPowerUp(player, powerUp) {
        // parameter 1 : make it inactive
        // parameter 2 : hide it from the display list
        powerUp.disableBody(true, true);
        this.m_pickupSound.play();
        powerUp.destroy();
    }

    hurtPlayer(player, enemy) {
        this.resetShipPos(enemy);

        if (this.m_player.alpha < 1)
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
        this.m_player.enableBody(true, x, y, true, true);
        this.m_player.alpha = 0.5;

        var tween = this.tweens.add({
            targets: this.m_player,
            y: config.height - 64,
            ease: 'Power1',
            duration: 1500,
            repeat: 0,
            onComplete: function() {
                this.m_player.alpha = 1;
            },
            callbackScope: this
        });
    }

    hitEnemy(projectile, enemy) {
        var explosion = new Explosion(this, enemy.x, enemy.y);

        projectile.destroy();
        this.resetShipPos(enemy);
        this.m_score += 15;
        var scoreFormated = this.zeroPad(this.m_score, 6);
        this.m_scoreLabel.text = "SCORE " + scoreFormated;
        console.log(this.m_score);
        this.m_explosionSound.play();
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
        this.moveShip(this.m_ship1, 1);
        this.moveShip(this.m_ship2, 2);
        this.moveShip(this.m_ship3, 3);

        this.movePlayerManager();
        if (Phaser.Input.Keyboard.JustDown(this.m_spacebar)) {
            if (this.m_player.active) {
                this.shootBeam();
            }
        }

        for (var i=0; i<this.m_projectiles.getChildren().length; ++i) {
            var beam = this.m_projectiles.getChildren()[i];
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

    shootBeam() {
        const beam = new Beam(this);
        this.m_beamSound.play();
    }
}