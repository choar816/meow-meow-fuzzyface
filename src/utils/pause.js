import game from "../index";

let global_scene_paused = false;
let global_time_paused = (Date.now() - 100);

export default function global_pause(scene) {
    if (Date.now() - global_time_paused > 100 && game.scene.isActive(scene)) {
        game.scene.pause(scene);
        console.log('--------- global_pause called');
        global_time_paused = Date.now();
        global_scene_paused = scene;

        game.scene.getScene(scene).togglePauseScreen(true);
        game.scene.getScene(scene).m_pauseInSound.play({volume: 0.2});
    }
}

document.addEventListener('keydown', function(event) {
    if(event.key === 'Escape' && Date.now() - global_time_paused > 100 && global_scene_paused) {
        game.scene.resume(global_scene_paused);
        console.log('+++++++++++ RESUME');
        game.scene.getScene(global_scene_paused).togglePauseScreen(false);
        game.scene.getScene(global_scene_paused).m_pauseOutSound.play({volume: 0.2});
        global_scene_paused = false;
        global_time_paused = Date.now();
    }
});
