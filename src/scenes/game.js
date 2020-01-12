// Utils
import Text from '../utils/Text';
class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });
  }

  init(data) {
    this.backgroundMusic = data.backgroundMusic;
    this.sys.canvas.style.cursor = "none";
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

    let shapes = this.cache.json.get('shapes');

    this.centerX = this.sys.game.config.width / 2;
    this.centerY = this.sys.game.config.height / 2;

    let board = this.add.sprite(this.centerX, this.centerY - 35, 'board');

    let guard = '0 0 0 600 20 600 20 0';
    let sideGuard = this.add.polygon(this.centerX - 236, 400, guard, 0xED1C24, 1);
    sideGuard.setAlpha(0);
    this.matter.add.gameObject(sideGuard, { shape: { type: 'fromVerts', verts: guard, flagInternal: true }, isStatic: true, angle: 0.03 });

    let sideGuardLeft = this.add.polygon(this.centerX + 230, 400, guard, 0xED1C24, 1);
    sideGuardLeft.setAlpha(0);
    this.matter.add.gameObject(sideGuardLeft, { shape: { type: 'fromVerts', verts: guard, flagInternal: true }, isStatic: true, angle: -0.03 });

    /*
      Center the paddles via an offset value from the this.centerX value. A container could of been used but as the container has children
      the physics bodies would be offset.
    */

    this.leftPaddle = this.matter.add.sprite(this.centerX - 57, 650, 'leftPaddle', null, { shape: shapes.leftPaddle }).setStatic(true);
    this.rightPaddle = this.matter.add.sprite(this.centerX + 57, 650, 'rightPaddle', null, { shape: shapes.rightPaddle }).setStatic(true);
    this.outsideGuardLeft = this.matter.add.sprite(this.centerX - 130, 602, 'outsideGuardLeft', null, { shape: shapes.outsideGuardLeft }).setStatic(true);
    this.outsideGuardRight = this.matter.add.sprite(this.centerX + 130, 602, 'outsideGuardRight', null, { shape: shapes.outsideGuardRight }).setStatic(true);
    this.baseCatcher = this.matter.add.sprite(this.centerX, 740, 'baseCatcher', null, { shape: shapes.baseCatcher }).setStatic(true);
    this.launchGuard = this.matter.add.sprite(this.centerX + 186, 397, 'launchGuard', null, { shape: shapes.launchGuard }).setStatic(true);
    this.cycGuard = this.matter.add.sprite(this.centerX, 17, 'cycGuard', null, { shape: shapes.cycGuard }).setStatic(true);
    this.launcher = this.matter.add.sprite(this.centerX + 213, 615, 'launcher', null, { shape: shapes.launcher }).setStatic(true);
    this.captinAmericaBumper = this.matter.add.sprite(this.centerX, 400, 'captinAmericaBumper', null, { shape: shapes.captinAmericaBumper }).setStatic(true);
    this.pinball = this.matter.add.sprite(this.centerX + 213, 525, 'pinball', null, { shape: shapes.pinball });
    this.pinballHole = this.matter.add.sprite(this.centerX, 775, 'pinballHole', null, { shape: shapes.pinballHole }).setStatic(true).setAlpha(1);
    this.slingshotLeft = this.matter.add.sprite(this.centerX - 130, 500, 'slingshotLeft', null, { shape: shapes.slingshotLeft }).setStatic(true);
    this.slingshotLeftLight = this.matter.add.sprite(this.centerX - 130, 500, 'slingshotLeftLight', null, { shape: shapes.slingshotLeft }).setStatic(true).setAlpha(0);
    this.slingshotRight = this.matter.add.sprite(this.centerX + 130, 500, 'slingshotRight', null, { shape: shapes.slingshotRight }).setStatic(true);
    this.slingshotRightLight = this.matter.add.sprite(this.centerX + 130, 500, 'slingshotRightLight', null, { shape: shapes.slingshotRight }).setStatic(true).setAlpha(0);
    this.topSideGuard = this.matter.add.sprite(this.centerX - 177, 225, 'topSideGuard', null, { shape: shapes.topSideGuard }).setStatic(true);

    // Sprite Sheets
    this.sparkHit = this.add.sprite(this.centerX, 400, 'sparkHit', 'Spark_00000.png').setAlpha(0);

    // Physics
    this.leftPaddle.setFriction(0, 0, 0);
    this.leftPaddle.setBounce(0.2);

    this.rightPaddle.setFriction(0, 0, 0);
    this.rightPaddle.setBounce(0.2);

    this.baseCatcher.setFriction(5, 5, 5);
    this.baseCatcher.setBounce(0.2);

    this.pinball.setFriction(0, 0, 7);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
    this.pinball.setVelocity(1, 3); //5
    this.pinball.setBounce(0.1);
    this.pinball.setScale(1);

    this.slingshotLeft.setBounce(1);
    this.slingshotLeft.setFriction(0, 0, 0);
    this.slingshotRight.setBounce(1);
    this.slingshotRight.setFriction(0, 0, 0);
    
    // Depth Sorting
    this.pinball.setDepth(2);
    this.launchGuard.setDepth(4);
    this.baseCatcher.setDepth(5);
    this.pinballHole.setDepth(1);

    this.pinballHole.setScale(0.8);

    // Add Game Sound
    this.pinballRolling = this.sound.add('pinballRolling');
    this.pullLauncher = this.sound.add('pullLauncher');
    this.pinballFall = this.sound.add('pinballFall');
    this.paddleFlip = this.sound.add('paddleFlip');
    this.slingshot = this.sound.add('slingshot', { volume: 0.3 });
    this.captinAmericaBumperHit = this.sound.add('captinAmericaBumperHit', { volume: 0.8 });

    // Collisions
    this.matterCollision.addOnCollideStart({ objectA: this.pinball, objectB: this.captinAmericaBumper, callback: () => {
      this.setPoint();
      this.captinAmericaBumperHit.play();
      this.sparkParticles.emitParticleAt(this.pinball.x, this.pinball.y, 50);
    }});
    this.matterCollision.addOnCollideStart({ objectA: this.pinball, objectB: this.pinballHole, callback: () => {
      this.pinballHoleCollisions++;
      this.removeHealth(this.pinballHoleCollisions);
    }});
    this.matterCollision.addOnCollideStart({ objectA: this.pinball, objectB: this.slingshotLeft, callback: () => {
      this.slingshot.play();
      this.boardLights('slingshotLeft') 
    }});
    this.matterCollision.addOnCollideStart({ objectA: this.pinball, objectB: this.slingshotRight, callback: () => {
      this.slingshot.play();
      this.boardLights('slingshotRight') 
    }});

    this.createParticles();
  }

  createUI() {
    // Score Bar
    this.scoreBar = this.createUIBar(25, 735, 150, 25);
    this.scoreText = new Text(this, 30, 735, 'Score ', 'score', 0.5);
    this.scoreText.setDepth(this.depth.ui);

    // Health Bar
    this.healthBar = this.createUIBar(325, 735, 155, 25);
    this.healthText = new Text(this, 330, 735, 'Health ', 'score', 0.5);
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
    this.scoreText.setText(`Score ${this.bumperPoint}`);

    const emojis = [];
    for (let i = 0; i < this.healthPoint; i++) {
      emojis.push('❤');
    }
    let healthHearts = emojis.join().replace(/\,/g, ' ');
    this.healthText.setText(`Health ${healthHearts}`);
  }

  setPoint() {
    this.bumperPoint++;
  }

  removeHealth(collisions) {
    console.log(collisions);

    if (collisions === 1) {
      this.pinballFall.play();
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

      this.pinball.scale = 0;
      this.tweens.add({
        targets: this.pinball,
        scale: 1,
        duration: 2000,
        ease: 'Power2',
        yoyo: false,
        delay: 0
      });

      this.pinball.setPosition(this.centerX + 213, 525);
    }, 1000);
  }

  movePaddles(paddle) {
    if (paddle.texture.key === 'leftPaddle') {
      this.paddleFlip.play();

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
      this.paddleFlip.play();

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
    this.pullLauncher.play();
    this.tweens.add({
      targets: launcher,
      y: 630,
      duration: 50,
      ease: 'Power2',
      yoyo: false,
      delay: 0,
      onComplete: () => {
        launcher.setVelocity(2, -9.3);
        launcher.setBounce(1);
        this.tweens.add({ targets: launcher, y: 615, duration: 50, ease: 'Power2'});
      }
    });
  }

  // Lighting Effect Animations
  boardLights(boardObj) {
    switch(boardObj) {
      case 'slingshotLeft':
        this.tweens.add({
          targets: this.slingshotLeftLight,
          alpha: 1,
          duration: 150,
          ease: 'Linear',
          yoyo: true,
          delay: 0,
          loop: 3,
          onComplete: () => {
            this.slingshotLeftLight.setAlpha(0);
          }
        });
        break;
      case 'slingshotRight':
        this.tweens.add({
          targets: this.slingshotRightLight,
          alpha: 1,
          duration: 150,
          ease: 'Linear',
          yoyo: true,
          delay: 0,
          loop: 3,
          onComplete: () => {
            this.slingshotRightLight.setAlpha(0);
          }
        });
        break;
    }
  }

  createSpriteAnimations(animation) {
    switch (animation) {
      case 'pinballFlood':
        const sparkFrames = this.anims.generateFrameNames('sparkHit', { 
          start: 1, end: 84, zeroPad: 5,
          prefix: 'Spark_' , suffix: '.png'
        });
    
        this.anims.create({ key: 'sparkHit', frames: sparkFrames, frameRate: 60, repeat: -1 });
        this.sparkHit.play('sparkHit');
        break;
    }
  }

  createParticles() {
    this.sparkParticles = this.add.particles('sparkHit');
    this.sparkEmitter = this.sparkParticles.createEmitter({
      x: this.centerX,
      y: 500,
      speed: 15,
      lifespan: 1400,
      blendMode: 'ADD',
      maxParticles: 400,
      scale: { start: 0.3, end: 0 },
      on: false
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

    // Check Score
    if (this.healthPoint === 0) {
      this.scene.start('GameOver', { score: this.bumperPoint, backgroundMusic: this.backgroundMusic });
    }

    // console.log(this.pinball.body.velocity);
    if (this.pinball.body.velocity.x < -3 && this.pinball.body.velocity.x > -5 ) {
      this.pinballRolling.play();
    }
  }
}

export default Game;
