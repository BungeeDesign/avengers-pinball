export default class Text {
  constructor(context, x, y, string, action, origin) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.text = string;
    this.action = action;
    this.origin = this.initOrigin(origin);
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

  initOrigin(origin) {
    if (typeof origin === "number") {
      return {
        x: origin,
        y: origin
      };
    } else if (typeof origin === "object") {
      return origin;
    } else {
      return {
        x: 0.5,
        y: 0.5
      };
    }
  }

  createButton() {
    let backgroundContainer = this.context.add.rectangle(this.x, this.y, 160, 60);
    backgroundContainer.setFillStyle('0x0072C0', 1);

    let obj = this.context.add.text(
      this.x - 26,
      this.y - 15,
      this.text,
      {
        font: `25px Gothic`,
        fill: "white",
        align: 'center'
      }
    );

    // obj.setOrigin(0.5);

    obj.setInteractive();
    obj.on('pointerover', () => { 
      this.context.sys.canvas.style.cursor = "pointer";
      backgroundContainer.setFillStyle('0xD12600', 1);
    });

    obj.on('pointerout', () => { 
      this.context.sys.canvas.style.cursor = "default";
      backgroundContainer.setFillStyle('0x0072C0', 1);
    });

    obj.on('pointerdown', () => { 
      this.context.scene.start(this.action);
    });

    return obj;
  }
}