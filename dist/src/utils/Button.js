class Button {
  constructor(context, x, y, horizontalPadding, verticalPadding, fontSize, string, action) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.horizontalPadding = horizontalPadding;
    this.verticalPadding = verticalPadding;
    this.fontSize = fontSize;
    this.text = string;
    this.action = action;
    this.obj = this.createButton();
  }

  setStyle(styleType) {
    // Base Style
    let style = {
      font: `20px Arial`,
      fill: "white"
    };
    
    switch (styleType.toLowerCase()) {
      case "loading":
        style.font = `20px Arial`;
        break;
      case "score":
        style.font = `20px Arial`;
        break;
    }

    return style;
  }

  createButton() {
    let backgroundContainer = this.context.add.rectangle(this.x, this.y, 160, 60);
    backgroundContainer.setFillStyle('0x0072C0', 1);

    let obj = this.context.add.text(
      this.x - this.horizontalPadding,
      this.y - this.verticalPadding,
      this.text,
      {
        font: `${this.fontSize}px Gothic`,
        fill: "white",
        align: 'center'
      }
    );

    obj.setInteractive();

    obj.on('pointerover', () => { 
      this.context.sys.canvas.style.cursor = "pointer";
      backgroundContainer.setFillStyle('0xD12600', 1);
    });

    obj.on('pointerout', () => { 
      this.context.sys.canvas.style.cursor = "default";
      backgroundContainer.setFillStyle('0x0072C0', 1);
    });

    let musicOn = true;
    obj.on('pointerdown', () => {
      if (typeof this.action === 'object') {
        this.context.scene.start(this.action.scene, this.action.data);
      } else {
        if (this.action === 'Music') {
          if (musicOn) {
            this.context.backgroundMusic.stop();
            obj.setText('MUSIC: OFF');
            musicOn = false;
          } else {
            this.context.backgroundMusic.play();
            obj.setText('MUSIC: ON');
            musicOn = true;
          }
        } else {
          this.context.scene.start(this.action);
        }
      }
    });

    return obj;
  }
}

export default Button;