import game from "../index";

let level_scene_paused = false;
let level_time_paused = Date.now() - 100;

export default function level_pause(scene) {
  if (Date.now() - level_time_paused > 100 && game.scene.isActive(scene)) {
    game.scene.pause(scene);
    level_time_paused = Date.now();
    level_scene_paused = scene;

    game.scene.getScene(scene).toggleLevelScreen(true);
    game.scene.getScene(scene).m_pauseInSound.play({ volume: 0.2 });
  }
}

document.addEventListener("keydown", function (event) {
  if (
    (event.key === "1" || event.key === "2" || event.key === "3") &&
    Date.now() - level_time_paused > 100 &&
    level_scene_paused
  ) {
    const previousScene = game.scene.getScene(level_scene_paused);
    game.scene.resume(level_scene_paused);
    previousScene.toggleLevelScreen(false);
    previousScene.m_pauseOutSound.play({ volume: 0.2 });
    previousScene.afterLevelUp();
    level_scene_paused = false;
    level_time_paused = Date.now();
  }
});
