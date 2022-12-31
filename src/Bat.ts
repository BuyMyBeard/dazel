import { Character } from "./Character";
import { SimpleAnimations } from "./Character";
import { IPoint, Graphics, Ticker } from "pixi.js";
import { Vect2D } from "./Vect2D";
import { Entity } from "./Entity";

export class Bat extends Character {
  public static animations : SimpleAnimations;
  static readonly HP = 3;
  static readonly SPEED = 0.5;
  private readonly idleTicker : Ticker = new Ticker();
  public displacement : Vect2D = new Vect2D(0,0);
  private tick : number = 0; 
  public update(): void {
    this.move(this.displacement);
    const playerPosition : Vect2D = new Vect2D(Entity.player.position.x, Entity.player.position.y);
    const distance = playerPosition.distance(this.position)
    distance < this.range ? this.state = "Walk" : this.state = "Idle";
    if (distance < this.aoeRange) {
      Entity.player.takeDamage();
    }
    if (this.state == "Walk") {
      this.move(Vect2D.unit(this.position, playerPosition).multiply(this.speed));
    }
  }
  public constructor(animations : SimpleAnimations, position : IPoint) {
    super(animations.Walk, position, undefined, animations);
    this.init();
    this.sprite.anchor.set(0.5, 0.5);
    this.filterInfo.loops = 1;
    this.animatedSprite.animationSpeed = 0.5;
    this.aoeRange = 20;
    this.range = 200; // aggro range
    this.speed = Bat.SPEED;
    this.hp = Bat.HP;
    this.state = "Idle";
    this.idleTicker.add(this.updateDisplacement, this);
    this.idleTicker.start();
    this.sprite.scale.set(3);
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
  updateDisplacement() { //callback
    this.tick++;
    this.displacement.x = Math.sin(this.tick / 30) * 0.75;
    this.displacement.y = Math.sin(this.tick / 20) *0.50;
  }
}