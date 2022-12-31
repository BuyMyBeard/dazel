import { Text, Application, Assets, SCALE_MODES, settings, Graphics } from 'pixi.js';
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
const slimeAnimation: SimpleAnimations = {
  Walk: getTextureArray(name, 0, 8),
};

const dazel = new Player(dazelAnimation, new Vect2D(200, 200));
const slime1 = new Slime(slimeAnimation, new Vect2D(250, 250), "Up");

const tilesetName = "plain-tileset";
const maps: { [id: string]: Map } = {};
const loadMapAssets = Object.values(mapAssets).map(async (mapDefinition: any, index) => {
  const map = new Map(await Assets.load(mapDefinition.filepath) as string, tilesetName);
  maps[`map${index + 1}`] = map;
  return map;
});

Promise.all(loadMapAssets).then(() => {
  maps.map1.draw(C.COLLISION_SPECIFICATIONS);
  const debugBackground: Graphics = new Graphics();

  debugBackground.beginFill(0x222222);
  debugBackground.drawRect(0, 0, 150, 70);
  debugBackground.endFill();
  debugBackground.alpha = 0.5;
  app.stage.addChild(debugBackground);


  let state = dazel.State;
  let direction = dazel.Direction;
  Object.values(maps).forEach((map: Map) => {
    dazel.subscribe(map);
    slime1.subscribe(map);
  });
  const stateDebug = new Text("dazel.State : " + state, fontAssets.debug);
  const directionDebug = new Text("dazel.Direction : " + direction, fontAssets.debug);
  directionDebug.position.set(0, 12);
  app.stage.addChild(stateDebug);
  app.stage.addChild(directionDebug);
  slime1.debug();
  dazel.debug();
  dazel.moveToTop();
  slime1.moveToTop()
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
});