// src/systems/CatStateMachine.js
export default class CatStateMachine {
    constructor(catSprite, onDisappear) {
      this.cat = catSprite;
      this.bond = 0;
      this.state = "strange"; // strange / familiar / trust / deeply_bonded
      this.updateSprite();
      this.disappearRate = 0.5;
      this.worldEventRate = 0.5;
      this.onDisappear = onDisappear; // Callback for game over
      console.log("[CatStateMachine] Initialized with disappearRate:", this.disappearRate);
    }
  
    update() {
      console.log("[CatStateMachine] Update called - Bond:", this.bond, "State:", this.state);
      this.updateState();
      this.checkBond();
      return this.checkWorldEvent(); // return true if disappear
    }
  
    feed() {
      this.bond = Math.min(100, this.bond + 5);
      console.log("[CatStateMachine] Fed cat - Bond now:", this.bond);
      this.updateState();
    }
  
    pet() {
      this.bond = Math.min(100, this.bond + 3);
      console.log("[CatStateMachine] Pet cat - Bond now:", this.bond);
      this.updateState();
    }

    shelter() {
      this.bond = Math.max(0, this.bond + 20);
      this.updateState();
    }
  
    updateState() {
      const oldState = this.state;
      if (this.bond < 20) this.state = "strange";
      else if (this.bond < 40) this.state = "familiar";
      else if (this.bond < 60) this.state = "trust";
      else this.state = "deeply_bonded";
      
      if (oldState !== this.state) {
        console.log("[CatStateMachine] State changed:", oldState, "->", this.state);
      }
      this.updateSprite();
    }
    
    checkBond() {
      if (this.state === "strange") this.disappearRate == 0.5;
      else if (this.state === "familiar") this.disappearRate == 0.3;
      else if (this.state === "trust") this.disappearRate == 0.2;
      else if (this.state === "deeply_bonded") this.disappearRate == 0.1;
      this.cat.setScale(this.disappearRate);
    }

    checkWorldEvent() {
        const randomValue = Math.random();
        console.log("[CatStateMachine] checkWorldEvent - Random:", randomValue.toFixed(3), "DisappearRate:", this.disappearRate);
        
        if (randomValue > this.disappearRate) {
            console.log("[CatStateMachine] ⚠️ CAT DISAPPEARED! Triggering game over...");
            if (this.onDisappear) {
                this.onDisappear(); // Trigger game over callback
            }
            return true; // disappear
        }
        console.log("[CatStateMachine] ✓ Cat is safe this time");
        return false; // do not disappear
      }
    

    updateSprite() {
      switch (this.state) {
        case "strange": this.cat.setTexture("cat_idle"); break;
        case "familiar": this.cat.setTexture("cat_idle"); break;
        case "trust": this.cat.setTexture("cat_idle"); break;
        case "deeply_bonded": this.cat.setVisible(false); break;
      }
      if (this.state !== "away") this.cat.setVisible(true);
    }
  }  