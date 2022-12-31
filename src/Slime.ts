import { IPoint, Application, Graphics } from "pixi.js";
import { Character, SimpleAnimations } from "./Character"
import { Entity } from "./Entity";
import { Map } from "./Map";
import { Vect2D } from "./Vect2D";

export class Slime extends Character {
  private static readonly SPEED = 3;
  private static readonly HP = 3;
  public constructor(app : Application, animations : SimpleAnimations, position : IPoint) {
    super(app, animations.Walk, position, Slime.HP, Slime.SPEED, undefined, animations);
    this.init();
    this.sprite.anchor.set(0.5, 0.5);
    this.filterInfo.loops = 1;
    this.range = 0;
    this.aoeRange = 20;

  }

  public update(): void {
    let pos = new Vect2D(this.position.x, this.position.y);
    if (pos.distance(Entity.player.position) < this.aoeRange) {
      Entity.player.takeDamage();
    }
  }

  public override debug() {
    super.debug();
    const g : Graphics = new Graphics();
    g.beginFill(0x444444);
    g.drawCircle(this.position.x, this.position.y, this.aoeRange);
    g.endFill();
    g.alpha = 0.4;
    Map.app.stage.addChild(g);
    this.attackHitboxVisualisation = g;
  }
}