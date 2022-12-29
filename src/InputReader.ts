export class KeysPressed {
  public Up : Boolean = false;
  public Down : Boolean = false;
  public Left : Boolean = false;
  public Right : Boolean = false;
  public Attack : Boolean = false;
  public Interact : Boolean = false;
  public Pause : Boolean = false;

  public reset() {
    this.Up = false;
    this.Down = false;
    this.Left = false;
    this.Right = false;
    this.Attack = false;
    this.Interact = false;
    this.Pause = false;
  }
  public any() : Boolean {
    return this.Up || this.Down || this.Left || this.Right || this.Attack || this.Interact || this.Pause;
  }
}

export class InputReader {

    
  public static keysPressed : KeysPressed = new KeysPressed(); //à clear à chaque loop cycle. Permet de savoir ce qui a été appuyé entre 2 frames;

  public static initialize() {
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
  }

  public static onKeyDown(e : any) {
    switch (e.key) {
      case 'w':
      case 'ArrowUp':
        InputReader.keysPressed.Up = true;
        break;
  
      case 'a':
      case 'ArrowLeft':
        InputReader.keysPressed.Left = true;
        break;
  
      case 'd':
      case 'ArrowRight':
        InputReader.keysPressed.Right = true;
        break;
  
      case 's':
      case 'ArrowDown':
        InputReader.keysPressed.Down = true;
        break;
  
      case 'p':
      case 'Escape':
        InputReader.keysPressed.Pause = true;
        break;
  
      case 'e':
      case ' ':
        InputReader.keysPressed.Attack = true;
        break;
  
      default:
        break;
    }
  }
  public static onKeyUp(e : any) {
    switch (e.key) {
      case 'w':
      case 'ArrowUp':
        InputReader.keysPressed.Up = false;
        break;
  
      case 'a':
      case 'ArrowLeft':
        InputReader.keysPressed.Left = false;
        break;
  
      case 'd':
      case 'ArrowRight':
        InputReader.keysPressed.Right = false;
        break;
  
      case 's':
      case 'ArrowDown':
        InputReader.keysPressed.Down = false;
        break;
  
      case 'p':
      case 'Escape':
        InputReader.keysPressed.Pause = false;
        break;
  
      case 'e':
      case ' ':
        InputReader.keysPressed.Attack = false;
        break;
  
      default:
        break;
    }
  }
}
