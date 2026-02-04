import background from './sprites/background.jpg';

class MainMenu extends Phaser.Scene
{
    constructor()
    
    {
        super('Main Menu');
    }

    preload() {
    this.load.image('background', background);
  }
}