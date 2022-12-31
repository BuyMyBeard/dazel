import { Entity } from "./Entity";
import { AnimatedSprite, Application, IPoint, Texture } from "pixi.js";

export abstract class Character extends Entity {
  protected hp : number;
  protected animations : Animations | undefined;
  protected simpleAnimations : SimpleAnimations | undefined;
  protected speed : number;

  protected get animatedSprite() {
    return (this.sprite as AnimatedSprite);
  }

  constructor(app : Application, animations : Animations | undefined = undefined, simpleAnimations : SimpleAnimations | undefined = undefined,
     position : IPoint, hp : number = 3, speed : number = 10, animation : Array<Texture>) {
    super(app, new AnimatedSprite(animation), position);
    this.hp = hp;
    this.speed = speed;
    this.animations = animations;
  }

  protected init() { // to make more flexible
    let anim = (this.sprite as AnimatedSprite);
    anim.play()
    anim.animationSpeed = 0.2;
    this.sprite.scale.set(4)
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