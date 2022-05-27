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
        this.scale = 0.2;
        // scene.add.existing(this);
        // scene.physics.add.image(250, 250, "player");
        // scene.physics.world.enableBody(this);
    }

    update() {

    }

    hitByEnemy(damage) {
        console.log(`HIT! damage: ${damage}`)
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