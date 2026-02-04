//import Phaser, { Input, Physics, Scene } from "phaser";
// import background from './sprites/background.jpg';
// import hitZone from './sprites/hitZone.png';
// import hitZoneShadow from './sprites/note.png';
// import note from './sprites/note.png';
// import Audio from "./audio/background_track.mp3";



class MainMenu extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }
  preload() {
    this.load.image('background', background);
  }
  create() {
    const {width,height}= this.scale
    
    let bg = this.add.image(width/2, height/2, 'background'); 
    bg.setDisplaySize(width,height);
    this.add.text(600, 200, 'RHYTHM MASTER', { fontSize: '80px', fill: '#dfc016',stroke: '#000000' ,strokeThickness: 3}).setOrigin(0.5);
    this.add.text(600, 250, '(use space to play)', { fontSize: '40px', fill: '#dfc016',stroke: '#000000' ,strokeThickness: 3}).setOrigin(0.5);

    let startBtn = this.add.text(600, 400, 'CLICK TO START', { fontSize: '100px', fill: '#fff',stroke: '#000000' ,strokeThickness: 3 })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    startBtn.on('pointerdown', () => {
      this.scene.start('GamePlay');
    });
  }
}

class GamePlay extends Phaser.Scene {
  constructor() {
    super('GamePlay');
  }
  preload() {
    this.load.image('background', background);
    this.load.image('hitZone', hitZone);
    this.load.image('hitZoneShadow', hitZoneShadow);
    this.load.image('note', note);
    this.load.audio('bgm',Audio)

  }
  create() {
    this.noteSpeed = Phaser.Math.Between(5,10)
    this.music = this.sound.add('bgm');
    this.music.play({
      loop:false,
      volume: 0.5
    })


    this.music.on('complete', () => {
    this.scene.start("GameOver", { combo: this.comboCount });
  });

    this.miss = 0;
    this.comboCount = 0; 
    this.highscore = 0;
    this.add.image(600, 300, 'background');

    this.scoreText = this.add.text(600, 50, this.comboCount, { fontSize: '100px', fill: '#dfc016',stroke: '#000000' ,strokeThickness: 3}).setOrigin(0.5);
    this.scoreText.visible = false;

    this.add.image(597, 500, 'hitZoneShadow').setScale(1);
    this.noteHitzone = this.add.image(600, 500, 'hitZone').setScale(0.95);
    this.note = this.add.image(600, 0, 'note').setScale(1);

    let startBtn = this.add.text(1100, 50, 'Back', { fontSize: '50px', fill: '#fff',stroke: '#000000' ,strokeThickness: 3})
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    startBtn.on('pointerdown', () => {
      this.music.stop()
      this.scene.start('MainMenu');
    });

    this.input.keyboard.on('keydown-SPACE', () => {
      let distance = Math.abs(this.note.y - this.noteHitzone.y);
      if (distance < 40) {
        this.comboCount++;
        this.highscore++;
        this.scoreText.visible = true;
        this.note.y = -50;
        this.noteSpeed = Phaser.Math.Between(5, 10);
      } else {
        // this.miss++;
        this.comboCount = 0;
        this.scoreText.visible = false;
        this.noteSpeed = Phaser.Math.Between(5, 10);
      }
    });
  }
  update() {
    if (this.note) {
      this.note.y += this.noteSpeed ;
      if (this.note.y > 600) {
        this.note.y = -50;
        this.comboCount = 0;
        // this.miss++;
        this.scoreText.visible = false;
      }
    }

    if(this.miss >= 5)
    {
      this.music.stop();
      this.scene.start("GameOver",{combo :this.highscore});
    }

    if (this.scoreText) {
      this.scoreText.setText(this.comboCount);
    }
  }
}

class GameOver extends Phaser.Scene
{
  constructor()
  {
    super('GameOver');
  }

  init(data)
  {
    this.finalScore = data.combo
  }
  preload() {

  }
  
  create()
  {
    var {width,height} = this.scale
    let bg = this.add.image(width/2, height/2, 'background'); 
    bg.setDisplaySize(width,height);

    this.add.text(width / 2, height / 2 - 50, 'High Score', { 
        fontSize: '100px', 
        fill: '#fff', 
        stroke: '#000', 
        strokeThickness: 10 
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 +100, this.finalScore, { 
        fontSize: '100px', 
        fill: '#fff', 
        stroke: '#eff319', 
        strokeThickness: 10 
    }).setOrigin(0.5);
  }
  }

  
  
 

const config = {
  width: 1200,
  height: 600,
  type: Phaser.AUTO,
  scale:{
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [MainMenu, GamePlay,GameOver],
  


};




const game = new Phaser.Game(config);
