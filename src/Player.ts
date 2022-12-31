import { Character, Animations } from "./Character";
import { Application, IPoint } from "pixi.js";
import { CardinalDirection } from "./Map";
import { Direction } from "./Entity";
import * as C from "./Constants";
import { Vect2D } from "./Vect2D";
import { InputReader } from "./InputReader";

export class Player extends Character {
  
  changeMap(app : Application, cardinalDirection : CardinalDirection) {
    this.moveToTop(app);
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
  }
  
  constructor(app : Application, animations : Animations, position : IPoint = new Vect2D, hp : number = 3, speed : number = 2) {
    super(app, animations, undefined, position, hp, speed, animations.Idle.Down)
    this.init();
    this.sprite.anchor.set(0.5, 0.9);
  }
  
  public update() {
    if (this.state == "Attack") {
      return;
    }

    let movement : Vect2D = Vect2D.zero();
    let direction : Direction = "None";
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
        //interact
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
      
    }
  }