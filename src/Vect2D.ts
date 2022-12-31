import type { IPoint, IPointData } from 'pixi.js'
import { Direction } from './Entity';

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

  public get norm() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  public static from(p : IPoint) {
    return new Vect2D(p.x, p.y);
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

  public add(vect2D : IPoint) : Vect2D {
    this.x += vect2D.x;
    this.y += vect2D.y;
    return this;
  }

  public static add(vec1 : IPoint, vec2 : IPoint) : Vect2D {
    return new Vect2D(vec1.x + vec2.x, vec1.y + vec2.y);
  }

  public adjustDiagonal() {
    if (this.x == 0 || this.y == 0)
      return;
    const SIN45DEGREE = 0.70710678118654752440084436210485; //because divisions and roots are bad on cpu
    this.x *= SIN45DEGREE;
    this.y *= SIN45DEGREE;
  }
  
  public multiply(scalar : number) : Vect2D {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  public static multiply(vect : IPoint, scalar : number) : Vect2D {
    return new Vect2D(vect.x * scalar, vect.y * scalar);
  }

  public distance(point : IPoint) : number {
    return Math.sqrt((point.x - this.x) ** 2 + (point.y - this.y) ** 2);
  }

  public static fromDirection(direction : Direction) : Vect2D {
    switch (direction) {
      case "Down":
        return Vect2D.down();

      case "Up":
        return Vect2D.up();

      case "Left":
        return Vect2D.left();

      case "Right":
        return Vect2D.right();

      case "None":
        return Vect2D.zero();
    }
  }
  public static ToDirection(vect : IPoint) : Direction {
    if (Vect2D.up().equals(vect)) {
      return "Up";
    } else if (Vect2D.down().equals(vect)) {
      return "Down";
    } else if (Vect2D.left().equals(vect)) {
      return "Left";
    } else if (Vect2D.right().equals(vect)) {
      return "Right"
    } else {
      return "None";
    }
  }

  public static unit(p1 : IPoint, p2 : IPoint) {
    const delta = new Vect2D(p2.x - p1.x, p2.y - p1.y);
    return delta.multiply(1 / delta.norm);
  }
}