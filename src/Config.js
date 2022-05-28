import LoadingScene from "./LoadingScene";
import MainScene from "./MainScene";
import PlayingScene from "./PlayingScene";

const Config = {
    // 맵 크기
    width: 800,
    height: 600,
    backgroundColor: 0x000000,
    scene: [LoadingScene, MainScene, PlayingScene],
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            debug: true,
        },
    },
};

export default Config;
