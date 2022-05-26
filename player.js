const Direction = Object.freeze({
    Up: 'Up',
    Down: 'Down',
    Left: 'Left',
    Right: 'Right'
});

class Player extends Phaser.GameObjects.Image {
// class Player extends Phaser.Types.Physics.Arcade.ImageWithDynamicBody {
    static PLAYER_SPEED = 3;

    constructor(scene, frame) {
        super(scene, 250, 250, "player", frame);

        // this.hp = 100;
        this.scale = 0.2;

        scene.add.existing(this);
        scene.physics.world.enableBody(this);

        // vvv.setCollideWorldBounds(true);
        // vvv = null;
    }

    fire() {
    }

    hitByEnemy(scene, damage) {
        console.log(`HIT! damage: ${damage}`);
        scene.physics.world.disableBody(true, true);
        // this.disableBody(true, true);
        scene.time.addEvent({
            delay: 1000,
            callback: this.resetPlayer,
            callbackScope: this,
            loop: false
        });
    }

    resetPlayer(scene) {
        let x = config.width / 2 - 8;
        let y = config.height - 64;
        scene.physics.world.enableBody(true, x, y,true, true);
        // this.enableBody(true, x, y, true, true);
        this.alpha = 0.5;

        let tween = scene.tweens.add({
            targets: this,
            y: config.height - 64,
            ease: 'Power1',
            duration: 1500,
            repeat: 0,
            onComplete: function() {
                this.alpha = 1;
            },
            callbackScope: this
        });
    }

    move(direction) {
        switch (direction) {
            case Direction.Up:
                this.y -= Player.PLAYER_SPEED;
                break;

            case Direction.Down:
                this.y += Player.PLAYER_SPEED;
                break;

            case Direction.Left:
                this.x -= Player.PLAYER_SPEED;
                this.flipX = true;
                break;

            case Direction.Right:
                this.x += Player.PLAYER_SPEED;
                this.flipX = false;
                break;
        }
    }
}