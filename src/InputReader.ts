export class InputReader {
  private static keysPressed : any = {}; //à clear à chaque loop cycle. Permet de savoir ce qui a été appuyé entre 2 frames;

  public static initialize() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  public static getKeysPressed() : any {
    let keys = this.keysPressed;
    this.keysPressed = {};
    return keys;
  }

  public static onKeyDown(e : any) {
    switch (e.key) {
      case 'w':
      case 'ArrowUp':
        this.keysPressed[KeyInput.Up] = true;
        break;
  
      case 'a':
      case 'ArrowLeft':
        this.keysPressed[KeyInput.Left] = true;
        break;
  
      case 'd':
      case 'ArrowRight':
        this.keysPressed[KeyInput.Right] = true;
        break;
  
      case 's':
      case 'ArrowDown':
        this.keysPressed[KeyInput.Down] = true;
        break;
  
      case 'p':
      case 'Escape':
        this.keysPressed[KeyInput.Pause] = true;
        break;
  
      case 'e':
      case ' ':
        this.keysPressed[KeyInput.Attack] = true;
        break;
  
      default:
        break;
    }
  }
  
  
  
}
export const InputTypes = (type : InType) => KeyInput[type];

export type InType = "Up" | "Down" | "Left" | "Right" | "Attack" | "Interact" | "Pause";

export enum KeyInput {
  Up = "Up", 
  Down = "Down", 
  Left = "Left", 
  Right = "Right", 
  Attack = "Attack", 
  Interact = "Interact", 
  Pause = "Pause",
}