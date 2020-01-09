// Utils
import Text from '../utils/Text';
class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });
  }

  init() {
    this.scoreText = 0;
    this.depth = {
      ui: 999,
      sprite: 8
    }
  }
  
  create() {
    // Create the UI
    this.createUI();

    // Globals
    this.bumperPoint = 0;


    let shapes = this.cache.json.get('shapes');

    const centerX = this.sys.game.config.width / 2;
    const centerY = this.sys.game.config.height / 2;

    let board = this.add.sprite(centerX, centerY, 'board');

    let guard = '0 0 0 600 20 600 20 0';
    let sideGuard = this.add.polygon(centerX - 236, 400, guard, 0xED1C24, 1);
    sideGuard.setAlpha(0);
    this.matter.add.gameObject(sideGuard, { shape: { type: 'fromVerts', verts: guard, flagInternal: true }, isStatic: true, angle: 0.03 });

    let sideGuardLeft = this.add.polygon(centerX + 230, 400, guard, 0xED1C24, 1);
    sideGuardLeft.setAlpha(0);
    this.matter.add.gameObject(sideGuardLeft, { shape: { type: 'fromVerts', verts: guard, flagInternal: true }, isStatic: true, angle: -0.03 });

    /*
      Center the paddles via an offset value from the centerX value. A container could of been used but as the container has children
      the physics bodies would be offset.
    */

    this.leftPaddle = this.matter.add.sprite(centerX - 57, 650, 'leftPaddle', null, { shape: shapes.leftPaddle }).setStatic(true);
    this.rightPaddle = this.matter.add.sprite(centerX + 57, 650, 'rightPaddle', null, { shape: shapes.rightPaddle }).setStatic(true);
    this.baseCatcher = this.matter.add.sprite(centerX, 740, 'baseCatcher', null, { shape: shapes.baseCatcher }).setStatic(true);
    this.launchGuard = this.matter.add.sprite(centerX + 186, 397, 'launchGuard', null, { shape: shapes.launchGuard }).setStatic(true);
    this.cycGuard = this.matter.add.sprite(centerX, 17, 'cycGuard', null, { shape: shapes.cycGuard }).setStatic(true);
    this.launcher = this.matter.add.sprite(centerX + 213, 595, 'launcher', null, { shape: shapes.launcher }).setStatic(true);
    this.captinAmericaBumper = this.matter.add.sprite(centerX, 400, 'captinAmericaBumper', null, { shape: shapes.captinAmericaBumper }).setStatic(true);
    this.pinball = this.matter.add.sprite(centerX + 213, 525, 'pinball', null, { shape: shapes.pinball });

    // Physics
    this.leftPaddle.setFriction(0, 0, 0);
    this.leftPaddle.setBounce(0.2);

    this.rightPaddle.setFriction(0, 0, 0);
    this.rightPaddle.setBounce(0.2);

    this.baseCatcher.setFriction(5, 5, 5);
    this.baseCatcher.setBounce(0.2);

    // this.pinball.setDensity(5.5);
    this.pinball.setFriction(0, 0, 0);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
    this.pinball.setVelocity(1, 5);
    this.pinball.setBounce(0.1);
    this.pinball.setScale(0.9);
    
    // Depth Sorting
    this.launchGuard.setDepth(4);
    this.baseCatcher.setDepth(5);

    // Collisions
    this.matterCollision.addOnCollideStart({ objectA: this.pinball, objectB: this.captinAmericaBumper, callback: () => this.setPoint() });
    this.matterCollision.addOnCollideStart({ objectA: this.pinball, objectB: this.baseCatcher, callback: () => console.log("Pinball / Base Catcher Collison") });
  }

  createUI() {
    this.pointBar = this.createUIBar(25, 735, 150, 50);
    this.scoreText = new Text(this, 30, 735, 'Score: ', 'score', 0.5);
    this.scoreText.setDepth(this.depth.ui);
  }

  createUIBar(x, y, w, h) {
    const bar = this.add.graphics({ x: x, y: y });
    bar.fillStyle('0x0072C0', 1);
    bar.fillRect(0, 0, w, h);
    bar.setDepth(this.depth.ui);
    bar.setScrollFactor(0);
  }

  updateUI() {
    this.scoreText.setText(`Points: ${this.bumperPoint}`);
  }

  setPoint() {
    this.bumperPoint++;
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

  moveLauncher(launcher) {
    this.tweens.add({
      targets: launcher,
      y: 620,
      duration: 50,
      ease: 'Power2',
      yoyo: false,
      delay: 0,
      onComplete: () => {
        launcher.setVelocity(2, -9.3);
        launcher.setBounce(1);
        this.tweens.add({ targets: launcher, y: 595, duration: 50, ease: 'Power2'});
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
      this.movePaddles(this.leftPaddle);
    }
    
    if (keys.right.isDown) {
      this.movePaddles(this.rightPaddle);
    }

    if (keys.down.isDown) {
      this.moveLauncher(this.launcher);
    }

    this.updateUI();
  }
}

export default Game;
