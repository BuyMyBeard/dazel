import { Application, Sprite, IPoint } from "pixi.js";
import * as C from "./Constants";
import { Entity } from "./Entity";
import { Player } from "./Player";
import { Vect2D } from "./Vect2D";

export type CardinalDirection = "North" | "South" | "East" | "West";
export type MapNeighbors = {
  [key in CardinalDirection]?: Map
}
export type MapNetwork = {
  [key: string]: MapNeighbors
}
export class Map implements IPositionWatcher {
  private tileMap: number[][];
  private collisionMap: CollisionMap = new CollisionMap;
  public collisionSpecifications: Array<[number, TypeCollision]> = [];
  private neighbors: MapNeighbors | undefined;
  public readonly width: number;
  public readonly height: number;
  private readonly tileset: String;
  private active: boolean = false;

  public static app: Application;

  public North: Map | null = null;
  public South: Map | null = null;
  public East: Map | null = null;
  public West: Map | null = null;

  /**
   * 
   * @param map loaded asset
   * @param tileset name of tileset in assets (without the extension)
   */
  public constructor(mapFile: string, tileset: String) {
    this.tileMap = this.generateTileMap(mapFile)
    this.width = this.tileMap[0].length;
    this.height = this.tileMap.length;
    this.tileset = tileset;
  }
  /**
   * 
   * @param entity entity to check position of
   * @returns true if collision registered, false otherwise
   */
  warn(entity: Entity, newPosition: IPoint): boolean {
    if (!this.active) {
      return false;
    }
    if (this.collisionMap.checkCollision(newPosition)) {
      return true;
    }
    let directionToLoad: CardinalDirection | undefined;
    if (this.neighbors !== undefined) {
      if (newPosition.x < 0) {
        directionToLoad = "West";
      } else if (newPosition.x > C.STAGE_WIDTH) {
        directionToLoad = "East";
      } else if (newPosition.y < 0) {
        directionToLoad = "North";
      } else if (newPosition.y > C.STAGE_HEIGHT) {
        directionToLoad = "South"
      } else {
        return false;
      }
      if (!(entity instanceof Player)) {
        return true;
      }
      console.log(this.neighbors[directionToLoad]);
      (entity as Player).changeMap(directionToLoad);
      this.loadNext(this.neighbors[directionToLoad]);
    }
    return true; //position will already get updated by changeMap method
  }
  private loadNext(map: Map | undefined) {
    if (map === null || map === undefined) {
      throw "map not defined";
      // return;
    }
    this.active = false;
    let content = Map.app.stage.removeChildren();
    map.draw(this.collisionSpecifications);
  }
  public subscribeNeighbors(mapNeighbors: MapNeighbors) {
    this.neighbors = mapNeighbors;
    console.log(mapNeighbors);
  }
  private generateTileMap(mapFile: string): number[][] {

    let lines: any = mapFile.split("\n");
    let tileMap: number[][] = Array();

    for (let s of lines) {
      let items: Array<string> = s.split(',');
      let numbers: Array<number> = new Array();
      for (let item of items) {
        numbers.push(parseInt(item));
      }
      tileMap.push(numbers);
    }

    let width: number = tileMap[0].length;
    for (let row of tileMap) {
      if (row.length !== width) {
        throw 'Invalid map file, not all rows have the same width';
      }
    }
    return tileMap;
  }

  public displayDebug() {
    console.table(this.tileMap);
    console.log("width : " + this.width);
    console.log("height : " + this.height);
  }

  public draw(collisionSpecifications: Array<[number, TypeCollision]> = []) {
    if (collisionSpecifications.length != 0) {
      this.collisionSpecifications = collisionSpecifications;
    }
    let fillCollisionMap: boolean = this.collisionMap.empty() && this.collisionSpecifications.length != 0;
    this.active = true;
    for (let i = 0; i < this.tileMap.length; i++) {
      for (let j = 0; j < this.tileMap[0].length; j++) {
        let id = this.tileMap[i][j];
        const sprite: Sprite = Sprite.from(this.tileset + id.toString() + ".png");
        const pos = new Vect2D(C.TILE_RESOLUTION * C.SCALE_MULTIPLIER * j, C.TILE_RESOLUTION * C.SCALE_MULTIPLIER * i);
        sprite.position = pos;
        sprite.scale.set(C.SCALE_MULTIPLIER);
        Map.app.stage.addChild(sprite);
        if (fillCollisionMap) {
          for (let tuple of collisionSpecifications) {
            if (id == tuple[0]) {
              this.collisionMap.addSolidTile(pos, tuple[1]);
              break;
            }
          }
        }
      }
    }
  }

}

export interface IPositionWatcher {
  warn(entity: Entity, newPosition: IPoint): boolean;
}

export type TypeCollision = "Square" | "TopLeftTriangle" | "TopRightTriangle" | "BottomLeftTriangle" | "BottomRightTriangle";
class CollisionMap {
  public empty(): boolean {
    return this.solidTiles.length == 0;
  }
  public solidTiles: Array<[IPoint, TypeCollision]> = [];

  public addSolidTile(position: IPoint, typeCollision: TypeCollision) {
    this.solidTiles.push([position, typeCollision]);
  }

  public checkCollision(position: IPoint): boolean {
    for (const tile of this.solidTiles) {
      if (this.isInsideTile(position, tile)) {
        return true;
      }
    }
    return false;
  }

  public isInsideTile(position: IPoint, tile: [IPoint, TypeCollision]): boolean {
    const x0y0 = tile[0];
    const x1y0 = Vect2D.add(tile[0], new Vect2D(C.REAL_TILE_RESOLUTION, 0));
    const x0y1 = Vect2D.add(tile[0], new Vect2D(0, C.REAL_TILE_RESOLUTION));
    const x1y1 = Vect2D.add(tile[0], new Vect2D(C.REAL_TILE_RESOLUTION, C.REAL_TILE_RESOLUTION));
    const x0 = x0y0.x;
    const x1 = x1y0.x;
    const y0 = x0y0.y;
    const y1 = x0y1.y;

    switch (tile[1]) {
      case "Square":
        return position.x >= x0
          && position.y >= y0
          && position.x <= x1
          && position.y <= y1;

      case "BottomLeftTriangle":
        return position.x >= x0
          && position.y <= y1
          && this.compare(position, x0y0, x1y1) >= 0;

      case "BottomRightTriangle":
        return position.x <= x1
          && position.y <= y1
          && this.compare(position, x0y1, x1y0) >= 0;;

      case "TopLeftTriangle":
        return position.x >= x0
          && position.y >= y0
          && this.compare(position, x0y1, x1y0) <= 0;

      case "TopRightTriangle":
        return position.x <= x1
          && position.y >= y0
          && this.compare(position, x0y0, x1y1) <= 0;
    }
  }
  /**
   * checks relation of point and line
   * @param point point to check
   * @param linePoint1 first point of line
   * @param linePoint2 second point of line
   * @returns 0 if on line, > 0 if under line and < 0 if above
   */
  public compare(point: IPoint, linePoint1: IPoint, linePoint2: IPoint): number {
    return (linePoint2.x - linePoint1.x) * (point.y - linePoint1.y) - (linePoint2.y - linePoint1.y) * (point.x - linePoint1.x);
  }
}