import { AnimatedSprite, IPoint, Sprite, Texture, Application} from "pixi.js";
import { Vect2D } from "./Vect2D";
import { InputReader, KeysPressed } from "./InputReader";

/** 
 * Represent anything that has a position and a sprite and is not bound to the tileset
*/
type State = "Attack" | "Walk" | "Idle" | "None";
type Direction = "Up" | "Down" | "Left" | "Right" | "None";
export abstract class Entity {
  protected state : State = "None";
  protected direction : Direction = "None";
  protected sprite : Sprite;
  

  public get position()  {
    return this.sprite.position;
  }
  public set position(pos : IPoint) {
    this.sprite.position = pos;
  }

  public move(movement : IPoint) {
    this.position = (movement as Vect2D).add(this.position);
  }

  constructor(app : Application, sprite : Sprite, position : IPoint) {
    this.sprite = sprite;
    this.position = position;
    app.stage.addChild(sprite);
  }


}
export abstract class Character extends Entity {
  protected hp : number;
  protected animations : Animations;
  protected speed : number;

  protected get animatedSprite() {
    return (this.sprite as AnimatedSprite);
  }

  constructor(app : Application, animations : Animations, position : IPoint, hp : number = 3, speed : number = 10) {
    super(app, new AnimatedSprite(animations.Idle.Down), position);
    this.hp = hp;
    this.speed = speed;
    this.animations = animations;
  }

  protected init() { // to make more flexible
    let anim = (this.sprite as AnimatedSprite);
    anim.play();
    anim.animationSpeed = 0.2;
    this.sprite.scale.set(4)
  }
  protected updateAnimation() {
    console.log(this.state);
    console.log(this.direction);
    const directionalAnimation : DirectionalAnimation | null = this.animations[this.state];
    if (directionalAnimation === null) {
      console.log("animation not valid");
      return;
    }
    const textures : Array<Texture> | null = directionalAnimation[this.direction];
    if (textures === null) {
      console.log("animation not valid");
      return;
    }
    this.animatedSprite.textures = textures;
    this.animatedSprite.play();
  }
}

export class Player extends Character {

  constructor(app : Application, animations : Animations, position : IPoint = new Vect2D, hp : number = 3, speed : number = 2) {
    super(app, animations, position, hp, speed)
    this.init();
  }
  
  public update() {

    let movement : Vect2D = Vect2D.zero();
    let direction : Direction = "None";
    switch (InputReader.currentInput) {
      case "Up":
        movement.add(Vect2D.up());
        direction = "Up";
        break;
      
      case "Down":
        movement.add(Vect2D.down());
        direction = "Down";
        break;

      case "Left":
        movement.add(Vect2D.left());
        direction = "Left";
        break;

      case "Right":
        movement.add(Vect2D.right());
        direction = "Right";
        break;

      case "Attack":
        //attack
        break;

      case "Interact":
        //interact
        break;
    }

    if (direction != "None" && direction != this.direction) {
      this.direction = direction;
      this.state = "Walk";
      this.updateAnimation();
    } else {
      this.state = "Idle";
    }

    //movement.adjustDiagonal();
    movement.multiply(this.speed);
    this.move(movement);
  }

}


// export type Animations = {
//   frontWalk : Array<Texture>,
//   frontAttack : Array<Texture>,
//   backWalk : Array<Texture>,
//   backAttack : Array<Texture>,
//   leftWalk : Array<Texture>,
//   leftAttack : Array<Texture>,
//   rightWalk : Array<Texture>,
//   rightAttack : Array<Texture>
// };

export type Animations = {
  Walk: DirectionalAnimation,
  Attack: DirectionalAnimation,
  Idle: DirectionalAnimation,
  None: null,
};

export type DirectionalAnimation = {
  Up: Array<Texture>,
  Down: Array<Texture>,
  Left: Array<Texture>,
  Right: Array<Texture>,
  None: null,
};
