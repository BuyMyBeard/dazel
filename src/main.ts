

import { Text, Application, Assets, SCALE_MODES, settings, Graphics, GraphicsGeometry } from 'pixi.js';
import { Map } from "./Map";
import { Animations, Player } from "./Entity";
import { getTextureArray } from "./functions";
import { InputReader} from './InputReader';
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
const maps : { [id: string] : Map} = {
  map1 : new Map(mapAssets.map1, "plain-tileset", app),
  map2 : new Map(mapAssets.map2, "plain-tileset", app),
}

Object.values(maps).forEach((map : Map) => {
  dazel.subscribe(map);
})

maps.map1.North = maps.map2;
maps.map2.South = maps.map1;
maps.map1.draw();



const debugBackground : Graphics = new Graphics();

debugBackground.beginFill(0x222222);
debugBackground.drawRect(0,0, 150, 70);
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

