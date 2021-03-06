class preGoFishing extends Phaser.Scene {
    constructor() {
        super("preGoFishing");
    }
    init(data) {
        this.name = data.name;
        this.socket = data.socket;
    }
    preload() {
        this.load.image("background_pregame", "assets/goFishingAssets/background_pregame.png");
        this.load.image("title", "assets/goFishingAssets/game_title.png");
        this.load.image("guide", "assets/goFishingAssets/button_guide.png");
        this.load.image("play", "assets/goFishingAssets/button_play.png");
        this.load.image("frame", "assets/goFishingAssets/frame.png");
        this.load.image("icon_x", "assets/goFishingAssets/icon_x.png");
        this.load.audio("background_sound", "assets/goFishingAssets/background_sound.mp3");
    }
    create() {


        this.add.image(400, 300, "background_pregame").setScale(0.6);
        this.title = this.add.image(420, 260, "title").setScale(0.5);
        this.guide = this.add.image(480, 450, "guide").setScale(0.8);
        this.play = this.add.image(340, 447, "play").setScale(0.8);
        this.guide.setInteractive();
        this.play.setInteractive();
        this.play.on('pointerup', () => {
            this.scene.start('goFishing', { socket: this.socket, name: this.name });
        });
        this.icon_close = this.physics.add.image(400, -280, "icon_x").setScale(0.3);
        this.icon_close.setInteractive();
        this.guide.on('pointerup', () => {
            this.frame = this.physics.add.image(400, -300, "frame").setScale(0.8);
            this.tweens.add({ targets: this.frame, y: 300, duration: 1000, ease: 'Back' });
            this.tweens.add({ targets: this.icon_close, y: 90, duration: 1000, ease: 'Back' });
            this.title.setVisible(false);
            this.guide.setVisible(false);
            this.play.setVisible(false);
        });
        this.icon_close.on('pointerdown', () => {
            console.log(1);
            this.tweens.add({ targets: this.frame, y: -300, duration: 1000, ease: 'Back' });
            this.tweens.add({ targets: this.icon_close, y: -300, duration: 1000, ease: 'Back' });
            this.title.setVisible(true);
            this.guide.setVisible(true);
            this.play.setVisible(true);
        });
    }
    update() { }
}