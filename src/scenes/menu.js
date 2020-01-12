
import Button from '../utils/Button';

class Menu extends Phaser.Scene {
  constructor() {
    super({
      key: 'Menu'
    });
  }

  create() {
    this.centerX = this.sys.game.config.width / 2;
    this.centerY = this.sys.game.config.height / 2;

    const musicConfig = {
      mute: false,
      volume: .7,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0
    }

    this.backgroundMusic = this.sound.add('backgroundMusic', { volume: 0.5 });
    this.backgroundMusic.play();

    let menuBg = this.add.sprite(this.centerX, this.centerY, 'menuBg');
    let playBtn = new Button(this, this.centerX, 600, 'PLAY', { scene: 'Game', data: { backgroundMusic: this.backgroundMusic }});
  }
}

export default Menu;
