import Phaser from "phaser";
import SplashScreen from './scenes/splash-screen';
import Game from './scenes/game';
import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";

const DEFAULT_WIDTH = 500;
const DEFAULT_HEIGHT = 800;

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#000',
  loaderPath: 'assets/',
  parent: "container",
  width: DEFAULT_WIDTH,
  height: DEFAULT_HEIGHT,
  scene: [SplashScreen, Game],
  physics: {
    default: 'matter',
    matter: {
      debug: false
    }
  },
  plugins: {
    scene: [
      {
        plugin: PhaserMatterCollisionPlugin,
        key: "matterCollision",
        mapping: "matterCollision"
      }
    ]
  }
};

window.addEventListener('load', () => {
  let game = new Phaser.Game(config);
});



