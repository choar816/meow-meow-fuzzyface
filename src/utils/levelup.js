import game from "../index";

let global_scene_paused = false;
let global_time_paused = (Date.now() - 100);

export default function global_levelup(scene) {
    if (Date.now() - global_time_paused > 100 && game.scene.isActive(scene)) {
        game.scene.pause(scene);
        global_time_paused = Date.now();
        global_scene_paused = scene;

        game.scene.getScene(scene).toggleLevelScreen(true);
        game.scene.getScene(scene).m_pauseInSound.play({volume: 0.2});
    }
}

export function go_to_next_level(scene) {
    console.log('go_to_next_level');
    if (Date.now() - global_time_paused > 100 && global_scene_paused) {
        game.scene.resume(scene);
        game.scene.getScene(scene).toggleLevelScreen(false);
        game.scene.getScene(scene).m_pauseOutSound.play({volume: 0.2});
        global_scene_paused = false;
        global_time_paused = Date.now();
        scene.m_level += 1;
    }
}

// document.addEventListener('keydown', function(event) {
//     if(event.key === ' ' && Date.now() - global_time_paused > 100 && global_scene_paused) {
//         game.scene.resume(global_scene_paused);
//         game.scene.getScene(global_scene_paused).toggleLevelScreen(false);
//         game.scene.getScene(global_scene_paused).m_pauseOutSound.play({volume: 0.2});
//         global_scene_paused = false;
//         global_time_paused = Date.now();
//     }
// });
