import { AnimatedSprite, IPoint, Sprite, Texture, Application} from "pixi.js";
import { Vect2D } from "./Vect2D";
import { IPositionWatcher, CardinalDirection } from "./Map";

/** 
 * Represent anything that has a position and a sprite and is not bound to the tileset
*/
export type State = "Attack" | "Walk" | "Idle" | "None";
export type Direction = "Up" | "Down" | "Left" | "Right" | "None";
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
