import Scene1 from "./Scenes/Scene1";
import Scene2 from "./Scenes/Scene2";

const config = {
    width: 256,
    height: 272,
    backgroundColor: 0x000000,
    scene: [Scene1, Scene2],
	pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
        }
    }
};

export default config;