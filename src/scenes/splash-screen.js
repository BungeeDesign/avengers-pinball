
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
    this.load.image('board', 'board.png');
    this.load.image('leftPaddle', 'left-paddle.png');
    this.load.image('rightPaddle', 'right-paddle.png');
  }

  create() {
    this.scene.start('Game');
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
