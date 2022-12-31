import { Character, Animations } from "./Character";
import { Application, DisplayObject, Graphics, IPoint, Ticker } from "pixi.js";
import { CardinalDirection, Map } from "./Map";
import { Direction, Entity } from "./Entity";
import * as C from "./Constants";
import { Vect2D } from "./Vect2D";
import { InputReader } from "./InputReader";

export class Player extends Character {
  private attackFramesTicker: Ticker = new Ticker();

  changeMap(cardinalDirection: CardinalDirection) {
    this.moveToTop();
    switch (cardinalDirection) {
      case "East":
        this.position.x = 10;
        break;

      case "West":
        this.position.x = C.STAGE_WIDTH - 10;
        break;

      case "North":
        this.position.y = C.STAGE_HEIGHT - 5;
        break;

      case "South":
        this.position.y = 30;
    }
    console.log(this.position);
  }

  constructor(animations: Animations, position: IPoint = new Vect2D) {
    super(animations.Idle.Down, position, animations)
    this.init();
    this.sprite.anchor.set(0.5, 0.9);
    this.attackFramesTicker.add(this.checkAttackRange, this);
    this.range = 30;
    this.aoeRange = 15;
    this.speed = 2;
    this.state = "Idle";
    this.direction = "Down";
  }

  public update() {
    if (this.state == "Attack") {
      return;
    }

    let movement: Vect2D = Vect2D.zero();
    let direction: Direction = "None";
    switch (InputReader.currentInput) {
      case "Up":
        movement.add(Vect2D.up());
        direction = "Up";
        break;

      case "Down":
        movement.add(Vect2D.down());
        direction = "Down";
        break;

      case "Left":
        movement.add(Vect2D.left());
        direction = "Left";
        break;

      case "Right":
        movement.add(Vect2D.right());
        direction = "Right";
        break;

      case "Attack":
        this.Attack();
        break;

      case "Interact":
        console.log(this.subs);
        break;
    }
    if (this.state == "Walk" && direction == "None") {
      this.state = "Idle";
      this.updateAnimation();
    } else if ((direction != this.direction && direction != "None") || (direction == this.direction && this.state == "Idle")) {
      this.direction = direction;
      this.state = "Walk";
      this.updateAnimation();
    }

    movement.multiply(this.speed);
    this.move(movement);
  }

  protected override Attack(): void {
    super.Attack();
    this.attackFramesTicker.start();
  }
  private checkAttackRange() { //callback
    const currentFrame = this.animatedSprite.currentFrame;
    if (currentFrame == 0) {
      return;
    }
    if (currentFrame == 4) {
      this.attackFramesTicker.stop();
      Map.app.stage.removeChild(this.attackHitboxVisualisation as DisplayObject)
      this.attackHitboxVisualisation = undefined;
      return;
    }
    const attackLocation: Vect2D = Vect2D.fromDirection(this.Direction).multiply(this.range).add(this.position);
    if (this.attackHitboxVisualisation == undefined) {
      const g: Graphics = new Graphics();
      g.beginFill(0xAAAA00);
      g.drawCircle(attackLocation.x, attackLocation.y, this.aoeRange);
      g.endFill();
      g.alpha = 0.4;
      Map.app.stage.addChild(g);
      this.attackHitboxVisualisation = g;
    }
    for (const entity of Entity.pool) {
      if (entity == this || !(entity instanceof Character)) { //to modify if we add destroyable non-characters
        continue;
      }
      if (attackLocation.distance(entity.position) < this.range) {
        entity.takeDamage();
      }
    }
  }
}

