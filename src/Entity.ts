import { AnimatedSprite, IPoint, Sprite, Texture, Application} from "pixi.js";
import { Vect2D } from "./Vect2D";
import { InputReader } from "./InputReader";
import { IPositionWatcher, CardinalDirection } from "./Map";
import * as C from "./Constants";

/** 
 * Represent anything that has a position and a sprite and is not bound to the tileset
*/
type State = "Attack" | "Walk" | "Idle" | "None";
type Direction = "Up" | "Down" | "Left" | "Right" | "None";
export abstract class Entity {
  protected state : State = "None";
  protected direction : Direction = "None";
  protected sprite : Sprite;
  protected subs : Array<IPositionWatcher> = [];

  public subscribe(watcher : IPositionWatcher) {
    this.subs.push(watcher);
  }
  protected warnSubs(newPosition : IPoint) : boolean {
    let collisionDetected : boolean = false;
    for (let sub of this.subs) {
      if (sub.warn(this, newPosition)) {
        collisionDetected = true;
      }
    }
    return collisionDetected;
  }

  public get State() {
    return this.state;
  }
  public get Direction() {
    return this.direction;
  }

  public get position()  {
    return this.sprite.position;
  }
  protected set position(pos : IPoint) {
    this.sprite.position = pos;
  }

  public move(movement : IPoint) {
    let newPosition = (movement as Vect2D).add(this.position);
    if (!this.warnSubs(newPosition)) {
      this.position = newPosition;
    }

    
  }

  constructor(app : Application, sprite : Sprite, position : IPoint) {
    this.sprite = sprite;
    this.position = position;
    app.stage.addChild(sprite);
  }
  public moveToTop(app : Application) {
    app.stage.removeChild(this.sprite);
    app.stage.addChild(this.sprite);
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
    const directionalAnimation : DirectionalAnimation | null = this.animations[this.state];
    if (directionalAnimation === null) {
      console.log(`animation not valid \n state: ${this.state}  \n direction: ${this.direction}`);
      return;
    }
    const textures : Array<Texture> | null = directionalAnimation[this.direction];
    if (textures === null) {
      console.log(`animation not valid \n state: ${this.state}  \n direction: ${this.direction}`);
      return;
    }
    this.animatedSprite.textures = textures;
    if (this.state == "Attack") {
      this.animatedSprite.loop = false;
      this.animatedSprite.onComplete = this.onAttackEnd.bind(this);
    }
    this.animatedSprite.play();

  }
  protected Attack() {
    this.state = "Attack";
    this.updateAnimation();
  }

  protected onAttackEnd() {
    this.state = "Idle";
    this.animatedSprite.loop = true;
    this.animatedSprite.onComplete = undefined;
    this.updateAnimation();
  }
}

export class Player extends Character {
  
  changeMap(app : Application, cardinalDirection : CardinalDirection) {
    this.moveToTop(app);
    switch (cardinalDirection) {
      case "East":
        this.position.x = 10;
        break;

      case "West":
        this.position.x = C.STAGE_WIDTH - 10;
        break;

      case "North":
        this.position.y = C.STAGE_HEIGHT - 5;
        break;

      case "South":
        this.position.y = 30;
    }
  }
  
  constructor(app : Application, animations : Animations, position : IPoint = new Vect2D, hp : number = 3, speed : number = 2) {
    super(app, animations, position, hp, speed)
    this.init();
    this.sprite.anchor.set(0.5, 1);
  }
  
  public update() {
    if (this.state == "Attack") {
      return;
    }

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
        this.Attack();
        break;
        
      case "Interact":
        //interact
        break;
      }
      if (this.state == "Walk" && direction == "None") {
        this.state = "Idle";
        this.updateAnimation();
      } else if ((direction != this.direction && direction != "None") || (direction == this.direction && this.state == "Idle")) {
        this.direction = direction;
        this.state = "Walk";
        this.updateAnimation();
      }
      
      movement.multiply(this.speed);
      this.move(movement);
    }
    
    protected override Attack(): void {
      super.Attack();
      
    }
  }

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
