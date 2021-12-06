class startScene extends Phaser.Scene {
    constructor() {
        super("startScene");
    }

    preload() {
        this.load.html('nameForm', 'assets/nameForm/nameForm.html');
        this.load.css('answerCss', 'assets/nameForm/nameForm.css');
        this.load.image("bg", "assets/startScene/3.png");
        this.load.image("start_btn", "assets/startScene/start_btn.png");
        // set
        this.load.audio("button_sound", "assets/matchingGame/audio-button.mp3");
    }
    create() {
        // set
        this.button_sound = this.sound.add("button_sound", { loop: false });
        this.background = this.add.image(400, 300, 'bg');
        this.startBtn = this.add.image(615, 385, 'start_btn').setScale(0.04);
        this.startBtn.setInteractive();
        this.elementName = this.add.dom(380, 370).createFromCache('nameForm');
        //go to main
        this.startBtn.on("pointerdown", () => {
            if ((this.elementName.getChildByName('nameField').value).trim().length > 0) {
                this.cameras.main.fade(250);
                this.time.delayedCall(250, function() {
                    this.button_sound.play();
                    this.scene.start('mainHall', { name: this.elementName.getChildByName('nameField').value });
                }, [], this);
            }
        });
    }

    update() {}

}