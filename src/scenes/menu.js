
import Button from '../utils/Button';

class Menu extends Phaser.Scene {
  constructor() {
    super({
      key: 'Menu'
    });
  }

  /*
    The menu scene contains the UI controls for starting the game, music controls and touch controls based on
    the device. If the player selects the play button then the scene.start() method is called which runs the main Game
    scene. The backgroundMusic is passed in along with the isMobile flag.
  */
  create() {
    this.centerX = this.sys.game.config.width / 2;
    this.centerY = this.sys.game.config.height / 2;
    let isMobile = false;

    this.backgroundMusic = this.sound.add('backgroundMusic', { volume: 0.5 });
    this.backgroundMusic.play();
    
    let menuBg = this.add.sprite(this.centerX, this.centerY, 'menuBg');

    // Checking if device is mobile
    if (!this.sys.game.device.os.desktop) {
      isMobile = true;

      let touchControls = this.add.text(this.centerX - 90, this.centerY + 60, 'Touch Controls: ON', { font: `20px Gothic`, fill: 'white', align: 'center' }).setOrigin(0);
      touchControls.setInteractive();
      touchControls.on('pointerdown', () => {
        touchControls.setText('Touch Controls: OFF');
        touchControls.setAlpha(.5);
        isMobile = false;
      });

      touchControls.on('pointerover', () => { 
        this.sys.canvas.style.cursor = "pointer";
        touchControls.setAlpha(.5);
      });
  
      touchControls.on('pointerout', () => { 
        this.sys.canvas.style.cursor = "default";
        touchControls.setAlpha(1);
        console.log(isMobile);
      });
    }

    let playBtn = this.add.sprite(this.centerX, this.centerY + 170, 'playBtn');
    playBtn.setInteractive();

    playBtn.on('pointerover', () => { 
      this.sys.canvas.style.cursor = "pointer";
      playBtn.setAlpha(.8);
    });

    playBtn.on('pointerout', () => { 
      this.sys.canvas.style.cursor = "default";
      playBtn.setAlpha(1);
    });

    playBtn.on('pointerdown', () => {
      this.scene.start('Game', { backgroundMusic: this.backgroundMusic, isMobile: isMobile });
    });

    let musicBtn = new Button(this, this.centerX, 760, 65, 15, 25, 'MUSIC: ON', 'Music');
    
  }
}

export default Menu;
