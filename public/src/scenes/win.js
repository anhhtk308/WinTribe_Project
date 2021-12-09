class win extends Phaser.Scene {
    constructor() {
        super("win");
    }
    init(data){
       this.name=data.name;
       this.socket=data.socket
    }
    preload(){
        this.load.image("win","assets/GameMain/win.jpg");
        this.load.image("restart",'assets/GameMain/btn_restart.png');
        this.load.audio("button_sound", "assets/matchingGame/audio-button.mp3");

    }
    create(){
        this.video_over=this.add.image(400,300,"win")
        this.button_sound = this.sound.add("button_sound", { loop: false });
        this.btn= this.add.image(400,340,"restart").setScale(0.15);
        this.btn.setInteractive();
        this.btn.on('pointerdown', function (pointer) {
           this.button_sound.play();
            window.location.reload();
    
        });

    }
    update(){

    }

}