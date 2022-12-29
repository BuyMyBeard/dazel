import type { IPoint, IPointData } from 'pixi.js'

export class Vect2D implements IPoint {
  public x : number;
  public y : number;
  
  public constructor (x : number = 0, y : number = x) {
    this.x = x;
    this.y = y;
  }
  copyFrom(p: IPointData): this {
    this.x = p.x;
    this.y = p.y
    return this;
  }
  copyTo<T extends IPoint>(p: T): T {
    p.x = this.x;
    p.y = this.y;
    return p;
  }


  public static zero() {
    return new Vect2D(0, 0);
  }

  public set(x : number = 0, y : number = x) {
    this.x = x;
    this.y = y;
  }

  public equals(vect2D : Vect2D) : boolean {
    return this.x === vect2D.x && this.y === vect2D.y;
  }
}