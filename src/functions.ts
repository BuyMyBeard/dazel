
import { BaseTexture, Texture, Rectangle } from "pixi.js";

export function generateTextures(baseTexture : BaseTexture, resolution : number, spriteCount : number, tilesPerRow : number) {

  let textures = [];
  for (let i = 0; i < spriteCount; i++) {
    textures[i] = new Texture(baseTexture, new Rectangle(resolution * (i % tilesPerRow), resolution * Math.floor(i / tilesPerRow), resolution, resolution));
  }
  return textures;
}

export function getTextureArray(ressource : String, startIndex : number, count : number) : Array<Texture>{
  const array : Array<Texture> = [];
  for (let i = startIndex; i < startIndex + count; i++) {
    array.push(Texture.from(ressource + i.toString() + ".png"));
  }
  return array;
}
