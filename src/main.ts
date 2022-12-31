import { Text, Application, Assets, SCALE_MODES, settings, Graphics} from 'pixi.js';
import { Map } from "./Map";
import { Animations, SimpleAnimations } from './Character';
import { Player } from './Player';
import { getTextureArray } from "./functions";
import { InputReader } from './InputReader';
import { Vect2D } from './Vect2D';
import * as C from './Constants';
import { Slime } from './Slime';
import { Entity } from './Entity';

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
Map.app = app;

InputReader.initialize();
settings.SCALE_MODE = SCALE_MODES.NEAREST;

await Assets.init({ manifest: "manifest.json" });
const mapAssets = await Assets.loadBundle("maps");
const fontAssets = await Assets.loadBundle("fonts");
const textureAssets = await Assets.loadBundle("textures");
await Assets.loadBundle("tilesets");

let name = "dazel";
const dazelAnimation: Animations = {
  Walk: {
    Down: getTextureArray(name, 0, 4),
    Up: getTextureArray(name, 9, 4),
    Right: getTextureArray(name, 18, 4),
    Left: getTextureArray(name, 27, 4),
    None: null,
  },
  Attack: {
    Down: getTextureArray(name, 4, 5),
    Up: getTextureArray(name, 13, 5),
    Right: getTextureArray(name, 22, 5),
    Left: getTextureArray(name, 31, 5),
    None: null,
  },
  Idle: {
    Down: getTextureArray(name, 1, 1),
    Up: getTextureArray(name, 10, 1),
    Right: getTextureArray(name, 19, 1),
    Left: getTextureArray(name, 28, 1),
    None: null,
  },
  None: null,
}
name = "slime";
const slimeAnimation : SimpleAnimations = {
  Walk : getTextureArray(name, 0, 8),
};

const dazel = new Player(dazelAnimation, new Vect2D(200, 200));

const slime1 = new Slime(slimeAnimation, new Vect2D(250,250), "Up");

const tilesetName = "plain-tileset";
const maps: { [id: string]: Map } = {
  map1: new Map(mapAssets.map1, tilesetName),
  map2: new Map(mapAssets.map2, tilesetName),
  map3: new Map(mapAssets.map3, tilesetName),
  map4: new Map(mapAssets.map4, tilesetName),
  map5: new Map(mapAssets.map5, tilesetName),
  map6: new Map(mapAssets.map6, tilesetName),
  map7: new Map(mapAssets.map7, tilesetName),
  map8: new Map(mapAssets.map8, tilesetName),
}

Object.values(maps).forEach((map: Map) => {
  dazel.subscribe(map);
  slime1.subscribe(map);
});

maps.map1.North = maps.map2;
maps.map2.South = maps.map1;

maps.map1.draw(C.COLLISION_SPECIFICATIONS);

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

slime1.moveToTop(app);
dazel.moveToTop(app);

app.ticker.add(delta => updateLoop(delta));
function updateLoop(_: number) {
  dazel.update();
  slime1.update();
  if (dazel.State != state) {
    state = dazel.State;
    stateDebug.text = "dazel.State : " + state;
  }
  if (dazel.Direction != direction) {
    direction = dazel.Direction;
    directionDebug.text = "dazel.Direction : " + direction;
  }
}

app.stage.addChild(stateDebug);
app.stage.addChild(directionDebug);


slime1.debug();
dazel.debug();