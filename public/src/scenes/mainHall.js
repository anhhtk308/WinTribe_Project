class MainHall extends Phaser.Scene {
    constructor() {
        super("mainHall");
    }

    preload() {
        this.load.image("waterfall", "assets/mainHall/waterfall.jpg");
        this.load.image("base_out_atlas", "assets/mainHall/base_out_atlas.jpg");
        this.load.image("fishing", "assets/mainHall/fishing.jpg");
        this.load.image("gemChinh", "assets/mainHall/gemChinh.jpg");
        this.load.image("map_tree", "assets/mainHall/map_tree.jpg");
        this.load.image("optionGameQuiz", "assets/mainHall/optionGameQuiz.jpg");
        this.load.image("shop", "assets/mainHall/Shop.jpg");
        this.load.image("textOption", "assets/mainHall/textOption.jpg");
        this.load.image("mainCharacter", "assets/mainHall/mainCharacter.jpg");

        this.load.tilemapTiledJSON("MainHallMap", "assets/mainHall/MainHall.json");
    }
    create() {

        const map = this.add.tilemap("MainHallMap");

        // const waterfall_tile = map.addTilesetImage("waterfall");
        // const base_out_atlas_tile = map.addTilesetImage("base_out_atlas");
        // const fishing_tile = map.addTilesetImage("fishing");
        // const gemChinh_tile = map.addTilesetImage("gemChinh");
        // const map_tree_tile = map.addTilesetImage("map_tree");
        // const optionGameQuiz_tile = map.addTilesetImage("optionGameQuiz");
        // const shop_tile = map.addTilesetImage("shop");
        // const textOption_tile = map.addTilesetImage("textOption");
        // const mainCharacter_tile = map.addTilesetImage("mainCharacter");



        const backGroundLayer = map.createLayer("background", [base_out_atlas_tile,waterfall_tile,map_tree_tile,fishing_tile,gemChinh_tile,optionGameQuiz_tile,shop_tile,textOption_tile]);
        // const roadLayer = map.createLayer("road", [base_out_atlas_tile,waterfall_tile,map_tree_tile,fishing_tile,gemChinh_tile,optionGameQuiz_tile,shop_tile,textOption_tile]);
        // const streetLayer = map.createLayer("street", [base_out_atlas_tile,waterfall_tile,map_tree_tile,fishing_tile,gemChinh_tile,optionGameQuiz_tile,shop_tile,textOption_tile]);
        // const volcanoAndTreeLayer = map.createLayer("volcanoAndTree", [base_out_atlas_tile,waterfall_tile,map_tree_tile,fishing_tile,gemChinh_tile,optionGameQuiz_tile,shop_tile,textOption_tile]);
        // const optionGameFishingLayer = map.createLayer("optionGameFishing", [base_out_atlas_tile,waterfall_tile,map_tree_tile,fishing_tile,gemChinh_tile,optionGameQuiz_tile,shop_tile,textOption_tile]);
        // const optionArenaLayer = map.createLayer("optionArena", [base_out_atlas_tile,waterfall_tile,map_tree_tile,fishing_tile,gemChinh_tile,optionGameQuiz_tile,shop_tile,textOption_tile]);
        // const optionShopLayer = map.createLayer("optionShop", [base_out_atlas_tile,waterfall_tile,map_tree_tile,fishing_tile,gemChinh_tile,optionGameQuiz_tile,shop_tile,textOption_tile]);
        // const optionGameQuizLayer = map.createLayer("optionGameQuiz", [base_out_atlas_tile,waterfall_tile,map_tree_tile,fishing_tile,gemChinh_tile,optionGameQuiz_tile,shop_tile,textOption_tile]);

    }

    update() {

    }
}