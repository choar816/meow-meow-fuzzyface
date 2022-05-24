var gameSettings = {
  playerSpeed: 3,
}

const config = {
  // 카메라 크기
  width: 500,
  height: 500,
  backgroundColor: 0x000000,
  scene: [Scene1, Scene2],
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
}

const game = new Phaser.Game(config);
