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


  public static zero() : Vect2D{
    return new Vect2D(0, 0);
  }
  public static up() : Vect2D {
    return new Vect2D(0, -1);
  }
  public static down() : Vect2D {
    return new Vect2D(0, 1);
  }
  public static left() : Vect2D {
    return new Vect2D(-1, 0);
  }
  public static right() : Vect2D {
    return new Vect2D(1, 0);
  }

  public set(x : number = 0, y : number = x) {
    this.x = x;
    this.y = y;
  }

  public equals(vect2D : IPoint) : boolean {
    return this.x === vect2D.x && this.y === vect2D.y;
  }

  public add(vect2D : IPoint) : IPoint {
    this.x += vect2D.x;
    this.y += vect2D.y;
    return this;
  }

  public static add(vec1 : IPoint, vec2 : IPoint) {
    return new Vect2D(vec1.x + vec2.x, vec1.y + vec2.y);
  }

  public adjustDiagonal() {
    if (this.x == 0 || this.y == 0)
      return;
    const SIN45DEGREE = 0.70710678118654752440084436210485; //because divisions and roots are bad on cpu
    this.x *= SIN45DEGREE;
    this.y *= SIN45DEGREE;
  }
  
  public multiply(scalar : number) : IPoint {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }
}