// src/systems/CatStateMachine.js
export default class CatStateMachine {
    constructor(catSprite) {
      this.cat = catSprite;
      this.hunger = 50;
      this.bond = 50;
      this.state = "idle"; // idle / hungry / sleeping / away
      this.updateSprite();
    }
  
    update() {
      // 自然变饿
      this.hunger = Math.min(100, this.hunger + 1);
      this.updateState();
    }
  
    feed() {
      this.hunger = Math.max(0, this.hunger - 30);
      this.bond = Math.min(100, this.bond + 5);
      this.updateState();
    }
  
    pet() {
      this.bond = Math.min(100, this.bond + 5);
      this.updateState();
    }
  
    updateState() {
      if (this.hunger > 70) this.state = "hungry";
      else if (this.bond < 20) this.state = "sleeping";
      else this.state = "idle";
      this.updateSprite();
    }
  
    updateSprite() {
      switch (this.state) {
        case "idle": this.cat.setTexture("cat_idle"); break;
        case "hungry": this.cat.setTexture("cat_hungry"); break;
        case "sleeping": this.cat.setTexture("cat_sleeping"); break;
        case "away": this.cat.setVisible(false); break;
      }
      if (this.state !== "away") this.cat.setVisible(true);
    }
  }  