
import Text from '../utils/Text';

class GameOver extends Phaser.Scene {
  constructor() {
    super({
      key: 'GameOver'
    });
  }

  init(data) {
    this.score = data.score;
  }

  create() {
    this.centerX = this.sys.game.config.width / 2;
    this.centerY = this.sys.game.config.height / 2;

    let gameOverBg = this.add.sprite(this.centerX, this.centerY, 'gameOverBg');
    this.scoreText = new Text(this, this.centerX / 2, 500, `You Scored: ${this.score}`, 'title');

    // Reset Cursor
    this.sys.canvas.style.cursor = "default";

    setTimeout(() => {
      this.scene.start('Menu');
    }, 2600);
  }
}

export default GameOver;
