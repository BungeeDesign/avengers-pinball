
class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });
  }

  create() {
    const gameW = this.sys.game.config.width;
    const gameH = this.sys.game.config.height;

    let board = this.add.sprite(gameW / 2, gameH / 2, 'board');
  }

  update() {

  }

}

export default Game;
