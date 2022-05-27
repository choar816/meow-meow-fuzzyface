const Direction = Object.freeze({
    Up: 'Up',
    Down: 'Down',
    Left: 'Left',
    Right: 'Right'
});

class Player extends Phaser.Physics.Arcade.Image {
    static PLAYER_SPEED = 5;

    constructor(scene) {
        let x = 250;
        let y = 250;
        super(scene, x, y, "player");
        // this.scale = 0.2;
    }

    update() {

    }

    hitByEnemy(damage) {
        // this.resetShipPos(enemy);

        if (this.alpha < 1)
            return;

        console.log(`HIT! damage: ${damage}`);
        const explosion = new Explosion(this.scene, this.x, this.y);
        this.disableBody(true, true);
        this.scene.time.addEvent({
            delay: 1000,
            callback: this.resetPlayer,
            callbackScope: this,
            loop: false
        });
    }

    resetPlayer() {
        const x = config.width / 2 - 8;
        const y = config.height - 64;
        this.enableBody(true, x, y, true, true);
        this.alpha = 0.5;

        const tween = this.scene.tweens.add({
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