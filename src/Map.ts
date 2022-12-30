import { Application, Sprite, IPoint } from "pixi.js";
import * as C from "./Constants";

export class Map implements IPositionWatcher {
  private tileMap : number[][];
  public readonly width : number;
  public readonly height : number;
  private readonly tileset : String;
  
  private app : Application;

  public north : Map | null = null;
  public south : Map | null = null;
  public east : Map | null = null;
  public west : Map | null = null;

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
  warn(position: IPoint): void {
    if (position.x < 0) {
      this.loadNext(this.west);
    } else if (position.x > C.STAGE_WIDTH) {
      this.loadNext(this.east);
    } else if (position.y < 0) {
      this.loadNext(this.north);
    } else if (position.y > C.STAGE_HEIGHT) {
      this.loadNext(this.south);
    }
  }
  private loadNext(map : Map | null) {
    if (map === null) {
      throw "map not defined";
    }
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
  warn(position : IPoint) : void;
}