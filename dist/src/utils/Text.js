class Text {
  constructor(context, x, y, string, style) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.text = string;
    this.style = this.setStyle(style);
    this.obj = this.createText();
  }

  setStyle(styleType) {
    // Base Style
    let style = {
      font: `20px Gothic`,
      color: "#fff"
    };
    
    switch (styleType.toLowerCase()) {
      case "loading":
        style.font = `20px Gothic`;
        break;
      case "score":
        style.font = `20px Gothic`;
        break;
      case "title":
        style.font = `35px Gothic`;
        break;
    }

    return style;
  }

  createText() {
    let obj = this.context.add.text(
      this.x,
      this.y,
      this.text,
      this.style
    );

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

export default Text;