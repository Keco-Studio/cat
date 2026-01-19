// src/scenes/HomeScene.js
import Phaser from "phaser";
import CatStateMachine from "../systems/CatStateMachine.js";

export default class HomeScene extends Phaser.Scene {
  constructor() {
    super({ key: "HomeScene" });
  }

  preload() {
    // 猫咪图片
    this.load.image("cat_idle", "/assets/cat/cat_idle.png");
    this.load.image("cat_hungry", "/assets/cat/cat_hungry.png");
    this.load.image("cat_sleeping", "/assets/cat/cat_sleeping.png");
    this.load.image("food", "/assets/fish.png");

    // 背景
    this.load.image("room", "/assets/bg/room.png");

    // 音乐 & 音效
    this.load.audio("bgm", "/assets/music/bg_loop.mp3");
    this.load.audio("pet_sfx", "/assets/sfx/pet.mp3");
    this.load.audio("eat_sfx", "/assets/sfx/eat.mp3");
  }

  create() {
    // 背景
    this.add.image(400, 300, "room").setDepth(0);

    // 猫咪状态机
    this.cat = this.add.image(500, 400, "cat_idle").setScale(0.29);
    this.catState = new CatStateMachine(this.cat);

    // 背景音乐
    this.bgm = this.sound.add("bgm", { loop: true, volume: 0.4 });
    this.bgm.play();

    // 输入事件
    this.input.on("pointerdown", (pointer) => {
      const dist = Phaser.Math.Distance.Between(
        pointer.x,
        pointer.y,
        this.cat.x,
        this.cat.y
      );
      if (dist < 80) {
        this.petCat();
      } else {
        this.feedCat();
      }
    });

    // 猫咪呼吸动画
    this.tweens.add({
      targets: this.cat,
      scaleX: 0.33,
      scaleY: 0.31,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // 循环状态更新
    this.time.addEvent({
      delay: 1000 * 60,
      callback: () => this.catState.update(),
      loop: true,
    });
  }

  petCat() {
    this.sound.play("pet_sfx", { volume: 0.6 });
    this.catState.pet();
    this.flashMessage("你摸了摸猫，猫很开心 😺");
  }

  feedCat() {
    const food = this.add.image(400, 500, "food").setScale(0.25);
    this.sound.play("eat_sfx", { volume: 0.6 });

    this.tweens.add({
      targets: food,
      x: this.cat.x,
      y: this.cat.y + 20,
      duration: 400,
      ease: "Sine.easeIn",
      onComplete: () => {
        food.destroy();
        this.catState.feed();
        this.flashMessage("猫吃饱了 🐟");

        // 猫高兴 bounce
        this.tweens.add({
          targets: this.cat,
          scale: 0.45,
          duration: 120,
          yoyo: true,
          ease: "Back.easeOut",
        });
      },
    });
  }

  flashMessage(text) {
    const msg = this.add.text(400, 50, text, {
      fontSize: "24px",
      color: "#333",
      backgroundColor: "#fff8",
      padding: { x: 8, y: 4 },
    }).setOrigin(0.5, 0.5);

    this.tweens.add({
      targets: msg,
      alpha: 0,
      duration: 1500,
      delay: 500,
      onComplete: () => msg.destroy(),
    });
  }
}