// Utils
import Text from '../utils/Text';
class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });
  }

  init() {
    this.bumperPoint = 0;
    this.healthPoint = 3;
    this.scoreText = 0;
    this.healthText = 0;
    this.pinballHoleCollisions = 0;
    this.depth = {
      ui: 999,
      sprite: 8
    }
  }
  
  create() {
    // Create the UI
    this.createUI();

    // Globals
    // this.bumperPoint = 0;
    // this.healthPoint = 3;


    let shapes = this.cache.json.get('shapes');

    this.centerX = this.sys.game.config.width / 2;
    this.centerY = this.sys.game.config.height / 2;

    let board = this.add.sprite(this.centerX, this.centerY, 'board');

    let guard = '0 0 0 600 20 600 20 0';
    let sideGuard = this.add.polygon(this.centerX - 236, 400, guard, 0xED1C24, 1);
    sideGuard.setAlpha(0);
    this.matter.add.gameObject(sideGuard, { shape: { type: 'fromVerts', verts: guard, flagInternal: true }, isStatic: true, angle: 0.03 });

    let sideGuardLeft = this.add.polygon(this.centerX + 230, 400, guard, 0xED1C24, 1);
    sideGuardLeft.setAlpha(0);
    this.matter.add.gameObject(sideGuardLeft, { shape: { type: 'fromVerts', verts: guard, flagInternal: true }, isStatic: true, angle: -0.03 });

    // let hole = this.add.circle(this.centerX, 750, 35, '0x000000');

    /*
      Center the paddles via an offset value from the this.centerX value. A container could of been used but as the container has children
      the physics bodies would be offset.
    */

    this.leftPaddle = this.matter.add.sprite(this.centerX - 57, 650, 'leftPaddle', null, { shape: shapes.leftPaddle }).setStatic(true);
    this.rightPaddle = this.matter.add.sprite(this.centerX + 57, 650, 'rightPaddle', null, { shape: shapes.rightPaddle }).setStatic(true);
    this.baseCatcher = this.matter.add.sprite(this.centerX, 740, 'baseCatcher', null, { shape: shapes.baseCatcher }).setStatic(true);
    this.launchGuard = this.matter.add.sprite(this.centerX + 186, 397, 'launchGuard', null, { shape: shapes.launchGuard }).setStatic(true);
    this.cycGuard = this.matter.add.sprite(this.centerX, 17, 'cycGuard', null, { shape: shapes.cycGuard }).setStatic(true);
    this.launcher = this.matter.add.sprite(this.centerX + 213, 595, 'launcher', null, { shape: shapes.launcher }).setStatic(true);
    this.captinAmericaBumper = this.matter.add.sprite(this.centerX, 400, 'captinAmericaBumper', null, { shape: shapes.captinAmericaBumper }).setStatic(true);
    this.pinball = this.matter.add.sprite(this.centerX + 213, 525, 'pinball', null, { shape: shapes.pinball });
    this.pinballHole = this.matter.add.sprite(this.centerX, 775, 'pinballHole', null, { shape: shapes.pinballHole }).setStatic(true).setAlpha(1);

    // Physics
    this.leftPaddle.setFriction(0, 0, 0);
    this.leftPaddle.setBounce(0.2);

    this.rightPaddle.setFriction(0, 0, 0);
    this.rightPaddle.setBounce(0.2);

    this.baseCatcher.setFriction(5, 5, 5);
    this.baseCatcher.setBounce(0.2);

    // this.pinball.setDensity(5.5);
    this.pinball.setFriction(0, 0, 7);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
    this.pinball.setVelocity(1, 5);
    this.pinball.setBounce(0.1);
    this.pinball.setScale(1);

    this.pinballHole.setScale(0.8);
    
    // Depth Sorting
    this.pinball.setDepth(2);
    this.launchGuard.setDepth(4);
    this.baseCatcher.setDepth(5);
    this.pinballHole.setDepth(1);

    // Collisions
    this.matterCollision.addOnCollideStart({ objectA: this.pinball, objectB: this.captinAmericaBumper, callback: () => this.setPoint() });
    this.matterCollision.addOnCollideStart({ objectA: this.pinball, objectB: this.pinballHole, callback: () => {
      this.pinballHoleCollisions++;
      this.removeHealth(this.pinballHoleCollisions);
    }});
  }

  createUI() {
    // Score Bar
    this.scoreBar = this.createUIBar(25, 735, 150, 50);
    this.scoreText = new Text(this, 30, 735, 'Score: ', 'score', 0.5);
    this.scoreText.setDepth(this.depth.ui);

    // Health Bar
    this.healthBar = this.createUIBar(325, 735, 150, 50);
    this.healthText = new Text(this, 330, 735, 'Health: ', 'score', 0.5);
    this.healthText.setDepth(this.depth.ui);
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

    const emojis = [];
    for (let i = 0; i < this.healthPoint; i++) {
      emojis.push('❤');
    }
    let healthHearts = emojis.join().replace(/\,/g, ' ');
    this.healthText.setText(`Health: ${healthHearts}`);
  }

  setPoint() {
    this.bumperPoint++;
  }

  removeHealth(collisions) {
    console.log(collisions);

    if (collisions === 1) {
      this.healthPoint--;
      this.respawnPinball();
    }
  }

  respawnPinball() {
    setTimeout(() => {
      console.log('Pinball Respawned');
      this.pinballHoleCollisions = 0;

      this.pinball.setVelocity(0, 0);
      this.pinball.setBounce(0);
      this.launcher.setVelocity(0, 0);
      this.launcher.setBounce(0);

      this.tweens.add({
        targets: this.pinball,
        setScale: 0,
        duration: 50,
        ease: 'Power2',
        yoyo: false,
        delay: 0,
        onComplete: () => {
          this.tweens.add({ targets: this.pinball, setScale: 0.9, duration: 4550, ease: 'Power2'});
        }
      });

      this.pinball.setPosition(this.centerX + 213, 400);
    }, 1000);
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
