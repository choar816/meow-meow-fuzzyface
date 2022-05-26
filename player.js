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