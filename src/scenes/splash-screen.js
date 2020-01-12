
class SplashScreen extends Phaser.Scene {
  constructor() {
    super({
      key: 'SplashScreen',

      // Preload loading assets before loading game assets
      pack: {
        files: [{
          type: 'image',
          key: 'loading-bar',
          url: 'src/assets/img/loading-bar.png'
        }]
      }
    });
  }

  // Preload all game assets.
  preload() {
    // Show the loader.
    this.showLoader();    
    this.load.setBaseURL('src/assets/img');
    this.load.image('menuBg', 'menu-bg.png');
    this.load.image('gameOverBg', 'game-over-bg.png');
    this.load.image('board', 'board-base.png');
    this.load.image('pinball', 'pinball.png');
    this.load.image('pinballHole', 'pinball-hole.png');
    this.load.image('leftPaddle', 'left-paddle.png');
    this.load.image('rightPaddle', 'right-paddle.png');
    this.load.image('outsideGuardLeft', 'outlane-guard-left.png');
    this.load.image('outsideGuardRight', 'outlane-guard-right.png');
    this.load.image('baseCatcher', 'base-catcher.png');
    this.load.image('launchGuard', 'launch-guard.png');
    this.load.image('launcher', 'launcher.png');
    this.load.image('cycGuard', 'cyc-guard.png');
    this.load.image('captinAmericaBumper', 'captin-america-bumper.png');
    this.load.image('slingshotLeft', 'slingshot-left.png');
    this.load.image('slingshotLeftLight', 'slingshot-left-light.png');
    this.load.image('slingshotRight', 'slingshot-right.png');
    this.load.image('slingshotRightLight', 'slingshot-right-light.png');
    this.load.image('topSideGuard', 'top-side-guard.png');

    // Load Sprite Sheet
    this.load.multiatlas('sparkHit', '../sheets/spark.json', './');

    // Load Audio
    this.load.audio('pinballRolling', '../audio/Pinball machine element - ball rolling.mp3');
    this.load.audio('pullLauncher', '../audio/Pinball machine pull spring with force 2.mp3');
    this.load.audio('pinballFall', '../audio/Pinball machine element - rolling into hole or gate.mp3');
    this.load.audio('paddleFlip', '../audio/Pinball_Sharpshooter_FlipperBat_Fienup_003.mp3');
    this.load.audio('slingshot', '../audio/slingshot.mp3');
    this.load.audio('backgroundMusic', '../audio/background.mp3');
    this.load.audio('captinAmericaBumperHit', '../audio/zap-pulse.ogg');

    // P2 Physics
    this.load.json('shapes', '../matter/shapes.json')
  }

  create() {
    this.scene.start('Menu');
  }

  showLoader() {
    const {width: w, height: h} = this.textures.get('loading-bar').get();
    const img = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'loading-bar');
    img.setScale(.2);
    this.load.on('progress', v => img.setCrop(0, 0, Math.ceil(v * w), h));

    const loadingText = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 + 60, 'Loading...', { 
      font: '20px Arial',
      fill: 'white'
    });

    loadingText.setOrigin(0.5, 0.5);
  }

  timer() {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default SplashScreen;
