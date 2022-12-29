

import { Application, Assets, SCALE_MODES, settings } from 'pixi.js';
import { Map } from "./Map";
import type { Animations } from "./Entity";
import { updateLoop, generateTextures} from "./functions";
import { InputReader } from './InputReader';


const TILE_RESOLUTION = 16; //textures are 16 by 16
const SCALE_MULTIPLIER = 1;
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


await Assets.init({manifest: "manifest.json"});
const mapAssets = await Assets.loadBundle("maps");
const fontAssets = await Assets.loadBundle("fonts");
const textureAssets = await Assets.loadBundle("textures");


const desertSheet = await Assets.load('textures/desert.png');
const textureArray = generateTextures(desertSheet, TILE_RESOLUTION, 40, 8);

const map = new Map(mapAssets.map4, textureArray);
map.draw(app, TILE_RESOLUTION, SCALE_MULTIPLIER);
map.displayDebug();

app.ticker.add(delta => updateLoop(delta));

const dazelSheet = await Assets.load('textures/dazel-front.png');
const dazelTextureArray = generateTextures(dazelSheet, TILE_RESOLUTION, 9, 9);


let animations : Animations = {
  frontWalk : dazelTextureArray.slice(0, 4),
  frontAttack : dazelTextureArray.slice(4),
};

console.log(animations);