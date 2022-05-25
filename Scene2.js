class Scene2 extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    create() {
        // 월드 크기
        var camera = this.cameras.main;
        this.cameras.addExisting(camera);
        // console.log(camera.x, camera.y);

        // this.background = this.add.image(0,0, "background");
        this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
        this.background.setOrigin(0,0);

        this.ship1 = this.add.sprite(config.width/2 - 50, config.height/2, "ship");
        this.ship2 = this.add.sprite(config.width/2, config.height/2, "ship2");
        this.ship3 = this.add.sprite(config.width/2 + 50, config.height/2, "ship3");

        this.ship1.play("ship1_anim");
        this.ship2.play("ship2_anim");
        this.ship3.play("ship3_anim");

        this.ship1.setInteractive();
        this.ship2.setInteractive();
        this.ship3.setInteractive();

        this.input.on('gameobjectdown', this.destroyShip, this);

        this.add.text(20, 20, "Playing game", {
            font: "25px Arial",
            fill: "yellow",
        });

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

        this.player = this.physics.add.sprite(250, 250, "player");
        this.player.play("thrust");
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.player.setCollideWorldBounds(true);

        camera.startFollow(this.player);

        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.projectiles = this.add.group();
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

    update() {
        // 매 프레임마다 ?
        this.moveShip(this.ship1, 1);
        this.moveShip(this.ship2, 2);
        this.moveShip(this.ship3, 3);

        // this.background.tilePositionX -= 0.5;
        this.movePlayerManager();
        if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
            this.shootBeam();
        }

        for (var i=0; i<this.projectiles.getChildren().length; ++i) {
            var beam = this.projectiles.getChildren()[i];
            beam.update();
        }
    }

    movePlayerManager() {
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
    }
}