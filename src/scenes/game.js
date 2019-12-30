class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });
  }

  create() {
    let shapes = this.cache.json.get('shapes');

    const centerX = this.sys.game.config.width / 2;
    const centerY = this.sys.game.config.height / 2;

    let board = this.add.sprite(centerX, centerY, 'board');

    /*
      Center the paddles via an offset value from the centerX value. A container could of been used but as the container has children
      the physics bodies would be offset.
    */

    this.leftPaddle = this.matter.add.sprite(centerX - 57, 650, 'leftPaddle', null, { shape: shapes.leftPaddle });
    this.rightPaddle = this.matter.add.sprite(centerX + 57, 650, 'rightPaddle', null, { shape: shapes.rightPaddle });
    this.pinball = this.matter.add.sprite(centerX, centerY, 'pinball', null, { shape: shapes.pinball });

    // Tempoary Side Guards
    let guard = '0 0 0 440 20 440 20 0';
    let guardTop = '0 0 0 20 440 20 440 0';

    let sideGuard = this.add.polygon(centerX - 170, 450, guard, 0xED1C24, 1);
    this.matter.add.gameObject(sideGuard, { shape: { type: 'fromVerts', verts: guard, flagInternal: true }, isStatic: true, angle: -0.3 });

    let sideGuardRight = this.add.polygon(centerX + 170, 450, guard, 0xED1C24, 1);
    this.matter.add.gameObject(sideGuardRight, { shape: { type: 'fromVerts', verts: guard, flagInternal: true }, isStatic: true, angle: 0.3 });

    let topGuard = this.add.polygon(centerX, 200, guardTop, 0xED1C24, 1);
    this.matter.add.gameObject(topGuard, { shape: { type: 'fromVerts', verts: guardTop, flagInternal: true }, isStatic: true, angle: 0 });

    // Physics
    this.leftPaddle.setStatic(true);
    this.leftPaddle.setFriction(0, 0, 0);
    this.leftPaddle.setBounce(0.2);
    // this.leftPaddle.setAngularVelocity(0.3);

    this.rightPaddle.setStatic(true);
    this.rightPaddle.setFriction(0, 0, 0);
    this.rightPaddle.setBounce(0.2);

    // this.pinball.setDensity(5.5);
    this.pinball.setFriction(0, 0, 0);
    this.pinball.setVelocity(1, 5);
    this.pinball.setBounce(0.1);
    
  }

  movePaddles(paddle) {
    if (paddle.texture.key === 'leftPaddle') {
      // Velocity Increace
      paddle.setVelocity(2, -12);
      paddle.setBounce(1);

      this.tweens.add({
        targets: paddle,
        angle: -30,
        duration: 50,
        ease: 'Power2',
        yoyo: false,
        delay: 0,
        onComplete: () => {
          paddle.setVelocity(0, 0);
          paddle.setBounce(0.2);
          this.tweens.add({ targets: paddle, angle: 0, duration: 50, ease: 'Power2'});
        }
      });

    } else {
      paddle.setVelocity(2, -12);
      paddle.setBounce(1);

      // Right Paddle
      this.tweens.add({
        targets: paddle,
        angle: 30,
        duration: 50,
        ease: 'Power2',
        yoyo: false,
        delay: 0,
        onComplete: () => {
          paddle.setVelocity(0, 0);
          paddle.setBounce(0.2);
          this.tweens.add({ targets: paddle, angle: 0, duration: 50, ease: 'Power2'});
        }
      });
    }
  }

  update() {
    let keys = this.input.keyboard.addKeys({
      up: 'up',
      down: 'down',
      left: 'left',
      right: 'right'
    });

    if (keys.left.isDown) {
      this.movePaddles(this.leftPaddle);
    }
    
    if (keys.right.isDown) {
      this.movePaddles(this.rightPaddle);
    }
  }
}

export default Game;
