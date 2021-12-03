class man1 extends Phaser.Scene {
    constructor() {
        super("man1");
    }
    init(data) {
        this.name = data.name;
    }
    preload() {
        this.load.html('chatForm', 'assets/chatForm/chatForm.html');
        this.load.html('nameForm', 'assets/matchingGame/answerForm/answerForm.html');
        this.load.css('answerCss', 'assets/matchingGame/answerForm/answerForm.css');
        this.load.image("ship", "assets/Ship.png");
        this.load.image("tiles", "assets/tiles.png");
        this.load.tilemapTiledJSON("SeaMapDemo23114", "assets/SeaMapDemo23114.json");

        // set
        this.load.audio("button_sound", "assets/matchingGame/audio-button.mp3");
    }
    create() {

        //alert(this.socket.id);
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



        //chat
        //alert(this.name);
        this.elementChat = this.add.dom(175, 550).createFromCache('chatForm');
        //test
        var socket = io();
        var self = this;
        socket.emit('startMan1', { name: self.name });
        socket.on('addToChat', function(data) {
            self.elementChat.getChildByID("chat-text").innerHTML += '<div>' + data + '</div>';
        });

        this.elementChat.getChildByID("chat-form").onsubmit = function(e) {
            e.preventDefault();
            socket.emit('sendMsgToServer', { name: self.name, text: self.elementChat.getChildByID("chat-input").value });
            self.elementChat.getChildByID("chat-input").value = '';
        }

        this.otherPlayers = this.physics.add.group();
        socket.on('currentPlayers', function(players) {
            Object.keys(players).forEach(function(id) {
                if (players[id].playersID === socket.id) {
                    self.addPlayer(self, players[id]);
                } else {
                    self.addOtherPlayers(self, players[id]);
                }
            });
        });
        socket.on('newPlayer', function(playerInfo) {
            self.addOtherPlayers(self, playerInfo);
        });

        //
        //btn
        this.btn_test = this.add.text(210, 400, 'test', { font: '32px Courier', fill: '#000' }).setVisible(true);
        this.btn_test.setInteractive();
        this.btn_test.on('pointerdown', function() {
            this.cameras.main.fade(250);
            // this.cameras.main.flash();
            this.time.delayedCall(250, function() {
                this.button_sound.play();
                this.scene.start('test', { socket: socket });
            }, [], this);
        }, this);

        this.btn_test_2 = this.add.text(510, 400, 'Matching Game', { font: '32px Courier', fill: '#000' }).setVisible(true);
        this.btn_test_2.setInteractive();
        this.btn_test_2.on('pointerdown', function() {
            this.cameras.main.fade(250);
            // this.cameras.main.flash();
            this.time.delayedCall(250, function() {
                this.button_sound.play();
                this.scene.start('man2');
            }, [], this);
        }, this);

        //oki
        // this.otherPlayers = this.physics.add.group();
        // socket.on('currentPlayers', function(players) {
        //     Object.keys(players).forEach(function(id) {
        //         if (players[id].playersID === socket.id) {
        //             self.addPlayer(self, players[id]);
        //         } else {
        //             self.addOtherPlayers(self, players[id]);
        //         }
        //     });
        // });
        // socket.on('newPlayer', function(playerInfo) {
        //     self.addOtherPlayers(self, playerInfo);
        // });

        //oki
        // var this.socket = io();
        // var self = this;
        // socket.on('addToChat', function(data) {
        //     self.elementChat.getChildByID("chat-text").innerHTML += '<div>' + data + '</div>';
        // });

        // this.elementChat.getChildByID("chat-form").onsubmit = function(e) {
        //     e.preventDefault();
        //     socket.emit('sendMsgToServer', { name: self.name, text: self.elementChat.getChildByID("chat-input").value });
        //     self.elementChat.getChildByID("chat-input").value = '';
        // }

        // this.otherPlayers = this.physics.add.group();
        // socket.on('currentPlayers', function(players) {
        //     Object.keys(players).forEach(function(id) {
        //         if (players[id].playersID === socket.id) {
        //             self.addPlayer(self, players[id]);
        //         } else {
        //             self.addOtherPlayers(self, players[id]);
        //         }
        //     });
        // });
        // socket.on('newPlayer', function(playerInfo) {
        //     self.addOtherPlayers(self, playerInfo);
        // });

        // this.otherPlayers = this.physics.add.group();
        // socket.on('currentPlayers', function(player) {
        //     var x = Math.floor(Math.random() * 600) + 200;
        //     var y = Math.floor(Math.random() * 400) + 200;
        //     Object.keys(player).forEach(function(id) {
        //         if (player[id].playersID === self.socket.id) {
        //             self.ship = self.physics.add.image(x, y, 'ship').setScale(0.2);
        //             self.text_ship = self.add.text(x + 30, y - 50, self.name, { fontSize: 10, color: "#FFFFFF" });
        //         } else {
        //             const otherPlayer = self.add.sprite(x, y, 'ship').setScale(0.2);
        //             otherPlayer.playerId = player.playersID;
        //             self.add.text(x + 30, y - 50, self.name, { fontSize: 10, color: "#FFFFFF" });
        //             self.otherPlayers.add(otherPlayer);
        //         }

        //     });
        // });
        // socket.on('newPlayer', function(playerInfo) {
        //     var x = Math.floor(Math.random() * 600) + 200;
        //     var y = Math.floor(Math.random() * 400) + 200;
        //     self.ship = self.physics.add.image(x, y, 'ship').setScale(0.2);
        //     self.text_ship = self.add.text(x + 30, y - 50, self.name, { fontSize: 10, color: "#FFFFFF" });

        //     //self.cameras.main.startFollow(self.ship);
        // });
        // element.addListener('keydown');

        // element.on('keydown', function(event) {
        //     if (event.keyCode == 13) {
        //         var inputText = this.getChildByName('nameField');
        //         console.log(inputText.value);
        //     }
        //if (event.target.name === 'nameField') {
        // var inputText = this.getChildByName('nameField');

        // //  Have they entered anything?
        // if (inputText.value !== '') {
        //     //  Turn off the click events
        //     this.removeListener('keydown');

        //     //  Hide the login element
        //     this.setVisible(false);

        //     //  Populate the text with whatever they typed in
        //     text.setText('Welcome ' + inputText.value);
        //     console.log(inputText.value);
        // } else {
        //     //  Flash the prompt
        //     this.scene.tweens.add({
        //         targets: text,
        //         alpha: 0.2,
        //         duration: 250,
        //         ease: 'Power3',
        //         yoyo: true
        //     });
        // }
        //}

        //});

        // text.on("pointerdown", () => {
        //     element.getChildByName('nameField').value = "";
        // });
    }

    update() {
        // this.cursors = this.input.keyboard.createCursorKeys();
        // if (this.ship) {
        //     if (this.cursors.left.isDown) {
        //         this.ship.setAngularVelocity(-150);
        //     } else if (this.cursors.right.isDown) {
        //         this.ship.setAngularVelocity(150);
        //     } else {
        //         this.ship.setAngularVelocity(0);
        //     }

        //     if (this.cursors.up.isDown) {
        //         this.physics.velocityFromRotation(this.ship.rotation + 1.5, 100, this.ship.body.acceleration);
        //     } else {
        //         this.ship.setAcceleration(0);
        //     }

        //     this.physics.world.wrap(this.ship, 5);
        // }
    }

    addPlayer(self, data) {
        self.ship = self.physics.add.image(data.x, data.y, 'ship').setScale(0.2);
        self.text_ship = self.add.text(data.x, data.y - 100, data.name, { fontSize: 10, color: "#FFFFFF" });
    }

    addOtherPlayers(self, data) {
        const otherPlayer = self.add.sprite(data.x, data.y, 'ship').setScale(0.2);
        self.add.text(data.x, data.y - 100, data.name, { fontSize: 10, color: "#FFFFFF" });
        otherPlayer.playerId = data.playersID;
        self.otherPlayers.add(otherPlayer);
    }
}