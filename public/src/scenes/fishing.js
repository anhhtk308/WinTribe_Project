class fishing extends Phaser.Scene {
    constructor() {
        super("fishing");
    }

    preload() {
        this.load.image("background", "assets/background.png");
        this.load.image("sea", "assets/sea.png");
        this.load.image("popup", "assets/popup.jpg");
        this.load.image("process", "assets/process.png");
        this.load.image("ca_chep", "assets/ca_chep.png");
        this.load.image("ca_ro_phi", "assets/ca_ro_phi.png");
        this.load.image("ca_ba_sa", "assets/ca_ba_sa.png");
        this.load.image("ung", "assets/ung.png");
        this.load.image("point", "assets/point.png");
        this.load.image("boat", "assets/boat.png");
        this.load.image("house", "assets/house.png");
        this.load.image("ground", "assets/ground.png");
        this.load.image("bag", "assets/bag.png");
        this.load.image("guilde", "assets/guilde.png");
        this.load.image("icon_close", "assets/icon_close.png");
        this.load.tilemapTiledJSON("fishing", "assets/fishing.json");
        this.load.spritesheet("player", "assets/character.png", {
            frameWidth: 50,
            frameHeight: 48,
        });
    }
    create() {
        const map = this.add.tilemap("fishing");
        const boat_tileset = map.addTilesetImage("boat");
        const ground_tileset = map.addTilesetImage("ground");
        const house_tileset = map.addTilesetImage("house");
        const background_tileset = map.addTilesetImage("background");
        const sea_tileset = map.addTilesetImage("sea");
        const background_layer = map.createLayer("background", [background_tileset]);
        const ground = map.createLayer("ground", [ground_tileset]);
        const sea_layer = map.createLayer("sea", [sea_tileset]);
        const boat_layer = map.createLayer("boat", [boat_tileset]);
        const house_layer = map.createLayer("house", [house_tileset]);
        this.add.image(700, 250, "process");
        // Create object point
        this.point = this.physics.add.sprite(510, 228, "point");
        this.point.body.velocity.x = 150;
        this.isSpaceDown = false;
        this.isGoFishing = false;
        this.turn_right = true;
        // Create animation of acter
        this.player = this.physics.add.sprite(790, 478, "player").setScale(3.5);
        this.anims.create({
            key: "doing",
            frames: this.anims.generateFrameNumbers("player", { start: 0, end: 200 }),
            frameRate: 3,
            repeat: -1,
        });
        this.anims.create({
            key: "turn",
            frames: [{ key: "player", frame: 0 }],
            frameRate: 0,
        });
        this.isShowPopup = false;
        this.count = 0;
        // Create item bag, guilde
        this.bag = this.add.image(1350, 100, "bag").setScale(0.19).setVisible(true);
        this.guilde = this.add.image(1350, 190, "guilde").setScale(0.19).setVisible(true);
        this.bag.setInteractive();
        this.guilde.setInteractive();
        // Create popup
        this.popup = this.add.image(500, 100, "popup").setOrigin(0, 0).setScale(0.35, 0.5).setVisible(false);
        // Create notice
        this.message = this.add.text(630, 170, "Bạn đã câu được:", { fontSize: 20, color: "#000000" }).setVisible(false);
        // create image of items
        this.ca_chep = this.add.image(625, 190, "ca_chep").setOrigin(0, 0).setScale(0.5).setVisible(false);
        this.ca_ba_sa = this.add.image(625, 190, "ca_ba_sa").setOrigin(0, 0).setScale(0.5).setVisible(false);
        this.ca_ro_phi = this.add.image(625, 190, "ca_ro_phi").setOrigin(0, 0).setScale(0.5).setVisible(false);
        this.ung = this.add.image(625, 190, "ung").setOrigin(0, 0).setScale(0.5).setVisible(false);
        // create var
        this.item_name = this.add.text(0, 0, "").setVisible(false);
        this.guide_content = this.add.text(0, 0, "").setVisible(false);
        this.guide_title = this.add.text(0, 0, "").setVisible(false);
        this.number_of_ca_chep = this.add.text(0, 0, "").setVisible(false);
        this.number_of_ca_ba_sa = this.add.text(0, 0, "").setVisible(false);
        this.number_of_ca_ro_phi = this.add.text(0, 0, "").setVisible(false);
        this.velocity_temp = 0;
        this.count_number_of_fish = 0;
        this.point_of_y = 200;
        this.isChange = false;
        // Create item in bag 
        this.ca_chep_in_bag = this.add.text(0, 0, "").setVisible(false);
        this.ca_ba_sa_in_bag = this.add.text(0, 0, "").setVisible(false);
        this.ca_ro_phi_in_bag = this.add.text(0, 0, "").setVisible(false);
        // create icon close
        this.icon_close = this.add.image(980, 80, "icon_close").setScale(0.06).setVisible(false);
        this.icon_close.setInteractive();
        // Create map to save history
        this.history = new Map();
        this.history.set("ca_chep", 0);
        this.history.set("ca_ba_sa", 0);
        this.history.set("ca_ro_phi", 0);
    }
    update() {
        var keyboard = this.input.keyboard.createCursorKeys();
        if (this.isSpaceDown == false && this.turn_right) {
            this.point.body.velocity.x = 150;
            if (this.point.x == 905) {
                this.turn_right = false;
            }
        }
        else if (this.isSpaceDown == false && this.turn_right == false) {
            this.point.body.velocity.x = -150;
            if (this.point.x == 510) {
                this.turn_right = true;
            }
        }

        if (keyboard.space.isDown && this.isGoFishing == false) {
            this.player.anims.play("doing", true);
            this.time.delayedCall(2000, function () {
                this.popup.setVisible(true);
                this.message.setVisible(true);
                this.getItem(this.point.x);
                this.icon_close.setVisible(true);
            }, [], this);
            this.velocity_temp = this.point.body.velocity.x;
            this.isSpaceDown = true;
            this.point.body.velocity.x = 0;
            this.isGoFishing = true;
        }


        this.showBagAndGuilde();
        this.closePopup();
        if (this.isShowPopup) {
            this.velocity_temp = this.point.body.velocity.x;
            this.point.body.velocity.x = 0;
        }
    }
    getItem(point_x) {
        var index_item_show;
        if (point_x >= 610 && point_x <= 810) {
            index_item_show = Math.floor(Math.random() * 3) + 1;
        }
        else {
            index_item_show = 0;
        }
        switch (index_item_show) {
            case 0:
                this.ung.setVisible(true);
                this.item_name = this.add.text(630, 400, "1 chiếc ủng", { fontSize: 20, color: "#000000" }).setVisible(true);
                break;
            case 1:
                this.ca_chep.setVisible(true);
                this.item_name = this.add.text(630, 400, "1 con cá Chép", { fontSize: 20, color: "#000000" }).setVisible(true);
                this.history.set("ca_chep", this.history.get("ca_chep") + 1);
                break;
            case 2:
                this.ca_ro_phi.setVisible(true);
                this.item_name = this.add.text(630, 400, "1 con cá Rô phi", { fontSize: 20, color: "#000000" }).setVisible(true);
                this.history.set("ca_ro_phi", this.history.get("ca_ro_phi") + 1);
                break;
            case 3:
                this.ca_ba_sa.setVisible(true);
                this.item_name = this.add.text(630, 400, "1 con cá Ba sa", { fontSize: 20, color: "#000000" }).setVisible(true);
                this.history.set("ca_ba_sa", this.history.get("ca_ba_sa") + 1);
                break;
        }
        this.isShowPopup = true;
    }
    showBagAndGuilde() {
        this.bag.on("pointerdown", () => {

            if (this.isShowPopup == false) {
                this.popup.setVisible(true);
                this.showBag();
                this.icon_close.setVisible(true);
                this.isShowPopup = true;
                this.point.body.velocity.x = 0;
                this.isGoFishing = true;
            }

        });
        this.guilde.on("pointerdown", () => {

            if (this.isShowPopup == false) {
                this.popup.setVisible(true);
                this.guide_title = this.add.text(690, 180, "GUILDE", { fontSize: 20, color: "#000000" });
                this.guide_content = this.add.text(550, 230, "Nhập vai vào một người ngư dân\nđánh bắt cá, bạn nãy căn chỉnh\nsử dụng phím SPACE sao cho hợp\nlý để mũi tên dừng lại ở vạch\nmàu xanh. Khi đó, sẽ có cơ hội\nlớn câu được cá. Nếu dừng lại ở\nkhoảng màu đỏ thì bạn sẽ không\ncâu được con cá nào.\nThời gian chơi là không giới\nhạn nên nãy thật bình tĩnh nhé!", { fontSize: 20, color: "#000000" });
                this.icon_close.setVisible(true);
                this.isShowPopup = true;
                this.isGoFishing = true;
            }
        });
    }
    closePopup() {
        this.icon_close.on("pointerdown", () => {
            this.hideObjects();
        });
    }
    hideObjects() {
        this.item_name.setVisible(false);
        this.ung.setVisible(false);
        this.ca_ba_sa.setVisible(false);
        this.ca_chep.setVisible(false);
        this.ca_ro_phi.setVisible(false);
        this.message.setVisible(false);
        this.popup.setVisible(false);
        this.icon_close.setVisible(false);
        this.guide_content.setVisible(false);
        this.guide_title.setVisible(false);
        this.ca_chep_in_bag.setVisible(false);
        this.ca_ro_phi_in_bag.setVisible(false);
        this.ca_ba_sa_in_bag.setVisible(false);
        this.number_of_ca_chep.setVisible(false);
        this.number_of_ca_ba_sa.setVisible(false);
        this.number_of_ca_ro_phi.setVisible(false);
        this.isGoFishing = false;
        this.isShowPopup = false;
        if (this.velocity_temp < 0) {
            this.turn_right = false;
            this.isSpaceDown = false;
        }
        else {
            this.turn_right = true;
            this.isSpaceDown = false;
        }

    }
    showBag() {
        this.ca_chep_in_bag = this.add.image(660, 200, "ca_chep").setScale(0.25).setVisible(true);
        this.ca_ro_phi_in_bag = this.add.image(660, 290, "ca_ro_phi").setScale(0.25).setVisible(true);
        this.ca_ba_sa_in_bag = this.add.image(660, 390, "ca_ba_sa").setScale(0.35).setVisible(true);
        this.number_of_ca_chep = this.add.text(720, 190, 0, { fontSize: 20, color: "#000000" }).setVisible(true);
        this.number_of_ca_ro_phi = this.add.text(720, 280, 0, { fontSize: 20, color: "#000000" }).setVisible(true);
        this.number_of_ca_ba_sa = this.add.text(720, 380, 0, { fontSize: 20, color: "#000000" }).setVisible(true);
        for (const [key, value] of this.history.entries()) {
            if (value > 0) {
                if (key == 'ca_chep') {
                    this.number_of_ca_chep.setVisible(false);
                    this.number_of_ca_chep = this.add.text(720, 190, `${value}`, { fontSize: 20, color: "#000000" }).setVisible(true);
                }
                else if (key == 'ca_ro_phi') {
                    this.number_of_ca_ro_phi.setVisible(false);
                    this.number_of_ca_ro_phi = this.add.text(720, 280, `${value}`, { fontSize: 20, color: "#000000" }).setVisible(true);
                }
                else if (key == 'ca_ba_sa') {
                    this.number_of_ca_ba_sa.setVisible(false);
                    this.number_of_ca_ba_sa = this.add.text(720, 380, `${value}`, { fontSize: 20, color: "#000000" }).setVisible(true);
                }
            }
        }

    }



}