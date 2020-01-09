export default class Text {
  constructor(context, x, y, string, style, origin) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.text = string;
    this.style = this.setStyle(style);
    this.origin = this.initOrigin(origin);
    this.obj = this.createText();
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

  createText() {
    let obj = this.context.add.text(
      this.x,
      this.y,
      this.text,
      this.style
    );

    // obj.setOrigin(this.origin.x, this.origin.y);
    return obj;
  }

  destroy() {
    this.obj.destroy();

    this.obj = false;
  }

  // Setters
  setText(string) {
    this.text = string;
    this.obj.setText(string);
  }

  setX(x) {
    this.x = x;
    this.obj.setX(x);
  }

  setY(y) {
    this.y = y;
    this.obj.setY(y);
  }

  setOrigin(origin) {
    this.origin = this.initOrigin(origin);
    this.obj.setOrigin(origin);
  }

  setDepth(depth) {
    this.obj.setDepth(depth);
  }

  setScrollFactor(scrollX, scrollY) {
    this.obj.setScrollFactor(scrollX, scrollY);
  }
}