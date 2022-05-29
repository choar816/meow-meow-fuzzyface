export default class Button extends Phaser.GameObjects.Graphics {
    constructor(x, y, label, scene, callback) {
        super(scene);

        const button = scene.add.text(x, y, label)
            .setOrigin(0.5)
            .setPadding(10)
            .setStyle({ backgroundColor: '#8aacc8' })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => callback())
            .on('pointerover', () => button.setStyle({ fill: '#000' }))
            .on('pointerout', () => button.setStyle({ fill: '#fff' }));
    }
}
