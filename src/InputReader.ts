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
  
  public getAnyTrue() : inputTypes | boolean {
    if (this.None) {
      return false;
    }
    //return Object.keys(this).find(this => this.val)
    return true;
  }

  public reset() {
    Object.values(this).some(val => val = false)
  }
  public any() : Boolean {
    return Object.values(this).some(val => val);
  }
}

export type inputTypes = "Up" | "Down" | "Left" | "Right" | "Attack" | "Interact" | "Pause" | "None" ;


export class InputReader {
 
  public static keysPressed : KeysPressed = new KeysPressed(); //à clear à chaque loop cycle. Permet de savoir ce qui a été appuyé entre 2 frames;

  public static initialize() {
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
  }

  public static get currentInput() : inputTypes {
    if (this.inputStack.length == 0) {
      return 'None'
    }
    return this.inputStack[0];
  }
  private static inputStack : Array<inputTypes> = [];

  public static onKeyDown(e : any) {
    let inputType : inputTypes = InputReader.keyToInputType(e.key);
    if (inputType != 'None' && InputReader.inputStack.indexOf(inputType) == -1) {
      InputReader.inputStack.unshift(inputType);
    }
  }

  public static onKeyUp(e : any) {
    let inputType : inputTypes = InputReader.keyToInputType(e.key);
    if (inputType != 'None') {
      InputReader.inputStack = InputReader.inputStack.filter(input => input != inputType);
    }
  }

  private static keyToInputType(key : string) : inputTypes {
    let inputType : inputTypes = 'None';
    switch (key) {
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
  
      case 'Enter':
      case ' ':
        inputType = "Attack";
        break;

      case 'e':
      case 'Control':
        inputType = "Interact";
        break;
  
      default:
        inputType = "None";
        break;
    }
    return inputType;
  }
}
