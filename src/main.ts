

import { Text, Application, Assets, SCALE_MODES, settings, Graphics, GraphicsGeometry } from 'pixi.js';
import { Map, TypeCollision } from "./Map";
import { Animations, Player } from "./Entity";
import { getTextureArray } from "./functions";
import { InputReader } from './InputReader';
import { Vect2D } from './Vect2D';
import * as C from './Constants';


const app = new Application({
  view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
  width: C.STAGE_WIDTH,
  height: C.STAGE_HEIGHT,
  backgroundColor: 0xAAAAAA,
  antialias: false,
});
app.ticker.maxFPS = 60;

InputReader.initialize();
settings.SCALE_MODE = SCALE_MODES.NEAREST;

await Assets.init({ manifest: "manifest.json" });
const mapAssets = await Assets.loadBundle("maps");
const fontAssets = await Assets.loadBundle("fonts");
const textureAssets = await Assets.loadBundle("textures");
await Assets.loadBundle("tilesets");

//const Plain_Tileset = generateTextures(tilesetAssets.plain_tileset, TILE_RESOLUTION, 160, 8);

//map.draw(app, TILE_RESOLUTION, SCALE_MULTIPLIER);

const dazelAnimation: Animations = {
  Walk: {
    Down: getTextureArray("dazel", 0, 4),
    Up: getTextureArray("dazel", 9, 4),
    Right: getTextureArray("dazel", 18, 4),
    Left: getTextureArray("dazel", 27, 4),
    None: null,
  },
  Attack: {
    Down: getTextureArray("dazel", 4, 5),
    Up: getTextureArray("dazel", 13, 5),
    Right: getTextureArray("dazel", 22, 5),
    Left: getTextureArray("dazel", 31, 5),
    None: null,
  },
  Idle: {
    Down: getTextureArray("dazel", 1, 1),
    Up: getTextureArray("dazel", 10, 1),
    Right: getTextureArray("dazel", 19, 1),
    Left: getTextureArray("dazel", 28, 1),
    None: null,
  },
  None: null,
}

const tilesetName = "plain-tileset";
const dazel = new Player(app, dazelAnimation, new Vect2D(200, 200));
const maps: { [id: string]: Map } = {};
const loadMapAssets = Object.values(mapAssets).map(async (mapDefinition: any, index) => {
  const map = new Map(await Assets.load(mapDefinition.filepath) as string, tilesetName, app);
  maps[`map${index + 1}`] = map;
  return map;
});
console.log(maps);
Object.values(maps).forEach((map: Map) => {
  dazel.subscribe(map);
});

const collisionSpecifications: Array<[number, TypeCollision]> = [
  [13, "BottomRightTriangle"],
  [14, "Square"],
  [15, "BottomLeftTriangle"],
  [21, "TopRightTriangle"],
  [22, "Square"],
  [23, "TopLeftTriangle"],
  [30, "TopLeftTriangle"],
  [39, "BottomRightTriangle"],
  [40, "Square"],
  [47, "Square"],
  [48, "Square"],
  [49, "Square"],
  [50, "Square"],
  [51, "BottomRightTriangle"],
  [52, "BottomLeftTriangle"],
  [53, "TopRightTriangle"],
  [54, "Square"],
  [55, "TopLeftTriangle"],
  [56, "Square"],
  [64, "Square"],
  [65, "Square"],
  [66, "Square"],
  [67, "Square"],
  [68, "Square"],
  [69, "Square"],
  [70, "Square"],
  [71, "Square"],
  [72, "Square"],
  [73, "Square"],
  [74, "Square"],
  [75, "Square"],
  [76, "Square"],
  [77, "Square"],
  [78, "Square"],
  [79, "Square"],
  [82, "Square"],
  [83, "Square"],
  [84, "Square"],
  [85, "Square"],
  [86, "Square"],
  [87, "Square"],
  [88, "Square"],
  [89, "Square"],
  [90, "Square"],
  [91, "BottomLeftTriangle"],
  [92, "Square"],
  [93, "BottomLeftTriangle"],
]
Promise.all(loadMapAssets).then(() => {
  maps.map1.draw(collisionSpecifications);
  const debugBackground: Graphics = new Graphics();

  debugBackground.beginFill(0x222222);
  debugBackground.drawRect(0, 0, 150, 70);
  debugBackground.endFill();
  debugBackground.alpha = 0.5;
  app.stage.addChild(debugBackground);


  let state = dazel.State;
  let direction = dazel.Direction;

  const stateDebug = new Text("dazel.State : " + state, fontAssets.debug);
  const directionDebug = new Text("dazel.Direction : " + direction, fontAssets.debug);
  directionDebug.position.set(0, 12);
  app.stage.addChild(stateDebug);
  app.stage.addChild(directionDebug);

  dazel.moveToTop(app);

  app.ticker.add(delta => updateLoop(delta));
  function updateLoop(_: number) {
    dazel.update();
    if (dazel.State != state) {
      state = dazel.State;
      stateDebug.text = "dazel.State : " + state;
    }
    if (dazel.Direction != direction) {
      direction = dazel.Direction;
      directionDebug.text = "dazel.Direction : " + direction;
    }

  }
});




