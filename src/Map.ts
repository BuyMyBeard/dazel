import { Application, Sprite, IPoint } from "pixi.js";
import * as C from "./Constants";
import { Entity, Player} from "./Entity";

export type CardinalDirection = "North" | "South" | "East" | "West";

export class Map implements IPositionWatcher {
  private tileMap : number[][];
  public readonly width : number;
  public readonly height : number;
  private readonly tileset : String;
  private active : boolean = false;

  private app : Application;

  public North : Map | null = null;
  public South : Map | null = null;
  public East : Map | null = null;
  public West : Map | null = null;

  /**
   * 
   * @param map loaded asset
   * @param tileset name of tileset in assets (without the extension)
   */
  public constructor(mapFile : string, tileset : String, app : Application) {
    this.tileMap = this.generateTileMap(mapFile)
    this.width = this.tileMap[0].length;
    this.height = this.tileMap.length;
    this.tileset = tileset;
    this.app = app;
  }
  warn(entity : Entity): void {
    if (!this.active) {
      return;
    }
    let directionToLoad : CardinalDirection;
    if (entity.position.x < 0) {
      directionToLoad = "West";
    } else if (entity.position.x > C.STAGE_WIDTH) {
      directionToLoad = "East";
    } else if (entity.position.y < 0) {
      directionToLoad = "North";
    } else if (entity.position.y > C.STAGE_HEIGHT) {
      directionToLoad = "South";
    } else {
      return;
    }
    this.loadNext(this[directionToLoad]);
    (entity as Player).changeMap(this.app, directionToLoad);
    console.log(this[directionToLoad]);
  }
  private loadNext(map : Map | null) {
    if (map === null) {
      throw "map not defined";
    }
    this.active = false;
    this.app.stage.removeChildren();
    map.draw();

  }

  private generateTileMap(mapFile : string) : number[][] {

    let lines : any = mapFile.split("\n");
    let tileMap : number[][] = Array();

    for (let s of lines) {
      let items : Array<string> = s.split(',');
      let numbers : Array<number> = new Array();
      for (let item of items) {
        numbers.push(parseInt(item));
      }
      tileMap.push(numbers);
    }
    
    let width : number = tileMap[0].length;
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
        const sprite : Sprite = Sprite.from(this.tileset + id.toString() + ".png");
        sprite.position.set(C.TILE_RESOLUTION * C.SCALE_MULTIPLIER * j, C.TILE_RESOLUTION * C.SCALE_MULTIPLIER * i);
        sprite.scale.set(C.SCALE_MULTIPLIER);
        this.app.stage.addChild(sprite);
      }
    }
  }

}

export interface IPositionWatcher {
  warn(entity : Entity) : void;
}