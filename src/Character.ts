import { Entity } from "./Entity";
import { AnimatedSprite, Application, Circle, Graphics, IPoint, Texture, Ticker } from "pixi.js";
import { ColorOverlayFilter } from "@pixi/filter-color-overlay";

export abstract class Character extends Entity {
  protected hp : number = 3;
  protected speed : number = 10;
  private readonly damageFilter = new ColorOverlayFilter(0xFF0000, 0);
  protected damaged : boolean = false;
  protected range : number = 1;
  protected aoeRange : number = 0;
  protected attackHitboxVisualisation? : Graphics = undefined;
  protected readonly filterInfo = {
    filter : this.damageFilter,
    loop : 0,
    grow : true,
    rate : 0.08,
    ticker : new Ticker(),
    loops : 5,
  };

  protected get animatedSprite() {
    return (this.sprite as AnimatedSprite);
  }

  constructor(animation : Array<Texture>, position : IPoint) {
    super(new AnimatedSprite(animation), position);
  }

  protected init(scale : number = 4) { // to make more flexible
    let anim = (this.sprite as AnimatedSprite);
    anim.play();
    anim.animationSpeed = 0.2;
    this.sprite.scale.set(scale);
    this.sprite.filters = [this.damageFilter];
    this.filterInfo.ticker.add(this.updateFilter, this);
  }


  public takeDamage() {
    if (this.damaged) {
      return;
    }
    this.filterInfo.loop = 0;
    this.filterInfo.ticker.start();
  }
  private updateFilter() { //callback method
    this.filterInfo.filter.alpha += (this.filterInfo.grow ? this.filterInfo.rate : -this.filterInfo.rate);
    if (this.filterInfo.filter.alpha >= 0.60) {
      this.filterInfo.grow = false;
    } else if (this.filterInfo.filter.alpha <= 0) {
      this.filterInfo.grow = true;
      this.filterInfo.loop++;
    }
    if (this.filterInfo.loop >= this.filterInfo.loops) {
      this.filterInfo.ticker.stop();
      this.damaged = false;
    }
  }
}




