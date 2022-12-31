import { IPoint, Application, Graphics } from "pixi.js";
import { Character, SimpleAnimations } from "./Character"
import { Direction, Entity } from "./Entity";
import { Vect2D } from "./Vect2D";
import * as C from "./Constants";

export class Slime extends Character {
  private static readonly SPEED = 1;
  private static readonly HP = 3;
  public constructor(animations : SimpleAnimations, position : IPoint, initialDirection : Direction) {
    super(animations.Walk, position, undefined, animations);
    this.init();
    this.sprite.anchor.set(0.5, 0.5);
    this.filterInfo.loops = 1;
    this.aoeRange = 20;
    this.speed = Slime.SPEED;
    this.hp = Slime.HP;
    this.direction = initialDirection;
    this.state = "Walk";
  }

  public update(): void {
    const baseVect = Vect2D.fromDirection(this.direction);
    if (!this.move(Vect2D.multiply(baseVect, this.speed))) {
      baseVect.multiply(-1);
      this.direction = Vect2D.ToDirection(baseVect);
      this.move(baseVect.multiply(this.speed));
    }
    let pos = new Vect2D(this.position.x, this.position.y);
    if (pos.distance(Entity.player.position) < this.aoeRange) {
      Entity.player.takeDamage();
    }
  }

  public override debug() {
    super.debug();
    const g : Graphics = new Graphics();
    g.beginFill(0x444444);
    g.drawCircle(0,0, this.aoeRange);
    g.endFill();
    g.alpha = 0.4;
    g.scale.set(0.25)
    this.sprite.addChild(g);
    this.attackHitboxVisualisation = g;
  }
}