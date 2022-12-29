import { AnimatedSprite, IPoint, Sprite, Texture} from "pixi.js";
import { Vect2D } from "./Vect2D";
import { KeyInput } from "./InputReader";

/** 
 * Represent anything that has a position and a sprite and is not bound to the tileset
*/
export abstract class Entity {
  protected sprite : Sprite;

  /**
   * 
   * @param sprite can be AnimatedSprite since it extends Sprite
   * @param position position to apply to the sprite
   */
  constructor(sprite : Sprite, position : IPoint) {
    this.sprite = sprite;
    this.sprite.position = position;
  }

  public get position() {
    return this.sprite.position;
  }
  public set position(pos : IPoint) {
    this.sprite.position.set(pos.x, pos.y);
  }

}
export abstract class Character extends Entity {
  protected hp : number;
  protected animations : Animations;

  constructor(animations : Animations, position : IPoint, hp : number) {
    super(new AnimatedSprite(animations.frontWalk), position);
    this.hp = hp;
    this.animations = animations;
  }
}

export class Player extends Character {

  constructor(animations : Animations, position : IPoint = new Vect2D, hp : number = 3) {
    super(animations, position, hp)
  }
  
  public update(keysPressed : any) {
    let input = Object.keys(keysPressed);
    if (input.length === 0) return

    if (input.includes(KeyInput.Attack))
      console.log("attack!");
    
    if (input.includes(KeyInput.Down))
      console.log("MOve down!");
    
  }
}


export type Animations = {
  frontWalk : Array<Texture>,
  frontAttack : Array<Texture>,
};