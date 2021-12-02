class mainHall extends Phaser.Scene {

    constructor() {
        super("mainHall");
    }

    preload() {
        this.load.image("testBg", "assets/mainHall/testBg.png");
        this.load.image("waterfall", "assets/mainHall/waterfall.jpg");
        this.load.image("base_out_atlas", "assets/mainHall/base_out_atlas.png");
        this.load.image("fishing", "assets/mainHall/fishing.png");
        this.load.image("gemChinh", "assets/mainHall/gemChinh.png");
        this.load.image("map_tree", "assets/mainHall/map_tree.png");
        this.load.image("optionGameQuiz", "assets/mainHall/optionGameQuiz.png");
        this.load.image("Shop", "assets/mainHall/Shop.png");
        this.load.image("textOption", "assets/mainHall/textOption.png");
        // this.load.audio("musicMailHall", "assets/mainHall/musicMailHall.mp3")

        this.load.spritesheet("player", "assets/mainHall/dude.png", {
            frameWidth: 32,
            frameHeight: 48,
        });
        // this.load.spritesheet("player1", "assets/mainHall/dude.png", {
        //     frameWidth: 32,
        //     frameHeight: 48,
        // });
        this.load.tilemapTiledJSON("MainHallMap", "assets/mainHall/MainHall.json");
    }
    create() {
//map
//             this.add.tileSprite(0, 0, 1922, 1200, 'testBg');
//         this.world.setBounds(0, 0, 1920, 1920);
        this.cameras.main.setBounds(0, 0, 1922 , 1200 );
        this.physics.world.setBounds(0, 0, 1922, 1200);

        const map = this.add.tilemap("MainHallMap");

        // this.musicMailHall = this.sound.add("musicMailHall", { loop: false, volume: 0.3 });
        // this.musicMailHall.play();

        const waterfall_tile = map.addTilesetImage("waterfall");
        const base_out_atlas_tile = map.addTilesetImage("base_out_atlas");
        const fishing_tile = map.addTilesetImage("fishing");
        const gemChinh_tile = map.addTilesetImage("gemChinh");
        const map_tree_tile = map.addTilesetImage("map_tree");
        const optionGameQuiz_tile = map.addTilesetImage("optionGameQuiz");
        const shop_tile = map.addTilesetImage("Shop");
        const textOption_tile = map.addTilesetImage("textOption");
        const menu = map.addTilesetImage("waterfall");


        //
        this.backGroundLayer = map.createLayer("background", [base_out_atlas_tile,waterfall_tile,map_tree_tile,fishing_tile,gemChinh_tile,shop_tile,optionGameQuiz_tile,textOption_tile,menu]);
        this.streetLayer = map.createLayer("street", [base_out_atlas_tile,waterfall_tile,map_tree_tile,fishing_tile,gemChinh_tile,shop_tile,optionGameQuiz_tile,textOption_tile,menu]);
        this.volcanoAndTreeLayer = map.createLayer("volcanoAndTree", [base_out_atlas_tile,waterfall_tile,map_tree_tile,fishing_tile,gemChinh_tile,shop_tile,optionGameQuiz_tile,textOption_tile,menu]);
        this.optionGameFishingLayer = map.createLayer("optionGameFishing", [base_out_atlas_tile,waterfall_tile,map_tree_tile,fishing_tile,gemChinh_tile,shop_tile,optionGameQuiz_tile,textOption_tile,menu]);
        this.optionArenaLayer = map.createLayer("optionArena", [base_out_atlas_tile,waterfall_tile,map_tree_tile,fishing_tile,gemChinh_tile,shop_tile,optionGameQuiz_tile,textOption_tile,menu]);
        this.optionShopLayer = map.createLayer("optionShop",[base_out_atlas_tile,waterfall_tile,map_tree_tile,fishing_tile,gemChinh_tile,shop_tile,optionGameQuiz_tile,textOption_tile,menu]);
        this.optionShopLayer = map.createLayer("optionShop",shop_tile,0,0);

        this.optionGameQuizLayer = map.createLayer("optionGameQuiz", [base_out_atlas_tile,waterfall_tile,map_tree_tile,fishing_tile,gemChinh_tile,shop_tile,optionGameQuiz_tile,textOption_tile,menu]);
        this.optionGameQuizLayer = map.createLayer("optionGameQuiz", [base_out_atlas_tile,waterfall_tile,map_tree_tile,fishing_tile,gemChinh_tile,shop_tile,optionGameQuiz_tile,textOption_tile,menu]);
        this.roadLayer = map.createLayer("road",base_out_atlas_tile,0,0);


        this.add.image(0, 0, 'roadLayer').setOrigin(0);
        this.add.image(1922, 0, 'roadLayer').setOrigin(0).setFlipX(true);
        this.add.image(0, 1200, 'roadLayer').setOrigin(0).setFlipY(true);
        this.add.image(1922, 1200, 'roadLayer').setOrigin(0).setFlipX(true).setFlipY(true);

        // this.roadLayer.setCollisionBetween(1, 25);
        // this.roadLayer.setTileLocationCallback(2, 0, 1, 1, this.hitSecretDoor, this);
        //map

        this.player = this.physics.add.sprite(821, 775, 'player').setBounce(0.2);
        // this.player.body.fixedRotation = true;
        this.physics.add.collider(this.player,this.backGroundLayer);
        this.physics.add.collider(this.player,this.streetLayer);
        this.physics.add.collider(this.player,this.volcanoAndTreeLayer);
        this.physics.add.collider(this.player,this.optionGameFishingLayer);
        this.physics.add.collider(this.player,this.optionArenaLayer);
        this.physics.add.collider(this.player,this.optionShopLayer);
        this.physics.add.collider(this.player,this.optionGameQuizLayer);

        this.cursors = this.input.keyboard.createCursorKeys();
//         this.physics.startSystem(Phaser.Physics.P2JS);
//         this.physics.p2.enable(this.player);
        this.player.setCollideWorldBounds(true);
        // this.player = this.physics.add.sprite(100, 300, 'player');
        // this.player.;
        // this.player.setCollideWorldBounds(true);
        // this.player.setGravityY(1000);
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'player', frame: 4 } ],
            frameRate: 20
        });
        
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        // this.camera.follow(this.player, Phaser.Cameras.FOLLOW_LOCKON, 0.1, 0.1);
        this.cameras.main.startFollow(this.player);

        this.cameras.main.followOffset.set(-50, 0);




    }

    update() {
        //this.player.setVelocity(0);
         //this.player.anims.play("left",true);
        if (this.cursors.left.isDown)
        {

            this.player.setVelocityX(-150);
            this.player.anims.play("left",true);

        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(150);
            this.player.anims.play("right",true);
        }

        else if (this.cursors.up.isDown)
        {
            this.player.setVelocityY(-150);
            this.player.anims.play("turn",true);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.setVelocityY(150);
        } else {
            this.player.setVelocityY(0);
            this.player.setVelocityX(0);
            this.player.anims.play("turn",true);
        }

    }
}