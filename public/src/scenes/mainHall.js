class mainHall extends Phaser.Scene {

    constructor() {
        super("mainHall");
    }
    init(data) {
        this.name = data.name;
    }
    preload() {
        //chatting
        this.load.html('chatForm', 'assets/chatForm/chatForm.html');

        this.load.image("testBg", "assets/mainHall/testBg.png");
        this.load.image("waterfall", "assets/mainHall/waterfall.jpg");
        this.load.image("base_out_atlas", "assets/mainHall/base_out_atlas.png");
        this.load.image("fishing", "assets/mainHall/fishing.png");
        this.load.image("gemChinh", "assets/mainHall/gemChinh.png");
        this.load.image("map_tree", "assets/mainHall/map_tree.png");
        this.load.image("optionGameQuiz", "assets/mainHall/optionGameQuiz.png");
        this.load.image("Shop", "assets/mainHall/Shop.png");
        this.load.image("textOption", "assets/mainHall/textOption.png");

        this.load.spritesheet("player", "assets/mainHall/dude.png", {
            frameWidth: 32,
            frameHeight: 48,
        });
        this.load.tilemapTiledJSON("MainHallMap", "assets/mainHall/MainHall.json");
    }
    create() {

        //chatting
        this.elementChat = this.add.dom(175, 540).createFromCache('chatForm').setScrollFactor(0);
        var socket = io();
        var self = this;
        socket.emit('startMainHall', { name: self.name });
        socket.on('addToChat', function(data) {
            self.elementChat.getChildByID("chat-text").innerHTML += '<div>' + data + '</div>';
        });

        this.elementChat.getChildByID("chat-form").onsubmit = function(e) {
            e.preventDefault();
            socket.emit('sendMsgToServer', { name: self.name, text: self.elementChat.getChildByID("chat-input").value });
            self.elementChat.getChildByID("chat-input").value = '';
        }


        //map

        this.cameras.main.setBounds(0, 0, 1922, 1200);
        this.physics.world.setBounds(0, 0, 1922, 1200);

        const map = this.add.tilemap("MainHallMap");


        const waterfall_tile = map.addTilesetImage("waterfall");
        const base_out_atlas_tile = map.addTilesetImage("base_out_atlas");
        const fishing_tile = map.addTilesetImage("fishing");
        const gemChinh_tile = map.addTilesetImage("gemChinh");
        const map_tree_tile = map.addTilesetImage("map_tree");
        const optionGameQuiz_tile = map.addTilesetImage("optionGameQuiz");
        const shop_tile = map.addTilesetImage("Shop");
        const textOption_tile = map.addTilesetImage("textOption");
        //const menu = map.addTilesetImage("waterfall");


        //
        this.backGroundLayer = map.createLayer("background", [base_out_atlas_tile, waterfall_tile, map_tree_tile, map_tree_tile, fishing_tile, gemChinh_tile, shop_tile, optionGameQuiz_tile, textOption_tile]);
        this.streetLayer = map.createLayer("street", [base_out_atlas_tile, waterfall_tile, map_tree_tile, map_tree_tile, fishing_tile, gemChinh_tile, shop_tile, optionGameQuiz_tile, textOption_tile]);
        this.volcanoAndTreeLayer = map.createLayer("volcanoAndTree", [base_out_atlas_tile, waterfall_tile, map_tree_tile, map_tree_tile, fishing_tile, gemChinh_tile, shop_tile, optionGameQuiz_tile, textOption_tile]);
        this.volcanoAndTreeLayer = map.createLayer("pedestal", [base_out_atlas_tile, waterfall_tile, map_tree_tile, map_tree_tile, fishing_tile, gemChinh_tile, shop_tile, optionGameQuiz_tile, textOption_tile]);
        this.optionGameFishingLayer = map.createLayer("optionGameFishing", [base_out_atlas_tile, waterfall_tile, map_tree_tile, map_tree_tile, fishing_tile, gemChinh_tile, shop_tile, optionGameQuiz_tile, textOption_tile]);
        this.optionArenaLayer = map.createLayer("optionArena", [base_out_atlas_tile, waterfall_tile, map_tree_tile, map_tree_tile, fishing_tile, gemChinh_tile, shop_tile, optionGameQuiz_tile, textOption_tile]);
        this.optionShopLayer = map.createLayer("optionShop", [base_out_atlas_tile, waterfall_tile, map_tree_tile, map_tree_tile, fishing_tile, gemChinh_tile, shop_tile, optionGameQuiz_tile, textOption_tile]);
        this.optionShopLayer = map.createLayer("optionShop", shop_tile, 0, 0);

        this.optionGameQuizLayer = map.createLayer("optionGameQuiz", [base_out_atlas_tile, waterfall_tile, map_tree_tile, fishing_tile, gemChinh_tile, shop_tile, optionGameQuiz_tile, textOption_tile]);
        this.roadLayer = map.createLayer("road", base_out_atlas_tile, 0, 0);


        this.add.image(0, 0, 'roadLayer').setOrigin(0);
        this.add.image(1922, 0, 'roadLayer').setOrigin(0).setFlipX(true);
        this.add.image(0, 1200, 'roadLayer').setOrigin(0).setFlipY(true);
        this.add.image(1922, 1200, 'roadLayer').setOrigin(0).setFlipX(true).setFlipY(true);

        //map

        // this.player = this.physics.add.sprite(821, 775, 'player').setBounce(0.2);
        // this.physics.add.collider(this.player, this.backGroundLayer);
        // this.physics.add.collider(this.player, this.streetLayer);
        // this.physics.add.collider(this.player, this.volcanoAndTreeLayer);
        // this.physics.add.collider(this.player, this.optionGameFishingLayer);
        // this.physics.add.collider(this.player, this.optionArenaLayer);
        // this.physics.add.collider(this.player, this.optionShopLayer);
        // this.physics.add.collider(this.player, this.optionGameQuizLayer);
        // this.backGroundLayer.setCollisionBetween(0, 10000);
        // this.volcanoAndTreeLayer.setCollisionBetween(0, 10000);
        // this.cursors = this.input.keyboard.createCursorKeys();
        // this.player.setCollideWorldBounds(true);
        // this.anims.create({
        //     key: 'left',
        //     frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        //     frameRate: 10,
        //     repeat: -1
        // });

        // this.anims.create({
        //     key: 'turn',
        //     frames: [{ key: 'player', frame: 4 }],
        //     frameRate: 20
        // });

        // this.anims.create({
        //     key: 'right',
        //     frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
        //     frameRate: 10,
        //     repeat: -1
        // });
        // //camera follow
        // this.cameras.main.startFollow(this.player);
        // this.cameras.main.followOffset.set(-50, 0);

        //player
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


    }

    update() {
        // if (this.cursors.left.isDown) {

        //     this.player.setVelocityX(-150);
        //     this.player.anims.play("left", true);

        // } else if (this.cursors.right.isDown) {
        //     this.player.setVelocityX(150);
        //     this.player.anims.play("right", true);
        // } else if (this.cursors.up.isDown) {
        //     this.player.setVelocityY(-150);
        //     this.player.anims.play("turn", true);
        // } else if (this.cursors.down.isDown) {
        //     this.player.setVelocityY(150);
        // } else {
        //     this.player.setVelocityY(0);
        //     this.player.setVelocityX(0);
        //     this.player.anims.play("turn", true);
        // }

    }

    addPlayer(self, data) {
        self.ship = self.physics.add.image(data.x, data.y, 'ship').setScale(0.2);
        self.text_ship = self.add.text(data.x, data.y - 50, data.name, { fontSize: 10, color: "#000" });
    }

    addOtherPlayers(self, data) {
        const otherPlayer = self.add.sprite(data.x, data.y, 'ship').setScale(0.2);
        self.add.text(data.x, data.y - 50, data.name, { fontSize: 10, color: "#000" });
        otherPlayer.playerId = data.playersID;
        self.otherPlayers.add(otherPlayer);
    }
}