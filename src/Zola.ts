// import { Character } from "./Character";
// import { Map } from "./Map";
// import { Vect2D } from "./Vect2D";

// export class Zola extends Character {
//   private static animation = undefined;
//   private waterTiles : Array<Vect2D>;
//   public static readonly HP : number = 2;
//   public update(): void {
//     throw new Error("Method not implemented.");
//   }
//   public constructor(map : Map) {
//     super(Zola.animation.x, Vect2D.zero(), undefined, Zola.animation.x);
//     this.waterTiles = map.WaterTiles;
//     if (this.waterTiles.length == 0) {
//       throw 'Cannot instanciate a Zola on a map with no water tiles';
//     }
//     this.init();
//     this.sprite.anchor.set(0.5, 0.5);
//     this.filterInfo.loops = 1;
//     this.animatedSprite.animationSpeed = 0.5;
//     this.aoeRange = 20;
//     this.range = 200; // aggro range
//     this.hp = Zola.HP;
//     this.state = "Idle";
//     this.sprite.scale.set(3);
//   }
// }