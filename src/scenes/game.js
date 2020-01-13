// Utils
import Text from '../utils/Text';
class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });
  }

  /*
    Here we are getting access to the data that was passed in via the
    Menu scene via the data param. We are also declaring some variables aswell as calling the getRandomTime() method.
  */
  init(data) {
    this.isMobile = data.isMobile;
    this.backgroundMusic = data.backgroundMusic;
    this.sys.canvas.style.cursor = "default";
    this.bumperPoint = 0;
    this.highScore = 0;
    this.healthPoint = 3;
    this.scoreText = 0;
    this.healthText = 0;
    this.pinballHoleCollisions = 0;
    this.randomTime = this.getRandomTime();
    this.depth = {
      ui: 999,
      sprite: 8
    }
    this.centerX = this.sys.game.config.width / 2;
    this.centerY = this.sys.game.config.height / 2;
  }
  
  create() {
    // If on mobile device create on sceen controls
    if (this.isMobile) {
      console.log('Mobile Device Detected');
      this.createMobileControls();
    }

    // Create the UI
    this.createUI();

    this.shapes = this.cache.json.get('shapes');

    let board = this.add.sprite(this.centerX, this.centerY - 30, 'board');

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

    this.leftPaddle = this.matter.add.sprite(this.centerX - 57, 615, 'leftPaddle', null, { shape: this.shapes.leftPaddle }).setStatic(true);
    this.rightPaddle = this.matter.add.sprite(this.centerX + 57, 615, 'rightPaddle', null, { shape: this.shapes.rightPaddle }).setStatic(true);
    this.outsideGuardLeft = this.matter.add.sprite(this.centerX - 132, 565, 'outsideGuardLeft', null, { shape: this.shapes.outsideGuardLeft }).setStatic(true);
    this.outsideGuardRight = this.matter.add.sprite(this.centerX + 132, 565, 'outsideGuardRight', null, { shape: this.shapes.outsideGuardRight }).setStatic(true);
    this.baseCatcher = this.matter.add.sprite(this.centerX, 722, 'baseCatcher', null, { shape: this.shapes.baseCatcher }).setStatic(true);
    this.launchGuard = this.matter.add.sprite(this.centerX + 186, 397, 'launchGuard', null, { shape: this.shapes.launchGuard }).setStatic(true);
    this.cycGuard = this.matter.add.sprite(this.centerX, 17, 'cycGuard', null, { shape: this.shapes.cycGuard }).setStatic(true);
    this.launcher = this.matter.add.sprite(this.centerX + 213, 615, 'launcher', null, { shape: this.shapes.launcher }).setStatic(true);
    this.captinAmericaBumper = this.matter.add.sprite(this.centerX, 375, 'captinAmericaBumper', null, { shape: this.shapes.captinAmericaBumper }).setStatic(true);
    this.pinball = this.matter.add.sprite(this.centerX + 213, 525, 'pinball', null, { shape: this.shapes.pinball });
    this.pinballHole = this.matter.add.sprite(this.centerX, 760, 'pinballHole', null, { shape: this.shapes.pinballHole }).setStatic(true).setAlpha(1);
    this.slingshotLeft = this.matter.add.sprite(this.centerX - 110, 490, 'slingshotLeft', null, { shape: this.shapes.slingshotLeft }).setStatic(true);
    this.slingshotLeftLight = this.matter.add.sprite(this.centerX - 110, 490, 'slingshotLeftLight', null, { shape: this.shapes.slingshotLeft }).setStatic(true).setAlpha(0);
    this.slingshotRight = this.matter.add.sprite(this.centerX + 105, 490, 'slingshotRight', null, { shape: this.shapes.slingshotRight }).setStatic(true);
    this.slingshotRightLight = this.matter.add.sprite(this.centerX + 105, 490, 'slingshotRightLight', null, { shape: this.shapes.slingshotRight }).setStatic(true).setAlpha(0);
    this.topSideGuard = this.matter.add.sprite(this.centerX - 177, 225, 'topSideGuard', null, { shape: this.shapes.topSideGuard }).setStatic(true);
    this.avengersLogo = this.matter.add.sprite(this.centerX + 3, 155, 'avengersLogo', null, { shape: this.shapes.avengersLogo }).setStatic(true);
    this.bonusSpot50 = this.matter.add.sprite(this.centerX - 95, 105, 'bonusSpot50', null, { shape: this.shapes.bonusSpot50 }).setStatic(true);
    this.bonusSpot100 = this.matter.add.sprite(this.centerX + 150, 230, 'bonusSpot100', null, { shape: this.shapes.bonusSpot100 }).setStatic(true);
    this.bonusSpotBalls = this.matter.add.sprite(this.centerX - 160, 390, 'bonusSpotBalls', null, { shape: this.shapes.bonusSpotBalls }).setStatic(true);
    this.bonusSpotBarrier = this.matter.add.sprite(this.centerX + 150, 368, 'bonusSpotBarrier', null, { shape: this.shapes.bonusSpotBarrier }).setStatic(true);

    // Sprite Sheets
    this.sparkHit = this.add.sprite(this.centerX, 400, 'sparkHit', 'Spark_00000.png');
    this.sparkHit.setAlpha(0);

    this.haloHit = this.add.sprite(this.centerX, 400, 'haloHit', 'Halo_00000.png');
    this.haloHit.setAlpha(0);

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

    this.bonusSpot100.setBounce(1);
    this.bonusSpot100.setFriction(0, 0, 0);
    
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
    this.bonusSpotHit = this.sound.add('bonusSpotHit', { volume: 0.6 });
    this.pinballCloneTone = this.sound.add('pinballClone', { volume: 0.7 });

    // Collisions
    this.matterCollision.addOnCollideStart({ objectA: this.pinball, objectB: this.captinAmericaBumper, callback: () => {
      this.setPoint('captinAmericaBumper');
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

    this.matterCollision.addOnCollideStart({ objectA: this.pinball, objectB: this.bonusSpot50, callback: () => {
      this.bonusSpotHit.play();
      this.playSpriteAnimations('bonusSpot50');
      this.setPoint('bonusSpot50');
    }});

    this.matterCollision.addOnCollideStart({ objectA: this.pinball, objectB: this.bonusSpot100, callback: () => {
      this.bonusSpotHit.play();
      this.playSpriteAnimations('bonusSpot100');
      this.setPoint('bonusSpot100');
    }});

    this.matterCollision.addOnCollideStart({ objectA: this.pinball, objectB: this.bonusSpotBalls, callback: () => {
      this.bonusSpotHit.play();
      this.playSpriteAnimations('bonusSpotBalls');
      this.clonePinball();
    }});

    this.matterCollision.addOnCollideStart({ objectA: this.pinball, objectB: this.bonusSpotBarrier, callback: () => {
      this.bonusSpotHit.play();
      this.playSpriteAnimations('bonusSpotBarrier');
      this.createBarrier();
    }});

    // Create Animations
    this.createSpriteAnimations();

    // Create Particles
    this.createParticles();
  }

  /*
    Here we are creating the UI score and health bars by calling the createUIBar() method and then making
    a new instance of our Text utility. 
  */
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

  /*
    Creates a bar that is pre styled. Takes in x and y params for position. Used by createUI
    for the score and health bar.
  */
  createUIBar(x, y, w, h) {
    const bar = this.add.graphics({ x: x, y: y });
    bar.fillStyle('0x0072C0', 1);
    bar.fillRect(0, 0, w, h);
    bar.setDepth(this.depth.ui);
    bar.setScrollFactor(0);
  }

  /*
    updateUI updates the UI elements, this includes the score and the health points.
    This is called from the update() method.
  */
  updateUI() {
    this.scoreText.setText(`Score ${this.bumperPoint}`);

    const emojis = [];
    for (let i = 0; i < this.healthPoint; i++) {
      emojis.push('❤');
    }
    let healthHearts = emojis.join().replace(/\,/g, ' ');
    this.healthText.setText(`Health ${healthHearts}`);
  }

  /*
    The setPoint method simply sets the point for a particluar item on the board. An item param is passed in and is then
    ran through a switch statement which has the 3 items on the board that creates a point increase.
  */
  setPoint(item) {
    switch (item) {
      case 'captinAmericaBumper':
        this.bumperPoint += 10;
        break;
      case 'bonusSpot50':
        this.bumperPoint += 50;
        break;
      case 'bonusSpot100':
        this.bumperPoint += 100;
        break;
    }
  }

  /*
    The removeHealth method will remove health if the pinball has entered the pinball hole. The collisions param will check for only 1
    collison occurence this ensures that only 1 health point will be taken away.
  */
  removeHealth(collisions) {
    if (collisions === 1) {
      this.pinballFall.play();
      this.healthPoint--;
      this.respawnPinball();
    }
  }

  /*
    Called from removeHealth() the respawnPinball method respawns the Pinball at the launcher position after 1 second.
    The pinball and launcher physic properties are reset to stop any unexptected force from the respawn. The physics resets
    on the launcher event.
  */
  respawnPinball() {
    setTimeout(() => {
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

  /*
    Moves the paddles on the left and right key down event. 
    The paddle flip sound also is played when this method is called.
    The action of the paddle that creates the speed increace on the pinball hit is done by setting a higher velocity on the paddle
    along with a max bounce value. 

    Once the animation is complete the velocity and bouch vales of the paddle are set to a default state this ensures that
    when the paddles are in the inactive state the active forces are not applied to the pinball if a collision occurs.
  */
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

  /*
    This method is called via the down key event in which will move the board launcher to lauch the pinball.
    The same logic is used within the paddle methods in which a velocity and bounce increase is set. In this
    case it is only set once the animation is complete, due to the last state of the animation being the state
    in which the launcher should exert force.
  */
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

  /*
    The boardLights method simply controls the board light animations via a switch statement.
  */
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
  
  /*
    This method creates all of the sprite animations that are used when various board items are hit.
    The AnimationManager is used to create the animations from the multiatlas sprite sheets.
  */
  createSpriteAnimations() {
    const haloFrames = this.anims.generateFrameNames('haloHit', { 
      start: 1, end: 84, zeroPad: 5,
      prefix: 'Halo_' , suffix: '.png'
    });

    this.anims.create({ key: 'haloHit', frames: haloFrames, frameRate: 60, repeat: 0 });

    const sparkFrames = this.anims.generateFrameNames('sparkHit', { 
      start: 1, end: 84, zeroPad: 5,
      prefix: 'Spark_' , suffix: '.png'
    });

    this.anims.create({ key: 'sparkHit', frames: sparkFrames, frameRate: 60, repeat: -1 });
  }

  /*
    Here we are playing the animations that were created in the createSpriteAnimations() method.
    This method is called from the relevant collison that occur from the pinball. A simple switch
    statement runs the called animation.
  */
  playSpriteAnimations(animation) {
    switch (animation) {
      case 'bonusSpotBalls':
        this.haloHit.setAlpha(1);
        this.haloHit.setPosition(this.centerX - 160, 390);
        this.haloHit.setScale(0.3);
        this.haloHit.play('haloHit');
        break;
      case 'bonusSpot50':
        this.haloHit.setAlpha(1);
        this.haloHit.setPosition(this.centerX - 95, 105);
        this.haloHit.setScale(0.5);
        this.haloHit.play('haloHit');
        break;
      case 'bonusSpot100':
        this.haloHit.setAlpha(1);
        this.haloHit.setPosition(this.centerX + 150, 230);
        this.haloHit.setScale(0.5);
        this.haloHit.play('haloHit');
        break;
      case 'bonusSpotBarrier':
        this.sparkHit.setAlpha(1);
        this.sparkHit.setPosition(this.centerX , 640);
        this.sparkHit.setScale(0.5);
        this.sparkHit.setAngle(145);
        this.sparkHit.play('sparkHit');
        setTimeout(() => {
          this.sparkHit.setAlpha(0);
        }, this.randomTime);
        break;
    }
  }

  /*
    This method creates the particles for the captinAmericaBumper collision.
    The actual particles are ran via the emitParticleAt method.
  */
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

  /*
    The clonePinball method creates a random amount of pinballs between 1 and 5. This method is called
    when the bonus balls spot is hit on the board. Each new pinball clone created is pushed into an array
    which is then itterated through to add various properties on like depth, physics and collisions.
  */
  clonePinball() {
    this.pinballCloneTone.play();

    // Generate a random number between 1 and 5
    const cloneAmount = Math.floor(Math.random(1) * 5) + 1;
    const pinballClones = [];
    for (let i = 0; i < cloneAmount; i++) {
      pinballClones[i] = this.matter.add.sprite(this.centerX - 160, 390, 'pinball', null, { shape: this.shapes.pinball });
    }

    // Set Properties on created pinballs
    pinballClones.forEach((pinballClone) => {

      pinballClone.setDepth(2);
      pinballClone.setFriction(0, 0, 7);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
      pinballClone.setVelocity(1, 3); //5
      pinballClone.setBounce(0.1);
      pinballClone.setScale(1);

      // Add Collisons
      this.matterCollision.addOnCollideStart({ objectA: pinballClone, objectB: this.pinballHole, callback: () => {
        pinballClone.destroy();
      }});

      this.matterCollision.addOnCollideStart({ objectA: pinballClone, objectB: this.captinAmericaBumper, callback: () => {
        this.setPoint('captinAmericaBumper');
        this.captinAmericaBumperHit.play();
        this.sparkParticles.emitParticleAt(pinballClone.x, pinballClone.y, 50);
      }});
    });
  }

  /*
    The createBarrier method creates the barrier at the paddles to stop the ball from falling. This is called from
    the bonus barrier spot collision. The barrier is only active for a set amount of time which is random each game.
  */
  createBarrier() {
    let barrier = '0 0 0 20 60 20 60 0';
    let bonusBarrier = this.add.polygon(250, 650, barrier, 0xED1C24, 1);
    bonusBarrier.setAlpha(0);
    bonusBarrier.setDepth(8);
    this.matter.add.gameObject(bonusBarrier, { shape: { type: 'fromVerts', verts: barrier, flagInternal: true }, isStatic: true, angle: 0 });

    setTimeout(() => {
      bonusBarrier.destroy();
    }, this.randomTime);
  }

  /*
    Returns a random value between 1000 and 5000. Called once per game or init() call.
  */
  getRandomTime() {
    return Math.floor(Math.random(1000) * 5000) + 1;
  }

  /*
    This method creates the mobile controls if being played on a mobile device. Touch areas are made
    to allow for wider are of control on the screen.
  */
  createMobileControls() {
    let leftArrowArea = this.add.rectangle(this.centerX - 140, this.centerY + 280, 240, 300);
    leftArrowArea.setFillStyle('0x0072C0', 1);
    leftArrowArea.setDepth(this.depth.ui);
    leftArrowArea.setInteractive();

    // Show the touch areas to the player
    this.tweens.add({
      targets: leftArrowArea,
      alpha: 0,
      duration: 2000,
      ease: 'Power2',
      yoyo: false,
      delay: 0,
      loop: 1,
      onComplete: () => {
        leftArrowArea.setAlpha(0.1);
      }
    });

    let rightArrowArea = this.add.rectangle(this.centerX + 140, this.centerY + 280, 240, 300);
    rightArrowArea.setFillStyle('0x0072C0', 1);
    rightArrowArea.setDepth(this.depth.ui);
    rightArrowArea.setInteractive();

    this.tweens.add({
      targets: rightArrowArea,
      alpha: 0,
      duration: 2000,
      ease: 'Power2',
      yoyo: false,
      delay: 0,
      loop: 1,
      onComplete: () => {
        rightArrowArea.setAlpha(0.1);
      }
    });

    let downArrow = this.add.sprite(this.centerX, this.centerY + 265, 'arrow');
    downArrow.setDepth(this.depth.ui);
    downArrow.setAlpha(.3);
    downArrow.setInteractive();

    downArrow.on('pointerdown', () => {
      console.log('On Screen Down Arrow');
      this.moveLauncher(this.launcher);
    });

    leftArrowArea.on('pointerdown', () => {
      console.log('On Screen Left Arrow');
      this.movePaddles(this.leftPaddle);
    });

    rightArrowArea.on('pointerdown', () => {
      console.log('On Screen Right Arrow');
      this.movePaddles(this.rightPaddle);
    });
  }

  /*
    The update method is called every frame (60fps).
  */
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
      if (this.bumperPoint > localStorage.getItem('highScore')) {
        localStorage.setItem('highScore', this.bumperPoint);
      }
      this.scene.start('GameOver', { score: this.bumperPoint, backgroundMusic: this.backgroundMusic });
    }

    // console.log(this.pinball.body.velocity);
    if (this.pinball.body.velocity.x < -3 && this.pinball.body.velocity.x > -5 ) {
      this.pinballRolling.play();
    }
  }
}

export default Game;
