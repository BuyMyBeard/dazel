import { IPoint, Sprite, Application, Graphics } from "pixi.js";
import { Vect2D } from "./Vect2D";
import { IPositionWatcher } from "./Map";
import { Player } from "./Player";
import { Map } from "./Map";

/** 
 * Represent anything that has a position and a sprite and is not bound to the tileset
*/
export type State = "Attack" | "Walk" | "Idle" | "None";
export type Direction = "Up" | "Down" | "Left" | "Right" | "None";
export abstract class Entity {
  public static pool: Array<Entity> = [];
  public static player: Player;
  protected state: State = "None";
  protected direction: Direction = "None";
  protected sprite: Sprite;
  protected subs: Array<IPositionWatcher> = [];

  protected anchorVisualisation?: Graphics = undefined;
  protected inDebug: boolean = false;

  public subscribe(watcher: IPositionWatcher) {
    this.subs.push(watcher);
  }

  /**
   * 
   * @param newPosition 
   * @returns true if collision detected, false otherwise
   */
  protected warnSubs(newPosition: IPoint): boolean {
    let collisionDetected: boolean = false;
    let activeSub : IPositionWatcher | null = null; 
    for (let sub of this.subs) {
      if (sub.active) {
        activeSub = sub;
        break;
      }
    }
    if (activeSub == null) {
      return false;
    }
    if (activeSub.warn(this, newPosition)) {
      collisionDetected = true;
    }
    
    return collisionDetected;
  }

  public get State() {
    return this.state;
  }
  public get Direction() {
    return this.direction;
  }

  public get position() {
    return this.sprite.position;
  }
  protected set position(pos: IPoint) {
    this.sprite.position = pos;
  }
  /**
   * 
   * @param movement 
   * @returns true if successful, false otherwise
   */
  public move(movement: IPoint): boolean {
    let newPosition = (movement as Vect2D).add(this.position);
    if (!this.warnSubs(newPosition)) {
      this.position = newPosition;
      return true;
    }
    return false;
  }

  constructor(sprite: Sprite, position: IPoint) {
    this.sprite = sprite;
    this.position = position;
    Map.app.stage.addChild(sprite);
    Entity.pool.push(this);
    if (this instanceof Player) {
      Entity.player = this;
    }
  }
  public moveToTop() {
    Map.app.stage.removeChild(this.sprite);
    Map.app.stage.addChild(this.sprite);
  }

  public debug() {
    const g: Graphics = new Graphics();
    g.beginFill(0x0000FF);
    g.drawCircle(0, 0, 1);
    g.endFill();
    g.alpha = 0.8;
    g.scale.set(0.5);
    this.anchorVisualisation = g;
    this.inDebug = true;
    this.sprite.addChild(g);
  }
}
