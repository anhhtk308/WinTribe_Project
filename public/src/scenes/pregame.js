class pregame extends Phaser.Scene {
    constructor() {
        super("pregame");
    }
    preload() {
        this.load.image("background_pregame", "assets/background_pregame.png");
        this.load.image("title", "assets/game_title.png");
        this.load.image("guide", "assets/button_guide.png");
        this.load.image("play", "assets/button_play.png");
    }
    create() {
        this.add.image(400, 300, "background_pregame").setScale(0.6);
        this.add.image(420, 260, "title").setScale(0.5);
        this.guide = this.add.image(480, 450, "guide").setScale(0.8);
        this.play = this.add.image(340, 447, "play").setScale(0.8);
        this.guide.setInteractive();
        this.play.setInteractive();
        this.play.on('pointerup', () => {
            this.scene.start('man2');
        });
    }
    update() { }
}