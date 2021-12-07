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
        var self = this;
        this.socket = io();
        
        this.otherPlayers = this.physics.add.group();
        this.otherPlayers_name = this.add.group();
        this.socket.emit('startMainHall', { name: self.name });
        this.socket.on('addToChat', function (data) {
            self.elementChat.getChildByID("chat-text").innerHTML += '<div>' + data + '</div>';
        });

        this.elementChat.getChildByID("chat-form").onsubmit = function (e) {
            e.preventDefault();
            self.socket.emit('sendMsgToServer', { name: self.name, text: self.elementChat.getChildByID("chat-input").value });
            self.elementChat.getChildByID("chat-input").value = '';
        }


        this.socket.on('currentPlayersMain', function (players) {
            Object.keys(players).forEach(function (id) {
                if (players[id].playersID === self.socket.id) {
                    self.addPlayer(self, players[id]);
                } else {
                    self.addOtherPlayer(self, players[id]);
                }
            });
        });


        this.socket.on('newPlayerMain', function (playerInfo) {
            self.addOtherPlayer(self, playerInfo);
        });


        function addPlayer(self, playerInfo) {

            self.player = self.physics.add.sprite(playerInfo.x, playerInfo.y, 'player').setScale(0.2);
             self.player.setCollideWorldBounds(true);
             self.player_name = self.add.text(playerInfo.x - 20, playerInfo.y - 50,playerInfo.name, { fontSize: 54, color: "#800000" });
             self.cameras.main.startFollow(self.player);

        }

        function addOtherPlayer(self, playerInfo) {
            const other = self.otherPlayers.create(playerInfo.x, playerInfo.y, "player");
            other.playersID = playerInfo.playersID;
            const other_name = self.otherPlayers_name.create(playerInfo.x - 20, playerInfo.y - 50, playerInfo.name, { fontSize: 32, color: "#800000" });
        }
        //map

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

        this.socket.on("player_moved",function(playerInfo){
            self.otherPlayers.getChildren().forEach(function (other) {
                if (playerInfo.playersID == other.playersID) {
                    other.setPosition(playerInfo.x, playerInfo.y);
                    other.anims.play(playerInfo.status);
                }
            });
            self.otherPlayers_name.getChildren().forEach(function (other) {
                if (playerInfo.playersID == other.playersID) {
                    other.setPosition(playerInfo.x-30, playerInfo.y-50);
                    //other.setRotation(playerInfo.rotation);
                }
            });
        })

        
       

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
        this.backGroundLayer = map.createLayer("background", [map_tree_tile]);
        this.streetLayer = map.createLayer("street", [base_out_atlas_tile,waterfall_tile, map_tree_tile]);
        this.volcanoAndTreeLayer = map.createLayer("volcanoAndTree", [base_out_atlas_tile, map_tree_tile]);
        this.pedestal = map.createLayer("pedestal", [ map_tree_tile]);
        this.optionGameFishingLayer = map.createLayer("optionGameFishing", [ fishing_tile, textOption_tile]);
        this.optionArenaLayer = map.createLayer("optionArena", [ gemChinh_tile, textOption_tile]);
        this.optionShopLayer = map.createLayer("optionShop", [ shop_tile, textOption_tile]);
        //this.optionShopLayer = map.createLayer("optionShop", shop_tile, 0, 0);

        this.optionGameQuizLayer = map.createLayer("optionGameQuiz", [optionGameQuiz_tile, textOption_tile]);
        this.roadLayer = map.createLayer("road", [base_out_atlas_tile]);
        this.wall =map.createLayer("wall",[base_out_atlas_tile]);


        // this.add.image(0, 0, 'roadLayer').setOrigin(0);
        // this.add.image(1922, 0, 'roadLayer').setOrigin(0).setFlipX(true);
        // this.add.image(0, 1200, 'roadLayer').setOrigin(0).setFlipY(true);
        // this.add.image(1922, 1200, 'roadLayer').setOrigin(0).setFlipX(true).setFlipY(true);

        //map


        
        this.backGroundLayer.setCollisionBetween(0, 20000);
        //this.wall.setCollisionByProperty({ collides: true });
        this.wall.setCollisionBetween(0,20000);
        this.volcanoAndTreeLayer.setCollisionBetween(0, 20000);
        this.optionGameFishingLayer.setCollisionBetween(0, 20000);
        this.optionArenaLayer.setCollisionBetween(0, 20000);
        this.optionShopLayer.setCollisionBetween(0, 20000);
        this.optionGameQuizLayer.setCollisionBetween(0, 20000);
        this.streetLayer.setCollisionBetween(0, 20000);
        this.cursors = this.input.keyboard.createCursorKeys();
        
       
        
    }

    update() {
        
        if (this.player&&this.player_name) {
            var status;
            if (this.cursors.left.isDown) {

                this.player.setVelocityX(-150);
                this.player.anims.play("left", true);
                status="left";

            } else if (this.cursors.right.isDown) {
                this.player.setVelocityX(150);
                this.player.anims.play("right", true);
                status="right";
            } else if (this.cursors.up.isDown) {
                this.player.setVelocityY(-150);
                this.player.anims.play("turn", true);
                status="turn";
            } else if (this.cursors.down.isDown) {
                this.player.setVelocityY(150);
            } else {
                this.player.setVelocityY(0);
                this.player.setVelocityX(0);
                this.player.anims.play("turn", true);
                status="turn";
            }
             this.player_name.x = this.player.x-20;
             this.player_name.y = this.player.y - 50;

             var x = this.player.x;
             var y = this.player.y;
             
             //var z = this.ship.rotation;
             this.socket.emit("movement_player", { x: this.player.x, y: this.player.y,status:status});
            
             this.player.oldposition = {
                 x: this.player.x,
                 y: this.player.y,
                
             }

        }
    }

    addPlayer(self, data) {
        self.player = self.physics.add.sprite(data.x, data.y, 'player');
        self.player_name = self.add.text(data.x, data.y - 50, data.name, { fontSize: 20, color: "#800000" });
        self.physics.add.collider(self.player, self.wall);
        self.physics.add.collider(self.player, self.backGroundLayer);
        self.physics.add.collider(self.player, self.streetLayer);
        self.physics.add.collider(self.player, self.volcanoAndTreeLayer);
        self.physics.add.collider(self.player, self.optionGameFishingLayer,self.enter_quiz,null,self);
        self.physics.add.collider(self.player, self.optionArenaLayer,self.enter_quiz,null,self);
        self.physics.add.collider(self.player, self.optionShopLayer,self.enter_quiz,null,self);
        self.physics.add.collider(self.player, self.optionGameQuizLayer,self.enter_quiz,null,self);
        
        self.cameras.main.startFollow(self.player);
       
    }

    addOtherPlayer(self, data) {
        const otherPlayer = self.add.sprite(data.x, data.y, 'player');
        const player_name=self.add.text(data.x, data.y - 50, data.name, { fontSize: 20, color: "#000" });
        otherPlayer.playersID = data.playersID;
        self.otherPlayers.add(otherPlayer);
        self.otherPlayers_name.add(player_name);
    }
    enter_quiz(player,optionGameQuizLayer){
        this.scene.start("Preload");
    }
}