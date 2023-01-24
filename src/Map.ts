import { Application, Sprite, IPoint } from "pixi.js";
import { Bat } from "./Bat";
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
  public static readonly BOUNDARY_DISTANCE = 64;
  public static maps : { [id: string]: Map };
  public id : number;
  private tileMap: number[][];
  private collisionMap: CollisionMap;
  public collisionSpecifications: Array<[number, TypeCollision]> = [];
  private neighbors: MapNeighbors | undefined;
  public readonly width: number;
  public readonly height: number;
  private readonly tileset: String;
  public active: boolean = false;

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
  public constructor(id : number, mapFile: string, tileset: String, collisionSpecifications : Array<[number, TypeCollision]>) {
    this.tileMap = this.generateTileMap(mapFile);
    this.collisionMap = new CollisionMap(this.tileMap, collisionSpecifications);
    this.width = this.tileMap[0].length;
    this.height = this.tileMap.length;
    this.tileset = tileset;
    this.id = id;
    
  }
  public get WaterTiles() {
    const waterTiles : Array<Vect2D> = [];
    for (let i = 0; i < this.tileMap.length; i++) {
      for (let j = 0; j < this.tileMap[0].length; j++) {
        if (C.WATERTILES.includes(this.tileMap[i][j])) {
          waterTiles.push(new Vect2D(j, i));
          continue;
        }
      }
    }
    return waterTiles;
  }

  /**
   * prerequisite: Map must be active
   * @param entity entity to check position of
   * @returns true if collision registered, false otherwise
   */
  warn(entity: Entity, newPosition: IPoint): boolean {
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
      console.log(newPosition);
      this.loadNext(this.neighbors[directionToLoad]);
      (entity as Player).changeMap(directionToLoad);
    }
    return true; //position will already get updated by changeMap method
  }
  private loadNext(map: Map | undefined) {
    if (map === undefined) {
      //throw "map not defined";
      return;
    }
    this.active = false;
    Map.app.stage.removeChildren();
    map.draw();
    
  }
  public subscribeNeighbors(mapNeighbors: MapNeighbors) {
    this.neighbors = mapNeighbors;
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

  public draw() {
    this.active = true;
    for (let i = 0; i < this.tileMap.length; i++) {
      for (let j = 0; j < this.tileMap[0].length; j++) {
        let id = this.tileMap[i][j];
        const sprite: Sprite = Sprite.from(this.tileset + id.toString() + ".png");
        const pos = new Vect2D(C.TILE_RESOLUTION * C.SCALE_MULTIPLIER * j, C.TILE_RESOLUTION * C.SCALE_MULTIPLIER * i);
        sprite.position = pos;
        sprite.scale.set(C.SCALE_MULTIPLIER);
        Map.app.stage.addChild(sprite);

      }
    } 
    this.populate();
  }
  private populate() {
    switch (this.id) {
      
    }
  }

  public isOutsideBoundary(position : IPoint) {
    return position.x < -Map.BOUNDARY_DISTANCE 
        || position.y < -Map.BOUNDARY_DISTANCE 
        || position.x > Map.BOUNDARY_DISTANCE + this.width * C.REAL_TILE_RESOLUTION
        || position.y > Map.BOUNDARY_DISTANCE + this.height * C.REAL_TILE_RESOLUTION;
  }

  public static get CurrentMap() : Map { 
    for (const map of Object.values(Map.maps)) {
      if (map.active = true) {
        return map;
      }
    }
    throw "No currently active map";
  }
}

export interface IPositionWatcher {
  active : boolean;
  warn(entity: Entity, newPosition: IPoint): boolean;
}

export type TypeCollision = "Square" | "TopLeftTriangle" | "TopRightTriangle" | "BottomLeftTriangle" | "BottomRightTriangle";
class CollisionMap {
  public empty(): boolean {
    return this.solidTiles.length == 0;
  }
  private solidTiles : TypeCollision[][] = [];

  public constructor(tileMap : number[][], collisionSpecifications : Array<[number, TypeCollision]>) {
    for (let i = 0; i < tileMap.length; i++) {
      this.solidTiles[i] = [];
      for (let j = 0; j < tileMap[0].length; j++) {
        for (const collision of collisionSpecifications) {
          if (collision[0] == tileMap[i][j]) {
            this.solidTiles[i][j] = collision[1];
            break;
          }
        }
      }
    }
  }


  public checkCollision(position: IPoint): boolean {
    const tileX = Math.floor(position.x / C.REAL_TILE_RESOLUTION);
    if (tileX < 0 || tileX >= this.solidTiles[0].length) {
      return false;
    }
    const tileY = Math.floor(position.y / C.REAL_TILE_RESOLUTION);
    if (tileY < 0 || tileY >= this.solidTiles.length) {
      return false;
    }
    const collision = this.solidTiles[tileY][tileX];
    if (collision == undefined) {
      return false;
    }
    return this.isInsideTile(position, new Vect2D(tileX * C.REAL_TILE_RESOLUTION, tileY * C.REAL_TILE_RESOLUTION), collision);
  }

  public isInsideTile(position: IPoint, tilePosition: IPoint, tileCollision : TypeCollision): boolean {
    const x0y0 = tilePosition;
    const x1y0 = Vect2D.add(tilePosition, new Vect2D(C.REAL_TILE_RESOLUTION, 0));
    const x0y1 = Vect2D.add(tilePosition, new Vect2D(0, C.REAL_TILE_RESOLUTION));
    const x1y1 = Vect2D.add(tilePosition, new Vect2D(C.REAL_TILE_RESOLUTION, C.REAL_TILE_RESOLUTION));
    const x0 = x0y0.x;
    const x1 = x1y0.x;
    const y0 = x0y0.y;
    const y1 = x0y1.y;

    switch (tileCollision) {
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
