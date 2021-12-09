class mainHall extends Phaser.Scene {

    constructor() {
        super("mainHall");
    }
    init(data) {
        this.name = data.name;
        this.socket = data.socket;
        this.player = undefined;
    }
    preload() {
        //chatting
        this.load.html('chatForm', 'assets/chatForm/chatForm.html');
        this.load.css('chatFormCss', 'assets/chatForm/chatForm.css');

        this.load.image("testBg", "assets/mainHall/testBg.png");
        this.load.image("waterfall", "assets/mainHall/waterfall.jpg");
        this.load.image("base_out_atlas", "assets/mainHall/base_out_atlas.png");
        this.load.image("fishing", "assets/mainHall/fishing.png");
        this.load.image("gemChinh", "assets/mainHall/gemChinh.png");
        this.load.image("map_tree", "assets/mainHall/map_tree.png");
        this.load.image("optionGameQuiz", "assets/mainHall/optionGameQuiz.png");
        this.load.image("Shop", "assets/mainHall/Shop.png");
        this.load.image("textOption", "assets/mainHall/textOption.png");
        this.load.image("frameGold", "assets/mainHall/111.png");
        this.load.image("goldImg", "assets/mainHall/333.png");

        this.load.spritesheet("player", "assets/mainHall/dude.png", {
            frameWidth: 32,
            frameHeight: 48,
        });
        this.load.tilemapTiledJSON("MainHallMap", "assets/mainHall/MainHall.json");

        this.load.audio("music_bg_main", "assets/mainHall/mainHallBGMusic.mp3");

    }
    create() {
        //music
        this.music_bg_main = this.sound.add("music_bg_main", { loop: true, volume: 0.3 });
        this.music_bg_main.play();

        //chatting
        this.elementChat = this.add.dom(175, 543).createFromCache('chatForm').setScrollFactor(0);
        this.otherPlayers = this.physics.add.group();
        this.otherPlayers_name = this.physics.add.group();
        var self = this;
        if (typeof this.socket === 'undefined') {
            this.socket = io();
            this.socket.on('addToChat', function(data) {
                self.elementChat.getChildByID("chat-text").innerHTML += '<div>' + data + '</div>';
            });
            this.socket.on('currentPlayersMain', function(players) {
                Object.keys(players).forEach(function(id) {
                    if (players[id].playersID === self.socket.id) {
                        self.addPlayer(self, players[id]);
                    } else {
                        self.addOtherPlayer(self, players[id]);
                    }
                });
            });

            this.socket.on('newPlayerMain', function(playerInfo) {
                self.addOtherPlayer(self, playerInfo);
            });
        }

        this.socket.emit('startMainHall', { name: self.name });

        //chatting
        this.elementChat.getChildByID("chat-form").onsubmit = function(e) {
            e.preventDefault();
            if ((self.elementChat.getChildByID("chat-input").value).trim() !== '') {
                self.socket.emit('sendMsgToServer', { name: self.name, text: self.elementChat.getChildByID("chat-input").value });
                self.elementChat.getChildByID("chat-input").value = '';
            }
        }

        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.keyEnter.on('down', function(key, event) {
            if ((self.elementChat.getChildByID("chat-input").value).trim() !== '') {
                self.socket.emit('sendMsgToServer', { name: self.name, text: self.elementChat.getChildByID("chat-input").value });
                self.elementChat.getChildByID("chat-input").value = '';
            }
        }, this);

        //animation
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'player', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        //move
        this.socket.on("player_moved", function(playerInfo) {
            self.otherPlayers.getChildren().forEach(function(other) {
                if (playerInfo.playersID === other.playersID) {
                    other.setPosition(playerInfo.x, playerInfo.y);
                    other.anims.play(playerInfo.status, true);
                }
            });
            self.otherPlayers_name.getChildren().forEach(function(other) {
                if (playerInfo.playersID === other.playersID) {
                    other.setPosition(playerInfo.x - 20, playerInfo.y - 50);
                }
            });
        });

        //destroy

        this.socket.on('disconnected_Main', function(id) {
            self.otherPlayers.getChildren().forEach(function(other) {
                if (id == other.playersID) {
                    other.destroy();
                }
            });
            self.otherPlayers_name.getChildren().forEach(function(other) {
                if (id === other.playersID) {
                    other.destroy();
                }
            });
        });

        this.socket.on('destroy_player_main', function(data) {
            self.otherPlayers.getChildren().forEach(function(other) {
                if (data.playersID == other.playersID) {
                    other.destroy();
                }
            });
            self.otherPlayers_name.getChildren().forEach(function(other) {
                if (data.playersID === other.playersID) {
                    other.destroy();
                }
            });
        });

        //map
        ////////////////-----------------------------------------
        const map = this.add.tilemap("MainHallMap");
        const waterfall_tile = map.addTilesetImage("waterfall");
        const base_out_atlas_tile = map.addTilesetImage("base_out_atlas");
        const fishing_tile = map.addTilesetImage("fishing");
        const gemChinh_tile = map.addTilesetImage("gemChinh");
        const map_tree_tile = map.addTilesetImage("map_tree");
        const optionGameQuiz_tile = map.addTilesetImage("optionGameQuiz");
        const shop_tile = map.addTilesetImage("Shop");
        const textOption_tile = map.addTilesetImage("textOption");

        //--------------------------------------------
        this.backGroundLayer = map.createLayer("background", [map_tree_tile]);
        this.streetLayer = map.createLayer("street", [base_out_atlas_tile, waterfall_tile, map_tree_tile]);
        this.volcanoAndTreeLayer = map.createLayer("volcanoAndTree", [base_out_atlas_tile, map_tree_tile]);
        this.pedestal = map.createLayer("pedestal", [map_tree_tile]);
        this.optionGameFishingLayer = map.createLayer("optionGameFishing", [fishing_tile, textOption_tile]);
        this.optionArenaLayer = map.createLayer("optionArena", [gemChinh_tile, textOption_tile]);
        this.optionShopLayer = map.createLayer("optionShop", [shop_tile, textOption_tile]);
        this.optionGameQuizLayer = map.createLayer("optionGameQuiz", [optionGameQuiz_tile, textOption_tile]);
        this.roadLayer = map.createLayer("road", [base_out_atlas_tile]);
        this.wall = map.createLayer("wall", [base_out_atlas_tile]);

        //map collision
        this.backGroundLayer.setCollisionBetween(0, 20000);
        this.wall.setCollisionBetween(0, 20000);
        this.volcanoAndTreeLayer.setCollisionBetween(0, 20000);
        this.optionGameFishingLayer.setCollisionBetween(0, 20000);
        this.optionArenaLayer.setCollisionBetween(0, 20000);
        this.optionShopLayer.setCollisionBetween(0, 20000);
        this.optionGameQuizLayer.setCollisionBetween(0, 20000);
        this.streetLayer.setCollisionBetween(0, 20000);

        //hide or show chat
        this.hide = this.add.text(350, 573, '<<', { color: '#000', fontSize: '30px' }).setScrollFactor(0);
        this.hide.setInteractive();
        this.hide.on("pointerdown", () => {
            if (this.hide.text === '<<') {
                this.tweens.add({ targets: self.elementChat, x: -200, duration: 500, ease: 'Back' });
                this.tweens.add({ targets: self.hide, x: 0, duration: 500, ease: 'Back' });
                this.hide.setText('>>');
            } else {
                this.tweens.add({ targets: self.elementChat, x: 175, duration: 500, ease: 'Back' });
                this.tweens.add({ targets: self.hide, x: 350, duration: 500, ease: 'Back' });
                this.hide.setText('<<');
            }
        });

        //gold
        this.frameGold = this.add.image(700, 10, 'frameGold').setScale(0.085).setScrollFactor(0);
        this.goldImg = this.add.image(665, 40, 'goldImg').setScale(0.03).setScrollFactor(0);
        this.socket.on('getPlayerMain', function(playerInfo) {
            self.gold = playerInfo.gold;
            self.textGold = self.add.text(680, 26, self.gold, { font: '30px', color: 'red' }).setScrollFactor(0);
        });
    }

    update() {
        this.cursors = this.input.keyboard.addKeys({
            up: 'up',
            down: 'down',
            left: 'left',
            right: 'right'
        }); // keys.up, keys.down, keys.left, keys.right
        if (this.player && this.player_name) {
            var status;
            if (this.cursors.left.isDown) {

                this.player.setVelocityX(-150);
                this.player.anims.play("left", true);
                status = "left";

            } else if (this.cursors.right.isDown) {
                this.player.setVelocityX(150);
                this.player.anims.play("right", true);
                status = "right";
            } else if (this.cursors.up.isDown) {
                this.player.setVelocityY(-150);
                this.player.anims.play("turn", true);
                status = "turn";
            } else if (this.cursors.down.isDown) {
                this.player.setVelocityY(150);
                status = "turn";
            } else {
                this.player.setVelocityY(0);
                this.player.setVelocityX(0);
                this.player.anims.play("turn", true);
                status = "turn";
            }
            this.player_name.x = this.player.x - 20;
            this.player_name.y = this.player.y - 50;

            var x = this.player.x;
            var y = this.player.y;

            if (this.player.oldPosition && (x !== this.player.oldPosition.x || y !== this.player.oldPosition.y)) {
                this.socket.emit("movement_player", { x: this.player.x, y: this.player.y, status: status });
            }
            this.player.oldPosition = {
                x: this.player.x,
                y: this.player.y,

            }

        }
    }

    addPlayer(self, data) {
        self.player = self.physics.add.sprite(data.x, data.y, 'player');
        self.player_name = self.add.text(data.x - 20, data.y - 50, data.name, { fontSize: 20, color: "#800000" });
        self.physics.add.collider(self.player, self.wall);
        self.physics.add.collider(self.player, self.backGroundLayer);
        self.physics.add.collider(self.player, self.streetLayer);
        self.physics.add.collider(self.player, self.volcanoAndTreeLayer);
        self.physics.add.collider(self.player, self.optionGameFishingLayer, self.enter_fish, null, self);
        self.physics.add.collider(self.player, self.optionShopLayer, self.enter_shop, null, self);
        self.physics.add.collider(self.player, self.optionArenaLayer, self.enter_area, null, self);
        self.physics.add.collider(self.player, self.optionGameQuizLayer, self.enter_quiz, null, self);
        self.cameras.main.startFollow(self.player);

    }

    addOtherPlayer(self, data) {
        const otherPlayer = self.physics.add.sprite(data.x, data.y, 'player');
        const player_name = self.add.text(data.x - 20, data.y - 50, data.name, { fontSize: 20, color: "#000" });
        otherPlayer.playersID = data.playersID;
        player_name.playersID = data.playersID;
        self.otherPlayers.add(otherPlayer);
        self.otherPlayers_name.add(player_name);
    }
    enter_quiz(player, optionGameQuizLayer) {
        this.music_bg_main.stop();
        this.socket.emit('destroy_main');
        this.scene.start("matchingGame", { socket: this.socket, name: this.name });
    }

    enter_shop(player, optionGame) {
        this.music_bg_main.stop();
        this.socket.emit('destroy_main');
        this.scene.start("shopScene", { socket: this.socket, name: this.name });
    }

    enter_area(player, optionGameQuizLayer) {
        this.music_bg_main.stop();
        this.socket.emit('destroy_main');
        this.scene.start("man_khoi_tao", { name: this.name, socket: this.socket });
    }

    enter_fish(player, optionGameQuizLayer) {
        this.music_bg_main.stop();
        this.socket.emit('destroy_main');
        this.scene.start("preGoFishing", { socket: this.socket, name: this.name });
    }
}