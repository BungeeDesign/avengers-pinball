class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });
  }

  create() {
    const centerX = this.sys.game.config.width / 2;
    const centerY = this.sys.game.config.height / 2;

    let board = this.add.sprite(centerX, centerY, 'board');

    this.leftPaddle = this.add.sprite(180, 650, 'leftPaddle');
    this.rightPaddle = this.add.sprite(280, 650, 'rightPaddle');
    this.leftPaddle.angle = 0;
    this.rightPaddle.angle = 0;

    // Create Paddles Container
    let paddlesContainer = this.add.container(centerX - 230, 0);
    paddlesContainer.add(this.leftPaddle);
    paddlesContainer.add(this.rightPaddle);
  }

  movePaddles(paddle) {
    // paddle.angle += 1;

    // let paddlePivot = this.add.tween(paddle);
    // paddlePivot.to({ angle: -30 }, 600, Phaser.Easing.Cubic.None);
    // paddlePivot.start();

    this.tweens.add({
      targets: paddle,
      angle: -30,
      duration: 50,
      ease: 'Power2',
      yoyo: false,
      delay: 0,
      onComplete: () => {
        this.tweens.add({ targets: paddle, angle: 0, duration: 450, ease: 'Power2'});
      }
    });
  }

  update() {
    let keys = this.input.keyboard.addKeys({
      up: 'up',
      down: 'down',
      left: 'left',
      right: 'right'
    });

    if (keys.left.isDown) {
      // this.leftPaddle.angle = 0;
      this.movePaddles(this.leftPaddle);
    }
  }
}

export default Game;
