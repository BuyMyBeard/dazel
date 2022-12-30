export class KeysPressed {
  public Up : Boolean = false;
  public Down : Boolean = false;
  public Left : Boolean = false;
  public Right : Boolean = false;
  public Attack : Boolean = false;
  public Interact : Boolean = false;
  public Pause : Boolean = false;
  public get None() {
    return !this.any();
  }
  

  public reset() {
    Object.values(this).some(val => val = false)
  }
  public any() : Boolean {
    return this.Up || this.Down || this.Left || this.Right || this.Attack || this.Interact || this.Pause;
  }
}

export type inputTypes = "Up" | "Down" | "Left" | "Right" | "Attack" | "Interact" | "Pause" | "None" ;


export class InputReader {
 
  public static keysPressed : KeysPressed = new KeysPressed(); //à clear à chaque loop cycle. Permet de savoir ce qui a été appuyé entre 2 frames;

  public static initialize() {
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
  }

  public static currentInput : inputTypes = 'None';

  public static onKeyDown(e : any) {
    let inputType : inputTypes = 'None';
    switch (e.key) {
      case 'w':
      case 'ArrowUp':
        inputType = "Up";
        break;
  
      case 'a':
      case 'ArrowLeft':
        inputType = "Left";
        break;
  
      case 'd':
      case 'ArrowRight':
        inputType = "Right";
        break;
  
      case 's':
      case 'ArrowDown':
        inputType = "Down";
        break;
  
      case 'p':
      case 'Escape':
        inputType = "Pause";
        break;
  
      case 'e':
      case ' ':
        inputType = "Attack";
        break; //add interact
  
      default:
        return;
      
    }
    if (!InputReader.keysPressed[inputType]) {
      InputReader.currentInput = inputType;
      InputReader.keysPressed[inputType] = true;
    }
    
  }
  public static onKeyUp(e : any) {
    let inputType : inputTypes = 'None';
    switch (e.key) {
      case 'w':
      case 'ArrowUp':
        inputType = "Up";
        break;
  
      case 'a':
      case 'ArrowLeft':
        inputType = "Left";
        break;
  
      case 'd':
      case 'ArrowRight':
        inputType = "Right";
        break;
  
      case 's':
      case 'ArrowDown':
        inputType = "Down";
        break;
  
      case 'p':
      case 'Escape':
        inputType = "Pause";
        break;
  
      case 'e':
      case ' ':
        inputType = "Attack";
        break; //add interact
  
      default:
        return;
    }
    if (inputType === InputReader.currentInput) {
      InputReader.currentInput = 'None';
    }
    if (InputReader.keysPressed[inputType]) {
      InputReader.keysPressed[inputType] = false;
    }
  }
}
