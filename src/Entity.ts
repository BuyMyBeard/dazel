import { AnimatedSprite, IPoint, Sprite, Texture, Application} from "pixi.js";
import { Vect2D } from "./Vect2D";
import { KeysPressed } from "./InputReader";

/** 
 * Represent anything that has a position and a sprite and is not bound to the tileset
*/
type State = "frontWalk" | "frontAttack" | "none";
export abstract class Entity {
  protected state : State = "none";
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

  constructor(sprite : Sprite, position : IPoint) {
    this.sprite = sprite;
    this.position = position;
  }

  public init(app : Application) {
    app.stage.addChild(this.sprite);
    this.state = "frontWalk";
  }
}
export abstract class Character extends Entity {
  protected hp : number;
  protected animations : Animations;
  protected speed : number;

  constructor(animations : Animations, position : IPoint, hp : number = 3, speed : number = 10) {
    super(new AnimatedSprite(animations.frontWalk), position);
    this.hp = hp;
    this.speed = speed;
    this.animations = animations;
  }

  public override init(app : Application) {
    super.init(app);
    let anim = (this.sprite as AnimatedSprite);
    anim.play();
    anim.animationSpeed = 0.2;
    this.sprite.scale.set(4)
  }
}

export class Player extends Character {

  constructor(animations : Animations, position : IPoint = new Vect2D, hp : number = 3, speed : number = 2) {
    super(animations, position, hp, speed)
  }
  
  public update(keysPressed : KeysPressed) {

    let movement : Vect2D = Vect2D.zero();
    

    if (keysPressed.Down) {
      movement.add(Vect2D.down());
    }
    if (keysPressed.Up) {
      movement.add(Vect2D.up());
    }
    if (keysPressed.Left) {
      movement.add(Vect2D.left());
    }
    if (keysPressed.Right) {
      movement.add(Vect2D.right());
    }
    movement.adjustDiagonal();
    movement.multiply(this.speed);
    this.move(movement);


    if (keysPressed.Attack && this.state !== "frontAttack") {
      (this.sprite as AnimatedSprite).textures = this.animations.frontAttack;
      this.state = "frontAttack";
    }
    if (keysPressed.Down) {
      (this.sprite as AnimatedSprite).textures = this.animations.frontWalk;
      this.state = "frontWalk";
    }
    (this.sprite as AnimatedSprite).play();
  }
}


export type Animations = {
  frontWalk : Array<Texture>,
  frontAttack : Array<Texture>,
};