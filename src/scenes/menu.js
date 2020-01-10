
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

    let menuBg = this.add.sprite(this.centerX, this.centerY, 'menuBg');
    let playBtn = new Button(this, this.centerX, 600, 'PLAY', 'Game');
  }
}

export default Menu;
