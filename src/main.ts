import { Application, Assets, SCALE_MODES, settings } from 'pixi.js';
import { Map, MapNetwork } from "./Map";
import { Character } from './Character';
import { Player, PlayerAnimation } from './Player';
import { getTextureArray } from "./functions";
import { InputReader } from './InputReader';
import { Vect2D } from './Vect2D';
import * as C from './Constants';
import { Slime } from './Slime';
import { Entity } from './Entity';
import { Bat } from './Bat';

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
const dazelAnimation: PlayerAnimation = {
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
const slimeAnimation = getTextureArray(name, 0, 8);

name = "bat";
const batAnimation = getTextureArray(name, 0, 10);

Player.animation = dazelAnimation;
Slime.animation = slimeAnimation;
Bat.animation = batAnimation;

const dazel = new Player(new Vect2D(200, 200));
const slime1 = new Slime(new Vect2D(250, 200), "Down");
const bat1 = new Bat(new Vect2D(400, 300));

const tilesetName = "plain-tileset";
const maps: { [id: string]: Map } = {};

const loadMapAssets = Object.values(mapAssets).map(async (mapDefinition: any, index) => {
  const map = new Map(index + 1, await Assets.load(mapDefinition.filepath) as string, tilesetName, C.COLLISION_SPECIFICATIONS);
  maps[`map${index + 1}`] = map;
  return map;
});

Map.maps = maps;
Promise.all(loadMapAssets).then(() => {
  const mapNetwork: MapNetwork = {
    map1: {
      North: maps.map2,
      West: maps.map3
    },
    map2: {
      South: maps.map1,
      West: maps.map4
    },
    map3: {
      North: maps.map4,
      East: maps.map1,
      West: maps.map5
    },
    map4: {
      South: maps.map3,
      East: maps.map2,
      West: maps.map6
    },
    map5: {
      North: maps.map6,
      East: maps.map3,
    },
    map6: {
      North: maps.map7,
      South: maps.map5,
      East: maps.map4
    },
    map7: {
      North: maps.map8,
      South: maps.map6,
    },
    map8: {
      South: maps.map7
    },
  }
  Object.values(maps).forEach((map, index) => {
    map.subscribeNeighbors(mapNetwork[`map${index + 1}`]);
  })

  maps.map1.draw();

  Object.values(maps).forEach((map: Map) => {
    dazel.subscribe(map);
  });

  slime1.moveToTop();
  bat1.moveToTop();
  dazel.moveToTop();

  app.ticker.add(delta => updateLoop(delta));
  function updateLoop(_: number) {
    for (let entity of Entity.pool) {
      if (entity instanceof Character) {
        entity.update();
      }
    }
  }
});
