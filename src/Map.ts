import { Texture, Application, Sprite } from "pixi.js";

export class Map {
  private tileMap : number[][];
  public readonly width : number;
  public readonly height : number;
  private readonly tileset : String;

  /**
   * 
   * @param map loaded asset
   * @param tileset name of tileset in assets (without the extension)
   */
  public constructor(mapFile : string, tileset : String) {
    this.tileMap = this.generateTileMap(mapFile)
    this.width = this.tileMap[0].length;
    this.height = this.tileMap.length;
    this.tileset = tileset;
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

  public draw(app : Application, tileRes : number, scale : number) {
    for (let i = 0; i < this.tileMap.length; i++) {
      for (let j = 0; j < this.tileMap[0].length; j++) {
        let id = this.tileMap[i][j];
        const sprite : Sprite = Sprite.from(this.tileset + id.toString() + ".png");
        sprite.position.set(tileRes * scale * j, tileRes * scale * i);
        sprite.scale.set(scale);
        app.stage.addChild(sprite);
      }
    }
  }
}


