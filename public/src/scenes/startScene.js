class startScene extends Phaser.Scene {
    constructor() {
        super("startScene");
    }

    preload() {
        //this.load.html('chatForm', 'assets/chatForm/chatForm.html');
        this.load.html('nameForm', 'assets/matchingGame/answerForm/answerForm.html');
        this.load.css('answerCss', 'assets/matchingGame/answerForm/answerForm.css');
        this.load.image("ship", "assets/Ship.png");
        this.load.image("tiles", "assets/tiles.png");
        this.load.tilemapTiledJSON("SeaMapDemo23114", "assets/SeaMapDemo23114.json");

        // set
        this.load.audio("button_sound", "assets/matchingGame/audio-button.mp3");
    }
    create() {


        const map = this.add.tilemap("SeaMapDemo23114");
        const natural_tile = map.addTilesetImage("tiles");
        const SeaLayer = map.createLayer("sea_bg", [natural_tile]);
        const IslandLayer = map.createLayer("island", [natural_tile]);

        this.ship = this.physics.add.sprite(500, 500, 'ship').setScale(0.2);
        this.ship.setCollideWorldBounds(true);
        this.ship.setDrag(100);
        this.ship.setAngularDrag(100);
        this.ship.setMaxVelocity(200);
        // set va chạm với biến platform

        this.physics.add.collider(this.ship, IslandLayer);

        // set
        this.button_sound = this.sound.add("button_sound", { loop: false });
        //
        this.btn_test = this.add.text(210, 400, 'Check', { font: '32px Courier', fill: '#000' }).setVisible(true);
        this.btn_test.setInteractive();
        this.btn_test.on('pointerdown', function() {
            this.cameras.main.fade(250);
            // this.cameras.main.flash();
            this.time.delayedCall(250, function() {
                this.button_sound.play();
                this.scene.start('man2');
            }, [], this);
        }, this);

        this.text = this.add.text(600, 300, 'Oki', { color: '#000', fontSize: '20px ' });
        this.text.setInteractive();
        this.elementName = this.add.dom(400, 300).createFromCache('nameForm');

        this.text.on("pointerdown", () => {
            if ((this.elementName.getChildByName('nameField').value).trim().length > 0) {
                this.cameras.main.fade(250);
                this.time.delayedCall(250, function() {
                    this.button_sound.play();
                    this.scene.start('man1', { name: this.elementName.getChildByName('nameField').value });
                }, [], this);
            }
        });
        // //chat

        // this.elementChat = this.add.dom(175, 550).createFromCache('chatForm');
        // var socket = io();
        // socket.on('addToChat', function(data) {
        //     this.elementChat.getChildByID("chat-text").innerHTML += '<div>' + data + '</div>';
        // });
        // this.elementChat.getChildByID('chat-form').onsubmit = function(e) {
        //     e.preventDefault();
        //     socket.emit('sendMsgToServer', { name: this.name, text: this.elementChat.getChildByID("chat-input").value });
        //     this.elementChat.getChildByID("chat-input").value = '';
        // }

    }

    update() {

    }
}