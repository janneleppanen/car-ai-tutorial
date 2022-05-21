class Controls {
  public forward: boolean = false;
  public left: boolean = false;
  public right: boolean = false;
  public reverse: boolean = false;

  constructor() {
    this.addKeyboardListeners();
  }

  private addKeyboardListeners = () => {
    document.onkeydown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          this.forward = true;
          break;
        case "ArrowLeft":
          this.left = true;
          break;
        case "ArrowRight":
          this.right = true;
          break;
        case "ArrowDown":
          this.reverse = true;
          break;
        default:
          break;
      }
    };

    document.onkeyup = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          this.forward = false;
          break;
        case "ArrowLeft":
          this.left = false;
          break;
        case "ArrowRight":
          this.right = false;
          break;
        case "ArrowDown":
          this.reverse = false;
          break;
        default:
          break;
      }
    };
  };
}

export default Controls;
