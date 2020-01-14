
import Text from '../utils/Text';

class GameOver extends Phaser.Scene {
  constructor() {
    super({
      key: 'GameOver'
    });
  }

  init(data) {
    this.score = data.score;
    this.backgroundMusic = data.backgroundMusic;
  }

  /*
    The Game Over scene is called once all of the health points are gone. The game over scene is displayed for 2.6 seconds and then
    automaticlly switched to the menu scene. The canvas cursor is reset from none to default. The backgroundMusic is also stopped
    if playing otherwise another instance would start to play once the Menu scene was called.
  */
  create() {
    this.centerX = this.sys.game.config.width / 2;
    this.centerY = this.sys.game.config.height / 2;

    let gameOverBg = this.add.sprite(this.centerX, this.centerY, 'gameOverBg');

    this.highScoreText = new Text(this, this.centerX / 2, 500, `High Score: ${localStorage.getItem('highScore').toString()}`, 'title');
    this.scoreText = new Text(this, this.centerX / 2, 550, `You Scored: ${this.score}`, 'title');

    // Reset Cursor
    this.sys.canvas.style.cursor = "default";

    setTimeout(() => {
      this.backgroundMusic.stop();
      this.scene.start('Menu');
    }, 2600);
  }
}

export default GameOver;
