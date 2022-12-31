import { IPoint, Application } from "pixi.js";
import { Character, SimpleAnimations } from "./Character"

export class Slime extends Character {
  private static readonly SPEED = 3;
  private static readonly HP = 3;
  public constructor(app : Application, animations : SimpleAnimations, position : IPoint) {
    super(app, animations.Walk, position, Slime.HP, Slime.SPEED, undefined, animations);
    this.init();
    this.sprite.anchor.set(0.5, 0.5);
  }

  public update(): void {
    
  }
}