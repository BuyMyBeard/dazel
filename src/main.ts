

import { AnimatedSprite, Application, Assets, SCALE_MODES, settings, Sprite, Spritesheet, Texture } from 'pixi.js';
import { Map } from "./Map";
import { Animations, Player } from "./Entity";
import { generateTextures } from "./functions";
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
settings.WRAP_MODE

await Assets.init({ manifest: "manifest.json" });
const mapAssets = await Assets.loadBundle("maps");
const fontAssets = await Assets.loadBundle("fonts");
const textureAssets = await Assets.loadBundle("textures");


const desertSheet = await Assets.load('textures/desert.png');
const textureArray = generateTextures(desertSheet, TILE_RESOLUTION, 40, 8);



const map = new Map(mapAssets.map4, textureArray);
map.draw(app, TILE_RESOLUTION, SCALE_MULTIPLIER);

app.ticker.add(delta => updateLoop(delta));



const dazelArray: Array<Texture> = generateTextures(textureAssets.dazel, TILE_RESOLUTION, 9, 9);

const dazelAnimation: Animations = {
  frontWalk: dazelArray.slice(0, 4),
  frontAttack: dazelArray.slice(4, 8)
}

const dazel = new Player(dazelAnimation, new Vect2D(30, 30))
dazel.init(app);

function updateLoop(_: number) {
  dazel.update();
}

