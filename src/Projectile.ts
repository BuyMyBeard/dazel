import { Sprite, Graphics, IPoint, Texture } from "pixi.js";
import { Direction, Entity, State } from "./Entity";
import { Map } from "./Map";
import { Player } from "./Player";
import { Vect2D } from "./Vect2D";

export class Projectile extends Entity {
  public static readonly TEXTURE : Texture;
  public static readonly SPEED : number = 1;
  public static readonly AOERANGE : number = 15;
  private movementVect : Vect2D;
  private reflected : boolean = false;

  takeDamage(): void {
    if (this.reflected) {
      return;
    }
    this.reflected = true;
    this.movementVect.multiply(-1);
  }
  public update(): void {
    this.position = Vect2D.multiply(this.movementVect, Projectile.SPEED).add(this.position);
    if (Map.CurrentMap.isOutsideBoundary(this.position)) {
      this.destroy();
      return;
    }
    for (const entity of Entity.pool) {
      if (this.reflected && !(entity instanceof Player) || !this.reflected && entity instanceof Player) {
        if (this.isColliding(entity)) {
          entity.takeDamage();
          break;
        }
      }
    }
  }
  isColliding(entity : Entity) {
    return Vect2D.distance(entity.position, this.position) <= Projectile.AOERANGE;
  }

  /**
   * 
   * @param startPosition starting position of the projectile
   * @param targetPosition position the projectile is fired at
   */
  public constructor(startPosition : Vect2D, targetPosition : Vect2D) {
    super(new Sprite(Projectile.TEXTURE), startPosition);
    this.movementVect = Vect2D.unit(startPosition, targetPosition);
  }

}