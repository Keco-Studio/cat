// src/main.js
import Phaser from "phaser";
import HomeScene from "./scenes/HomeScene.js";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#aaddff",
  parent: "game-container",
  scene: [HomeScene],
  physics: {
    default: "arcade",
    arcade: { debug: false },
  },
};

const game = new Phaser.Game(config);