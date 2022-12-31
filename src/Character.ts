import { Entity } from "./Entity";
import { AnimatedSprite, Application, Circle, Graphics, IPoint, Texture, Ticker } from "pixi.js";
import { ColorOverlayFilter } from "@pixi/filter-color-overlay";
import { Map } from "./Map";

export abstract class Character extends Entity {
  protected hp : number;
  protected animations : Animations | undefined;
  protected simpleAnimations : SimpleAnimations | undefined;
  protected speed : number;
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

  constructor(app : Application, animation : Array<Texture>, position : IPoint, hp : number = 3, speed : number = 10, 
    animations : Animations | undefined = undefined, simpleAnimations : SimpleAnimations | undefined = undefined) {
    super(app, new AnimatedSprite(animation), position);
    this.hp = hp;
    this.speed = speed;
    this.animations = animations;
  }

  protected init(scale : number = 4) { // to make more flexible
    let anim = (this.sprite as AnimatedSprite);
    anim.play()
    anim.animationSpeed = 0.2;
    this.sprite.scale.set(scale);
    this.sprite.filters = [this.damageFilter];
    this.filterInfo.ticker.add(this.updateFilter, this);
  }
  protected updateAnimation()  {
    if (this.animations == undefined)
      return;
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
  public static isSimpleAnimations(animations : Animations | SimpleAnimations) {
    return (Object.keys(animations).length < 4);
  }
  public abstract update() : void;

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

export type Animations = {
  Walk: DirectionalAnimation,
  Attack: DirectionalAnimation,
  Idle: DirectionalAnimation,
  None: null,
};

export type SimpleAnimations = {
  Walk: Array<Texture>
}

export type DirectionalAnimation = {
  Up: Array<Texture>,
  Down: Array<Texture>,
  Left: Array<Texture>,
  Right: Array<Texture>,
  None: null,
};

