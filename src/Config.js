import LoadingScene from "./scenes/LoadingScene";
import MainScene from "./scenes/MainScene";
import PlayingScene from "./scenes/PlayingScene";
import GameoverScene from "./scenes/GameoverScene";
// import 'dotenv/config';

const Config = {
    // 맵 크기
    width: 800,
    height: 600,
    backgroundColor: 0x000000,
    scene: [LoadingScene, MainScene, PlayingScene, GameoverScene],
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            debug: process.env.DEBUG === "true",
        },
    },
};

export default Config;
