

import { Text, Application, Assets, SCALE_MODES, settings, Graphics, GraphicsGeometry } from 'pixi.js';
import { Map } from "./Map";
import { Animations, Player } from "./Entity";
import { getTextureArray } from "./functions";
import { InputReader} from './InputReader';
import { Vect2D } from './Vect2D';


const TILE_RESOLUTION = 16; //textures are 16 by 16
const SCALE_MULTIPLIER = 2;
const STAGE_WIDTH = 16 * TILE_RESOLUTION * SCALE_MULTIPLIER;
const STAGE_HEIGHT = 11 * TILE_RESOLUTION * SCALE_MULTIPLIER;


const app = new Application({
  view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
  width: STAGE_WIDTH,
  height: STAGE_HEIGHT,
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

let map = new Map(mapAssets.map2, "plain-tileset");
map.draw(app, TILE_RESOLUTION, SCALE_MULTIPLIER);


//const Plain_Tileset = generateTextures(tilesetAssets.plain_tileset, TILE_RESOLUTION, 160, 8);

//map.draw(app, TILE_RESOLUTION, SCALE_MULTIPLIER);

const dazelAnimation: Animations = {
  Walk : {
    Down: getTextureArray("dazel", 0, 4),
    Up: getTextureArray("dazel", 9, 4),
    Right: getTextureArray("dazel", 18, 4),
    Left: getTextureArray("dazel", 27, 4),
    None: null,
  },
  Attack : {
    Down: getTextureArray("dazel", 4, 5),
    Up: getTextureArray("dazel", 13, 5),
    Right: getTextureArray("dazel", 22, 5),
    Left: getTextureArray("dazel", 31, 5),
    None: null,
  },
  Idle : {
    Down: getTextureArray("dazel", 1, 1),
    Up: getTextureArray("dazel", 10, 1),
    Right: getTextureArray("dazel", 19, 1),
    Left: getTextureArray("dazel", 28, 1),
    None: null,
  },
  None: null,
}



const dazel = new Player(app, dazelAnimation, new Vect2D(30, 30))


const debugBackground : Graphics = new Graphics();

debugBackground.beginFill(0x222222);
debugBackground.drawRect(0,0, STAGE_WIDTH, 70);
debugBackground.endFill();
debugBackground.alpha = 0.5;
app.stage.addChild(debugBackground);


let state = dazel.State;
let direction = dazel.Direction;

const stateDebug = new Text("dazel.State : " + state, fontAssets.debug);
const directionDebug = new Text("dazel.Direction : " + direction, fontAssets.debug);
directionDebug.position.set(0, 40);
app.stage.addChild(stateDebug);
app.stage.addChild(directionDebug);

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

