
import { BaseTexture, Texture, Rectangle } from "pixi.js";
import { InputReader } from "./InputReader";



export function updateLoop(_: number) {
  InputReader.getKeysPressed();
}

export function generateTextures(baseTexture : BaseTexture, resolution : number, spriteCount : number, tilesPerRow : number) {

  let textures = [];
  for (let i = 0; i < spriteCount; i++) {
    textures[i] = new Texture(baseTexture, new Rectangle(resolution * (i % tilesPerRow), resolution * Math.floor(i / tilesPerRow), resolution, resolution));
  }
  return textures;
}