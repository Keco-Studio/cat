import Phaser from "phaser";

class MainScene extends Phaser.Scene {
  constructor() {
    super("main");
  }

  preload() {
    this.load.image("cat", "assets/cat_ginger.png");
  }

  create() {
    // --- 游戏状态 ---
    this.state = {
      bond: 0,     // 亲近值
      hunger: 60,  // 饥饿(0-100，越高越饿)
      shelter: 0,  // 房子进度
      day: 1
    };

    // --- 背景 ---
    this.add.rectangle(400, 300, 800, 600, 0xf6f1e1);

    // // --- 猫(用圆形代替) ---
    // this.cat = this.add.circle(400, 260, 60, 0xffccaa).setStrokeStyle(4, 0x333333);
    // this.catText = this.add.text(360, 240, "CAT", { fontSize: "24px", color: "#333" });

    // --- 猫(使用图片) ---
    this.cat = this.add.image(400, 260, "cat"); 
    this.cat.setScale(0.4); // 根据图片大小缩放（可调）
    this.cat.setOrigin(0.5, 0.5); // 可选：让图片居中更自然

    // --- UI ---
    this.ui = this.add.text(30, 30, "", { fontSize: "18px", color: "#333" });
    this.hint = this.add.text(30, 520, "点击按钮：摸猫 / 喂猫 / 盖房子\n规则：饥饿太高会降低亲近，亲近越高猫越不容易消失", {
      fontSize: "16px",
      color: "#333"
    });

    // --- 按钮 ---
    this.btnPet = this.makeButton(80, 420, "摸猫", () => this.petCat());
    this.btnFeed = this.makeButton(250, 420, "喂猫", () => this.feedCat());
    this.btnBuild = this.makeButton(420, 420, "盖房子", () => this.buildHouse());
    this.btnNextDay = this.makeButton(620, 420, "过一天", () => this.nextDay());

    this.renderUI();
  }

  // 每天自然变化（也可以改成 update() 每秒变化）
  nextDay() {
    this.state.day += 1;

    // 饥饿上升
    this.state.hunger = Math.min(100, this.state.hunger + 12);

    // 饥饿高会影响亲近
    if (this.state.hunger >= 80) this.state.bond = Math.max(0, this.state.bond - 8);

    // 猫消失概率：亲近越高越低（你之前那段 disappearChance(bond) 的落地版本）
    const disappearChance = (bond) => {
      // 基础 25%，亲近每 +10 点，降低 3%，最低 3%
      return Math.max(3, 25 - Math.floor(bond / 10) * 3);
    };

    const roll = Phaser.Math.Between(0, 100);
    const chance = disappearChance(this.state.bond);

    if (roll < chance) {
      this.gameOver(`猫离开了…（roll=${roll} < ${chance}%）`);
      return;
    }

    this.renderUI();
    this.flashMessage(`第 ${this.state.day} 天开始！(roll=${roll}, chance=${chance}%)`);
  }

  petCat() {
    // 摸猫：亲近小幅上升；如果太饿，效果变差
    const delta = this.state.hunger >= 80 ? 2 : 6;
    this.state.bond = Math.min(100, this.state.bond + delta);
    this.cat.scale = 1.05;
    this.time.delayedCall(120, () => (this.cat.scale = 1));
    this.renderUI();
    this.flashMessage(`你摸了摸猫，亲近 +${delta}`);
  }

  feedCat() {
    // 喂猫：降低饥饿，亲近小幅上升
    this.state.hunger = Math.max(0, this.state.hunger - 25);
    this.state.bond = Math.min(100, this.state.bond + 3);
    this.renderUI();
    this.flashMessage("投喂成功：饥饿 -25，亲近 +3");
  }

  buildHouse() {
    // 盖房子：增加 shelter，完成后给大幅亲近奖励
    this.state.shelter = Math.min(100, this.state.shelter + 20);
    if (this.state.shelter === 100) {
      this.state.bond = Math.min(100, this.state.bond + 15);
      this.flashMessage("房子完成！亲近 +15（猫更愿意留下）");
    } else {
      this.flashMessage("你在搭建小窝…（进度 +20）");
    }
    this.renderUI();
  }

  gameOver(msg) {
    this.add.rectangle(400, 300, 800, 600, 0x000000, 0.55);
    this.add.text(200, 260, "GAME OVER", { fontSize: "48px", color: "#fff" });
    this.add.text(200, 330, msg, { fontSize: "18px", color: "#fff" });
    this.btnPet.disableInteractive();
    this.btnFeed.disableInteractive();
    this.btnBuild.disableInteractive();
    this.btnNextDay.disableInteractive();
  }

  renderUI() {
    const { bond, hunger, shelter, day } = this.state;
    this.ui.setText(
      `Day: ${day}\n亲近(bond): ${bond}/100\n饥饿(hunger): ${hunger}/100\n小窝(shelter): ${shelter}/100`
    );
  }

  flashMessage(text) {
    if (this.toast) this.toast.destroy();
    this.toast = this.add.text(30, 480, text, { fontSize: "16px", color: "#333" });
    this.time.delayedCall(1200, () => this.toast && this.toast.destroy());
  }

  makeButton(x, y, label, onClick) {
    const w = 140, h = 46;
    const bg = this.add.rectangle(x, y, w, h, 0xffffff).setStrokeStyle(2, 0x333333);
    const txt = this.add.text(x - 28, y - 12, label, { fontSize: "18px", color: "#333" });

    const hit = this.add.rectangle(x, y, w, h, 0x000000, 0).setInteractive({ useHandCursor: true });
    hit.on("pointerdown", onClick);
    hit.on("pointerover", () => bg.setFillStyle(0xeeeeee));
    hit.on("pointerout", () => bg.setFillStyle(0xffffff));

    // 返回一个可 disable 的对象（这里把 hit 当按钮本体）
    hit.bg = bg; hit.txt = txt;
    return hit;
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "app",
  scene: [MainScene]
});