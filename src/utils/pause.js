import game from "../index";

let global_scene_paused = false;
let global_time_paused = (Date.now() - 10000);

export default function global_pause(scene) {
    if (Date.now() - global_time_paused > 2000 && game.scene.isActive(scene)) {
        game.scene.pause(scene);
        console.log('--------- global_pause called');
        global_time_paused = Date.now();
        global_scene_paused = scene;
    }
}

document.addEventListener('keydown', function(event) {
    if(event.key === 'Escape' && Date.now() - global_time_paused > 2000 && global_scene_paused) {
        game.scene.resume(global_scene_paused);
        console.log('+++++++++++ RESUME');
        global_scene_paused = false;
        global_time_paused = Date.now();
    }
});
