

import { AnimatedSprite, Application, Assets, SCALE_MODES, settings, Sprite, Spritesheet, Texture } from 'pixi.js';
import { Map } from "./Map";
import { Animations, Player } from "./Entity";
import { generateTextures, getTextureArray } from "./functions";
import { InputReader, inputTypes, KeysPressed } from './InputReader';
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
    Down: getTextureArray("dazel", 0, 1),
    Up: getTextureArray("dazel", 9, 1),
    Right: getTextureArray("dazel", 18, 1),
    Left: getTextureArray("dazel", 27, 1),
    None: null,
  },
  None: null,
}

const dazel = new Player(app, dazelAnimation, new Vect2D(30, 30))

app.ticker.add(delta => updateLoop(delta));
function updateLoop(_: number) {
  dazel.update();
}

